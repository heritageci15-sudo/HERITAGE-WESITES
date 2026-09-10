import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatXOF, PRODUCTS as localProducts } from '../../data/products';
import {
  fetchAllAdminOrdersFromSupabase,
  updateOrderStatusInSupabase
} from '../../lib/supabase';
import { Order, OrderStatus, Product } from '../../types';
import {
  Shield,
  Package,
  TrendingUp,
  Users,
  Phone,
  MessageCircle,
  Clock,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  ArrowLeft
} from 'lucide-react';

interface AdminPortalViewProps {
  navigate: (route: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ navigate }) => {
  const { orders: storeOrders } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'clients'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Commandes
  const [allOrders, setAllOrders] = useState<Order[]>(storeOrders);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Produits & Stocks
  const [catalog, setCatalog] = useState<Product[]>(localProducts);
  const [productSearch, setProductSearch] = useState('');

  // Clients
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Synchronisation des commandes depuis Supabase
  const syncSupabaseOrders = async () => {
    try {
      const sbOrders = await fetchAllAdminOrdersFromSupabase();
      if (sbOrders.length > 0) {
        const orderMap = new Map<string, Order>();
        storeOrders.forEach((o) => orderMap.set(o.id, o));
        sbOrders.forEach((o) => orderMap.set(o.id, o));
        setAllOrders(Array.from(orderMap.values()));
      }
    } catch (e) {
      console.error('Erreur synchronisation commandes:', e);
    }
  };

  useEffect(() => {
    syncSupabaseOrders();

    // Charger les utilisateurs via l'API serveur Supabase Admin
    setLoadingUsers(true);
    fetch('/api/admin/users')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setRegisteredUsers(data);
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, []);

  // Mettre à jour le statut d'une commande
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatusId(orderId);
    try {
      await updateOrderStatusInSupabase(
        orderId,
        newStatus,
        `Statut mis à jour en "${newStatus}" par l'administrateur HERITAGE`
      );

      setAllOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              status: newStatus,
              statusHistory: [
                ...ord.statusHistory,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: `Statut mis à jour en "${newStatus}" par l'administrateur`
                }
              ]
            };
          }
          return ord;
        })
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Ajustement rapide de stock
  const handleStockChange = (productId: string, delta: number) => {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextCount = Math.max(0, p.stockCount + delta);
          return {
            ...p,
            stockCount: nextCount,
            stockStatus: nextCount === 0 ? 'Indisponible' : nextCount <= 2 ? 'Stock limité' : 'En stock'
          };
        }
        return p;
      })
    );
  };

  // Calculs métriques
  const totalRevenue = allOrders.reduce((acc, curr) => acc + curr.totalXOF, 0);
  const pendingOrdersCount = allOrders.filter((o) => ['pending_payment', 'paid', 'processing'].includes(o.status)).length;
  const deliveredCount = allOrders.filter((o) => o.status === 'delivered').length;
  const averageCart = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

  const filteredOrders = allOrders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = catalog.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.reference.toLowerCase().includes(productSearch.toLowerCase())
  );

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Tableau de Bord',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'orders' as const,
      label: 'Commandes',
      icon: Package,
      badge: allOrders.length
    },
    {
      id: 'products' as const,
      label: 'Catalogue & Stocks',
      icon: Sparkles,
      badge: catalog.length
    },
    {
      id: 'clients' as const,
      label: 'Clients Privilèges',
      icon: Users,
      badge: registeredUsers.length
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF9F7] text-[#002141] font-montserrat">
      {/* Overlay mobile quand le menu latéral est ouvert */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#002141]/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR LATÉRALE GAUCHE (PLIABLE / DÉPLIABLE)                            */}
      {/* ========================================================================= */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-[#002141] text-[#FAF9F7] flex flex-col justify-between border-r border-[#AC854B]/30 transition-all duration-300 ease-in-out select-none shadow-xl ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* En-tête de la sidebar */}
        <div className="p-4 border-b border-[#FAF9F7]/10">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xs bg-[#AC854B] text-[#002141] font-playfair font-black text-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                  H
                </div>
                <div className="leading-tight truncate">
                  <span className="font-playfair font-bold text-sm tracking-wider text-[#FAF9F7] block">
                    HERITAGE
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#AC854B] block">
                    Administration
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-10 h-10 rounded-xs bg-[#AC854B] text-[#002141] font-playfair font-black text-lg flex items-center justify-center shadow-xs">
                  H
                </div>
              </div>
            )}

            {/* Bouton de repliement Desktop */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Déplier le menu latéral' : 'Plier le menu latéral'}
              className="hidden md:flex p-1.5 text-[#FAF9F7]/70 hover:text-[#FAF9F7] hover:bg-[#FAF9F7]/10 rounded-xs transition-colors cursor-pointer"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-[#AC854B]" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-[#AC854B]" />
              )}
            </button>

            {/* Bouton fermeture Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-[#FAF9F7]/70 hover:text-[#FAF9F7] rounded-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto space-y-1.5 px-2">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#AC854B]/80">
              Menu Portail
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xs text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#AC854B] text-[#002141] font-bold shadow-xs'
                    : 'text-[#FAF9F7]/75 hover:bg-[#FAF9F7]/10 hover:text-[#FAF9F7]'
                } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#002141]' : 'text-[#AC854B]'}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!isSidebarCollapsed && item.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#002141] text-[#FAF9F7]' : 'bg-[#FAF9F7]/15 text-[#FAF9F7]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bas de sidebar : Liens & Contrôles */}
        <div className="p-3 border-t border-[#FAF9F7]/10 space-y-2 bg-[#00172e]">
          {!isSidebarCollapsed ? (
            <>
              {/* Liens retour */}
              <div className="flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#FAF9F7]/80 hover:text-[#FAF9F7] hover:bg-[#FAF9F7]/10 rounded-xs transition-colors cursor-pointer text-left"
                >
                  <Store className="w-3.5 h-3.5 text-[#AC854B]" />
                  <span>Boutique en ligne</span>
                </button>
              </div>

              {/* Bouton de repliement bas */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:flex w-full items-center justify-center gap-1.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#FAF9F7]/50 hover:text-[#AC854B] border-t border-[#FAF9F7]/5 pt-2 transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span>Plier le menu</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                title="Boutique en ligne"
                className="p-2 text-[#FAF9F7]/70 hover:text-[#FAF9F7] hover:bg-[#FAF9F7]/10 rounded-xs transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#AC854B]" />
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                title="Déplier le menu latéral"
                className="p-2 text-[#FAF9F7]/70 hover:text-[#AC854B] hover:bg-[#FAF9F7]/10 rounded-xs transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#AC854B]" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ZONE DE CONTENU PRINCIPALE (TOP BAR + TABS)                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar de navigation rapide */}
        <header className="bg-white border-b border-[#002141]/10 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Bouton Menu Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-[#002141] hover:bg-[#002141]/5 rounded-xs cursor-pointer"
              title="Ouvrir le menu latéral"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Bouton Toggle Desktop */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-[#002141]/70 hover:text-[#002141] hover:bg-[#002141]/5 rounded-xs transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Déplier le menu latéral' : 'Plier le menu latéral'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#AC854B]" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-[#002141]" />
              )}
            </button>

            {/* Titre & Statut */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-playfair font-bold text-base sm:text-lg text-[#002141] tracking-wide">
                  {activeTab === 'overview' && 'Tableau de Bord Exécutif'}
                  {activeTab === 'orders' && `Gestion des Commandes (${allOrders.length})`}
                  {activeTab === 'products' && `Catalogue & Niveaux de Stock (${catalog.length})`}
                  {activeTab === 'clients' && `Comptes Privilèges Clients (${registeredUsers.length})`}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-[#AC854B]/15 text-[#AC854B] text-[10px] font-bold uppercase tracking-widest rounded-xs border border-[#AC854B]/30">
                  Portail Privé
                </span>
              </div>
              <p className="text-[11px] text-[#3A3A3A]/70 hidden sm:block">
                Maison HERITAGE Horlogerie &middot; Abidjan, Côte d'Ivoire &middot; Espace de Gestion Privé
              </p>
            </div>
          </div>

          {/* Actions rapides à droite */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voir la Boutique</span>
            </button>
          </div>
        </header>

        {/* Corps des onglets */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1 : VUE D'ENSEMBLE / DASHBOARD */}
          {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#002141]/10 p-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3A3A]/70 block mb-1">
                  Chiffre d'Affaires Total
                </span>
                <span className="font-playfair text-2xl font-bold text-[#002141] block">
                  {formatXOF(totalRevenue)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {allOrders.length} transaction{allOrders.length > 1 ? 's' : ''} enregistrée{allOrders.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-white border border-[#002141]/10 p-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3A3A]/70 block mb-1">
                  Commandes en Cours
                </span>
                <span className="font-playfair text-2xl font-bold text-[#AC854B] block">
                  {pendingOrdersCount}
                </span>
                <span className="text-[10px] text-[#3A3A3A]/70 mt-2 block">
                  En préparation ou en cours de livraison
                </span>
              </div>

              <div className="bg-white border border-[#002141]/10 p-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3A3A]/70 block mb-1">
                  Panier Moyen
                </span>
                <span className="font-playfair text-2xl font-bold text-[#002141] block">
                  {formatXOF(averageCart)}
                </span>
                <span className="text-[10px] text-[#3A3A3A]/70 mt-2 block">
                  Pièces suisses de prestige
                </span>
              </div>

              <div className="bg-white border border-[#002141]/10 p-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3A3A]/70 block mb-1">
                  Garde-Temps Livrés
                </span>
                <span className="font-playfair text-2xl font-bold text-emerald-800 block">
                  {deliveredCount}
                </span>
                <span className="text-[10px] text-emerald-700 mt-2 block">
                  Remise sous pli scellé réussie
                </span>
              </div>
            </div>

            {/* Quick Orders Overview */}
            <div className="bg-white border border-[#002141]/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-lg font-bold text-[#002141]">
                  Dernières Commandes Passées
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#AC854B] hover:text-[#002141] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir toutes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {allOrders.length === 0 ? (
                <p className="text-xs text-[#3A3A3A]/70 py-6 text-center">
                  Aucune commande n'a encore été enregistrée.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#002141]/10 text-[10px] uppercase font-bold text-[#3A3A3A]/60">
                        <th className="py-2.5 px-3">Numéro</th>
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Commune (Abidjan)</th>
                        <th className="py-2.5 px-3">Montant</th>
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#002141]/5">
                      {allOrders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF9F7]/60">
                          <td className="py-3 px-3 font-mono font-bold text-[#002141]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block text-[#002141]">
                              {ord.customer.fullName}
                            </span>
                            <span className="text-[11px] text-[#3A3A3A]/70">
                              {ord.customer.phone}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#3A3A3A]">
                            {ord.customer.commune}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#002141]">
                            {formatXOF(ord.totalXOF)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs tracking-wider ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'shipped_or_ready'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'paid'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {ord.status === 'paid'
                                ? 'Payée'
                                : ord.status === 'shipped_or_ready'
                                ? 'En livraison'
                                : ord.status === 'delivered'
                                ? 'Livrée'
                                : ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveTab('orders');
                              }}
                              className="text-[11px] font-semibold text-[#AC854B] hover:text-[#002141] cursor-pointer"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 : GESTION DES COMMANDES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#3A3A3A]">Filtrer par état :</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="text-xs bg-white border border-[#002141]/20 px-3 py-1.5 focus:outline-hidden focus:border-[#AC854B]"
                >
                  <option value="all">Toutes les commandes</option>
                  <option value="pending_payment">En attente de paiement</option>
                  <option value="paid">Payées (À préparer)</option>
                  <option value="shipped_or_ready">En cours d'acheminement</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>

              <span className="text-xs text-[#3A3A3A]/70">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white border border-[#002141]/10 p-12 text-center text-xs text-[#3A3A3A]/70">
                    Aucune commande pour ce filtre.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`bg-white border p-5 transition-all cursor-pointer ${
                        selectedOrder?.id === ord.id
                          ? 'border-[#AC854B] shadow-md ring-1 ring-[#AC854B]/30'
                          : 'border-[#002141]/10 hover:border-[#AC854B]/50'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#002141]">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs tracking-wider ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped_or_ready'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'paid'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-200 text-stone-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#002141]">
                          {formatXOF(ord.totalXOF)}
                        </span>
                      </div>

                      <div className="text-xs text-[#3A3A3A] grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="text-[10px] uppercase text-[#3A3A3A]/60 block">Client</span>
                          <span className="font-semibold text-[#002141]">{ord.customer.fullName}</span>
                          <span className="text-[11px] block">{ord.customer.phone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#3A3A3A]/60 block">Livraison Abidjan</span>
                          <span className="font-semibold text-[#002141]">{ord.customer.commune}</span>
                          <span className="text-[11px] block truncate">{ord.customer.deliveryAddress}</span>
                        </div>
                      </div>

                      <div className="border-t border-[#002141]/5 pt-3 flex items-center justify-between text-[11px] text-[#3A3A3A]/70">
                        <span>{ord.items.length} article{ord.items.length > 1 ? 's' : ''} &middot; {ord.paymentMethod.toUpperCase()}</span>
                        <span>{new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Detail Panel */}
              <div className="bg-white border border-[#002141]/10 p-6 self-start sticky top-28 shadow-xs">
                {selectedOrder ? (
                  <div className="space-y-6">
                    <div className="border-b border-[#002141]/10 pb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#AC854B] block mb-1">
                        Détail de la commande
                      </span>
                      <h3 className="font-mono text-lg font-bold text-[#002141]">
                        {selectedOrder.orderNumber}
                      </h3>
                      <span className="text-xs text-[#3A3A3A]/70">
                        Passée le {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>

                    {/* Quick Status Update */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#002141] mb-2">
                        Changer le Statut de Livraison :
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={updatingStatusId === selectedOrder.id}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'paid')}
                          className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Confirmée / Payée
                        </button>
                        <button
                          type="button"
                          disabled={updatingStatusId === selectedOrder.id}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped_or_ready')}
                          className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          En acheminement
                        </button>
                        <button
                          type="button"
                          disabled={updatingStatusId === selectedOrder.id}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                          className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Marquer Livrée
                        </button>
                        <button
                          type="button"
                          disabled={updatingStatusId === selectedOrder.id}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                          className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>

                    {/* Customer Info & Contact */}
                    <div className="bg-[#FAF9F7] p-4 border border-[#002141]/10 space-y-3 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC854B] block">
                        Coordonnées du Destinataire
                      </span>
                      <div>
                        <span className="font-bold text-[#002141] block">{selectedOrder.customer.fullName}</span>
                        <span className="text-[#3A3A3A] block">{selectedOrder.customer.email}</span>
                        <span className="text-[#3A3A3A] font-mono block">{selectedOrder.customer.phone}</span>
                        <span className="text-[#3A3A3A] block mt-1">
                          <strong>Lieu :</strong> {selectedOrder.customer.commune}, {selectedOrder.customer.deliveryAddress}
                        </span>
                        {selectedOrder.customer.notes && (
                          <p className="mt-1 text-[11px] italic bg-white p-2 border border-[#002141]/5">
                            Note : "{selectedOrder.customer.notes}"
                          </p>
                        )}
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#002141]/10">
                        <a
                          href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Bonjour ${selectedOrder.customer.fullName}, ici la Maison HERITAGE concernant votre commande ${selectedOrder.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors rounded-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${selectedOrder.customer.phone}`}
                          className="px-3 py-2 bg-white border border-[#002141]/20 hover:bg-black/5 text-[#002141] font-semibold text-xs transition-colors rounded-xs"
                          aria-label="Appeler le client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Items List */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A3A3A]/70 block mb-2">
                        Pièces Commandées
                      </span>
                      <div className="divide-y divide-[#002141]/5 text-xs">
                        {selectedOrder.items.map((it, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                            <img
                              src={it.product.primaryImage}
                              alt=""
                              className="w-10 h-10 object-contain bg-[#FAF9F7] p-1 border border-[#002141]/10"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-[#002141] block truncate">
                                {it.product.name}
                              </span>
                              <span className="text-[10px] text-[#3A3A3A]/70">
                                Quantité : {it.quantity}
                              </span>
                            </div>
                            <span className="font-semibold text-[#002141]">
                              {formatXOF(it.product.priceXOF * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-[#3A3A3A]/60">
                    Sélectionnez une commande à gauche pour afficher ses détails complets et coordonner la remise en main propre.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 : CATALOGUE & GESTION DES STOCKS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#3A3A3A]/50 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher une montre ou référence..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#002141]/20 focus:outline-hidden focus:border-[#AC854B]"
                />
              </div>

              <span className="text-xs text-[#3A3A3A]/70">
                {filteredProducts.length} garde-temps répertorié{filteredProducts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-white border border-[#002141]/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF9F7] border-b border-[#002141]/10 text-[10px] uppercase font-bold text-[#3A3A3A]/70">
                    <th className="py-3 px-4">Montre</th>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Prix en Vente (XOF)</th>
                    <th className="py-3 px-4">Stock Actuel</th>
                    <th className="py-3 px-4">État</th>
                    <th className="py-3 px-4 text-right">Ajuster Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#002141]/5">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF9F7]/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.primaryImage}
                            alt=""
                            className="w-12 h-14 object-contain bg-[#FAF9F7] p-1 border border-[#002141]/10 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-sm text-[#002141] block">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-[#3A3A3A]/70">
                              {prod.attributes.mouvement} &middot; {prod.attributes.diametre}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#3A3A3A]">
                        {prod.reference}
                      </td>
                      <td className="py-3 px-4 font-semibold text-sm text-[#002141]">
                        {formatXOF(prod.priceXOF)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold font-mono text-sm text-[#002141] px-2 py-0.5 bg-[#FAF9F7] border border-[#002141]/10 inline-block">
                          {prod.stockCount} pièce{prod.stockCount > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                            prod.stockCount > 2
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.stockCount > 0
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.stockStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStockChange(prod.id, -1)}
                            className="w-7 h-7 bg-[#FAF9F7] hover:bg-[#E8E1D3] border border-[#002141]/20 font-bold text-xs flex items-center justify-center cursor-pointer"
                            title="Diminuer stock"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(prod.id, +1)}
                            className="w-7 h-7 bg-[#FAF9F7] hover:bg-[#E8E1D3] border border-[#002141]/20 font-bold text-xs flex items-center justify-center cursor-pointer"
                            title="Augmenter stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4 : CLIENTS INSCRITS */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#002141]">
                  Clients et Utilisateurs Enregistrés
                </h3>
                <p className="text-xs text-[#3A3A3A]/70">
                  Liste des comptes clients créés avec adresse e-mail ou numéro de téléphone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoadingUsers(true);
                  fetch('/api/admin/users')
                    .then((res) => (res.ok ? res.json() : []))
                    .then((d) => setRegisteredUsers(Array.isArray(d) ? d : []))
                    .finally(() => setLoadingUsers(false));
                }}
                className="px-3 py-1.5 bg-white border border-[#002141]/20 text-xs font-semibold hover:bg-[#FAF9F7] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                <span>Actualiser la liste</span>
              </button>
            </div>

            {registeredUsers.length === 0 ? (
              <div className="bg-white border border-[#002141]/10 p-12 text-center text-xs text-[#3A3A3A]">
                <Users className="w-8 h-8 text-[#AC854B] mx-auto mb-3 opacity-60" />
                <p className="font-bold text-sm text-[#002141] mb-1">
                  Aucun compte client enregistré pour le moment
                </p>
                <p className="text-xs text-[#3A3A3A]/70 max-w-md mx-auto">
                  Les visiteurs peuvent dès à présent créer leur compte sur la page Espace Client avec leur adresse e-mail ou leur numéro de téléphone ivoirien.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/compte')}
                    className="px-4 py-2 bg-[#002141] text-[#FAF9F7] text-xs font-semibold uppercase tracking-wider"
                  >
                    Tester la création de compte
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#002141]/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F7] border-b border-[#002141]/10 text-[10px] uppercase font-bold text-[#3A3A3A]/70">
                      <th className="py-3 px-4">Identifiant / E-mail</th>
                      <th className="py-3 px-4">Téléphone</th>
                      <th className="py-3 px-4">Nom Complet</th>
                      <th className="py-3 px-4">Rôle</th>
                      <th className="py-3 px-4">Date de Création</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#002141]/5">
                    {registeredUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-[#FAF9F7]/50">
                        <td className="py-3 px-4 font-semibold text-[#002141]">
                          {u.email || u.phone || 'Non renseigné'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#3A3A3A]">
                          {u.phone || u.user_metadata?.phone || '—'}
                        </td>
                        <td className="py-3 px-4 text-[#3A3A3A]">
                          {u.user_metadata?.full_name || 'Client HERITAGE'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs ${
                              u.user_metadata?.role === 'admin' || u.email?.includes('heritageci15')
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {u.user_metadata?.role || (u.email?.includes('heritageci15') ? 'admin' : 'customer')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#3A3A3A]/70 text-[11px]">
                          {new Date(u.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

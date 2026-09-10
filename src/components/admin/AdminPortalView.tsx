import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  GalleryVerticalEnd,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  MessageSquareText,
  PackagePlus,
  PanelLeftClose,
  Pencil,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Trash2,
  UsersRound,
  X
} from 'lucide-react';
import { adminRequest, AdminSession, getAdminSession, signOutAdministrator } from '../../lib/admin-api';
import { RichTextEditor } from './RichTextEditor';

interface AdminPortalViewProps {
  navigate: (route: string) => void;
}

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'administrators'
  | 'users'
  | 'media'
  | 'reviews'
  | 'blogs'
  | 'faqs'
  | 'legal'
  | 'meta'
  | 'coordinates'
  | 'pixels';

type AnyRecord = Record<string, any>;

const NAVIGATION: Array<{ id: AdminTab; label: string; icon: React.ElementType; section?: string }> = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, section: 'Pilotage' },
  { id: 'products', label: 'Produits / Stocks', icon: Boxes, section: 'Commerce' },
  { id: 'orders', label: 'Commandes', icon: ClipboardList },
  { id: 'administrators', label: 'Administrateurs', icon: ShieldCheck, section: 'Accès' },
  { id: 'users', label: 'Utilisateurs', icon: UsersRound },
  { id: 'media', label: 'Galerie média', icon: GalleryVerticalEnd, section: 'Contenus' },
  { id: 'reviews', label: 'Avis', icon: Star },
  { id: 'blogs', label: 'Blogs', icon: BookOpen },
  { id: 'faqs', label: 'F.A.Q', icon: MessageSquareText },
  { id: 'legal', label: 'Pages légales', icon: FileText },
  { id: 'meta', label: 'Méta description', icon: SlidersHorizontal },
  { id: 'coordinates', label: 'Coordonnées', icon: Settings2 },
  { id: 'pixels', label: 'Pixels', icon: BarChart3 }
];

const emptyProduct = (): AnyRecord => ({
  name: '',
  slug: '',
  sku: '',
  reference: '',
  brand: '',
  category: 'montres',
  short_description: '',
  description_html: '',
  purchase_price_xof: 0,
  regular_price_xof: 0,
  sale_price_xof: '',
  stock_quantity: 0,
  low_stock_threshold: 2,
  status: 'draft',
  primary_media_id: '',
  colors: '[]',
  attributes: '{}',
  faq: '[]',
  variants: '[]',
  seo_title: '',
  seo_description: ''
});

const formatXOF = (value: number) => new Intl.NumberFormat('fr-FR').format(Number(value || 0)) + ' FCFA';

const toJsonText = (value: unknown, fallback = '[]') => {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value ?? JSON.parse(fallback), null, 2);
  } catch {
    return fallback;
  }
};

const toProductForm = (product: AnyRecord): AnyRecord => ({
  ...emptyProduct(),
  ...product,
  colors: toJsonText(product.colors),
  attributes: toJsonText(product.attributes, '{}'),
  faq: toJsonText(product.faq),
  variants: toJsonText(product.product_variants || product.variants)
});

const statusLabel: Record<string, string> = {
  pending_payment: 'Paiement en attente',
  payment_pending: 'Paiement à confirmer',
  paid: 'Payée',
  processing: 'En préparation',
  shipped_or_ready: 'Expédiée / prête',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
  payment_failed: 'Paiement échoué'
};

interface ResourceField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'rich';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

interface ResourceConfig {
  key: 'reviews' | 'blogs' | 'faqs' | 'legal' | 'meta' | 'pixels';
  title: string;
  description: string;
  fields: ResourceField[];
  summary: (item: AnyRecord) => string;
}

const RESOURCE_CONFIGS: Record<'reviews' | 'blogs' | 'faqs' | 'legal' | 'meta' | 'pixels', ResourceConfig> = {
  reviews: {
    key: 'reviews',
    title: 'Avis clients',
    description: 'Approuvez, refusez ou supprimez les avis avant leur diffusion.',
    fields: [
      { name: 'author_name', label: 'Nom affiché', required: true },
      { name: 'author_email', label: 'E-mail', type: 'text' },
      { name: 'product_id', label: 'Identifiant du produit', placeholder: 'UUID du produit concerné' },
      { name: 'rating', label: 'Note', type: 'select', options: [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} / 5` })) },
      { name: 'title', label: 'Titre de l’avis' },
      { name: 'body', label: 'Contenu', type: 'textarea', required: true },
      { name: 'status', label: 'Statut', type: 'select', options: ['pending', 'approved', 'rejected'].map((value) => ({ value, label: value === 'pending' ? 'En attente' : value === 'approved' ? 'Approuvé' : 'Refusé' })) }
    ],
    summary: (item) => `${item.rating || 0}/5 · ${item.author_name || 'Client'} · ${item.status || 'pending'}`
  },
  blogs: {
    key: 'blogs',
    title: 'Articles du blog',
    description: 'Rédigez, optimisez et publiez les articles éditoriaux de HERITAGE.',
    fields: [
      { name: 'title', label: 'Titre', required: true },
      { name: 'slug', label: 'Lien', placeholder: 'guide-choisir-sa-montre' },
      { name: 'excerpt', label: 'Extrait', type: 'textarea' },
      { name: 'content_html', label: 'Article', type: 'rich', required: true },
      { name: 'cover_media_id', label: 'Identifiant du média de couverture' },
      { name: 'status', label: 'Publication', type: 'select', options: ['draft', 'published', 'archived'].map((value) => ({ value, label: value === 'draft' ? 'Brouillon' : value === 'published' ? 'Publié' : 'Archivé' })) },
      { name: 'seo_title', label: 'Titre SEO' },
      { name: 'seo_description', label: 'Description SEO', type: 'textarea' }
    ],
    summary: (item) => `${item.status === 'published' ? 'Publié' : 'Brouillon'} · ${item.updated_at ? new Date(item.updated_at).toLocaleDateString('fr-FR') : 'À rédiger'}`
  },
  faqs: {
    key: 'faqs',
    title: 'Foire aux questions',
    description: 'Organisez les réponses visibles sur l’accueil, le catalogue et la page contact.',
    fields: [
      { name: 'placement', label: 'Emplacement', type: 'select', options: [{ value: 'all', label: 'Toutes les pages prévues' }, { value: 'home', label: 'Accueil' }, { value: 'catalog', label: 'Boutique / catalogue' }, { value: 'contact', label: 'Contact' }] },
      { name: 'question', label: 'Question', required: true },
      { name: 'answer_html', label: 'Réponse', type: 'rich', required: true },
      { name: 'sort_order', label: 'Ordre', type: 'text' },
      { name: 'is_active', label: 'Visible', type: 'checkbox' }
    ],
    summary: (item) => `${item.placement || 'all'} · ${item.is_active ? 'Visible' : 'Masquée'}`
  },
  legal: {
    key: 'legal',
    title: 'Pages légales',
    description: 'Modifiez les pages légales avec un éditeur riche complet.',
    fields: [
      { name: 'page_key', label: 'Page', type: 'select', options: [{ value: 'mentions-legales', label: 'Mentions légales' }, { value: 'cgv', label: 'Conditions générales de vente' }, { value: 'confidentialite', label: 'Confidentialité' }, { value: 'livraison-retours', label: 'Livraison et retours' }, { value: 'cookies', label: 'Cookies' }] },
      { name: 'title', label: 'Titre', required: true },
      { name: 'content_html', label: 'Contenu', type: 'rich', required: true }
    ],
    summary: (item) => item.page_key || 'Page légale'
  },
  meta: {
    key: 'meta',
    title: 'Méta description',
    description: 'Gérez les balises de chaque page éditoriale, hors fiches produit.',
    fields: [
      { name: 'page_key', label: 'Route ou identifiant de page', placeholder: 'accueil', required: true },
      { name: 'title', label: 'Titre de la page', required: true },
      { name: 'description', label: 'Description, 160 caractères conseillés', type: 'textarea', required: true },
      { name: 'og_title', label: 'Titre de partage' },
      { name: 'og_description', label: 'Description de partage', type: 'textarea' },
      { name: 'no_index', label: 'Empêcher l’indexation', type: 'checkbox' }
    ],
    summary: (item) => item.page_key || 'Page'
  },
  pixels: {
    key: 'pixels',
    title: 'Pixels et tracking',
    description: 'Centralisez les identifiants Meta, Google Ads, Analytics et les scripts autorisés.',
    fields: [
      { name: 'provider', label: 'Plateforme', type: 'select', options: [{ value: 'meta', label: 'Meta Pixel' }, { value: 'google_ads', label: 'Google Ads' }, { value: 'google_analytics', label: 'Google Analytics' }, { value: 'custom', label: 'Script personnalisé' }] },
      { name: 'label', label: 'Nom interne', required: true },
      { name: 'pixel_id', label: 'Identifiant du pixel' },
      { name: 'script_code', label: 'Script de tracking', type: 'textarea' },
      { name: 'is_active', label: 'Actif', type: 'checkbox' }
    ],
    summary: (item) => `${item.provider || 'custom'} · ${item.is_active ? 'Actif' : 'Inactif'}`
  }
};

function PanelHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-[#002141]/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC854B]">{eyebrow}</p>
        <h1 className="font-playfair mt-2 text-3xl font-semibold text-[#002141] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3A3A3A]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-[#002141]/20 bg-white px-6 py-12 text-center">
      <p className="font-playfair text-xl font-semibold text-[#002141]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#3A3A3A]">{body}</p>
    </div>
  );
}

function ResourceManager({
  config,
  items,
  onRefresh,
  onNotify
}: {
  config: ResourceConfig;
  items: AnyRecord[];
  onRefresh: () => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [editing, setEditing] = useState<AnyRecord | null>(null);
  const [form, setForm] = useState<AnyRecord>({});
  const [submitting, setSubmitting] = useState(false);

  const startCreate = () => {
    const initial: AnyRecord = {};
    config.fields.forEach((field) => {
      initial[field.name] = field.type === 'checkbox' ? true : field.name === 'rating' ? '5' : field.name === 'status' ? 'draft' : '';
    });
    if (config.key === 'reviews') initial.status = 'pending';
    if (config.key === 'faqs') {
      initial.placement = 'all';
      initial.is_active = true;
    }
    if (config.key === 'pixels') {
      initial.provider = 'meta';
      initial.is_active = true;
    }
    setEditing({});
    setForm(initial);
  };

  const startEdit = (item: AnyRecord) => {
    setEditing(item);
    const next = { ...item };
    config.fields.forEach((field) => {
      if (next[field.name] === null || next[field.name] === undefined) next[field.name] = field.type === 'checkbox' ? false : '';
    });
    setForm(next);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editing?.id) await adminRequest(`/resources/${config.key}/${editing.id}`, { method: 'PATCH', body: form });
      else await adminRequest(`/resources/${config.key}`, { method: 'POST', body: form });
      setEditing(null);
      setForm({});
      await onRefresh();
      onNotify(editing?.id ? 'Modification enregistrée.' : 'Élément créé.');
    } catch (error) {
      onNotify(error instanceof Error ? error.message : 'Enregistrement impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (item: AnyRecord) => {
    if (!window.confirm('Supprimer définitivement cet élément ?')) return;
    try {
      await adminRequest(`/resources/${config.key}/${item.id}`, { method: 'DELETE' });
      await onRefresh();
      onNotify('Élément supprimé.');
    } catch (error) {
      onNotify(error instanceof Error ? error.message : 'Suppression impossible.');
    }
  };

  return (
    <>
      <PanelHeader
        eyebrow="Gestion de contenu"
        title={config.title}
        description={config.description}
        action={<button type="button" onClick={startCreate} className="admin-primary-button"><Plus className="h-4 w-4" aria-hidden="true" /> Ajouter</button>}
      />

      {editing !== null && (
        <form onSubmit={submit} className="mb-8 border border-[#002141]/15 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-[#002141]">{editing.id ? 'Modifier' : 'Ajouter'}</h2>
              <p className="mt-1 text-sm text-[#3A3A3A]">Les champs marqués par le navigateur comme obligatoires doivent être renseignés.</p>
            </div>
            <button type="button" onClick={() => setEditing(null)} className="admin-icon-button" aria-label="Fermer le formulaire"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' || field.type === 'rich' ? 'md:col-span-2' : ''}>
                {field.type === 'rich' ? (
                  <RichTextEditor id={`${config.key}-${field.name}`} label={field.label} value={String(form[field.name] || '')} onChange={(value) => setForm((current) => ({ ...current, [field.name]: value }))} />
                ) : field.type === 'checkbox' ? (
                  <label className="flex min-h-12 items-center gap-3 border border-[#002141]/15 px-4 text-sm font-semibold text-[#002141]">
                    <input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.checked }))} className="h-4 w-4 accent-[#AC854B]" />
                    {field.label}
                  </label>
                ) : (
                  <label className="block text-sm font-semibold text-[#002141]">
                    {field.label}
                    {field.type === 'select' ? (
                      <select value={String(form[field.name] || '')} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} className="admin-input mt-2" required={field.required}>
                        {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea value={String(form[field.name] || '')} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} className="admin-input mt-2 min-h-28 resize-y" required={field.required} placeholder={field.placeholder} />
                    ) : (
                      <input value={String(form[field.name] || '')} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} className="admin-input mt-2" required={field.required} placeholder={field.placeholder} />
                    )}
                  </label>
                )}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" disabled={submitting} className="admin-primary-button">{submitting ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button type="button" onClick={() => setEditing(null)} className="admin-secondary-button">Annuler</button>
          </div>
        </form>
      )}

      {items.length === 0 ? <EmptyState title="Aucun élément" body="Créez le premier élément avec le bouton Ajouter." /> : (
        <div className="divide-y divide-[#002141]/10 border border-[#002141]/15 bg-white">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-[#002141]">{item.title || item.question || item.label || item.author_name || item.page_key || 'Élément sans titre'}</h2>
                <p className="mt-1 text-sm text-[#3A3A3A]">{config.summary(item)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => startEdit(item)} className="admin-icon-button" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(item)} className="admin-icon-button text-red-800 hover:border-red-300 hover:bg-red-50" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ navigate }) => {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [dashboard, setDashboard] = useState<AnyRecord | null>(null);
  const [products, setProducts] = useState<AnyRecord[]>([]);
  const [orders, setOrders] = useState<AnyRecord[]>([]);
  const [administrators, setAdministrators] = useState<AnyRecord[]>([]);
  const [invitations, setInvitations] = useState<AnyRecord[]>([]);
  const [users, setUsers] = useState<AnyRecord[]>([]);
  const [media, setMedia] = useState<AnyRecord[]>([]);
  const [resources, setResources] = useState<Record<string, AnyRecord[]>>({});
  const [siteSettings, setSiteSettings] = useState<AnyRecord | null>(null);
  const [editingProduct, setEditingProduct] = useState<AnyRecord | null>(null);
  const [productForm, setProductForm] = useState<AnyRecord>(emptyProduct());
  const [generatedCode, setGeneratedCode] = useState('');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 5500);
  };

  const loadTab = async (tab: AdminTab) => {
    setLoading(true);
    try {
      if (tab === 'dashboard') setDashboard(await adminRequest('/dashboard'));
      if (tab === 'products') {
        const [catalog, gallery] = await Promise.all([adminRequest<AnyRecord[]>('/products'), adminRequest<AnyRecord[]>('/media')]);
        setProducts(catalog);
        setMedia(gallery);
      }
      if (tab === 'orders') setOrders(await adminRequest('/orders'));
      if (tab === 'administrators') {
        const response = await adminRequest<{ administrators: AnyRecord[]; invitations: AnyRecord[] }>('/administrators');
        setAdministrators(response.administrators);
        setInvitations(response.invitations);
      }
      if (tab === 'users') setUsers(await adminRequest('/users'));
      if (tab === 'media') setMedia(await adminRequest('/media'));
      if (tab === 'coordinates') setSiteSettings(await adminRequest('/site-settings'));
      if (['reviews', 'blogs', 'faqs', 'legal', 'meta', 'pixels'].includes(tab)) {
        const records = await adminRequest<AnyRecord[]>(`/resources/${tab}`);
        setResources((current) => ({ ...current, [tab]: records }));
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Les données ne sont pas disponibles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate('/admin/login');
        return;
      }
      setAdmin(session);
      void loadTab('dashboard');
    });
  }, []);

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    void loadTab(tab);
  };

  const dashboardTotals = dashboard?.totals || {};
  const lowStockProducts = useMemo(() => products.filter((product) => Number(product.stock_quantity) <= Number(product.low_stock_threshold)), [products]);

  const logout = async () => {
    await signOutAdministrator();
    navigate('/admin/login');
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let product: AnyRecord;
      if (editingProduct?.id) product = await adminRequest(`/products/${editingProduct.id}`, { method: 'PATCH', body: productForm });
      else product = await adminRequest('/products', { method: 'POST', body: productForm });

      const variants = JSON.parse(productForm.variants || '[]');
      if (Array.isArray(variants)) await adminRequest(`/products/${product.id}/variants`, { method: 'PUT', body: { variants } });
      setEditingProduct(null);
      setProductForm(emptyProduct());
      await loadTab('products');
      notify('Produit enregistré.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Le produit n’a pas pu être enregistré. Vérifiez les champs JSON.');
    }
  };

  const deleteProduct = async (product: AnyRecord) => {
    if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;
    try {
      await adminRequest(`/products/${product.id}`, { method: 'DELETE' });
      await loadTab('products');
      notify('Produit supprimé.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Suppression impossible.');
    }
  };

  const updateOrder = async (order: AnyRecord, status: string) => {
    try {
      await adminRequest(`/orders/${order.id}`, { method: 'PATCH', body: { status } });
      await loadTab('orders');
      notify('Statut de commande mis à jour.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Mise à jour impossible.');
    }
  };

  const generateInvitation = async () => {
    try {
      const response = await adminRequest<{ code: string }>('/invitations', { method: 'POST' });
      setGeneratedCode(response.code);
      await loadTab('administrators');
      notify('Code créé. Copiez-le maintenant, il ne sera plus affiché après fermeture.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Création du code impossible.');
    }
  };

  const uploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      notify('L’image dépasse 10 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await adminRequest('/media/upload', {
          method: 'POST',
          body: { fileName: file.name, mimeType: file.type, contentBase64: String(reader.result), altText: '' }
        });
        await loadTab('media');
        notify('Image ajoutée à la galerie.');
      } catch (error) {
        notify(error instanceof Error ? error.message : 'Envoi de l’image impossible.');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  if (!admin) {
    return <div className="flex min-h-screen items-center justify-center bg-[#002141] text-sm text-[#FAF9F7]"><LoaderCircle className="mr-3 h-5 w-5 animate-spin" /> Vérification de l’accès…</div>;
  }

  const renderDashboard = () => (
    <>
      <PanelHeader eyebrow="Pilotage" title="Tableau de bord" description="Une vue d’ensemble claire de l’activité commerciale, des commandes et des contenus à traiter." action={<button type="button" onClick={() => void loadTab('dashboard')} className="admin-secondary-button"><RefreshCw className="h-4 w-4" /> Actualiser</button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Chiffre d’affaires', formatXOF(dashboardTotals.revenueXOF), 'Commandes visibles dans Supabase'],
          ['Commandes en cours', String(dashboardTotals.pendingOrders || 0), 'Paiement ou préparation'],
          ['Panier moyen', formatXOF(dashboardTotals.averageCartXOF), 'Par commande enregistrée'],
          ['Stock à surveiller', String(dashboardTotals.lowStock || 0), 'Produits au seuil ou épuisés']
        ].map(([label, value, note]) => <article key={label} className="border border-[#002141]/12 bg-white p-5 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3A3A3A]">{label}</p><p className="font-playfair mt-4 text-3xl font-semibold text-[#002141]">{value}</p><p className="mt-3 text-sm text-[#3A3A3A]">{note}</p></article>)}
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="border border-[#002141]/12 bg-white p-6"><h2 className="font-playfair text-2xl font-semibold">Dernières commandes</h2>{(dashboard?.recentOrders || []).length === 0 ? <p className="mt-8 text-sm text-[#3A3A3A]">Aucune commande enregistrée pour le moment.</p> : <div className="mt-5 divide-y divide-[#002141]/10">{dashboard.recentOrders.map((order: AnyRecord) => <div key={order.id} className="flex justify-between gap-4 py-4 text-sm"><span>{order.order_number || order.id}</span><span>{formatXOF(order.total_xof)}</span><span className="text-[#AC854B]">{statusLabel[order.status] || order.status}</span></div>)}</div>}</section>
        <section className="border border-[#002141]/12 bg-[#002141] p-6 text-[#FAF9F7]"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D6BB8F]">Contenu à traiter</p><div className="mt-6 space-y-4"><p><strong className="font-playfair text-3xl text-[#D6BB8F]">{dashboardTotals.pendingReviews || 0}</strong><span className="ml-3 text-sm">avis en attente</span></p><p><strong className="font-playfair text-3xl text-[#D6BB8F]">{dashboardTotals.customers || 0}</strong><span className="ml-3 text-sm">utilisateurs enregistrés</span></p></div></section>
      </div>
    </>
  );

  const renderProducts = () => (
    <>
      <PanelHeader eyebrow="Commerce" title="Produits et stocks" description="Créez les fiches produit complètes, pilotez les prix, les marges, les variantes, les caractéristiques et le stock." action={<button type="button" onClick={() => { setEditingProduct({}); setProductForm(emptyProduct()); }} className="admin-primary-button"><PackagePlus className="h-4 w-4" /> Nouveau produit</button>} />
      {editingProduct !== null && <form onSubmit={saveProduct} className="mb-8 border border-[#002141]/15 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex justify-between gap-4"><div><h2 className="font-playfair text-2xl font-semibold">{editingProduct.id ? 'Modifier le produit' : 'Créer un produit'}</h2><p className="mt-1 text-sm text-[#3A3A3A]">Les données structurées permettent de générer une fiche produit exhaustive.</p></div><button type="button" onClick={() => setEditingProduct(null)} className="admin-icon-button" aria-label="Fermer"><X className="h-4 w-4" /></button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['name', 'Nom du produit', true], ['brand', 'Marque'], ['category', 'Catégorie'], ['sku', 'SKU'], ['reference', 'Référence'], ['slug', 'Lien produit'], ['purchase_price_xof', 'Prix d’achat FCFA'], ['regular_price_xof', 'Prix normal FCFA'], ['sale_price_xof', 'Prix actuel / réduit FCFA'], ['stock_quantity', 'Stock disponible'], ['low_stock_threshold', 'Seuil d’alerte'], ['seo_title', 'Titre SEO']
        ].map(([name, label, required]) => <label key={name} className="text-sm font-semibold text-[#002141]">{label}<input required={Boolean(required)} type={String(name).includes('price') || String(name).includes('stock') ? 'number' : 'text'} value={String(productForm[String(name)] ?? '')} onChange={(event) => setProductForm((current) => ({ ...current, [String(name)]: event.target.value }))} className="admin-input mt-2" /></label>)}
        <label className="text-sm font-semibold text-[#002141]">Statut<select value={productForm.status} onChange={(event) => setProductForm((current) => ({ ...current, status: event.target.value }))} className="admin-input mt-2"><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select></label>
        <label className="text-sm font-semibold text-[#002141]">Image principale<select value={productForm.primary_media_id || ''} onChange={(event) => setProductForm((current) => ({ ...current, primary_media_id: event.target.value }))} className="admin-input mt-2"><option value="">Choisir dans la galerie</option>{media.map((asset) => <option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select></label>
        <label className="md:col-span-2 xl:col-span-3 text-sm font-semibold text-[#002141]">Description courte<textarea value={productForm.short_description || ''} onChange={(event) => setProductForm((current) => ({ ...current, short_description: event.target.value }))} className="admin-input mt-2 min-h-24" /></label>
        <div className="md:col-span-2 xl:col-span-3"><RichTextEditor id="product-description" label="Description détaillée" value={productForm.description_html || ''} onChange={(value) => setProductForm((current) => ({ ...current, description_html: value }))} hint="Utilisez les titres, listes et liens pour une fiche de vente structurée." /></div>
        {[
          ['colors', 'Couleurs, au format JSON', '["Bleu", "Acier"]'], ['attributes', 'Caractéristiques, au format JSON', '{"mouvement":"Automatique","verre":"Saphir"}'], ['variants', 'Variantes, au format JSON', '[{"name":"40 mm","sku":"REF-40","stock_quantity":2}]'], ['faq', 'F.A.Q. produit, au format JSON', '[{"question":"…","answer":"…"}]']
        ].map(([name, label, placeholder]) => <label key={name} className="md:col-span-2 xl:col-span-3 text-sm font-semibold text-[#002141]">{label}<textarea value={productForm[String(name)] || ''} onChange={(event) => setProductForm((current) => ({ ...current, [String(name)]: event.target.value }))} className="admin-input mt-2 min-h-28 font-mono text-xs" placeholder={placeholder} /></label>)}
        <label className="md:col-span-2 xl:col-span-3 text-sm font-semibold text-[#002141]">Description SEO<textarea value={productForm.seo_description || ''} onChange={(event) => setProductForm((current) => ({ ...current, seo_description: event.target.value }))} className="admin-input mt-2 min-h-20" /></label>
      </div><div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="admin-primary-button">Enregistrer le produit</button><button type="button" onClick={() => setEditingProduct(null)} className="admin-secondary-button">Annuler</button></div></form>}
      {products.length === 0 ? <EmptyState title="Le catalogue Supabase est vide" body="Créez votre premier produit, puis envoyez les images depuis la galerie média." /> : <div className="overflow-x-auto border border-[#002141]/15 bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#002141] text-[#FAF9F7]"><tr><th className="p-4">Produit</th><th className="p-4">Prix actuel</th><th className="p-4">Marge brute</th><th className="p-4">Stock</th><th className="p-4">État</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{products.map((product) => { const currentPrice = Number(product.sale_price_xof ?? product.regular_price_xof ?? 0); const margin = currentPrice - Number(product.purchase_price_xof || 0); return <tr key={product.id} className="border-t border-[#002141]/10"><td className="p-4"><p className="font-semibold text-[#002141]">{product.name}</p><p className="mt-1 text-xs text-[#3A3A3A]">{product.reference || product.sku || 'Sans référence'}</p></td><td className="p-4">{formatXOF(currentPrice)}</td><td className="p-4 text-emerald-800">{formatXOF(margin)}</td><td className="p-4"><span className={Number(product.stock_quantity) <= Number(product.low_stock_threshold) ? 'font-bold text-red-800' : ''}>{product.stock_quantity}</span></td><td className="p-4"><span className="admin-pill">{product.status}</span></td><td className="p-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditingProduct(product); setProductForm(toProductForm(product)); }} className="admin-icon-button" aria-label="Modifier"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => void deleteProduct(product)} className="admin-icon-button text-red-800" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button></div></td></tr>})}</tbody></table></div>}
      {lowStockProducts.length > 0 && <p className="mt-4 text-sm text-red-800">{lowStockProducts.length} produit(s) ont atteint leur seuil de stock.</p>}
    </>
  );

  const renderOrders = () => <><PanelHeader eyebrow="Commerce" title="Commandes" description="Consultez les commandes enregistrées et suivez leur état sans quitter le portail." />{orders.length === 0 ? <EmptyState title="Aucune commande" body="Les nouvelles commandes synchronisées depuis le site apparaîtront ici." /> : <div className="space-y-4">{orders.map((order) => <article key={order.id} className="border border-[#002141]/15 bg-white p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-semibold text-[#002141]">{order.order_number || order.id}</p><p className="mt-1 text-sm text-[#3A3A3A]">{order.customer_name} · {order.customer_email} · {formatXOF(order.total_xof)}</p></div><label className="text-sm font-semibold text-[#002141]">État<select value={order.status} onChange={(event) => void updateOrder(order, event.target.value)} className="admin-input mt-2 min-w-52">{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>{Array.isArray(order.order_items) && <p className="mt-4 border-t border-[#002141]/10 pt-4 text-sm text-[#3A3A3A]">{order.order_items.map((item: AnyRecord) => `${item.quantity} × ${item.product_name}`).join(' · ')}</p>}</article>)}</div>}</>;

  const renderAdministrators = () => <><PanelHeader eyebrow="Accès sécurisé" title="Administrateurs" description="Gérez les comptes actifs et créez des codes à usage unique, valides pendant une heure." action={<button type="button" onClick={() => void generateInvitation()} className="admin-primary-button"><KeyRound className="h-4 w-4" /> Générer un code</button>} />{generatedCode && <div className="mb-6 border border-[#AC854B] bg-[#fffaf0] p-5"><p className="text-sm font-semibold text-[#002141]">Code d’invitation à transmettre une seule fois</p><code className="mt-3 block select-all break-all bg-[#002141] p-4 text-lg font-bold tracking-[0.12em] text-[#D6BB8F]">{generatedCode}</code><p className="mt-3 text-xs text-[#3A3A3A]">Il expirera dans une heure. Conservez-le hors des canaux publics.</p></div>}<div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><section className="border border-[#002141]/15 bg-white"><h2 className="border-b border-[#002141]/10 p-5 font-playfair text-2xl font-semibold">Comptes actifs</h2>{administrators.map((account) => <article key={account.id} className="flex items-center justify-between gap-4 border-b border-[#002141]/10 p-5"><div><p className="font-semibold">{account.full_name || 'Administrateur'}</p><p className="text-sm text-[#3A3A3A]">{account.email}</p></div><button type="button" onClick={async () => { try { await adminRequest(`/administrators/${account.id}`, { method: 'PATCH', body: { is_active: !account.is_active } }); await loadTab('administrators'); notify(account.is_active ? 'Compte désactivé.' : 'Compte réactivé.'); } catch (error) { notify(error instanceof Error ? error.message : 'Action impossible.'); } }} className={account.is_active ? 'admin-secondary-button' : 'admin-primary-button'}>{account.is_active ? 'Désactiver' : 'Réactiver'}</button></article>)}</section><section className="border border-[#002141]/15 bg-white"><h2 className="border-b border-[#002141]/10 p-5 font-playfair text-2xl font-semibold">Codes récents</h2>{invitations.length === 0 ? <p className="p-5 text-sm text-[#3A3A3A]">Aucun code créé.</p> : invitations.map((invitation) => <article key={invitation.id} className="flex items-center justify-between gap-3 border-b border-[#002141]/10 p-5"><div><p className="text-sm font-semibold">{invitation.used_at ? 'Utilisé' : invitation.revoked_at ? 'Révoqué' : new Date(invitation.expires_at) > new Date() ? 'Valide' : 'Expiré'}</p><p className="mt-1 text-xs text-[#3A3A3A]">Expire le {new Date(invitation.expires_at).toLocaleString('fr-FR')}</p></div>{!invitation.used_at && !invitation.revoked_at && new Date(invitation.expires_at) > new Date() && <button type="button" onClick={async () => { await adminRequest(`/invitations/${invitation.id}/revoke`, { method: 'PATCH' }); await loadTab('administrators'); notify('Code révoqué.'); }} className="admin-icon-button text-red-800" aria-label="Révoquer"><Trash2 className="h-4 w-4" /></button>}</article>)}</section></div></>;

  const renderUsers = () => <><PanelHeader eyebrow="Comptes clients" title="Utilisateurs" description="Visualisez les comptes personnels créés par les visiteurs et désactivez un accès en cas de besoin." />{users.length === 0 ? <EmptyState title="Aucun utilisateur enregistré" body="Les comptes visiteurs apparaîtront ici après leur inscription." /> : <div className="divide-y divide-[#002141]/10 border border-[#002141]/15 bg-white">{users.map((user) => <article key={user.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-[#002141]">{user.full_name || 'Client HERITAGE'}</p><p className="mt-1 text-sm text-[#3A3A3A]">{user.email} {user.phone ? `· ${user.phone}` : ''}</p></div><button type="button" onClick={async () => { try { await adminRequest(`/users/${user.id}`, { method: 'PATCH', body: { is_active: !user.is_active } }); await loadTab('users'); notify(user.is_active ? 'Compte client désactivé.' : 'Compte client réactivé.'); } catch (error) { notify(error instanceof Error ? error.message : 'Action impossible.'); } }} className={user.is_active ? 'admin-secondary-button' : 'admin-primary-button'}>{user.is_active ? 'Désactiver' : 'Réactiver'}</button></article>)}</div>}</>;

  const renderMedia = () => <><PanelHeader eyebrow="Fichiers de la boutique" title="Galerie média" description="Ajoutez et retirez les images destinées aux fiches produit. Formats JPEG, PNG, WebP ou AVIF, 10 Mo maximum." action={<label className="admin-primary-button cursor-pointer"><Plus className="h-4 w-4" /> Ajouter une image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={uploadMedia} /></label>} />{media.length === 0 ? <EmptyState title="La galerie est vide" body="Ajoutez la première image produit depuis votre appareil." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{media.map((asset) => <article key={asset.id} className="overflow-hidden border border-[#002141]/15 bg-white"><img src={asset.public_url} alt={asset.alt_text || asset.file_name} className="h-44 w-full object-cover" /><div className="flex items-center justify-between gap-3 p-4"><p className="truncate text-sm font-semibold text-[#002141]">{asset.file_name}</p><button type="button" onClick={async () => { if (!window.confirm('Supprimer cette image définitivement ?')) return; try { await adminRequest(`/media/${asset.id}`, { method: 'DELETE' }); await loadTab('media'); notify('Image supprimée.'); } catch (error) { notify(error instanceof Error ? error.message : 'Suppression impossible.'); } }} className="admin-icon-button text-red-800" aria-label="Supprimer l’image"><Trash2 className="h-4 w-4" /></button></div></article>)}</div>}</>;

  const renderCoordinates = () => {
    const settings = siteSettings || { business_name: 'HERITAGE', social_links: {} };
    return <><PanelHeader eyebrow="Informations de la maison" title="Coordonnées" description="Centralisez les contacts et liens sociaux affichés sur le footer, les pages de contact et les autres emplacements prévus." /> <form onSubmit={async (event) => { event.preventDefault(); try { await adminRequest('/site-settings', { method: 'PATCH', body: { ...settings, social_links: typeof settings.social_links === 'string' ? settings.social_links : JSON.stringify(settings.social_links || {}) } }); await loadTab('coordinates'); notify('Coordonnées enregistrées.'); } catch (error) { notify(error instanceof Error ? error.message : 'Enregistrement impossible.'); } }} className="max-w-3xl border border-[#002141]/15 bg-white p-5 sm:p-7"><div className="grid gap-5 md:grid-cols-2">{[['business_name','Nom de la boutique'],['email','E-mail'],['phone','Téléphone'],['address','Adresse'],['hours','Horaires']].map(([name,label]) => <label key={name} className="text-sm font-semibold text-[#002141]">{label}<input value={settings[name] || ''} onChange={(event) => setSiteSettings((current) => ({ ...(current || {}), [name]: event.target.value }))} className="admin-input mt-2" /></label>)}<label className="md:col-span-2 text-sm font-semibold text-[#002141]">Liens sociaux, au format JSON<textarea value={typeof settings.social_links === 'string' ? settings.social_links : JSON.stringify(settings.social_links || {}, null, 2)} onChange={(event) => setSiteSettings((current) => ({ ...(current || {}), social_links: event.target.value }))} className="admin-input mt-2 min-h-36 font-mono text-xs" placeholder={'{"facebook":"https://…","instagram":"https://…","tiktok":"https://…","x":"https://…","youtube":"https://…"}'} /></label></div><button type="submit" className="admin-primary-button mt-7">Enregistrer les coordonnées</button></form></>;
  };

  let content: React.ReactNode = renderDashboard();
  if (activeTab === 'products') content = renderProducts();
  if (activeTab === 'orders') content = renderOrders();
  if (activeTab === 'administrators') content = renderAdministrators();
  if (activeTab === 'users') content = renderUsers();
  if (activeTab === 'media') content = renderMedia();
  if (activeTab === 'coordinates') content = renderCoordinates();
  if (['reviews', 'blogs', 'faqs', 'legal', 'meta', 'pixels'].includes(activeTab)) {
    const config = RESOURCE_CONFIGS[activeTab as keyof typeof RESOURCE_CONFIGS];
    content = <ResourceManager config={config} items={resources[activeTab] || []} onRefresh={() => loadTab(activeTab)} onNotify={notify} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#002141]">
      {sidebarOpen && <button type="button" className="fixed inset-0 z-40 bg-[#002141]/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#002141] text-[#FAF9F7] shadow-2xl transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-[#FAF9F7]/10 p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center bg-[#AC854B] font-playfair text-xl font-bold text-[#002141]">H</span><div><p className="brand-wordmark text-sm">HERITAGE</p><p className="brand-descriptor mt-1 text-[8px] text-[#D6BB8F]">ADMINISTRATION</p></div></div><button type="button" onClick={() => setSidebarOpen(false)} className="admin-sidebar-icon lg:hidden" aria-label="Fermer le menu"><X className="h-5 w-5" /></button></div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Navigation administration">{NAVIGATION.map((item, index) => { const Icon = item.icon; const previous = NAVIGATION[index - 1]; return <React.Fragment key={item.id}>{item.section && <p className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D6BB8F]/80 ${previous ? 'pt-6' : 'pt-3'}`}>{item.section}</p>}<button type="button" onClick={() => selectTab(item.id)} className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold transition ${activeTab === item.id ? 'bg-[#AC854B] text-[#002141]' : 'text-[#FAF9F7]/82 hover:bg-[#FAF9F7]/10 hover:text-[#FAF9F7]'}`}><Icon className="h-4 w-4" aria-hidden="true" />{item.label}</button></React.Fragment>; })}</nav>
        <div className="border-t border-[#FAF9F7]/10 p-4"><p className="truncate text-sm font-semibold">{admin.full_name || 'Administrateur'}</p><p className="mt-1 truncate text-xs text-[#FAF9F7]/60">{admin.email}</p><button type="button" onClick={() => void logout()} className="mt-4 flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#D6BB8F] hover:text-[#FAF9F7]"><LogOut className="h-4 w-4" /> Déconnexion</button></div>
      </aside>
      <div className="lg:pl-72"><header className="sticky top-0 z-30 flex min-h-18 items-center justify-between border-b border-[#002141]/10 bg-[#F5F3EF]/95 px-4 py-3 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><button type="button" onClick={() => setSidebarOpen(true)} className="admin-icon-button lg:hidden" aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AC854B]">Portail privé</p><p className="text-sm font-semibold text-[#002141]">{NAVIGATION.find((item) => item.id === activeTab)?.label}</p></div></div><button type="button" onClick={() => navigate('/')} className="admin-secondary-button hidden sm:inline-flex"><PanelLeftClose className="h-4 w-4" /> Voir la boutique</button></header>
        <main className="px-4 py-7 sm:px-7 lg:px-10">{loading ? <div className="flex min-h-80 items-center justify-center text-sm text-[#3A3A3A]"><LoaderCircle className="mr-3 h-5 w-5 animate-spin text-[#AC854B]" /> Chargement des données sécurisées…</div> : content}</main>
      </div>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-[60] max-w-sm border border-[#D6BB8F] bg-[#002141] px-4 py-3 text-sm text-[#FAF9F7] shadow-xl"><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#D6BB8F]" />{notice}</div>}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { SearchModal } from './components/search/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';

// Home components
import { HeroSection } from './components/home/HeroSection';
import { TrustMarkers } from './components/home/TrustMarkers';
import { CategoriesSection } from './components/home/CategoriesSection';
import { CuratedSelection } from './components/home/CuratedSelection';
import { HouseStory } from './components/home/HouseStory';
import { MethodSection } from './components/home/MethodSection';
import { JournalSection } from './components/home/JournalSection';
import { LocalAdvice } from './components/home/LocalAdvice';

// App pages
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { ConfirmationView } from './components/checkout/ConfirmationView';
import { AccountView } from './components/account/AccountView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { AboutView } from './components/pages/AboutView';
import { AuthenticityView } from './components/pages/AuthenticityView';
import { JournalView } from './components/pages/JournalView';
import { ContactView } from './components/pages/ContactView';
import { LegalView } from './components/pages/LegalView';

import { getProductBySlug } from './data/products';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const { isSearchOpen, setIsSearchOpen, isCartOpen, setIsCartOpen, cartToast } = useStore();

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (route !== currentRoute) {
      window.history.pushState(null, '', route);
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Route Resolver
  const renderRoute = () => {
    if (currentRoute === '/' || currentRoute === '') {
      return (
        <main id="main-content">
          <HeroSection navigate={navigate} />
          <TrustMarkers />
          <CategoriesSection navigate={navigate} />
          <CuratedSelection navigate={navigate} />
          <HouseStory navigate={navigate} />
          <MethodSection navigate={navigate} />
          <JournalSection navigate={navigate} />
          <LocalAdvice navigate={navigate} />
        </main>
      );
    }

    if (currentRoute === '/montres') {
      return <CatalogView navigate={navigate} />;
    }

    if (currentRoute === '/montres/tissot') {
      return <CatalogView navigate={navigate} initialBrand="Tissot" />;
    }

    if (currentRoute && currentRoute.startsWith('/montres/')) {
      const slug = currentRoute.replace('/montres/', '');
      const product = getProductBySlug(slug);
      if (product) {
        return <ProductDetailView product={product} navigate={navigate} />;
      }
      return (
        <div className="bg-[#FAF9F7] min-h-screen pt-32 pb-24 text-center px-4">
          <div className="max-w-md mx-auto bg-white p-10 border border-[#002141]/10">
            <h1 className="font-playfair text-2xl font-bold text-[#002141] mb-3">
              Pièce introuvable
            </h1>
            <p className="text-xs text-[#3A3A3A] mb-6">
              La référence demandée n'est plus disponible ou a été modifiée.
            </p>
            <button
              type="button"
              onClick={() => navigate('/montres')}
              className="px-6 py-3 bg-[#002141] text-[#FAF9F7] text-xs font-semibold uppercase tracking-wider"
            >
              DÉCOUVRIR LES MONTRES EN STOCK
            </button>
          </div>
        </div>
      );
    }

    if (currentRoute === '/panier') {
      return <CartView navigate={navigate} />;
    }

    if (currentRoute === '/commande') {
      return <CheckoutView navigate={navigate} />;
    }

    if (currentRoute === '/commande/confirmation') {
      return <ConfirmationView navigate={navigate} />;
    }

    if (currentRoute === '/compte') {
      return <AccountView navigate={navigate} />;
    }

    if (currentRoute === '/admin') {
      return <AdminPortalView navigate={navigate} />;
    }

    if (currentRoute === '/a-propos') {
      return <AboutView navigate={navigate} />;
    }

    if (currentRoute === '/authenticite-provenance') {
      return <AuthenticityView navigate={navigate} />;
    }

    if (currentRoute === '/journal') {
      return <JournalView navigate={navigate} />;
    }

    if (currentRoute === '/contact') {
      return <ContactView navigate={navigate} />;
    }

    if (currentRoute === '/mentions-legales') {
      return <LegalView type="mentions-legales" navigate={navigate} />;
    }

    if (currentRoute === '/cgv') {
      return <LegalView type="cgv" navigate={navigate} />;
    }

    if (currentRoute === '/confidentialite') {
      return <LegalView type="confidentialite" navigate={navigate} />;
    }

    // Default 404 fallback
    return (
      <div className="bg-[#FAF9F7] min-h-screen pt-32 pb-24 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-10 border border-[#002141]/10">
          <h1 className="font-playfair text-2xl font-bold text-[#002141] mb-3">
            Page non trouvée
          </h1>
          <p className="text-xs text-[#3A3A3A] mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#002141] text-[#FAF9F7] text-xs font-semibold uppercase tracking-wider"
          >
            RETOURNER À L'ACCUEIL
          </button>
        </div>
      </div>
    );
  };

  const isAdmin = currentRoute === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#002141] font-montserrat antialiased selection:bg-[#AC854B] selection:text-[#FAF9F7]">
      {/* Global Navigation Header (Masqué sur le portail administration) */}
      {!isAdmin && (
        <Header
          currentRoute={currentRoute}
          navigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Main Routed Content */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Global Footer (Masqué sur le portail administration) */}
      {!isAdmin && <Footer navigate={navigate} />}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        navigate={navigate}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigate={navigate}
      />

      {/* Persistent Floating WhatsApp Advisor (Masqué sur le portail administration) */}
      {!isAdmin && <WhatsAppButton currentRoute={currentRoute} />}

      {/* Cart Notification Toast */}
      {cartToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#002141] text-[#FAF9F7] px-5 py-3 shadow-2xl border border-[#AC854B]/50 flex items-center gap-3 text-xs tracking-wide"
        >
          <span className="w-2 h-2 rounded-full bg-[#AC854B] animate-ping" />
          <span>{cartToast}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

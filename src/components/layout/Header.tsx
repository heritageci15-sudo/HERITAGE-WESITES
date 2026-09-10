import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  currentRoute?: string;
  navigate: (route: string) => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute = '',
  navigate,
  onOpenSearch,
  onOpenCart,
}) => {
  const { cartItemCount, setIsCartOpen, setIsSearchOpen } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ACCUEIL', route: '/' },
    { label: 'BOUTIQUE', route: '/boutique' },
    { label: 'BLOGS', route: '/blogs' },
    { label: 'À PROPOS', route: '/a-propos' },
    { label: 'CONTACT', route: '/contact' }
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#002141] text-[#FAF9F7] px-4 py-2 text-xs font-semibold uppercase tracking-wider"
      >
        Aller au contenu principal
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled || currentRoute !== '/'
            ? 'bg-[#FAF9F7]/95 backdrop-blur-md border-b border-[#002141]/10 py-3.5 shadow-xs'
            : 'bg-gradient-to-b from-[#002141]/70 via-[#002141]/30 to-transparent py-5 text-[#FAF9F7]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              id="header-mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-current hover:opacity-75 focus:outline-hidden"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Monogram */}
          <button
            type="button"
            id="header-brand-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left group cursor-pointer"
            aria-label="HERITAGE Boutique - Retour à l'accueil"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex-shrink-0">
              <img
                src="/assets/favicon.svg"
                alt="Monogramme HERITAGE"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-playfair text-lg sm:text-xl font-bold tracking-[0.2em] leading-none transition-colors ${
                  isScrolled || currentRoute !== '/' ? 'text-[#002141]' : 'text-[#FAF9F7]'
                }`}
              >
                HERITAGE
              </span>
              <span
                className={`text-[8px] sm:text-[9px] font-semibold tracking-[0.25em] uppercase leading-tight mt-1 transition-colors ${
                  isScrolled || currentRoute !== '/' ? 'text-[#AC854B]' : 'text-[#D6BB8F]'
                }`}
              >
                MONTRES &middot; ABIDJAN
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Navigation principale"
          >
            {navLinks.map((item) => {
              const isActive =
                item.route === '/'
                  ? currentRoute === '/'
                  : currentRoute.startsWith(item.route) ||
                    (item.route === '/boutique' && (currentRoute === '/montres' || currentRoute.startsWith('/montres'))) ||
                    (item.route === '/blogs' && (currentRoute === '/blogs' || currentRoute.startsWith('/blogs') || currentRoute === '/blog'));
              return (
                <button
                  key={item.route}
                  type="button"
                  id={`nav-link-${item.label.toLowerCase().replace(/[\sà]/g, '')}`}
                  onClick={() => navigate(item.route)}
                  className={`text-xs font-semibold tracking-[0.14em] uppercase py-1 transition-colors relative cursor-pointer ${
                    isScrolled || currentRoute !== '/'
                      ? isActive
                        ? 'text-[#002141] font-bold'
                        : 'text-[#3A3A3A] hover:text-[#002141]'
                      : isActive
                      ? 'text-[#FAF9F7] font-bold'
                      : 'text-[#FAF9F7]/85 hover:text-[#FAF9F7]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${
                        isScrolled || currentRoute !== '/' ? 'bg-[#AC854B]' : 'bg-[#D6BB8F]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              id="header-search-button"
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else setIsSearchOpen(true);
              }}
              className="p-2.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-current"
              aria-label="Rechercher une montre ou une référence"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              id="header-account-button"
              onClick={() => navigate('/compte')}
              className="p-2.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-current"
              aria-label="Mon compte et suivi des commandes"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              id="header-cart-button"
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else setIsCartOpen(true);
              }}
              className="relative p-2.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-current flex items-center"
              aria-label={`Panier d'achats, ${cartItemCount} article${cartItemCount > 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#AC854B] text-[#FAF9F7] text-[10px] font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#002141]/80 backdrop-blur-xs flex justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <div className="w-full max-w-xs bg-[#FAF9F7] h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#002141]/10">
              <div className="flex items-center gap-2">
                <img src="/assets/favicon.svg" alt="HERITAGE" className="w-7 h-7" />
                <span className="font-playfair font-bold text-lg text-[#002141] tracking-widest">
                  HERITAGE
                </span>
              </div>
              <button
                type="button"
                id="header-mobile-close-button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#002141] hover:opacity-75 focus:outline-hidden"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col py-6 space-y-4" aria-label="Menu mobile">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  type="button"
                  id={`mobile-nav-${item.label.toLowerCase().replace(/[\sà]/g, '')}`}
                  onClick={() => {
                    navigate(item.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-semibold tracking-[0.14em] uppercase py-2 cursor-pointer ${
                    currentRoute === item.route ||
                    (item.route === '/boutique' && (currentRoute === '/montres' || currentRoute.startsWith('/montres'))) ||
                    (item.route === '/blogs' && (currentRoute === '/blogs' || currentRoute.startsWith('/blogs') || currentRoute === '/blog'))
                      ? 'text-[#AC854B] font-bold'
                      : 'text-[#002141] hover:text-[#AC854B]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#002141]/10 text-xs text-[#3A3A3A] space-y-3">
              <p className="font-medium text-[#002141]">Maison HERITAGE &middot; Abidjan</p>
              <p>Yopougon, Abidjan, Côte d'Ivoire</p>
              <p>
                Conseil direct :{' '}
                <a
                  href="tel:+2250707181560"
                  className="font-semibold text-[#002141] underline underline-offset-2"
                >
                  +225 07 07 18 15 60
                </a>
              </p>
              <a
                href="https://wa.me/2250707181560?text=Bonjour%20HERITAGE%2C%20je%20souhaite%20un%20conseil%20au%20sujet%20de%20votre%20s%C3%A9lection%20de%20montres."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full mt-2 py-2.5 px-4 bg-[#002141] text-[#FAF9F7] text-xs font-semibold tracking-wider uppercase rounded-xs"
              >
                Échanger sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

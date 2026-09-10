import React, { useState, useMemo } from 'react';
import { getPublishedProducts, formatXOF } from '../../data/products';
import { ProductCard } from './ProductCard';
import { FilterState, Product } from '../../types';
import { SlidersHorizontal, X, RotateCcw, MessageCircle, ChevronDown } from 'lucide-react';

interface CatalogViewProps {
  navigate: (route: string) => void;
  initialBrand?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ navigate, initialBrand }) => {
  const publishedProducts = getPublishedProducts();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: initialBrand ? [initialBrand] : [],
    movement: [],
    diameter: [],
    waterResistance: [],
    material: [],
    dialColor: [],
    availability: [],
    sort: 'pertinence'
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Facet options derived from actual published products
  const facetOptions = useMemo(() => {
    const brands = Array.from(new Set(publishedProducts.map((p) => p.brand)));
    const movements = Array.from(new Set(publishedProducts.map((p) => p.attributes.mouvement)));
    const diameters = Array.from(new Set(publishedProducts.map((p) => p.attributes.diametre)));
    const availabilities = Array.from(new Set(publishedProducts.map((p) => p.stockStatus)));

    return { brands, movements, diameters, availabilities };
  }, [publishedProducts]);

  // Toggle filter helper
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentList = (prev[category] as string[]) || [];
      const exists = currentList.includes(value);
      const updated = exists
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updated };
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: [],
      movement: [],
      diameter: [],
      waterResistance: [],
      material: [],
      dialColor: [],
      availability: [],
      sort: 'pertinence'
    });
  };

  // Filtered & sorted product list
  const filteredProducts = useMemo(() => {
    return publishedProducts
      .filter((product) => {
        // Search
        if (filters.search.trim()) {
          const s = filters.search.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(s) ||
            product.reference.toLowerCase().includes(s) ||
            product.brand.toLowerCase().includes(s) ||
            product.attributes.mouvement.toLowerCase().includes(s);
          if (!matches) return false;
        }

        // Brand
        if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
          return false;
        }

        // Movement
        if (
          filters.movement.length > 0 &&
          !filters.movement.includes(product.attributes.mouvement)
        ) {
          return false;
        }

        // Diameter
        if (
          filters.diameter.length > 0 &&
          !filters.diameter.includes(product.attributes.diametre)
        ) {
          return false;
        }

        // Availability
        if (
          filters.availability.length > 0 &&
          !filters.availability.includes(product.stockStatus)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'prix_croissant') return a.priceXOF - b.priceXOF;
        if (filters.sort === 'prix_decroissant') return b.priceXOF - a.priceXOF;
        return 0; // Default pertinence
      });
  }, [publishedProducts, filters]);

  const activeFilterCount =
    filters.brand.length +
    filters.movement.length +
    filters.diameter.length +
    filters.availability.length +
    (filters.search ? 1 : 0);

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#3A3A3A] mb-8" aria-label="Fil d'Ariane">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-[#002141] transition-colors"
          >
            Accueil
          </button>
          <span>/</span>
          <span className="text-[#002141] font-semibold">Boutique</span>
          {initialBrand && (
            <>
              <span>/</span>
              <span className="text-[#AC854B] font-semibold">{initialBrand}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#002141] leading-tight mb-4">
            {initialBrand ? `Montres ${initialBrand} à Abidjan` : 'La Boutique HERITAGE'}
          </h1>
          <p className="text-sm sm:text-base text-[#3A3A3A] leading-relaxed mb-4">
            Découvrez nos pièces sélectionnées à Abidjan pour leur précision, leur facture et leur capacité à
            accompagner le temps. Montres de manufacture, créations horlogères, parfums et accessoires de prestige.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8E1D3]/50 text-xs font-semibold text-[#002141]">
            <span>{filteredProducts.length} pièces disponibles à découvrir</span>
          </div>
        </div>

        {/* Top Controls Bar: Search, Mobile Filter Toggle, and Sort */}
        <div className="bg-white border border-[#002141]/10 p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Marque, modèle ou référence..."
              className="w-full text-xs sm:text-sm bg-[#FAF9F7] px-3.5 py-2.5 border border-[#002141]/10 text-[#002141] placeholder-[#3A3A3A]/60 focus:outline-hidden focus:border-[#AC854B]"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F7] border border-[#002141]/15 text-xs font-semibold uppercase tracking-wider text-[#002141]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#AC854B]" />
              <span>Filtres {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="catalog-sort" className="text-xs text-[#3A3A3A] whitespace-nowrap">
                Trier par :
              </label>
              <div className="relative">
                <select
                  id="catalog-sort"
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sort: e.target.value as FilterState['sort']
                    })
                  }
                  className="appearance-none bg-[#FAF9F7] border border-[#002141]/10 text-xs font-semibold text-[#002141] py-2 pl-3 pr-8 focus:outline-hidden focus:border-[#AC854B] cursor-pointer"
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="prix_croissant">Prix croissant</option>
                  <option value="prix_decroissant">Prix décroissant</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#3A3A3A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (280px wide) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#002141]/10 p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#002141]/10">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#002141]">
                Filtres de recherche
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#AC854B] hover:text-[#002141]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            {/* Filter: Marque */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                Marque
              </h4>
              <div className="space-y-2">
                {facetOptions.brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-xs text-[#002141] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(brand)}
                      onChange={() => toggleFilter('brand', brand)}
                      className="rounded-xs border-[#002141]/30 text-[#002141] focus:ring-[#AC854B]"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Mouvement */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                Mouvement
              </h4>
              <div className="space-y-2">
                {facetOptions.movements.map((mov) => (
                  <label
                    key={mov}
                    className="flex items-center gap-2.5 text-xs text-[#002141] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={filters.movement.includes(mov)}
                      onChange={() => toggleFilter('movement', mov)}
                      className="rounded-xs border-[#002141]/30 text-[#002141] focus:ring-[#AC854B]"
                    />
                    <span>{mov}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Diamètre */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                Diamètre du boîtier
              </h4>
              <div className="space-y-2">
                {facetOptions.diameters.map((dia) => (
                  <label
                    key={dia}
                    className="flex items-center gap-2.5 text-xs text-[#002141] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={filters.diameter.includes(dia)}
                      onChange={() => toggleFilter('diameter', dia)}
                      className="rounded-xs border-[#002141]/30 text-[#002141] focus:ring-[#AC854B]"
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Disponibilité */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                Disponibilité
              </h4>
              <div className="space-y-2">
                {facetOptions.availabilities.map((avail) => (
                  <label
                    key={avail}
                    className="flex items-center gap-2.5 text-xs text-[#002141] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(avail)}
                      onChange={() => toggleFilter('availability', avail)}
                      className="rounded-xs border-[#002141]/30 text-[#002141] focus:ring-[#AC854B]"
                    />
                    <span>{avail}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} navigate={navigate} />
                ))}
              </div>
            ) : (
              /* Zero Results State conforming strictly to PRD */
              <div className="bg-white border border-[#002141]/10 p-12 text-center space-y-4">
                <p className="font-playfair text-xl font-bold text-[#002141]">
                  Aucune pièce ne correspond à ces critères.
                </p>
                <p className="text-xs text-[#3A3A3A] max-w-md mx-auto leading-relaxed">
                  Modifiez vos filtres ou réinitialisez votre sélection pour afficher les montres
                  actuellement en stock chez HERITAGE.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-6 py-3 bg-[#002141] text-[#FAF9F7] text-xs font-semibold uppercase tracking-widest hover:bg-[#AC854B] transition-colors cursor-pointer"
                  >
                    RÉINITIALISER LES FILTRES
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advice Prompt Banner at Bottom */}
        <div className="mt-16 bg-white border border-[#002141]/10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#002141] mb-2">
              Une référence vous intéresse, mais vous hésitez encore ?
            </h3>
            <p className="text-xs sm:text-sm text-[#3A3A3A] max-w-2xl leading-relaxed">
              HERITAGE vous accompagne depuis Yopougon, Abidjan. Obtenez une précision technique,
              validez la taille sur votre poignet ou organisez une remise en main propre.
            </p>
          </div>
          <a
            href="https://wa.me/2250707181560?text=Bonjour%20HERITAGE%2C%20je%20consulte%20votre%20catalogue%20de%20montres%20et%20souhaite%20un%20conseil."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7] text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#D6BB8F]" />
            <span>ÉCHANGER AVEC UN CONSEILLER</span>
          </a>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#002141]/80 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#002141]/10">
              <h3 className="font-playfair text-lg font-bold text-[#002141]">Filtres</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 -mr-2 text-[#3A3A3A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-6">
              {/* Movement */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                  Mouvement
                </h4>
                <div className="space-y-2">
                  {facetOptions.movements.map((mov) => (
                    <label key={mov} className="flex items-center gap-2 text-xs text-[#002141]">
                      <input
                        type="checkbox"
                        checked={filters.movement.includes(mov)}
                        onChange={() => toggleFilter('movement', mov)}
                        className="rounded-xs"
                      />
                      <span>{mov}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diameter */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                  Diamètre
                </h4>
                <div className="space-y-2">
                  {facetOptions.diameters.map((dia) => (
                    <label key={dia} className="flex items-center gap-2 text-xs text-[#002141]">
                      <input
                        type="checkbox"
                        checked={filters.diameter.includes(dia)}
                        onChange={() => toggleFilter('diameter', dia)}
                        className="rounded-xs"
                      />
                      <span>{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3A3A] mb-3">
                  Disponibilité
                </h4>
                <div className="space-y-2">
                  {facetOptions.availabilities.map((avail) => (
                    <label key={avail} className="flex items-center gap-2 text-xs text-[#002141]">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes(avail)}
                        onChange={() => toggleFilter('availability', avail)}
                        className="rounded-xs"
                      />
                      <span>{avail}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#002141]/10 space-y-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#002141] text-[#FAF9F7] text-xs font-semibold uppercase tracking-widest"
              >
                APPLIQUER ({filteredProducts.length} pièces)
              </button>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 bg-transparent text-[#002141] text-xs font-semibold uppercase tracking-widest border border-[#002141]/20"
                >
                  RÉINITIALISER
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

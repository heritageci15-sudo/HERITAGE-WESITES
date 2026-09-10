import React, { useState } from 'react';
import { BLOG_ARTICLES, BlogArticle } from '../../data/blog';
import { ArrowRight, Clock, Tag } from 'lucide-react';

interface BlogViewProps {
  navigate: (route: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ navigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Horlogerie', 'Haute Parfumerie', 'Lunetterie de Luxe'];

  const filteredArticles =
    selectedCategory === 'Tous'
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((art) => art.category === selectedCategory);

  if (selectedArticle) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#3A3A3A] mb-8" aria-label="Fil d'Ariane">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#002141] transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="hover:text-[#002141] transition-colors cursor-pointer"
            >
              Blogs
            </button>
            <span>/</span>
            <span className="text-[#002141] font-semibold truncate max-w-xs">{selectedArticle.title}</span>
          </nav>

          <article className="bg-white border border-[#002141]/10 p-8 sm:p-12 space-y-8 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#3A3A3A]/70">
                <span className="font-bold uppercase tracking-wider text-[#AC854B]">
                  {selectedArticle.category}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readingTime}
                </span>
                <span>&middot;</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#002141] leading-tight">
                {selectedArticle.title}
              </h1>

              <p className="font-playfair italic text-lg sm:text-xl text-[#002141]">
                {selectedArticle.subtitle}
              </p>
            </div>

            <div className="aspect-16/9 bg-[#002141] overflow-hidden">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-8 text-[#3A3A3A] leading-relaxed text-sm sm:text-base">
              {selectedArticle.content.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#002141]">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#002141]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                id="blog-back-to-list-btn"
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold uppercase tracking-wider text-[#002141] hover:text-[#AC854B] transition-colors cursor-pointer"
              >
                &larr; RETOUR AUX ARTICLES DU BLOG
              </button>

              <button
                type="button"
                id="blog-go-to-boutique-btn"
                onClick={() => navigate('/boutique')}
                className="px-6 py-3 bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7] text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                DÉCOUVRIR LA BOUTIQUE
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#3A3A3A] mb-8" aria-label="Fil d'Ariane">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-[#002141] transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <span>/</span>
          <span className="text-[#002141] font-semibold">Blogs</span>
        </nav>

        <div className="max-w-3xl mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#AC854B] block mb-2">
            ARTICLES &amp; SAVOIR-FAIRE
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#002141] leading-tight mb-4">
            Le Blog HERITAGE
          </h1>
          <p className="text-sm sm:text-base text-[#3A3A3A] leading-relaxed">
            Conseils d'experts, repères de style et guides d'achat de la boutique : montres de manufacture, lunettes solaires de créateur, haute parfumerie et accessoires d'exception à Abidjan.
          </p>
        </div>

        {/* Categories filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#002141]/10">
          <span className="text-xs font-semibold text-[#002141] mr-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#AC854B]" />
            Thématiques :
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#002141] text-[#FAF9F7] shadow-xs'
                  : 'bg-white border border-[#002141]/15 text-[#3A3A3A] hover:border-[#002141]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.slug}
              className="premium-section-card bg-white border border-[#002141]/10 flex flex-col justify-between overflow-hidden group hover:border-[#AC854B] cursor-pointer"
              onClick={() => setSelectedArticle(art)}
            >
              <div className="aspect-16/10 bg-[#002141] overflow-hidden relative">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#002141]/90 text-[#FAF9F7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {art.category}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#AC854B] mb-2">
                    <span>{art.publishedAt}</span>
                    <span>&middot;</span>
                    <span>{art.readingTime}</span>
                  </div>
                  <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#002141] group-hover:text-[#AC854B] transition-colors mb-2 leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed line-clamp-3 mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#002141]/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002141] group-hover:text-[#AC854B] inline-flex items-center gap-2">
                    <span>LIRE L'ARTICLE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

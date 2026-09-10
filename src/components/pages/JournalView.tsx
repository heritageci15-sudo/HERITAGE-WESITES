import React, { useState } from 'react';
import { JOURNAL_ARTICLES, Article } from '../../data/journal';
import { ArrowRight, Clock } from 'lucide-react';

interface JournalViewProps {
  navigate: (route: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ navigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="hover:text-[#002141] transition-colors"
            >
              Journal
            </button>
            <span>/</span>
            <span className="text-[#002141] font-semibold truncate max-w-xs">{selectedArticle.title}</span>
          </nav>

          <article className="bg-white border border-[#002141]/10 p-8 sm:p-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#3A3A3A]/70">
                <span className="font-bold uppercase tracking-wider text-[#AC854B]">
                  Guide Horloger
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
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold uppercase tracking-wider text-[#002141] hover:text-[#AC854B] transition-colors cursor-pointer"
              >
                &larr; RETOUR AU JOURNAL
              </button>

              <button
                type="button"
                onClick={() => navigate('/montres')}
                className="px-6 py-3 bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7] text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                DÉCOUVRIR NOS CALIBRES
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
            className="hover:text-[#002141] transition-colors"
          >
            Accueil
          </button>
          <span>/</span>
          <span className="text-[#002141] font-semibold">Le Journal HERITAGE</span>
        </nav>

        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#AC854B] block mb-2">
            ÉDITORIAL HORLOGER
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#002141] leading-tight mb-4">
            Le Journal HERITAGE
          </h1>
          <p className="text-sm sm:text-base text-[#3A3A3A] leading-relaxed">
            Comprendre l'horlogerie, apprécier les mécanismes suisses et acquérir des repères solides
            pour choisir une pièce qui traversera les générations.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {JOURNAL_ARTICLES.map((art) => (
            <div
              key={art.slug}
              className="bg-white border border-[#002141]/10 flex flex-col justify-between overflow-hidden group hover:border-[#AC854B] transition-all cursor-pointer"
              onClick={() => setSelectedArticle(art)}
            >
              <div className="aspect-16/10 bg-[#002141] overflow-hidden relative">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#002141]/90 text-[#FAF9F7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {art.readingTime}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC854B] block mb-2">
                    {art.publishedAt}
                  </span>
                  <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#002141] group-hover:text-[#AC854B] transition-colors mb-2">
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

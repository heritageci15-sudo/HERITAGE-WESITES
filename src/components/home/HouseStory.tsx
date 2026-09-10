import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HouseStoryProps {
  navigate: (route: string) => void;
}

export const HouseStory: React.FC<HouseStoryProps> = ({ navigate }) => {
  return (
    <section className="py-24 md:py-32 bg-[#FAF9F7] relative overflow-hidden border-b border-[#002141]/10">
      {/* Background Editorial Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: 'url(/assets/trame-maison.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom',
          backgroundSize: 'cover'
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Monogram emblem */}
        <div className="w-12 h-12 mx-auto mb-8">
          <img
            src="/assets/favicon.svg"
            alt="HERITAGE Emblem"
            className="w-full h-full object-contain opacity-80"
          />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#AC854B] block mb-4">
          NOTRE CONVICTION
        </span>

        <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#002141] leading-[1.25] tracking-tight mb-8">
          Il y a des objets que l'on choisit pour aujourd'hui et d'autres que l'on imagine déjà
          transmettre.
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-[#3A3A3A] leading-relaxed max-w-2xl mx-auto mb-10">
          « HERITAGE est née d'une conviction simple. Une belle pièce ne doit pas seulement accompagner
          une apparence. Elle doit pouvoir garder sa place dans une histoire, de main en main. Notre
          sélection commence par cette question : mérite-t-elle de durer au-delà de vous. »
        </p>

        <div>
          <button
            type="button"
            id="story-discover-house"
            onClick={() => navigate('/a-propos')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7] text-xs font-bold uppercase tracking-[0.18em] transition-colors cursor-pointer group shadow-sm"
          >
            <span>DÉCOUVRIR LA MAISON</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

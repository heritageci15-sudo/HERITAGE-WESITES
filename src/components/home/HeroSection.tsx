import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageCircle, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  navigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // High performance scroll parallax via RAF
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax transform calculation: scale 1 to 1.06, translateY 0 to -4%
  const maxScroll = 600;
  const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
  const scale = prefersReducedMotion ? 1 : 1 + progress * 0.06;
  const translateY = prefersReducedMotion ? 0 : progress * -4;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[72vh] md:min-h-[82vh] h-[720px] max-h-[920px] w-full overflow-hidden bg-[#002141] flex items-center"
      aria-label="Présentation de la Maison HERITAGE"
    >
      {/* Background Media Layer with Parallax */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `scale(${scale}) translateY(${translateY}%)`,
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
        }}
        aria-hidden="true"
      >
        {/* Desktop Poster / Visual */}
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/assets/hero-mobile-watch.jpg"
          />
          <img
            src="/assets/hero-watch.jpg"
            alt=""
            className="w-full h-full object-cover object-right md:object-[75%_center]"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Navy Gradient Overlay for guaranteed WCAG AA text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002141]/95 via-[#002141]/75 to-transparent md:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002141] via-transparent to-[#002141]/30 md:hidden" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-left"
        >
          {/* Brand Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-[1.5px] bg-[#D6BB8F]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D6BB8F]">
              HERITAGE &middot; MONTRES ET ACCESSOIRES
            </span>
          </div>

          {/* H1 Headline */}
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#FAF9F7] leading-[1.18] tracking-tight mb-5">
            Portez aujourd'hui ce que vous transmettrez demain.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#FAF9F7]/90 leading-relaxed font-normal max-w-lg mb-8">
            Une sélection de pièces choisies à Abidjan pour durer.
          </p>

          {/* CTAs (Maximum 2 actions as strictly required) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              id="hero-primary-cta"
              onClick={() => navigate('/montres')}
              className="px-8 py-4 bg-[#AC854B] hover:bg-[#96723c] text-[#FAF9F7] text-xs font-bold uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-3 shadow-lg cursor-pointer group"
            >
              <span>DÉCOUVRIR LES MONTRES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/2250707181560?text=Bonjour%20HERITAGE%2C%20je%20souhaite%20un%20conseil%20au%20sujet%20de%20votre%20s%C3%A9lection%20de%20montres."
              target="_blank"
              rel="noopener noreferrer"
              id="hero-secondary-cta"
              className="px-8 py-4 bg-transparent hover:bg-[#FAF9F7]/10 text-[#FAF9F7] border border-[#FAF9F7]/30 text-xs font-bold uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-3 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#D6BB8F]" />
              <span>ÉCHANGER AVEC UN CONSEILLER</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Motion / Pause Control for Accessibility */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-full bg-[#002141]/60 hover:bg-[#002141] text-[#FAF9F7] border border-[#FAF9F7]/20 backdrop-blur-xs transition-colors"
          aria-label={isPlaying ? 'Mettre en pause les animations' : 'Reprendre les animations'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </section>
  );
};

import React from 'react';
import { ArrowRight, Hash, Sliders, CheckCircle, HelpCircle } from 'lucide-react';

interface MethodSectionProps {
  navigate: (route: string) => void;
}

export const MethodSection: React.FC<MethodSectionProps> = ({ navigate }) => {
  const steps = [
    {
      num: '01',
      icon: Hash,
      title: 'La référence',
      text: 'Chaque pièce dispose d\'une référence fabricant officielle et d\'un numéro d\'identification univoque permettant sa vérification immédiate.'
    },
    {
      num: '02',
      icon: Sliders,
      title: 'Les caractéristiques',
      text: 'Mouvement, réserve de marche, étanchéité, boîtier et glace saphir sont mesurés et détaillés avec une rigueur horlogère complète.'
    },
    {
      num: '03',
      icon: CheckCircle,
      title: 'La disponibilité',
      text: 'Le statut affiché en ligne reflète l\'état réel du stock physique à Abidjan, sans promesse fictive ni attente imprévue.'
    },
    {
      num: '04',
      icon: HelpCircle,
      title: 'Le conseil',
      text: 'Avant de valider votre sélection, un conseiller identifié est à votre disposition pour répondre à chaque interrogation technique ou esthétique.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#002141]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#AC854B] block mb-2">
            NOTRE MÉTHODE
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#002141] leading-tight mb-4">
            Ce qui mérite votre attention avant de choisir
          </h2>
          <p className="text-sm md:text-base text-[#3A3A3A] leading-relaxed">
            Acquérir une belle montre demande de la clarté. Voici les quatre repères immuables qui
            guident notre catalogue et protègent votre décision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-[#FAF9F7] border border-[#002141]/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#AC854B]">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#002141]/60" />
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-[#002141] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#3A3A3A] leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-left">
          <button
            type="button"
            onClick={() => navigate('/authenticite-provenance')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#002141] hover:text-[#AC854B] pb-1 border-b-2 border-[#AC854B] transition-colors cursor-pointer group"
          >
            <span>VOIR COMMENT CHOISIR</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

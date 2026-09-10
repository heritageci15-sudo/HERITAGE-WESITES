import React from 'react';
import { Compass, CheckCircle2, MessageSquare } from 'lucide-react';

export const TrustMarkers: React.FC = () => {
  const markers = [
    {
      icon: Compass,
      title: 'Sélection exigeante',
      description: 'Chaque pièce est choisie pour sa facture et sa capacité à durer.'
    },
    {
      icon: CheckCircle2,
      title: 'Informations lisibles',
      description: 'Référence, caractéristiques, prix et disponibilité apparaissent sur chaque fiche publiée.'
    },
    {
      icon: MessageSquare,
      title: 'Conseil identifié',
      description: 'Avant ou après votre choix, échangez directement avec HERITAGE.'
    }
  ];

  return (
    <section className="bg-white border-b border-[#002141]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {markers.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-2 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#AC854B]/30 flex items-center justify-center text-[#AC854B] flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-bold text-[#002141] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#3A3A3A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

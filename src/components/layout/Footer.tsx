import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#002141] text-[#FAF9F7] pt-16 pb-12 border-t border-[#D6BB8F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value badges strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-[#FAF9F7]/10">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#D6BB8F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6BB8F] mb-1">
                Authenticité Garantie
              </h4>
              <p className="text-xs text-[#FAF9F7]/80 leading-relaxed">
                Chaque pièce est rigoureusement vérifiée et accompagnée de ses papiers d'origine.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-[#D6BB8F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6BB8F] mb-1">
                Garantie Mécanisme 2 Ans
              </h4>
              <p className="text-xs text-[#FAF9F7]/80 leading-relaxed">
                Assistance directe et prise en charge horlogère assurée localement par HERITAGE.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-[#D6BB8F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6BB8F] mb-1">
                Remise en Mains Propres
              </h4>
              <p className="text-xs text-[#FAF9F7]/80 leading-relaxed">
                Livraison discrète et sécurisée à Abidjan ou retrait sur rendez-vous à Yopougon.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4-column footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand Info */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-block text-left cursor-pointer"
              aria-label="Accueil HERITAGE"
            >
              <img
                src="/assets/logo-white.svg"
                alt="HERITAGE Montres et Accessoires"
                className="w-48 h-auto object-contain -ml-2"
              />
            </button>
            <p className="text-xs text-[#FAF9F7]/80 leading-relaxed pt-2">
              HERITAGE réunit à Abidjan des montres, des parfums, des lunettes et des accessoires
              choisis pour leur capacité à durer et à se transmettre.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#FAF9F7]/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D6BB8F]" />
                <span>Yopougon, Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D6BB8F]" />
                <a href="tel:+2250707181560" className="hover:text-[#D6BB8F] transition-colors">
                  +225 07 07 18 15 60
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D6BB8F]" />
                <a
                  href="mailto:berengeratokoli@gmail.com"
                  className="hover:text-[#D6BB8F] transition-colors"
                >
                  berengeratokoli@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Nav Column 1: Collection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6BB8F] mb-4">
              Collection Montres
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FAF9F7]/80">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/montres')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Toutes les montres suisses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/montres/tissot-le-locle-20th-anniversary-t006-407-11-033-03')
                  }
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Tissot Le Locle 20th Anniversary
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/montres/tissot-pr516-40mm-t149-417-11-011-00')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Chronographes Tissot PR516
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/montres/tissot-seastar-1000-40mm-t120-410-33-051-00')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Plongeuses Tissot Seastar 1000
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/montres/tissot-chemin-des-tourelles-42mm-t139-407-22-038-00')
                  }
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Tissot Chemin Des Tourelles
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Conseil & Guide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6BB8F] mb-4">
              Conseil & Exigence
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FAF9F7]/80">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/blogs')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Articles &amp; Guides du Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/a-propos')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  La Maison HERITAGE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/authenticite-provenance')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Authenticité & Traçabilité
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/livraison-retours')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Livraison sécurisée & Retours
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/garantie-service')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Garantie 2 ans & Entretien
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Contact & Légal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6BB8F] mb-4">
              Informations & Suivi
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FAF9F7]/80">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Échanger avec un conseiller
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/compte')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Suivre ma commande
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/faq')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Foire aux questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/cgv')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/confidentialite')}
                  className="hover:text-[#FAF9F7] transition-colors cursor-pointer text-left"
                >
                  Données personnelles (ARTCI)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line with currency note and copyright */}
        <div className="pt-8 border-t border-[#FAF9F7]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF9F7]/60">
          <p>
            Tous nos prix sont affichés en Francs CFA (FCFA / XOF). Paiements sécurisés Wave, Orange
            Money, MTN MoMo, Moov Money et Carte.
          </p>
          <p>&copy; {new Date().getFullYear()} HERITAGE. Tous droits réservés. Abidjan, Côte d'Ivoire.</p>
        </div>
      </div>
    </footer>
  );
};

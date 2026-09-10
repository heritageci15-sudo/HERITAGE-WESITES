import React from 'react';

interface LegalViewProps {
  type: 'mentions-legales' | 'cgv' | 'confidentialite';
  navigate: (route: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, navigate }) => {
  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <span className="text-[#002141] font-semibold">
            {type === 'mentions-legales'
              ? 'Mentions Légales'
              : type === 'cgv'
              ? 'Conditions Générales de Vente'
              : 'Politique de Confidentialité'}
          </span>
        </nav>

        {/* Navigation tabs between legal documents */}
        <div className="flex border-b border-[#002141]/10 mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => navigate('/mentions-legales')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              type === 'mentions-legales'
                ? 'border-b-2 border-[#AC854B] text-[#002141]'
                : 'text-[#3A3A3A]/60 hover:text-[#002141]'
            }`}
          >
            Mentions Légales
          </button>
          <button
            type="button"
            onClick={() => navigate('/cgv')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              type === 'cgv'
                ? 'border-b-2 border-[#AC854B] text-[#002141]'
                : 'text-[#3A3A3A]/60 hover:text-[#002141]'
            }`}
          >
            Conditions Générales de Vente
          </button>
          <button
            type="button"
            onClick={() => navigate('/confidentialite')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              type === 'confidentialite'
                ? 'border-b-2 border-[#AC854B] text-[#002141]'
                : 'text-[#3A3A3A]/60 hover:text-[#002141]'
            }`}
          >
            Confidentialité & Données
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white border border-[#002141]/10 p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
          {type === 'mentions-legales' && (
            <>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#002141]">
                Mentions Légales
              </h1>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  1. Éditeur de la plateforme
                </h2>
                <p>
                  Le site <strong>HERITAGE</strong> est édité par la société <strong>HERITAGE SARL</strong>,
                  société à responsabilité limitée de droit ivoirien au capital de 10 000 000 FCFA,
                  immatriculée au Registre du Commerce et du Crédit Mobilier d'Abidjan sous le numéro{' '}
                  <strong>CI-ABJ-03-2024-B12-00452</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Siège social : Yopougon, Abidjan, République de Côte d'Ivoire</li>
                  <li>Numéro Compte Contribuable (CC) : 2412894 X</li>
                  <li>Direction de la publication : Direction Générale HERITAGE</li>
                  <li>Téléphone : +225 07 07 18 15 60</li>
                  <li>Courriel : contact@heritage-abidjan.ci</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  2. Hébergement & Sécurité technique
                </h2>
                <p>
                  La plateforme en ligne est hébergée sur une infrastructure Cloud haute disponibilité
                  bénéficiant de protocoles de chiffrement SSL/TLS et de contrôles d'accès stricts.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  3. Propriété intellectuelle
                </h2>
                <p>
                  L'ensemble des éléments constituant la charte graphique, les marques déposées, les
                  textes éditoriaux, les photographies et la typographie de la Maison HERITAGE sont
                  la propriété exclusive de HERITAGE SARL. Toute reproduction, intégrale ou partielle,
                  est formellement interdite sans autorisation préalable écrite.
                </p>
              </section>
            </>
          )}

          {type === 'cgv' && (
            <>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#002141]">
                Conditions Générales de Vente (CGV)
              </h1>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  1. Objet et champ d'application
                </h2>
                <p>
                  Les présentes Conditions Générales de Vente régissent les commandes conclues entre la
                  Maison HERITAGE et toute personne physique ou morale procédant à l'acquisition d'une
                  pièce horlogère sur la plateforme officielle.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  2. Prix et monnaie
                </h2>
                <p>
                  Tous les prix sont exprimés en Francs CFA (XOF), toutes taxes comprises (TTC). Les
                  tarifs affichés sont fermes au moment de la passation de la commande.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  3. Modalités de paiement
                </h2>
                <p>
                  Le règlement s'effectue via les moyens de paiement autorisés en Côte d'Ivoire :
                  Wave Mobile Money, Orange Money, MTN Mobile Money, Moov Money, ou Carte bancaire
                  (Visa, Mastercard). Toute commande n'est validée qu'après confirmation irrévocable
                  de l'encaissement par la passerelle de paiement.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  4. Livraison et remise en main propre
                </h2>
                <p>
                  Les pièces peuvent être remises en main propre sur rendez-vous à la Maison HERITAGE
                  (Yopougon, Abidjan) ou acheminées par coursier dédié sous pli scellé et sécurisé
                  dans l'ensemble des communes du District Autonome d'Abidjan (frais forfaitaires de
                  5 000 FCFA).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  5. Garantie légale et contractuelle
                </h2>
                <p>
                  Chaque montre bénéficie d'une garantie de manufacture de 2 ans couvrant les vices de
                  fabrication du mouvement horloger, relayée par notre service d'inspection à Abidjan.
                </p>
              </section>
            </>
          )}

          {type === 'confidentialite' && (
            <>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#002141]">
                Politique de Confidentialité & Protection des Données
              </h1>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  1. Conformité réglementaire (Loi N° 2013-450)
                </h2>
                <p>
                  La Maison HERITAGE s'engage à traiter vos données personnelles en stricte conformité
                  avec la loi ivoirienne N° 2013-450 du 19 juin 2013 relative à la protection des
                  données à caractère personnel, sous l'égide de l'ARTCI.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  2. Données collectées et finalités
                </h2>
                <p>
                  Les données recueillies (nom, courriel, coordonnées téléphoniques, commune et adresse
                  de livraison) sont exclusivement destinées au traitement, à la facturation et à
                  l'acheminement de votre commande horlogère. Aucune donnée n'est cédée ni commercialisée
                  à des tiers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-playfair text-base font-bold text-[#002141]">
                  3. Exercice de vos droits
                </h2>
                <p>
                  Vous pouvez à tout moment solliciter l'accès, la rectification ou l'effacement de vos
                  informations en adressant une demande écrite à{' '}
                  <a
                    href="mailto:contact@heritage-abidjan.ci"
                    className="underline text-[#002141] font-semibold"
                  >
                    contact@heritage-abidjan.ci
                  </a>{' '}
                  ou directement depuis votre Espace Client.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import { Product } from '../types';

export function formatXOF(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export const PRODUCTS: Product[] = [
  // 1. Tissot Le Locle 20th Anniversary
  {
    id: 'prod-tissot-le-locle-20th',
    sku: 'T006.407.11.033.03',
    reference: 'T006.407.11.033.03',
    brand: 'Tissot',
    name: 'Tissot Le Locle 20th Anniversary 39,3 mm',
    slug: 'tissot-le-locle-20th-anniversary-t006-407-11-033-03',
    category: 'montres',
    priceXOF: 550000,
    stockStatus: 'En stock',
    stockCount: 3,
    status: 'published',
    primaryImage: '/assets/products/tissot-le-locle.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-le-locle.jpg',
        alt: 'Tissot Le Locle 20th Anniversary 39,3 mm, référence T006.407.11.033.03, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      },
      {
        url: '/assets/products/le-locle-angle.jpg',
        alt: 'Tissot Le Locle 20th Anniversary 39,3 mm, référence T006.407.11.033.03, vue en trois-quarts montrant le boîtier et le bracelet.',
        type: 'trois-quarts'
      },
      {
        url: '/assets/products/le-locle-caseback.jpg',
        alt: 'Tissot Le Locle 20th Anniversary 39,3 mm, référence T006.407.11.033.03, détail du fond transparent.',
        type: 'fond'
      }
    ],
    shortDescription: 'Automatique. Acier inoxydable 316L. Glace saphir. Réserve de marche jusqu\'à 80 heures.',
    valueStoryTitle: 'La constance d\'une mécanique qui sait se faire remarquer avec retenue.',
    valueStoryText: 'Cette Tissot Le Locle associe un mouvement automatique Powermatic 80 à un boîtier et un bracelet en acier inoxydable 316L. Son cadran argenté et son fond transparent donnent à la mécanique une présence classique, précise et durable. Une pièce pensée pour accompagner les jours qui comptent, puis les suivants.',
    attributes: {
      modele: 'Tissot Le Locle 20th Anniversary 39,3 mm',
      reference: 'T006.407.11.033.03',
      diametre: '39,3 mm',
      boitier: 'Acier inoxydable 316L',
      verre: 'Glace saphir résistante aux rayures',
      fondDeBoite: 'Transparent',
      mouvement: 'Automatique',
      reserveDeMarche: 'Jusqu\'à 80 heures',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 3 bar (30 m)',
      cadran: 'Argenté guilloché',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Provenance directe suisse certifiée. Boîtier et papiers d\'origine vérifiés par HERITAGE à Abidjan.',
    warrantySummary: 'Garantie de 2 ans sur le mécanisme horloger avec prise en charge directe par HERITAGE.',
    deliverySummary: 'Remise en main propre sécurisée à Abidjan (Cocody, Plateau, Yopougon) ou expédition sous scellé.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T006.407.11.033.03 à HERITAGE pour échanger au sujet de cette pièce.'
      },
      {
        question: 'Où retrouver les conditions applicables à cette pièce ?',
        answer: 'Les informations de provenance, de garantie, de livraison et de retour sont accessibles depuis les blocs ci-dessus lorsqu\'elles sont publiées.'
      }
    ]
  },

  // 2. Tissot PR516 40 mm - T149.417.11.011.00
  {
    id: 'prod-tissot-pr516-011',
    sku: 'T149.417.11.011.00',
    reference: 'T149.417.11.011.00',
    brand: 'Tissot',
    name: 'Tissot PR516 Chronographe 40 mm',
    slug: 'tissot-pr516-40mm-t149-417-11-011-00',
    category: 'montres',
    priceXOF: 330000,
    stockStatus: 'En stock',
    stockCount: 4,
    status: 'published',
    primaryImage: '/assets/products/tissot-pr516-white.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-pr516-white.jpg',
        alt: 'Tissot PR516 40 mm, référence T149.417.11.011.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Quartz. Acier inoxydable 316L avec revêtement PVD. Glace saphir avec traitement antireflet.',
    valueStoryTitle: 'L\'esprit chronographe historique revisité avec une précision contemporaine.',
    valueStoryText: 'Inspirée des tableaux de bord et de l\'héritage automobile de 1968, la PR516 associe un cadran chronographe lisible à une boîte en acier 316L et une lunette tachymétrique soignée. Une pièce rythmée pour mesurer chaque étape avec calme.',
    attributes: {
      modele: 'Tissot PR516 40 mm',
      reference: 'T149.417.11.011.00',
      diametre: '40 mm',
      boitier: 'Acier inoxydable 316L avec revêtement PVD',
      verre: 'Glace saphir résistante aux rayures avec traitement antireflet',
      fondDeBoite: 'Gravé',
      mouvement: 'Quartz',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 10 bar (100 m)',
      cadran: 'Argenté blanc avec sous-compteurs noirs',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Pièce suisse originale certifiée, accompagnée de son coffret et certificat horloger.',
    warrantySummary: 'Garantie de 2 ans assurant la précision du calibre quartz et l\'étanchéité.',
    deliverySummary: 'Livraison sur rendez-vous à Abidjan ou retrait auprès de la maison à Yopougon.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T149.417.11.011.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 3. Tissot PR516 40 mm - T149.417.11.041.00
  {
    id: 'prod-tissot-pr516-041',
    sku: 'T149.417.11.041.00',
    reference: 'T149.417.11.041.00',
    brand: 'Tissot',
    name: 'Tissot PR516 Chronographe Cadran Bleu 40 mm',
    slug: 'tissot-pr516-cadran-bleu-40mm-t149-417-11-041-00',
    category: 'montres',
    priceXOF: 330000,
    stockStatus: 'En stock',
    stockCount: 2,
    status: 'published',
    primaryImage: '/assets/products/tissot-pr516-blue.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-pr516-blue.jpg',
        alt: 'Tissot PR516 40 mm, référence T149.417.11.041.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Quartz. Acier inoxydable 316L. Glace saphir avec traitement antireflet.',
    valueStoryTitle: 'La profondeur d\'un cadran bleu soleillé pour un style sportif épuré.',
    valueStoryText: 'Cette déclinaison au cadran bleu profond capte la lumière avec nuance. Son boîtier en acier 316L et son bracelet interchangeable garantissent une robustesse sans faille au quotidien.',
    attributes: {
      modele: 'Tissot PR516 40 mm',
      reference: 'T149.417.11.041.00',
      diametre: '40 mm',
      boitier: 'Acier inoxydable 316L',
      verre: 'Glace saphir avec traitement antireflet',
      fondDeBoite: 'Gravé',
      mouvement: 'Quartz',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 10 bar (100 m)',
      cadran: 'Bleu soleillé',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Pièce suisse originale certifiée, accompagnée de son coffret et certificat horloger.',
    warrantySummary: 'Garantie de 2 ans assurant la précision du calibre quartz et l\'étanchéité.',
    deliverySummary: 'Livraison sur rendez-vous à Abidjan ou retrait auprès de la maison à Yopougon.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T149.417.11.041.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 4. Tissot PR 100 40 mm - T150.410.16.011.00
  {
    id: 'prod-tissot-pr100-011',
    sku: 'T150.410.16.011.00',
    reference: 'T150.410.16.011.00',
    brand: 'Tissot',
    name: 'Tissot PR 100 40 mm',
    slug: 'tissot-pr-100-40mm-t150-410-16-011-00',
    category: 'montres',
    priceXOF: 198000,
    stockStatus: 'En stock',
    stockCount: 5,
    status: 'published',
    primaryImage: '/assets/products/tissot-pr100.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-pr100.jpg',
        alt: 'Tissot PR 100 40 mm, référence T150.410.16.011.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Quartz. Acier inoxydable 316L. Glace saphir. Bracelet interchangeable à ouverture facile.',
    valueStoryTitle: 'La simplicité pure d\'une montre quotidienne à la fiabilité éprouvée.',
    valueStoryText: 'La Tissot PR 100 est une référence d\'élégance sobre. Des lignes nettes, un cadran épuré et une glace saphir inrayable pour une présence naturelle et durable.',
    attributes: {
      modele: 'Tissot PR 100 40 mm',
      reference: 'T150.410.16.011.00',
      diametre: '40 mm',
      boitier: 'Acier inoxydable 316L',
      verre: 'Glace saphir résistante aux rayures',
      mouvement: 'Quartz',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 10 bar (100 m)',
      cadran: 'Argenté',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Origine certifiée manufacture Tissot, documents d\'importation réguliers.',
    warrantySummary: 'Garantie de 2 ans fabricant couverte par notre engagement local.',
    deliverySummary: 'Livraison sécurisée sous 24 à 48h à Abidjan.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T150.410.16.011.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 5. Tissot Seastar 1000 40 mm - T120.410.33.051.00
  {
    id: 'prod-tissot-seastar-1000-black',
    sku: 'T120.410.33.051.00',
    reference: 'T120.410.33.051.00',
    brand: 'Tissot',
    name: 'Tissot Seastar 1000 40 mm',
    slug: 'tissot-seastar-1000-40mm-t120-410-33-051-00',
    category: 'montres',
    priceXOF: 290000,
    stockStatus: 'En stock',
    stockCount: 3,
    status: 'published',
    primaryImage: '/assets/products/tissot-seastar-black.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-seastar-black.jpg',
        alt: 'Tissot Seastar 1000 40 mm, référence T120.410.33.051.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Quartz. Acier inoxydable 316L avec revêtement PVD. Étanchéité jusqu\'à 30 bar.',
    valueStoryTitle: 'L\'étanchéité professionnelle dans un format 40 mm aux finitions nobles.',
    valueStoryText: 'Conçue pour défier les éléments aquatiques jusqu\'à 300 mètres, la Seastar 1000 conserve une finesse et une élégance qui conviennent aussi bien aux tenues habillées qu\'aux aventures sportives.',
    attributes: {
      modele: 'Tissot Seastar 1000 40 mm',
      reference: 'T120.410.33.051.00',
      diametre: '40 mm',
      boitier: 'Acier inoxydable 316L avec revêtement PVD',
      verre: 'Glace saphir résistante aux rayures avec traitement antireflet',
      fondDeBoite: 'Vissé',
      mouvement: 'Quartz',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 30 bar (300 m / 1000 ft)',
      cadran: 'Noir avec index luminescents',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Montre de plongée suisse authentifiée et scellée.',
    warrantySummary: 'Garantie de 2 ans avec contrôle de pressurisation et étanchéité.',
    deliverySummary: 'Livraison sécurisée avec remise en main propre à Abidjan.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T120.410.33.051.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 6. Tissot Seastar 1000 40 mm - T1204103342100 (Cadran Rouge Dégradé)
  {
    id: 'prod-tissot-seastar-1000-red',
    sku: 'T1204103342100',
    reference: 'T1204103342100',
    brand: 'Tissot',
    name: 'Tissot Seastar 1000 Cadran Rouge Dégradé 40 mm',
    slug: 'tissot-seastar-1000-cadran-rouge-t1204103342100',
    category: 'montres',
    priceXOF: 285000,
    stockStatus: 'Stock limité',
    stockCount: 1,
    status: 'published',
    primaryImage: '/assets/products/tissot-seastar-red.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-seastar-red.jpg',
        alt: 'Tissot Seastar 1000 40 mm, référence T1204103342100, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Quartz. Cadran rouge dégradé. Acier inoxydable 316L avec revêtement PVD. Étanchéité jusqu\'à 30 bar.',
    valueStoryTitle: 'Un tempérament audacieux sublimé par un dégradé rouge et noir singulier.',
    valueStoryText: 'Ce modèle arbore un cadran soleillé dégradé remarquable qui attire le regard sans ostentation. Alliant robustesse 30 bar et esthétique racée, c\'est une pièce d\'une grande personnalité.',
    attributes: {
      modele: 'Tissot Seastar 1000 40 mm',
      reference: 'T1204103342100',
      diametre: '40 mm',
      boitier: 'Acier inoxydable 316L avec revêtement PVD',
      verre: 'Glace saphir résistante aux rayures avec traitement antireflet',
      fondDeBoite: 'Vissé',
      mouvement: 'Quartz',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 30 bar (300 m / 1000 ft)',
      cadran: 'Rouge dégradé',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Pièce suisse originale certifiée en coffret d\'origine scellé.',
    warrantySummary: 'Garantie de 2 ans assurant la précision et la résistance sous l\'eau.',
    deliverySummary: 'Livraison sur rendez-vous à Abidjan ou retrait à Yopougon.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T1204103342100 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 7. Tissot Chemin Des Tourelles 42 mm - T139.407.22.038.00
  {
    id: 'prod-tissot-chemin-des-tourelles-gold',
    sku: 'T139.407.22.038.00',
    reference: 'T139.407.22.038.00',
    brand: 'Tissot',
    name: 'Tissot Chemin Des Tourelles 42 mm',
    slug: 'tissot-chemin-des-tourelles-42mm-t139-407-22-038-00',
    category: 'montres',
    priceXOF: 460000,
    stockStatus: 'En stock',
    stockCount: 2,
    status: 'published',
    primaryImage: '/assets/products/tissot-chemin-gold.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-chemin-gold.jpg',
        alt: 'Tissot Chemin Des Tourelles 42 mm, référence T139.407.22.038.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Automatique. Acier inoxydable 316L avec revêtement PVD. Glace saphir. Réserve de marche jusqu\'à 80 heures.',
    valueStoryTitle: 'La signature historique du berceau horloger de Tissot.',
    valueStoryText: 'Portant le nom de la rue où Tissot a établi ses ateliers en 1907, cette montre incarne le savoir-faire helvétique le plus noble. Finitions bicolores, calibre automatique Powermatic 80 et fond transparent révélant le mouvement.',
    attributes: {
      modele: 'Tissot Chemin Des Tourelles 42 mm',
      reference: 'T139.407.22.038.00',
      diametre: '42 mm',
      boitier: 'Acier inoxydable 316L avec revêtement PVD',
      verre: 'Glace saphir résistante aux rayures avec traitement antireflet',
      fondDeBoite: 'Transparent',
      mouvement: 'Automatique',
      reserveDeMarche: 'Jusqu\'à 80 heures',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 5 bar (50 m)',
      cadran: 'Argenté soleillé bicolore',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Origine suisse contrôlée, documents d\'importation officiels.',
    warrantySummary: 'Garantie de 2 ans internationale couverte par le service HERITAGE.',
    deliverySummary: 'Livraison exclusive sous pli sécurisé à Abidjan.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T139.407.22.038.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  },

  // 8. Tissot Chemin Des Tourelles 42 mm - T139.407.11.048.00 (Cadran Bleu Foncé)
  {
    id: 'prod-tissot-chemin-des-tourelles-blue',
    sku: 'T139.407.11.048.00',
    reference: 'T139.407.11.048.00',
    brand: 'Tissot',
    name: 'Tissot Chemin Des Tourelles Cadran Bleu Foncé 42 mm',
    slug: 'tissot-chemin-des-tourelles-bleu-t139-407-11-048-00',
    category: 'montres',
    priceXOF: 460000,
    stockStatus: 'En stock',
    stockCount: 3,
    status: 'published',
    primaryImage: '/assets/products/tissot-chemin-blue.jpg',
    additionalImages: [
      {
        url: '/assets/products/tissot-chemin-blue.jpg',
        alt: 'Tissot Chemin Des Tourelles 42 mm, référence T139.407.11.048.00, vue de face sur fond ivoire.',
        isPrimary: true,
        type: 'face'
      }
    ],
    shortDescription: 'Automatique. Cadran bleu foncé. Acier inoxydable 316L. Glace saphir. Réserve de marche jusqu\'à 80 heures.',
    valueStoryTitle: 'L\'élégance souveraine du bleu nuit combinée au Powermatic 80.',
    valueStoryText: 'Une allure intemporelle portée par un cadran bleu nuit profond et un boîtier en acier inoxydable 316L satiné et poli. La mécanique Powermatic 80 assure plus de 3 jours d\'autonomie sans compromis de précision.',
    attributes: {
      modele: 'Tissot Chemin Des Tourelles 42 mm',
      reference: 'T139.407.11.048.00',
      diametre: '42 mm',
      boitier: 'Acier inoxydable 316L',
      verre: 'Glace saphir résistante aux rayures avec traitement antireflet',
      fondDeBoite: 'Transparent',
      mouvement: 'Automatique',
      reserveDeMarche: 'Jusqu\'à 80 heures',
      bracelet: 'Interchangeable à ouverture facile',
      etancheite: 'Jusqu\'à 5 bar (50 m)',
      cadran: 'Bleu foncé soleillé',
      fabrication: 'Suisse (Swiss Made)'
    },
    provenanceSummary: 'Origine suisse contrôlée, documents d\'importation officiels.',
    warrantySummary: 'Garantie de 2 ans internationale couverte par le service HERITAGE.',
    deliverySummary: 'Livraison exclusive sous pli sécurisé à Abidjan.',
    faq: [
      {
        question: 'Cette pièce est-elle disponible ?',
        answer: 'Le statut affiché est mis à jour depuis le catalogue. Il est contrôlé à nouveau avant la validation de votre commande.'
      },
      {
        question: 'Puis-je demander un conseil avant d\'ajouter cette montre au panier ?',
        answer: 'Oui. Indiquez la référence T139.407.11.048.00 à HERITAGE pour échanger au sujet de cette pièce.'
      }
    ]
  }
];

// DRAFTS: Kept in database model but strictly filtered out of public views as mandated by PRD Section 6
export const DRAFT_PRODUCTS: Partial<Product>[] = [
  {
    id: 'draft-tissot-carson-standard',
    reference: 'T122.407.36.031.00',
    brand: 'Tissot',
    name: 'Tissot Carson Premium Powermatic 80 — Standard',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-tissot-carson-noir',
    reference: 'T122.407.36.031.00',
    brand: 'Tissot',
    name: 'Tissot Carson Premium Powermatic 80 — Cadran Noir',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-tissot-seastar-vert',
    reference: 'T1204103309100',
    brand: 'Tissot',
    name: 'Tissot Seastar 1000 Vert-Noir',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-tissot-seastar-2000',
    reference: 'INCONNUE',
    brand: 'Tissot',
    name: 'Tissot Seastar 2000 Professionnelle',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-timex-expedition-noir',
    reference: 'TW4B25500',
    brand: 'Timex',
    name: 'Timex Expedition Gallatin Noir',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-timex-expedition-vert',
    reference: 'TW4B25400',
    brand: 'Timex',
    name: 'Timex Expedition Gallatin Vert',
    status: 'draft',
    category: 'montres'
  },
  {
    id: 'draft-timex-navi-xl',
    reference: 'TW2U90000',
    brand: 'Timex',
    name: 'Timex Navi XL',
    status: 'draft',
    category: 'montres'
  }
];

export function getPublishedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.status === 'published');
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug && p.status === 'published');
}

export function getFeaturedWatches(): Product[] {
  // Returns the 3 signature pieces mentioned in the copy:
  // 1. Tissot Le Locle 20th Anniversary (550 000 FCFA)
  // 2. Tissot Seastar 1000 (290 000 FCFA)
  // 3. Tissot Chemin Des Tourelles (460 000 FCFA)
  const leLocle = PRODUCTS.find((p) => p.sku === 'T006.407.11.033.03');
  const seastar = PRODUCTS.find((p) => p.sku === 'T120.410.33.051.00');
  const chemin = PRODUCTS.find((p) => p.sku === 'T139.407.22.038.00');
  return [leLocle!, seastar!, chemin!].filter(Boolean);
}

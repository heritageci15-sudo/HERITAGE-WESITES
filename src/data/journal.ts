export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  readingTime: string;
  summary: string;
  coverImage: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
  relatedPieceSku?: string;
}

export const JOURNAL_ARTICLES: Article[] = [
  {
    slug: 'choisir-montre-automatique-ou-quartz',
    title: 'Automatique ou Quartz',
    subtitle: 'Comprendre la différence pour choisir une montre qui correspond à votre usage.',
    publishedAt: 'Septembre 2026',
    readingTime: '4 min de lecture',
    summary: 'La distinction entre montre mécanique automatique et calibre à quartz ne se résume pas à une question de prix. Elle touche au rapport que vous entretenez avec l\'objet, à son autonomie et à sa vocation de transmission.',
    coverImage: '/assets/products/le-locle-caseback.jpg',
    relatedPieceSku: 'T006.407.11.033.03',
    content: [
      {
        heading: 'Le mouvement automatique : l\'énergie du geste',
        paragraphs: [
          'Une montre automatique tire son énergie des mouvements naturels de votre poignet. Une masse oscillante (le rotor), visible au travers du fond transparent de pièces comme la Tissot Le Locle, remonte en continu le ressort de barillet.',
          'Avec des calibres modernes comme le Powermatic 80, la réserve de marche atteint 80 heures. Vous pouvez déposer la montre le vendredi soir et la retrouver le lundi matin parfaitement à l\'heure sans intervention.',
          'Choisir une automatique, c\'est choisir un objet vivant. Elle ne nécessite aucune pile : entretenue tous les cinq ans, elle fonctionne encore plusieurs décennies plus tard et se transmet naturellement.'
        ]
      },
      {
        heading: 'Le mouvement à quartz : la rigueur et l\'immédiateté',
        paragraphs: [
          'Une montre à quartz utilise la vibration d\'un cristal sous l\'impulsion d\'une pile électrique pour cadencer le temps avec une précision de quelques secondes par an.',
          'C\'est le choix privilégié pour une montre de sport ou un chronographe d\'intervention, comme la Tissot PR516 ou la plongeuse Seastar 1000. Vous la posez, vous la reprenez après plusieurs semaines, et l\'aiguille des secondes bat la mesure avec une ponctualité infaillible.',
          'La pile se remplace simplement tous les deux à trois ans lors d\'une révision où l\'on renouvelle également les joints d\'étanchéité.'
        ]
      },
      {
        heading: 'Quel choix pour votre première pièce HERITAGE ?',
        paragraphs: [
          'Si votre intention est d\'acquérir une pièce patrimoniale, destinée à marquer un accomplissement personnel ou à être léguée à un proche, le mouvement automatique offre une poésie et une noblesse technique incomparables.',
          'Si vous cherchez un instrument de mesure quotidien, robuste et prêt en toutes circonstances à Abidjan, un calibre quartz suisse de haute facture répondra à votre exigence sans nécessiter de remontage.'
        ]
      }
    ]
  }
];

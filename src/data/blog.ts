export interface BlogArticle {
  slug: string;
  category: string;
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

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'choisir-montre-automatique-ou-quartz',
    category: 'Horlogerie',
    title: 'Automatique ou Quartz : Bien choisir son garde-temps',
    subtitle: 'Comprendre la différence mécanique pour investir dans une pièce adaptée à votre quotidien.',
    publishedAt: 'Septembre 2026',
    readingTime: '4 min de lecture',
    summary: 'La distinction entre montre mécanique automatique et calibre à quartz ne se résume pas à une question de prix. Elle touche au rapport que vous entretenez avec l\'objet, à son autonomie et à sa vocation de transmission patrimoniale.',
    coverImage: '/assets/products/le-locle-caseback.jpg',
    relatedPieceSku: 'T006.407.11.033.03',
    content: [
      {
        heading: 'Le mouvement automatique : l\'énergie vivante du geste',
        paragraphs: [
          'Une montre automatique tire son énergie des mouvements naturels de votre poignet. Une masse oscillante (le rotor), visible au travers du fond transparent de pièces d\'exception comme la Tissot Le Locle, remonte en continu le ressort de barillet.',
          'Avec des calibres modernes comme le Powermatic 80, la réserve de marche atteint 80 heures. Vous pouvez déposer la montre le vendredi soir et la retrouver le lundi matin parfaitement à l\'heure sans intervention.',
          'Choisir une automatique, c\'est choisir un objet vivant et intemporel. Elle ne nécessite aucune pile : entretenue tous les cinq ans, elle traverse les décennies et se transmet naturellement de génération en génération.'
        ]
      },
      {
        heading: 'Le calibre à quartz : la précision absolue et l\'immédiateté',
        paragraphs: [
          'Une montre à quartz utilise la vibration régulière d\'un cristal de quartz sous l\'impulsion d\'une pile électrique pour cadencer le temps avec une précision rigoureuse de quelques secondes par an.',
          'C\'est le choix privilégié pour une montre sportive, un chronographe d\'intervention ou une pièce active. Vous la posez, vous la reprenez après plusieurs semaines, et la trotteuse bat la mesure avec une ponctualité infaillible.',
          'La pile se remplace simplement tous les deux à trois ans lors d\'un contrôle d\'étanchéité réalisé par nos soins à Abidjan.'
        ]
      },
      {
        heading: 'Quel choix pour votre prochaine acquisition ?',
        paragraphs: [
          'Si votre souhait est d\'acquérir une création noble marquant un accomplissement personnel ou destinée à être léguée, le mouvement automatique offre une poésie et une dimension artisanale uniques.',
          'Si vous cherchez un instrument quotidien, robuste et immédiatement opérationnel en toutes circonstances à Abidjan, un calibre quartz suisse de manufacture répondra à votre exigence.'
        ]
      }
    ]
  },
  {
    slug: 'art-du-parfum-sublimer-son-sillage-a-abidjan',
    category: 'Haute Parfumerie',
    title: 'L\'Art du Sillage : Bien porter son parfum sous le climat d\'Abidjan',
    subtitle: 'Concentration, tenue et notes olfactives adaptées à la douceur tropicale et aux soirées prestigieuses.',
    publishedAt: 'Août 2026',
    readingTime: '5 min de lecture',
    summary: 'Sous le climat chaud et humide d\'Abidjan, les fragrances réagissent avec intensité. Découvrez les secrets pour choisir entre Eau de Parfum et Extrait, et faire rayonner votre signature olfactive avec subtilité.',
    coverImage: '/assets/products/seastar-wrist.jpg',
    content: [
      {
        heading: 'Comprendre l\'évaporation des essences sous la chaleur',
        paragraphs: [
          'La température corporelle et l\'hygrométrie accélèrent la diffusion des molécules odorantes de tête (agrumes, bergamote, notes ozoniques). Celles-ci s\'expriment avec éclat mais s\'estompent plus rapidement.',
          'Pour conserver une aura sophistiquée tout au long de la journée, privilégiez des compositions dotées d\'un cœur floral noble (jasmin, néroli, iris) et d\'un fond boisé ou ambré (oud, santal, fève tonka, musc blanc) qui se fixent idéalement sur l\'épiderme.'
        ]
      },
      {
        heading: 'Eau de Parfum vs Extrait : la juste concentration',
        paragraphs: [
          'L\'Eau de Parfum offre un équilibre parfait entre fraîcheur d\'ouverture et rémanence au bureau ou lors de vos rendez-vous d\'affaires au Plateau ou à Cocody.',
          'Pour les grandes réceptions ou les dîners mondains, les Extraits de Parfum et les élixirs rares délivrent une concentration supérieure à 25%, libérant une signature envoûtante sans jamais être entêtante.'
        ]
      },
      {
        heading: 'Les zones de diffusion stratégiques',
        paragraphs: [
          'Vaporisez sur les points de pulsation : l\'intérieur des poignets, les creux des clavicules et derrière les oreilles. Pour une élégance absolue sans altérer vos étoffes précieuses, un nuage léger au revers de votre veste assure un sillage mémorable.'
        ]
      }
    ]
  },
  {
    slug: 'guide-lunettes-de-soleil-createur-protection-et-style',
    category: 'Lunetterie de Luxe',
    title: 'Lunettes Solaires de Créateur : Allier Haute Protection UV et Allure',
    subtitle: 'Choisir la monture qui structure votre visage tout en protégeant votre regard de la luminosité équatoriale.',
    publishedAt: 'Juillet 2026',
    readingTime: '4 min de lecture',
    summary: 'Au-delà d\'un accessoire de style incontournable, une monture de luxe solaire à Abidjan est un bouclier indispensable contre le rayonnement solaire intense. Repères de style et d\'ergonomie.',
    coverImage: '/assets/products/pr516-chronograph.jpg',
    content: [
      {
        heading: 'Indice de protection et verres polarisés',
        paragraphs: [
          'À proximité de la lagune Ébrié et du littoral de Grand-Bassam ou Assinie, la réverbération de la lumière est particulièrement forte. Des verres solaires de catégorie 3 dotés d\'un filtre polarisant éliminent les reflets parasites et améliorent les contrastes sans assombrir la vue.',
          'Toutes nos montures solaires répondent aux normes strictes de filtration 100% UVA et UVB pour préserver votre santé visuelle.'
        ]
      },
      {
        heading: 'Morphologie et architecture des montures',
        paragraphs: [
          'Les visages ovales profitent d\'une liberté totale de formes, des modèles pilotes aviateur aux silhouettes géométriques contemporaines.',
          'Pour un visage rond ou carré, les formes pantos, hexagonales ou rectangulaires adoucissent les traits et structurent le port de tête avec une élégance naturelle.',
          'L\'acétate de cellulose de haute densité et le titane poli garantissent une légèreté exceptionnelle au porter, même pendant les heures les plus chaudes.'
        ]
      },
      {
        heading: 'L\'accord parfait entre lunettes, montre et accessoires',
        paragraphs: [
          'Harmonisez les métaux : une monture aux accents dorés ou or rose dialoguera idéalement avec le boîtier bicolore de votre garde-temps. Pour un look contemporain et épuré, l\'acétate noir profond s\'associe avec un bracelet en acier 316L.'
        ]
      }
    ]
  }
];

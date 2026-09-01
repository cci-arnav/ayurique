// Product catalogue — edit or replace entries here. Images use an array so
// you can later drop in main, lifestyle, secondary and hover shots without
// touching component markup.

export type Category = 'Air Freshener' | 'Soap' | 'Attar' | 'Combo Offer';

export type Product = {
  id: string;
  name: string;
  category: Category;
  price?: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  lifestyleImage?: string;
  badge?: string;
  available: boolean;
  tags: string[];
  note?: string;
  use?: string;
};

// Hero carousel images
const HERO_IMAGES = {
  airFreshener1: '/assets/Products-img/Air%20Freshners/Aqua%20Bliss%20Air%20Freshener.jpg',
  airFreshener2: '/assets/Products-img/Air%20Freshners/Golden%20Dust%20Air%20Freshener.jpg',
  airFreshener3: '/assets/Products-img/Air%20Freshners/Rose%20Elegance%20Air%20Freshener.jpg',
};

const AIR_FRESHENERS = {
  aquaBliss: '/assets/Products-img/Air%20Freshners/Aqua%20Bliss%20Air%20Freshener.jpg',
  aquaBlissHover: '/assets/Products-img/Air%20Freshners/Aqua%20Bliss%20AIr%20Freshener-hover.jpg',
  blackOpium: '/assets/Products-img/Air%20Freshners/Black%20Opium%20Air%20Freshener.jpg',
  blackOpiumHover: '/assets/Products-img/Air%20Freshners/Black%20Opium%20Air%20Freshener-hover.jpg',
  goldenDust: '/assets/Products-img/Air%20Freshners/Golden%20Dust%20Air%20Freshener.jpg',
  goldenDustHover: '/assets/Products-img/Air%20Freshners/Golden%20Dust%20Air%20Freshener-hover.jpg',
  lemongrass: '/assets/Products-img/Air%20Freshners/Lemon%20grass%20air%20freshner.jpg',
  lemongrassHover: '/assets/Products-img/Air%20Freshners/Lemon%20grass%20air%20freshner-hover.jpg',
  roseElegance: '/assets/Products-img/Air%20Freshners/Rose%20Elegance%20Air%20Freshener.jpg',
  roseEleganceHover: '/assets/Products-img/Air%20Freshners/Rose%20Elegance%20Air%20Freshener-hover.jpg',
  allTogether: '/assets/Products-img/AllTogether/Air%20Freshners.jpg',
};

const SOAPS = {
  aloeVera: '/assets/Products-img/Soaps/Ayurique-AloeVeraSoap.jpg',
  aloeVeraHover: '/assets/Products-img/Soaps/Ayurique-AloeVeraSoap-hover.jpg',
  blackOpium: '/assets/Products-img/Soaps/Ayurique-BlackOpiumSoap.jpg',
  blackOpiumHover: '/assets/Products-img/Soaps/Ayurique-BlackOpiumSoap-hover.jpg',
  lalchandan: '/assets/Products-img/Soaps/Ayurique-LalchandanSoap.jpg',
  lalchandanHover: '/assets/Products-img/Soaps/Ayurique-LalchandanSoap-hover.jpg',
  lemongrass: '/assets/Products-img/Soaps/Ayurique-LemongrassSoap.jpg',
  lemongrassHover: '/assets/Products-img/Soaps/Ayurique-LemongrassSoap-hover.jpg',
  neem: '/assets/Products-img/Soaps/Ayurique-NeemSoap.jpg',
  neemHover: '/assets/Products-img/Soaps/Ayurique-NeemSoap-hover.jpg',
  rose: '/assets/Products-img/Soaps/Ayurique-roseSoap.jpg',
  roseHover: '/assets/Products-img/Soaps/Ayurique-roseSoap-hover.jpg',
};

const ATTARS = {
  blackOpium: '/assets/Products-img/Attar/Black%20Opium%20Attar.jpg',
  blackOpiumHover: '/assets/Products-img/Attar/Black%20Opium%20Attar-hover.jpg',
  whiteOud: '/assets/Products-img/Attar/White%20Oud%20Attar.jpg',
  whiteOudHover: '/assets/Products-img/Attar/White%20Oud%20Attar-hover.jpg',
};

const COMBOS = {
  blackOpiumCombo: '/assets/Products-img/Combo%20Offer/Black%20Opium%20Signature%20Combo.jpg',
  roseEleganceCombo: '/assets/Products-img/Combo%20Offer/Rose%20Elegance%20Signature%20Combo.jpg',
};

export const productImages = {
  hero: HERO_IMAGES.airFreshener1,
  // For ritual section (Begin Your Ritual)
  ritual: AIR_FRESHENERS.allTogether,
  // For follow ritual images
  ritualStepImages: [
    AIR_FRESHENERS.aquaBliss,
    SOAPS.rose,
    ATTARS.whiteOud,
  ],
  // Instagram gallery
  instagram: [
    AIR_FRESHENERS.aquaBliss,
    SOAPS.aloeVera,
    ATTARS.blackOpium,
    COMBOS.blackOpiumCombo,
    AIR_FRESHENERS.lemongrass,
    SOAPS.rose,
  ],
};

export const products: Product[] = [
  // AIR FRESHENERS - 5 products
  {
    id: 'aqua-bliss',
    name: 'Aqua Bliss Air Freshener',
    category: 'Air Freshener',
    description: 'A refreshing aquatic air freshener.',
    images: [AIR_FRESHENERS.aquaBliss, AIR_FRESHENERS.aquaBlissHover],
    available: true,
    tags: ['air freshener', 'aqua', 'fresh', 'home'],
  },
  {
    id: 'black-opium-freshener',
    name: 'Black Opium Air Freshener',
    category: 'Air Freshener',
    description: 'A warm and mysterious air freshener.',
    images: [AIR_FRESHENERS.blackOpium, AIR_FRESHENERS.blackOpiumHover],
    available: true,
    tags: ['air freshener', 'dark', 'warm', 'exotic'],
  },
  {
    id: 'golden-dust',
    name: 'Golden Dust Air Freshener',
    category: 'Air Freshener',
    description: 'A shimmering golden-toned air freshener.',
    images: [AIR_FRESHENERS.goldenDust, AIR_FRESHENERS.goldenDustHover],
    available: true,
    tags: ['air freshener', 'gold', 'warm', 'premium'],
  },
  {
    id: 'lemongrass-freshener',
    name: 'Lemongrass Air Freshener',
    category: 'Air Freshener',
    description: 'A zesty and invigorating air freshener.',
    images: [AIR_FRESHENERS.lemongrass, AIR_FRESHENERS.lemongrassHover],
    available: true,
    tags: ['air freshener', 'lemongrass', 'citrus', 'energizing'],
  },
  {
    id: 'rose-elegance-freshener',
    name: 'Rose Elegance Air Freshener',
    category: 'Air Freshener',
    description: 'An elegant rose-infused air freshener.',
    images: [AIR_FRESHENERS.roseElegance, AIR_FRESHENERS.roseEleganceHover],
    available: true,
    tags: ['air freshener', 'rose', 'floral', 'elegant'],
  },

  // SOAPS - 6 products
  {
    id: 'aloe-vera-soap',
    name: 'Aloe Vera Soap',
    category: 'Soap',
    description: 'A gentle soap with aloe vera.',
    images: [SOAPS.aloeVera, SOAPS.aloeVeraHover],
    available: true,
    tags: ['soap', 'aloe vera', 'gentle', 'skincare'],
  },
  {
    id: 'black-opium-soap',
    name: 'Black Opium Soap',
    category: 'Soap',
    description: 'A luxurious dark-scented soap.',
    images: [SOAPS.blackOpium, SOAPS.blackOpiumHover],
    available: true,
    tags: ['soap', 'dark', 'luxury', 'fragrant'],
  },
  {
    id: 'lalchandan-soap',
    name: 'Lalchandan Soap',
    category: 'Soap',
    description: 'A traditional Lalchandan-infused soap.',
    images: [SOAPS.lalchandan, SOAPS.lalchandanHover],
    available: true,
    tags: ['soap', 'traditional', 'ayurvedic', 'natural'],
  },
  {
    id: 'lemongrass-soap',
    name: 'Lemongrass Soap',
    category: 'Soap',
    description: 'A zesty lemongrass soap.',
    images: [SOAPS.lemongrass, SOAPS.lemongrassHover],
    available: true,
    tags: ['soap', 'lemongrass', 'citrus', 'energizing'],
  },
  {
    id: 'neem-soap',
    name: 'Neem Soap',
    category: 'Soap',
    description: 'A purifying neem-based soap.',
    images: [SOAPS.neem, SOAPS.neemHover],
    available: true,
    tags: ['soap', 'neem', 'purifying', 'ayurvedic'],
  },
  {
    id: 'rose-soap',
    name: 'Rose Soap',
    category: 'Soap',
    description: 'A delicate rose-infused soap.',
    images: [SOAPS.rose, SOAPS.roseHover],
    available: true,
    tags: ['soap', 'rose', 'floral', 'luxurious'],
  },

  // ATTARS - 2 products
  {
    id: 'black-opium-attar',
    name: 'Black Opium Attar',
    category: 'Attar',
    description: 'A rich and mysterious attar.',
    images: [ATTARS.blackOpium, ATTARS.blackOpiumHover],
    available: true,
    tags: ['attar', 'perfume', 'dark', 'exotic'],
  },
  {
    id: 'white-oud-attar',
    name: 'White Oud Attar',
    category: 'Attar',
    description: 'A precious white oud fragrance.',
    images: [ATTARS.whiteOud, ATTARS.whiteOudHover],
    available: true,
    tags: ['attar', 'perfume', 'oud', 'premium'],
  },

  // COMBO OFFERS - 2 products
  {
    id: 'black-opium-combo',
    name: 'Black Opium Signature Combo',
    category: 'Combo Offer',
    description: 'A complete Black Opium collection.',
    images: [COMBOS.blackOpiumCombo],
    available: true,
    tags: ['combo', 'offer', 'black opium', 'collection'],
  },
  {
    id: 'rose-elegance-combo',
    name: 'Rose Elegance Signature Combo',
    category: 'Combo Offer',
    description: 'A complete Rose Elegance collection.',
    images: [COMBOS.roseEleganceCombo],
    available: true,
    tags: ['combo', 'offer', 'rose', 'collection'],
  },
];

export const formatPrice = (value: number | undefined) => {
  if (!value) return 'Contact for pricing';
  return `₹${value.toLocaleString('en-IN')}`;
};

export const discountPercent = (product: Product) =>
  product.compareAtPrice && product.price && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

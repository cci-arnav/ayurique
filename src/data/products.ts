// Product catalogue — edit or replace entries here. Images use an array so
// you can later drop in main, lifestyle, secondary and hover shots without
// touching component markup.

export type Category = 'Perfume' | 'Room Freshener' | 'Soap';

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  lifestyleImage?: string;
  badge?: string;
  available: boolean;
  tags: string[];
  note: string;
  use: string;
};

const PEXELS = {
  hero: 'https://images.pexels.com/photos/4736027/pexels-photo-4736027.jpeg?auto=compress&cs=tinysrgb&w=1200',
  perfume: 'https://images.pexels.com/photos/7820544/pexels-photo-7820544.jpeg?auto=compress&cs=tinysrgb&w=900',
  perfumeAlt: 'https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=900',
  room: 'https://images.pexels.com/photos/28912723/pexels-photo-28912723.jpeg?auto=compress&cs=tinysrgb&w=900',
  roomAlt: 'https://images.pexels.com/photos/37936133/pexels-photo-37936133.jpeg?auto=compress&cs=tinysrgb&w=900',
  soap: 'https://images.pexels.com/photos/16263605/pexels-photo-16263605.jpeg?auto=compress&cs=tinysrgb&w=900',
  soapAlt: 'https://images.pexels.com/photos/17596996/pexels-photo-17596996.jpeg?auto=compress&cs=tinysrgb&w=900',
  ritual: 'https://images.pexels.com/photos/29723780/pexels-photo-29723780.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export const productImages = {
  ...PEXELS,
  instagram: [
    'https://images.pexels.com/photos/6800784/pexels-photo-6800784.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/19522722/pexels-photo-19522722.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/37936133/pexels-photo-37936133.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/17596996/pexels-photo-17596996.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/36507130/pexels-photo-36507130.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=700',
  ],
};

export const products: Product[] = [
  {
    id: 'sandalwood-oud',
    name: 'Sandalwood & Oud',
    category: 'Perfume',
    price: 1299,
    compareAtPrice: 1499,
    description: 'A warm, quietly magnetic personal fragrance.',
    images: [PEXELS.perfume, PEXELS.perfumeAlt],
    lifestyleImage: PEXELS.hero,
    badge: 'Bestseller',
    available: true,
    tags: ['perfume', 'fragrance', 'oud', 'sandalwood', 'warm', 'evening', 'unisex'],
    note: 'Velvety woods, soft spice and a lingering golden trail.',
    use: 'Mist onto pulse points from a comfortable distance. Let the fragrance settle naturally.',
  },
  {
    id: 'moonlit-jasmine',
    name: 'Moonlit Jasmine',
    category: 'Perfume',
    price: 1199,
    description: 'An intimate floral veil for slower evenings.',
    images: [PEXELS.hero, PEXELS.perfume],
    lifestyleImage: PEXELS.perfumeAlt,
    available: true,
    tags: ['perfume', 'fragrance', 'jasmine', 'floral', 'night', 'soft'],
    note: 'Night-blooming jasmine with creamy petals and soft amber.',
    use: 'Wear alone or layer lightly over your favourite body ritual.',
  },
  {
    id: 'sacred-basil',
    name: 'Sacred Basil',
    category: 'Room Freshener',
    price: 699,
    compareAtPrice: 799,
    description: 'A fresh botanical reset for the spaces you live in.',
    images: [PEXELS.room, PEXELS.roomAlt],
    lifestyleImage: PEXELS.ritual,
    badge: 'New ritual',
    available: true,
    tags: ['room freshener', 'fresh', 'basil', 'home', 'air', 'green', 'spray'],
    note: 'Green basil leaves, rain-washed herbs and a clean, airy finish.',
    use: 'Spritz into the air, away from fabrics and polished surfaces. Refresh whenever the room needs a lift.',
  },
  {
    id: 'rose-clay',
    name: 'Rose Clay Bar',
    category: 'Soap',
    price: 349,
    description: 'A gentle, considered cleanse for daily bathing.',
    images: [PEXELS.soap, PEXELS.soapAlt],
    lifestyleImage: PEXELS.room,
    available: true,
    tags: ['soap', 'bar', 'clay', 'rose', 'bath', 'cleanse', 'skin'],
    note: 'A soft botanical floral with an earthy clay warmth.',
    use: 'Work between wet hands and massage over the body. Rinse well and keep the bar dry between uses.',
  },
];

export const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const discountPercent = (product: Product) =>
  product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

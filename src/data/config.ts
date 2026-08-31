// Central site configuration — edit these values to update the whole site.

export const SITE_CONFIG = {
  brand: 'AYURIQUE',
  tagline: 'Ancient Knowledge, Modern Science',
  instagramUrl: 'https://www.instagram.com/the.ayurique/',
  whatsappUrl: 'https://wa.me/910000000000',
  // Replace this with your live Google Form URL. Leave entry IDs empty to use
  // generic prefilled query params; set them to map individual fields to form questions.
  orderFormUrl: 'PASTE_GOOGLE_FORM_URL_HERE',
  orderFormEntryIds: {
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    items: '',
    subtotal: '',
    coupon: '',
    discount: '',
    total: '',
  },
  contact: {
    email: 'hello@ayurique.in',
    phone: '+91 00000 00000',
  },
  freeShippingThreshold: 999,
} as const;

// Promotional campaigns — flip `active` to show/hide site-wide.
export type Promotion = {
  active: boolean;
  title: string;
  discountText: string;
  couponCode: string;
};

export const promotion: Promotion = {
  active: true,
  title: 'Festive Ritual Sale',
  discountText: 'Up to 20% off — use code FESTIVE20',
  couponCode: 'FESTIVE20',
};

// Rotating announcement bar messages.
export const announcements: string[] = [
  'Premium Fragrances & Ayurvedic Essentials — Elevate Every Ritual',
  'Discover Ayurique — Ancient Knowledge, Modern Science',
  'Shop Our Signature Fragrances & Wellness Essentials',
  'Looking for Bulk Orders? Connect With Us for Special Pricing!',
  'Free Shipping on Orders Above ₹999',
];

// Coupon configuration — add or edit codes here.
export type Coupon = {
  value: number; // percentage off
  minimumOrder: number; // minimum subtotal in ₹
};

export const coupons: Record<string, Coupon> = {
  AYU10: { value: 10, minimumOrder: 499 },
  WELCOME15: { value: 15, minimumOrder: 799 },
  FESTIVE20: { value: 20, minimumOrder: 999 },
};

// Central site configuration — edit these values to update the whole site.

export const SITE_CONFIG = {
  brand: 'AYURIQUE',
  tagline: 'Ancient Knowledge, Modern Science',
  instagramUrl: 'https://www.instagram.com/the.ayurique/',
  whatsappUrl: 'https://wa.me/910000000000',
  orderFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScaJ_j9MxQU0IqMBp-6vPzz_dLyjR8HJRKopVs3G-o48XYggA/viewform',
  orderFormEntryIds: {
    name: 'entry.2005620554',
    phone: 'entry.1166974658',
    email: 'entry.1045781291',
    address: 'entry.839337160',
    city: 'entry.835412807',
    state: 'entry.1135523380',
    pincode: 'entry.1065046570',
    items: 'entry.2040920693',
    subtotal: 'entry.2040920693',
    coupon: 'entry.1383981195',
    discount: 'entry.2040920693',
    total: 'entry.2040920693',
    payment: 'entry.951307928',
  },
  contact: {
    email: 'globalexpressgroup@gmail.com',
    phone: '+91 96505 60277',
    address: 'Global Express Group, New Delhi, 110001, India',
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

// localStorage helpers — single source of truth for client-side persistence.
import type { Product } from '@/data/products';

export type CartItem = Product & { quantity: number };

const KEYS = {
  cart: 'ayurique-cart',
  coupon: 'ayurique-coupon',
  wishlist: 'ayurique-wishlist',
  recentlyViewed: 'ayurique-recently-viewed',
  searchHistory: 'ayurique-search-history',
  chat: 'ayurique-chat',
  theme: 'ayurique-theme',
  lang: 'ayurique-lang',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable — fail silently */
  }
}

export type Theme = 'light' | 'dark';
export const getTheme = (): Theme => {
  try {
    const val = localStorage.getItem(KEYS.theme);
    return val === 'dark' || val === '"dark"' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};
export const saveTheme = (theme: Theme) => {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    /* fail silently */
  }
};

export const getSavedLanguage = (): string => {
  try {
    const val = localStorage.getItem(KEYS.lang);
    return val ? val.replace(/"/g, '') : 'en';
  } catch {
    return 'en';
  }
};
export const saveLanguage = (lang: string) => {
  try {
    localStorage.setItem(KEYS.lang, lang);
  } catch {
    /* fail silently */
  }
};

export const getCart = () => read<CartItem[]>(KEYS.cart, []);
export const saveCart = (cart: CartItem[]) => write(KEYS.cart, cart);
export const clearCart = () => localStorage.removeItem(KEYS.cart);

export const getCoupon = () => read<string>(KEYS.coupon, '');
export const saveCoupon = (code: string) => write(KEYS.coupon, code);
export const clearCoupon = () => localStorage.removeItem(KEYS.coupon);

export const getWishlist = () => read<string[]>(KEYS.wishlist, []);
export const saveWishlist = (ids: string[]) => write(KEYS.wishlist, ids);

export const getRecentlyViewed = () => read<string[]>(KEYS.recentlyViewed, []);
export const addRecentlyViewed = (id: string) => {
  const list = [id, ...getRecentlyViewed().filter((existing) => existing !== id)].slice(0, 8);
  write(KEYS.recentlyViewed, list);
};

export const getSearchHistory = () => read<string[]>(KEYS.searchHistory, []);
export const addSearchHistory = (term: string) => {
  const trimmed = term.trim();
  if (!trimmed) return;
  const list = [trimmed, ...getSearchHistory().filter((existing) => existing !== trimmed)].slice(0, 6);
  write(KEYS.searchHistory, list);
};
export const clearSearchHistory = () => localStorage.removeItem(KEYS.searchHistory);

export type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  time: string;
  productIds?: string[];
};

export const getChatHistory = () => read<ChatMessage[]>(KEYS.chat, []);
export const saveChatHistory = (messages: ChatMessage[]) => write(KEYS.chat, messages);
export const clearChatHistory = () => localStorage.removeItem(KEYS.chat);

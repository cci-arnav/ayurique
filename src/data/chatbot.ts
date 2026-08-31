// Rule-based chatbot responses. Add keywords and replies here — no AI or backend.
import { products, formatPrice } from './products';
import { coupons, promotion } from './config';

export type BotReply = { text: string; productIds?: string[] };

const productLines = (ids: string[]) =>
  ids
    .map((id) => {
      const product = products.find((p) => p.id === id);
      return product ? `• ${product.name} — ${formatPrice(product.price)}` : '';
    })
    .filter(Boolean)
    .join('\n');

export const suggestedQuestions = [
  'What products do you offer?',
  'Which product is right for me?',
  'Tell me about perfumes',
  'Tell me about room fresheners',
  'Tell me about soaps',
  'How can I place an order?',
  'Do you offer discounts?',
  'I need help with my order',
];

export const welcomeMessage =
  'Namaste 🌿 Welcome to Ayurique.\nHow can we help you today?';

export function botReply(input: string): BotReply {
  const text = input.toLowerCase();

  if (/(perfume|fragrance|scent|attar|deodor)/.test(text)) {
    const ids = products.filter((p) => p.category === 'Perfume').map((p) => p.id);
    return {
      text: `Our perfumes are crafted as quiet signatures for everyday rituals:\n${productLines(ids)}\n\nTap any product in the shop to explore notes and usage.`,
      productIds: ids,
    };
  }

  if (/(room|fresh|air|home|spray|ambiance)/.test(text)) {
    const ids = products.filter((p) => p.category === 'Room Freshener').map((p) => p.id);
    return {
      text: `Our room fresheners transform the atmosphere around you:\n${productLines(ids)}`,
      productIds: ids,
    };
  }

  if (/(soap|bar|bath|cleanse|wash)/.test(text)) {
    const ids = products.filter((p) => p.category === 'Soap').map((p) => p.id);
    return {
      text: `Our soaps are a gentle, considered cleanse:\n${productLines(ids)}`,
      productIds: ids,
    };
  }

  if (/(discount|offer|coupon|code|sale|deal|festive|promo)/.test(text)) {
    const lines = Object.entries(coupons)
      .map(([code, c]) => `• ${code} — ${c.value}% off (min order ₹${c.minimumOrder})`)
      .join('\n');
    const promoLine = promotion.active ? `\n\n🎉 ${promotion.title}: ${promotion.discountText}` : '';
    return { text: `Here are the current offers you can apply at checkout:\n${lines}${promoLine}` };
  }

  if (/(order|buy|purchase|checkout|cart|place|how)/.test(text)) {
    return {
      text: 'Placing an order is simple — add products to your ritual bag, apply any coupon, then proceed to checkout. You will be taken to a secure form to confirm your details. No payment is processed online.',
    };
  }

  if (/(right|recommend|suggest|which|best|for me|my)/.test(text)) {
    return {
      text: 'A lovely place to start: a personal fragrance for your mood, a room freshener for your space, and a soap for your daily ritual. Tell me the time of day or feeling you have in mind and I can guide you further.',
    };
  }

  if (/(ship|delivery|deliver|tracking|track)/.test(text)) {
    return { text: 'We offer free shipping on orders above ₹999. Delivery details are shared once your order is confirmed through the form.' };
  }

  if (/(help|support|issue|problem|wrong|missing|refund|return)/.test(text)) {
    return { text: "I'm still learning 🌿 Please contact our support team for detailed assistance — hello@ayurique.in" };
  }

  if (/(hi|hello|hey|namaste|good)/.test(text)) {
    return { text: 'Namaste 🌿 How can I help you discover Ayurique today?' };
  }

  return { text: "I'm still learning 🌿 Please contact our support team for detailed assistance — hello@ayurique.in" };
}

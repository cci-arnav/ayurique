import { useEffect, useState } from 'react';
import { Check, X, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { SITE_CONFIG } from '@/data/config';
import type { CartItem } from '@/lib/storage';

type CheckoutModalProps = {
  open: boolean;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  onClose: () => void;
  onClearCart: () => void;
};

const initialForm = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' };

export function CheckoutModal({ open, cart, subtotal, discount, total, couponCode, onClose, onClearCart }: CheckoutModalProps) {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) { setError(''); setSent(false); }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (field: keyof typeof form, value: string) => setForm((c) => ({ ...c, [field]: value }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      setError('Please complete every field to continue.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (SITE_CONFIG.orderFormUrl.includes('PASTE_')) {
      setSent(true);
      return;
    }
    const itemsString = cart.map((item) => `${item.name} x${item.quantity}`).join(', ');
    const entry = SITE_CONFIG.orderFormEntryIds;
    const params = new URLSearchParams();
    const setParam = (key: keyof typeof entry, generic: string, value: string) => {
      params.append(entry[key] || generic, value);
    };
    setParam('name', 'name', form.name);
    setParam('phone', 'phone', form.phone);
    setParam('email', 'email', form.email);
    setParam('address', 'address', form.address);
    setParam('city', 'city', form.city);
    setParam('state', 'state', form.state);
    setParam('pincode', 'pincode', form.pincode);
    setParam('items', 'items', itemsString);
    setParam('subtotal', 'subtotal', String(subtotal));
    setParam('coupon', 'coupon', couponCode);
    setParam('discount', 'discount', String(discount));
    setParam('total', 'total', String(total));
    window.location.href = `${SITE_CONFIG.orderFormUrl}?${params.toString()}`;
  };

  return (
    <div className="overlay modal-overlay" onClick={onClose} role="dialog" aria-label="Checkout">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="checkout-sent">
            <div className="checkout-sent-icon"><Check size={28} /></div>
            <h2 className="checkout-sent-title">One small step left.</h2>
            <p className="checkout-sent-text">
              Your order form is ready to connect. Add your Google Form URL in the site settings to send customers there with their details prefilled.
            </p>
            <button className="button button-dark" onClick={onClose}>Back to collection</button>
          </div>
        ) : (
          <>
            <div className="checkout-header">
              <div>
                <p className="eyebrow text-gold">Almost yours</p>
                <h2 className="checkout-title">Complete your ritual</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close checkout"><X size={20} /></button>
            </div>

            <div className="checkout-body">
              <form onSubmit={submit} className="checkout-form">
                <p className="checkout-intro">Share your details and we will take you to the secure order form.</p>
                <div className="checkout-fields">
                  <FormField label="Full name" value={form.name} onChange={(v) => update('name', v)} />
                  <FormField label="Phone" value={form.phone} onChange={(v) => update('phone', v)} />
                  <FormField label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} />
                  <FormField label="Pincode" value={form.pincode} onChange={(v) => update('pincode', v)} />
                  <div className="checkout-field-full"><FormField label="Address" value={form.address} onChange={(v) => update('address', v)} /></div>
                  <FormField label="City" value={form.city} onChange={(v) => update('city', v)} />
                  <FormField label="State" value={form.state} onChange={(v) => update('state', v)} />
                </div>
                {error && <p className="checkout-error">{error}</p>}
                <button className="button button-dark checkout-submit" type="submit">
                  Continue to order <ArrowRight size={15} />
                </button>
              </form>

              <div className="checkout-summary">
                <p className="eyebrow text-gold">Order summary</p>
                <div className="checkout-summary-items">
                  {cart.map((item) => (
                    <div className="checkout-summary-row" key={item.id}>
                      <span>{item.name} <span className="checkout-qty">× {item.quantity}</span></span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-summary-totals">
                  <div className="checkout-summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="checkout-summary-line checkout-discount"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
                  <div className="checkout-summary-final"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="checkout-field">
      <span className="checkout-field-label">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field w-full" />
    </label>
  );
}

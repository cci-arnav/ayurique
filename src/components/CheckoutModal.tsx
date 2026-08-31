import { useEffect, useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { SITE_CONFIG } from '@/data/config';
import type { CartItem } from '@/lib/storage';
import type { TranslationDict } from '@/data/i18n';

type CheckoutModalProps = {
  open: boolean;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  t: TranslationDict;
  onClose: () => void;
  onClearCart: () => void;
};

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  payment: 'Cash on Delivery / कैश ऑन डिलीवरी',
};

export function CheckoutModal({
  open,
  cart,
  subtotal,
  discount,
  total,
  couponCode,
  t,
  onClose,
  onClearCart,
}: CheckoutModalProps) {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) {
      setError('');
      setSent(false);
    }
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

    const requiredFields = [form.name, form.phone, form.address, form.city, form.state, form.pincode, form.payment];
    if (requiredFields.some((value) => !value || !value.trim())) {
      setError(t.checkout.errorRequired);
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t.checkout.errorEmail);
      return;
    }

    if (cart.length === 0) {
      setError(t.checkout.errorEmptyCart);
      return;
    }

    const baseUrl = SITE_CONFIG.orderFormUrl.includes('?') ? SITE_CONFIG.orderFormUrl.split('?')[0] : SITE_CONFIG.orderFormUrl;
    const entry = SITE_CONFIG.orderFormEntryIds;
    const orderLines = cart.map((item) => `${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`);
    const orderDetails = [
      ...orderLines,
      '',
      `Subtotal: ${formatPrice(subtotal)}`,
      `Discount: ${formatPrice(discount)}`,
      `Coupon: ${couponCode || 'No coupon'}`,
      `Total: ${formatPrice(total)}`,
    ].join('\n');

    const params = new URLSearchParams();
    params.set('usp', 'pp_url');
    params.set(entry.name, form.name.trim());
    params.set(entry.phone, form.phone.trim());
    if (form.email.trim()) params.set(entry.email, form.email.trim());
    params.set(entry.pincode, form.pincode.trim());
    params.set(entry.address, form.address.trim());
    params.set(entry.city, form.city.trim());
    params.set(entry.state, form.state.trim());
    params.set(entry.items, orderDetails);
    params.set(entry.coupon, couponCode || 'No coupon');
    params.set(entry.payment, form.payment);

    const finalUrl = `${baseUrl}?${params.toString()}`;
    window.location.href = finalUrl;
  };

  return (
    <div className="overlay modal-overlay" onClick={onClose} role="dialog" aria-label="Checkout">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="checkout-sent">
            <div className="checkout-sent-icon"><Check size={28} /></div>
            <h2 className="checkout-sent-title">{t.checkout.sentTitle}</h2>
            <p className="checkout-sent-text">{t.checkout.sentText}</p>
            <button className="button button-dark" onClick={onClose}>{t.checkout.backToCollection}</button>
          </div>
        ) : (
          <>
            <div className="checkout-header">
              <div>
                <p className="eyebrow text-gold">{t.checkout.almostYours}</p>
                <h2 className="checkout-title">{t.checkout.completeRitual}</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close checkout"><X size={20} /></button>
            </div>

            <div className="checkout-body">
              <form onSubmit={submit} className="checkout-form">
                <p className="checkout-intro">{t.checkout.intro}</p>
                <div className="checkout-fields">
                  <FormField label={t.checkout.fullName} value={form.name} onChange={(v) => update('name', v)} />
                  <FormField label={t.checkout.phone} value={form.phone} onChange={(v) => update('phone', v)} />
                  <FormField label={t.checkout.email} type="email" value={form.email} onChange={(v) => update('email', v)} />
                  <FormField label={t.checkout.pincode} value={form.pincode} onChange={(v) => update('pincode', v)} />
                  <div className="checkout-field-full">
                    <FormField label={t.checkout.address} value={form.address} onChange={(v) => update('address', v)} />
                  </div>
                  <FormField label={t.checkout.city} value={form.city} onChange={(v) => update('city', v)} />
                  <FormField label={t.checkout.state} value={form.state} onChange={(v) => update('state', v)} />
                  <div className="checkout-field-full">
                    <label className="checkout-field">
                      <span className="checkout-field-label">{t.checkout.paymentPref}</span>
                      <select
                        value={form.payment}
                        onChange={(e) => update('payment', e.target.value)}
                        className="input-field w-full"
                      >
                        <option>{t.checkout.cashOnDelivery}</option>
                        <option>{t.checkout.upi}</option>
                        <option>{t.checkout.bankTransfer}</option>
                      </select>
                    </label>
                  </div>
                </div>
                {error && <p className="checkout-error">{error}</p>}
                <button className="button button-dark checkout-submit" type="submit">
                  {t.checkout.continueToOrder} <ArrowRight size={15} />
                </button>
              </form>

              <div className="checkout-summary">
                <p className="eyebrow text-gold">{t.checkout.orderSummary}</p>
                <div className="checkout-summary-items">
                  {cart.map((item) => (
                    <div className="checkout-summary-row" key={item.id}>
                      <span>{item.name} <span className="checkout-qty">× {item.quantity}</span></span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-summary-totals">
                  <div className="checkout-summary-line"><span>{t.checkout.subtotal}</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="checkout-summary-line checkout-discount">
                      <span>{t.checkout.discount}</span><span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="checkout-summary-final"><span>{t.checkout.total}</span><span>{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="checkout-field">
      <span className="checkout-field-label">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field w-full" />
    </label>
  );
}

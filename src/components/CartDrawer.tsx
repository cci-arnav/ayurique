import { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Tag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice, type Product } from '@/data/products';
import { coupons } from '@/data/config';
import type { CartItem } from '@/lib/storage';

type CartDrawerProps = {
  open: boolean;
  cart: CartItem[];
  appliedCoupon: string;
  onClose: () => void;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemove: (id: string) => void;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
};

export function CartDrawer({
  open,
  cart,
  appliedCoupon,
  onClose,
  onUpdateQuantity,
  onRemove,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  onContinueShopping,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCouponInput('');
      setMessage('');
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 100);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const coupon = appliedCoupon ? coupons[appliedCoupon] : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.value) / 100) : 0;
  const total = subtotal - discount;

  const handleApply = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (appliedCoupon === code) {
      setMessage('This code is already applied.');
      return;
    }
    const selected = coupons[code];
    if (!selected) {
      setMessage('That code is not active yet.');
      return;
    }
    if (subtotal < selected.minimumOrder) {
      setMessage(`Add ${formatPrice(selected.minimumOrder - subtotal)} more to unlock this offer.`);
      return;
    }
    onApplyCoupon(code);
    setMessage(`${code} applied — ${selected.value}% saved.`);
  };

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-label="Shopping cart">
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div>
            <p className="eyebrow text-gold">Your selection</p>
            <h2 className="cart-title">
              The ritual bag <span className="cart-count-label">({cartCount})</span>
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={32} strokeWidth={1} className="text-gold" />
            <p className="cart-empty-title">Your bag is waiting.</p>
            <p className="cart-empty-sub">Add a ritual to begin.</p>
            <button className="button button-dark" onClick={onContinueShopping}>
              Explore the collection
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items" ref={scrollRef}>
              {cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <img src={item.images[0]} alt={item.name} className="cart-row-img" />
                  <div className="cart-row-info">
                    <div className="cart-row-top">
                      <div>
                        <p className="cart-row-cat">{item.category}</p>
                        <h3 className="cart-row-name">{item.name}</h3>
                      </div>
                      <span className="cart-row-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="cart-row-controls">
                      <div className="quantity-control">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} aria-label="Decrease quantity">
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} aria-label="Increase quantity">
                          <Plus size={13} />
                        </button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="cart-remove" aria-label={`Remove ${item.name}`}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="coupon-row">
                <Tag size={15} className="text-gold" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Have a coupon code?"
                  className="input-field"
                  aria-label="Coupon code"
                />
                <button className="button button-outline coupon-apply-btn" onClick={handleApply}>
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="coupon-applied">
                  <span>{appliedCoupon} — {coupons[appliedCoupon]?.value}% off</span>
                  <button onClick={onRemoveCoupon} aria-label="Remove coupon" className="coupon-remove-btn">
                    <X size={14} /> Remove
                  </button>
                </div>
              )}

              {message && (
                <p className={`coupon-message ${appliedCoupon && message.includes('applied') ? 'is-success' : 'is-error'}`}>
                  {message}
                </p>
              )}

              <div className="cart-totals">
                <div className="cart-total-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="cart-total-row cart-discount">
                    <span>Discount ({appliedCoupon})</span><span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="cart-total-final">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button className="button button-dark cart-checkout-btn" onClick={onCheckout}>
                Proceed to checkout <ArrowRight size={15} />
              </button>
              <button className="cart-continue" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

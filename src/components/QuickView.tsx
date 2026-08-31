import { useEffect, useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { formatPrice, discountPercent, type Product } from '@/data/products';

type QuickViewProps = {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (id: string) => void;
  onBuyNow: (product: Product, quantity: number) => void;
};

export function QuickView({ product, isWishlisted, onClose, onAddToCart, onToggleWishlist, onBuyNow }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && product && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const discount = discountPercent(product);
  const gallery = product.images.length > 1 ? product.images : [product.images[0]];

  return (
    <div className="overlay modal-overlay" onClick={onClose} role="dialog" aria-label={`${product.name} quick view`}>
      <div className="quick-view" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close product view">
          <X size={20} />
        </button>
        <div className="quick-view-grid">
          <div className="quick-gallery">
            <div className="quick-main-image">
              <img src={gallery[activeImage]} alt={product.name} />
              {discount > 0 && <span className="product-badge">{discount}% off</span>}
            </div>
            {gallery.length > 1 && (
              <div className="quick-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    className={`quick-thumb ${activeImage === i ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="quick-details">
            <p className="eyebrow text-gold">{product.category}</p>
            <h2 className="quick-name">{product.name}</h2>
            <div className="quick-price-row">
              <span className="quick-price">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="quick-compare">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="quick-desc">{product.description}</p>

            <div className="quick-divider" />

            <p className="quick-section-label">Why you'll love it</p>
            <p className="quick-section-text">{product.note}</p>
            <p className="quick-section-label">How to use</p>
            <p className="quick-section-text">{product.use}</p>

            <div className="quick-actions">
              <div className="quantity-control quick-quantity">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button
                className={`icon-button quick-wishlist ${isWishlisted ? 'is-active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              className="button button-dark quick-add-btn"
              onClick={() => onAddToCart(product, quantity)}
            >
              Add to cart <ShoppingBag size={15} />
            </button>
            <button
              className="button button-outline quick-buy-btn"
              onClick={() => onBuyNow(product, quantity)}
            >
              Buy now <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

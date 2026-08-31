import { useEffect, useRef } from 'react';
import { X, Heart, Plus, Trash2, ArrowRight } from 'lucide-react';
import { products, formatPrice, discountPercent, type Product } from '@/data/products';
import type { TranslationDict } from '@/data/i18n';

type WishlistDrawerProps = {
  open: boolean;
  wishlistIds: string[];
  t: TranslationDict;
  onClose: () => void;
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onExploreCollection: () => void;
};

export function WishlistDrawer({
  open,
  wishlistIds,
  t,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  onExploreCollection,
}: WishlistDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 100);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-label={t.wishlist.title}>
      <aside className="cart-drawer wishlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div>
            <p className="eyebrow text-gold">{t.wishlist.eyebrow}</p>
            <h2 className="cart-title">
              {t.wishlist.title} <span className="cart-count-label">({wishlistedProducts.length})</span>
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="cart-empty">
            <Heart size={36} strokeWidth={1} className="text-gold" />
            <p className="cart-empty-title">{t.wishlist.emptyTitle}</p>
            <p className="cart-empty-sub">{t.wishlist.emptySub}</p>
            <button
              className="button button-dark mt-6"
              onClick={() => {
                onClose();
                onExploreCollection();
              }}
            >
              {t.wishlist.exploreCollection} <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <div className="cart-items" ref={scrollRef}>
            {wishlistedProducts.map((product) => {
              const discount = discountPercent(product);
              return (
                <div className="cart-row wishlist-row" key={product.id}>
                  <div
                    className="wishlist-img-wrap"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  >
                    <img src={product.images[0]} alt={product.name} className="cart-row-img" />
                    {discount > 0 && <span className="product-badge wishlist-badge">{discount}% {t.collection.off}</span>}
                  </div>
                  <div className="cart-row-info">
                    <div className="cart-row-top">
                      <div>
                        <p className="cart-row-cat">{product.category}</p>
                        <h3
                          className="cart-row-name cursor-pointer hover:text-gold transition-colors"
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                        >
                          {product.name}
                        </h3>
                      </div>
                      <span className="cart-row-price">{formatPrice(product.price)}</span>
                    </div>

                    <div className="cart-row-controls mt-4 flex items-center justify-between">
                      <button
                        className="button button-dark wishlist-add-btn"
                        onClick={() => onAddToCart(product)}
                      >
                        <Plus size={13} /> {t.wishlist.addToBag}
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="cart-remove"
                        aria-label={`${t.wishlist.remove} ${product.name}`}
                      >
                        <Trash2 size={14} /> {t.wishlist.remove}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}

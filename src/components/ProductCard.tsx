import { Heart, Plus, ArrowRight } from 'lucide-react';
import { formatPrice, discountPercent, type Product } from '@/data/products';

type ProductCardProps = {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onAdd: () => void;
  onQuickView: () => void;
  onToggleWishlist: () => void;
};

export function ProductCard({ product, index, isWishlisted, onAdd, onQuickView, onToggleWishlist }: ProductCardProps) {
  const discount = discountPercent(product);
  const hasHoverImage = product.images.length > 1;

  return (
    <article className="product-card reveal" style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="product-image-wrap">
        {product.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={i === 0 ? product.name : `${product.name} alternate view`}
            loading="lazy"
            className={`product-img ${i === 0 ? 'is-primary' : 'is-secondary'}`}
          />
        ))}
        {!hasHoverImage && <img src={product.images[0]} alt={product.name} loading="lazy" className="product-img is-primary" />}

        {discount > 0 && <span className="product-badge">{discount}% off</span>}
        {product.badge && discount === 0 && <span className="product-badge product-badge-text">{product.badge}</span>}

        <button className="wishlist-button" onClick={onToggleWishlist} aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}>
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-rose' : ''} />
        </button>

        <button className="quick-button" onClick={onQuickView}>Quick view</button>
      </div>

      <div className="product-info">
        <div className="product-info-top">
          <div>
            <p className="product-cat">{product.category}</p>
            <h3 className="product-name">{product.name}</h3>
          </div>
          <div className="product-price-col">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span className="product-compare">{formatPrice(product.compareAtPrice)}</span>}
          </div>
        </div>
        <p className="product-desc">{product.description}</p>
        <button className="product-add-btn" onClick={onAdd}>
          <span>Add to bag</span> <Plus size={15} />
        </button>
      </div>
    </article>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { products, formatPrice, type Product } from '@/data/products';
import { getSearchHistory, addSearchHistory, clearSearchHistory } from '@/lib/storage';

type SearchBarProps = {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (term: string) => void;
};

export function SearchBar({ open, onClose, onSelectProduct, onSearchSubmit }: SearchBarProps) {
  const [term, setTerm] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setHistory(getSearchHistory());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTerm('');
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const suggestions = useMemo(() => {
    if (!term.trim()) return [];
    const q = term.toLowerCase();
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
      )
      .slice(0, 5);
  }, [term]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    setHistory(getSearchHistory());
    onSearchSubmit(trimmed);
    onClose();
  };

  const pickProduct = (product: Product) => {
    addSearchHistory(product.name);
    onSelectProduct(product);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose} role="dialog" aria-label="Search products">
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <form className="search-input-row" onSubmit={handleSubmit}>
          <Search size={20} strokeWidth={1.5} className="text-gold" />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search fragrances, soaps, fresheners…"
            aria-label="Search products"
            className="search-input"
          />
          {term && (
            <button type="button" onClick={() => setTerm('')} aria-label="Clear search" className="search-clear">
              <X size={18} />
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Close search" className="search-close-btn">
            <X size={20} />
          </button>
        </form>

        <div className="search-body">
          {!term.trim() && history.length > 0 && (
            <div className="search-section">
              <div className="search-section-head">
                <span className="eyebrow text-gold">Recent searches</span>
                <button onClick={() => { clearSearchHistory(); setHistory([]); }} className="search-clear-history">
                  Clear
                </button>
              </div>
              <div className="search-history-list">
                {history.map((h) => (
                  <button key={h} className="search-history-item" onClick={() => setTerm(h)}>
                    <Clock size={14} /> <span>{h}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {term.trim() && suggestions.length === 0 && (
            <p className="search-empty">No products match “{term}”. Try another word.</p>
          )}

          {suggestions.length > 0 && (
            <div className="search-section">
              <span className="eyebrow text-gold">Products</span>
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <button key={product.id} className="search-suggestion" onClick={() => pickProduct(product)}>
                    <img src={product.images[0]} alt={product.name} loading="lazy" />
                    <div className="search-suggestion-info">
                      <span className="search-suggestion-name">{product.name}</span>
                      <span className="search-suggestion-cat">{product.category}</span>
                    </div>
                    <span className="search-suggestion-price">{formatPrice(product.price)}</span>
                    <ArrowRight size={16} className="search-suggestion-arrow" />
                  </button>
                ))}
              </div>
              <button className="search-view-all" onClick={() => handleSubmit()}>
                View all results for “{term}” <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

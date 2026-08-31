import { useEffect, useState } from 'react';
import { Menu, X, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/data/config';

type NavbarProps = {
  cartCount: number;
  onNavigate: (id: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
};

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Shop', id: 'shop' },
  { label: 'Our Story', id: 'story' },
  { label: 'Ayurveda & Science', id: 'philosophy' },
  { label: 'Journal', id: 'journal' },
];

export function Navbar({ cartCount, onNavigate, onOpenSearch, onOpenCart }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (id: string) => { setMenuOpen(false); onNavigate(id); };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="shell nav-row" aria-label="Main navigation">
        <button className="brand-lockup" onClick={() => go('home')} aria-label={`${SITE_CONFIG.brand} home`}>
          <img src="/assets/logo/Ayurique.png" alt={`${SITE_CONFIG.brand} logo`} className="brand-mark" />
          <span className="brand-name">AYURIQUE</span>
        </button>

        <div className="nav-links">
          {navLinks.map((link) => (
            <button key={link.id} className="nav-link" onClick={() => go(link.id)}>{link.label}</button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="icon-button" aria-label="Search" onClick={onOpenSearch}><Search size={18} strokeWidth={1.5} /></button>
          <button className="icon-button nav-cart-btn" aria-label={`Cart, ${cartCount} items`} onClick={onOpenCart}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="button button-dark nav-shop-btn" onClick={() => go('shop')}>Shop now <ArrowRight size={15} /></button>
          <button className="icon-button nav-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} strokeWidth={1.5} /></button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu-head">
            <span className="eyebrow text-gold">AYURIQUE</span>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
          </div>
          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => go(link.id)} className="mobile-menu-link">{link.label}</button>
            ))}
          </div>
          <button className="button button-dark mobile-menu-shop" onClick={() => go('shop')}>Shop now <ArrowRight size={15} /></button>
          <div className="mobile-menu-foot">Ancient Knowledge, Modern Science</div>
        </div>
      )}
    </header>
  );
}

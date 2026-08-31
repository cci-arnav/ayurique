import { useEffect, useRef, useState } from 'react';
import { Menu, X, Search, ShoppingBag, Heart, Sun, Moon, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/data/config';
import { SUPPORTED_LANGUAGES, type TranslationDict, type LanguageCode } from '@/data/i18n';
import type { Theme } from '@/lib/storage';

type NavbarProps = {
  cartCount: number;
  wishlistCount: number;
  theme: Theme;
  language: string;
  t: TranslationDict;
  onToggleTheme: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onNavigate: (id: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
};

export function Navbar({
  cartCount,
  wishlistCount,
  theme,
  language,
  t,
  onToggleTheme,
  onSelectLanguage,
  onNavigate,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t.nav.home, id: 'home' },
    { label: t.nav.shop, id: 'shop' },
    { label: t.nav.story, id: 'story' },
    { label: t.nav.philosophy, id: 'philosophy' },
    { label: t.nav.journal, id: 'journal' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="shell nav-row" aria-label="Main navigation">
        <button className="brand-lockup" onClick={() => go('home')} aria-label={`${SITE_CONFIG.brand} home`}>
          <img src="/assets/logo/Ayurique.png" alt={`${SITE_CONFIG.brand} logo`} className="brand-mark" />
          <span className="brand-name">AYURIQUE</span>
        </button>

        <div className="nav-links">
          {navLinks.map((link) => (
            <button key={link.id} className="nav-link" onClick={() => go(link.id)}>
              {link.label}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          {/* Language Selector */}
          <div className="lang-selector hidden sm:block" ref={langMenuRef}>
            <button
              className="lang-toggle-btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-label={t.nav.selectLanguage}
            >
              <Globe size={14} />
              <span>{currentLangMeta.code.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="lang-dropdown" role="menu">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${lang.code === language ? 'is-active' : ''}`}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span>{lang.flag} {lang.nativeName}</span>
                    <span className="text-[10px] opacity-60 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
            title={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
          </button>

          {/* Search */}
          <button className="icon-button" aria-label={t.nav.search} onClick={onOpenSearch}>
            <Search size={18} strokeWidth={1.75} />
          </button>

          {/* Wishlist */}
          <button
            className="icon-button nav-wishlist-btn"
            aria-label={`${t.nav.wishlist}, ${wishlistCount} items`}
            onClick={onOpenWishlist}
            title={t.nav.wishlist}
          >
            <Heart size={19} strokeWidth={1.75} />
            {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </button>

          {/* Cart */}
          <button
            className="icon-button nav-cart-btn"
            aria-label={`${t.nav.cart}, ${cartCount} items`}
            onClick={onOpenCart}
            title={t.nav.cart}
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {/* Shop CTA */}
          <button className="button button-dark nav-shop-btn" onClick={() => go('shop')}>
            {t.nav.shopNow} <ArrowRight size={14} />
          </button>

          {/* Mobile menu trigger */}
          <button
            className="icon-button nav-menu-btn"
            aria-label={t.nav.openMenu}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu-head">
            <div className="flex items-center gap-2">
              <img src="/assets/logo/Ayurique.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="eyebrow text-gold">AYURIQUE</span>
            </div>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label={t.nav.closeMenu}>
              <X size={22} />
            </button>
          </div>

          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => go(link.id)} className="mobile-menu-link">
                {link.label}
              </button>
            ))}
          </div>

          <div className="mobile-menu-controls">
            <div className="mobile-menu-row">
              <span className="text-xs uppercase tracking-wider opacity-80">{t.nav.switchTheme}</span>
              <button
                className="icon-button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            </div>

            <div className="mobile-menu-row">
              <span className="text-xs uppercase tracking-wider opacity-80">{t.nav.wishlist}</span>
              <button
                className="icon-button relative"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenWishlist();
                }}
                aria-label={t.nav.wishlist}
              >
                <Heart size={19} />
                {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
              </button>
            </div>

            <div className="mobile-menu-row">
              <span className="text-xs uppercase tracking-wider opacity-80">{t.nav.selectLanguage}</span>
              <select
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
                className="input-field text-xs py-1 px-2 bg-transparent text-white border-white/20"
                aria-label={t.nav.selectLanguage}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-ink bg-ivory">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="button button-dark mobile-menu-shop" onClick={() => go('shop')}>
            {t.nav.shopNow} <ArrowRight size={15} />
          </button>

          <div className="mobile-menu-foot">{SITE_CONFIG.tagline}</div>
        </div>
      )}
    </header>
  );
}

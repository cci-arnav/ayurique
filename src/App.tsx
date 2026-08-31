import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles, Instagram, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { SearchBar } from '@/components/SearchBar';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';
import { QuickView } from '@/components/QuickView';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Chatbot } from '@/components/Chatbot';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products, productImages, type Product, type Category } from '@/data/products';
import { SITE_CONFIG, promotion, coupons } from '@/data/config';
import { getTranslations, SUPPORTED_LANGUAGES, type LanguageCode } from '@/data/i18n';
import {
  getCart, saveCart, clearCart, getCoupon, saveCoupon, clearCoupon,
  getWishlist, saveWishlist, addRecentlyViewed,
  getTheme, saveTheme, getSavedLanguage, saveLanguage,
  type CartItem, type Theme,
} from '@/lib/storage';

type FilterCategory = 'All' | Category;

function App() {
  const [theme, setTheme] = useState<Theme>(() => getTheme());
  const [language, setLanguage] = useState<LanguageCode>(() => (getSavedLanguage() as LanguageCode) || 'en');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist());
  const [appliedCoupon, setAppliedCoupon] = useState<string>(() => getCoupon());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const t = useMemo(() => getTranslations(language), [language]);

  // Sync theme
  useEffect(() => {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync language and RTL direction
  useEffect(() => {
    saveLanguage(language);
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    const dir = langMeta?.dir || 'ltr';
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      saveCoupon(appliedCoupon);
    } else {
      clearCoupon();
    }
  }, [appliedCoupon]);

  // IntersectionObserver for reveal animations with dynamic re-observation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      }),
      { threshold: 0.08 },
    );
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    window.addEventListener('ayurique-open-cart', openCart);
    return () => window.removeEventListener('ayurique-open-cart', openCart);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSelectLanguage = useCallback((newLang: LanguageCode) => {
    setLanguage(newLang);
  }, []);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const coupon = appliedCoupon ? coupons[appliedCoupon] : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.value) / 100) : 0;
  const total = subtotal - discount;

  // Collection filtering logic (Robust, no stale state)
  const visibleProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const scrollTo = (id: string) => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCheckoutOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, openCart = false) => {
    setCart((items) => {
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        return items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...items, { ...product, quantity }];
    });
    showToast(`${product.name} — ${t.collection.addToBag}`);
    if (openCart) setIsCartOpen(true);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((items) => items.flatMap((i) =>
      i.id === id ? (i.quantity + change > 0 ? [{ ...i, quantity: i.quantity + change }] : []) : [i],
    ));
  };

  const removeFromCart = (id: string) => setCart((items) => items.filter((i) => i.id !== id));

  const applyCoupon = (code: string) => setAppliedCoupon(code);
  const removeCoupon = () => { setAppliedCoupon(''); clearCoupon(); };

  const toggleWishlist = (id: string) => {
    const isSaved = wishlist.includes(id);
    const next = isSaved ? wishlist.filter((x) => x !== id) : [...wishlist, id];
    setWishlist(next);
    showToast(isSaved ? t.wishlist.removedToast : t.wishlist.addedToast);
  };

  const openQuickView = (product: Product) => {
    addRecentlyViewed(product.id);
    setQuickView(product);
  };

  const buyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity, false);
    setQuickView(null);
    setCheckoutOpen(true);
  };

  const submitNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) {
      setNewsletterMessage(t.newsletter.invalidEmail);
      return;
    }
    setNewsletterMessage(t.newsletter.success);
    setNewsletterEmail('');
  };

  return (
    <div className="app-root">
      <AnnouncementBar items={t.announcements} />
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        theme={theme}
        language={language}
        t={t}
        onToggleTheme={toggleTheme}
        onSelectLanguage={handleSelectLanguage}
        onNavigate={scrollTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <main>
        {/* HERO */}
        <section id="home" className="hero-section">
          <div className="hero-glow" />
          <div className="shell hero-grid">
            <div className="hero-copy reveal is-visible">
              <p className="eyebrow text-gold mb-6">{t.hero.eyebrow}</p>
              <h1 className="hero-title">{t.hero.titlePart1}<br /><em>{t.hero.titlePart2}</em></h1>
              <p className="hero-sub">{t.hero.subtitle}</p>
              <div className="hero-ctas">
                <button className="button button-dark" onClick={() => scrollTo('shop')}>
                  {t.hero.shopCollection} <ArrowRight size={15} />
                </button>
                <button className="button button-outline" onClick={() => scrollTo('story')}>
                  {t.hero.discoverAyurique}
                </button>
              </div>
              {promotion.active && (
                <div className="hero-promo">
                  <Sparkles size={14} /> <span>{promotion.discountText}</span>
                </div>
              )}
            </div>
            <div className="hero-visual reveal is-visible">
              <div className="hero-frame">
                <img src={productImages.hero} alt="Elegant perfume bottle in a warm botanical setting" />
                <div className="hero-frame-caption"><span>01 / 03</span><span>{t.hero.frameCaption}</span></div>
              </div>
              <div className="hero-stamp"><Sparkles size={16} /><span>{t.hero.stampTitle}<br />{t.hero.stampSub}</span></div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="section-story" id="story">
          <div className="shell story-shell">
            <div className="story-grid">
              <div className="story-identity reveal is-visible">
                <p className="eyebrow text-gold">{t.story.eyebrow}</p>
                <span className="story-number">{t.story.number}</span>
              </div>
              <div className="story-copy reveal is-visible">
                <h2 className="section-title">{t.story.titlePart1}<br /><em>{t.story.titlePart2}</em></h2>
                <p className="section-body">{t.story.body}</p>
                <button className="link-button mt-8" onClick={() => scrollTo('philosophy')}>
                  {t.story.readPhilosophy} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="category-section">
          <div className="shell">
            <div className="section-head-row">
              <div>
                <p className="eyebrow text-gold">{t.categories.eyebrow}</p>
                <h2 className="section-title mt-4">{t.categories.titlePart1} <em>{t.categories.titlePart2}</em></h2>
              </div>
              <button className="link-button hidden md:flex" onClick={() => { setActiveCategory('All'); scrollTo('shop'); }}>
                {t.categories.viewAll} <ArrowRight size={16} />
              </button>
            </div>
            <div className="category-grid">
              <CategoryCard
                title={t.categories.perfumesTitle}
                text={t.categories.perfumesText}
                exploreLabel={t.categories.explore}
                image={productImages.perfume}
                onClick={() => { setActiveCategory('Perfume'); scrollTo('shop'); }}
              />
              <CategoryCard
                title={t.categories.roomFreshenersTitle}
                text={t.categories.roomFreshenersText}
                exploreLabel={t.categories.explore}
                image={productImages.room}
                onClick={() => { setActiveCategory('Room Freshener'); scrollTo('shop'); }}
              />
              <CategoryCard
                title={t.categories.soapsTitle}
                text={t.categories.soapsText}
                exploreLabel={t.categories.explore}
                image={productImages.soap}
                onClick={() => { setActiveCategory('Soap'); scrollTo('shop'); }}
              />
            </div>
          </div>
        </section>

        {/* SHOP / COLLECTION */}
        <section id="shop" className="shell section-shop">
          <div className="shop-head">
            <div>
              <p className="eyebrow text-gold">{t.collection.eyebrow}</p>
              <h2 className="section-title mt-4">{t.collection.titlePart1} <em>{t.collection.titlePart2}</em></h2>
            </div>
            <div className="filter-row">
              {(['All', 'Perfume', 'Room Freshener', 'Soap'] as FilterCategory[]).map((cat) => {
                const label =
                  cat === 'All'
                    ? t.collection.all
                    : cat === 'Perfume'
                    ? t.collection.perfumes
                    : cat === 'Room Freshener'
                    ? t.collection.roomFresheners
                    : t.collection.soaps;
                return (
                  <button
                    key={cat}
                    className={`filter-button ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isWishlisted={wishlist.includes(product.id)}
                t={t}
                onAdd={() => addToCart(product, 1, false)}
                onQuickView={() => openQuickView(product)}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
          {visibleProducts.length === 0 && <p className="shop-empty">{t.collection.empty}</p>}
        </section>

        {/* PHILOSOPHY */}
        <section id="philosophy" className="philosophy-section">
          <div className="shell philosophy-grid">
            <div className="philosophy-image reveal is-visible">
              <img src={productImages.ritual} alt="Botanical shadows in warm afternoon light" />
              <div className="image-label">{t.philosophy.imgTradition}<br /><span>{t.philosophy.imgRefined}</span></div>
            </div>
            <div className="max-w-xl reveal is-visible philosophy-copy">
              <p className="eyebrow text-gold">{t.philosophy.eyebrow}</p>
              <h2 className="section-title mt-5">{t.philosophy.titlePart1}<br /><em>{t.philosophy.titlePart2}</em></h2>
              <p className="section-body">{t.philosophy.body}</p>
              <div className="philosophy-points">
                <div>
                  <span className="philosophy-point-num">01</span>
                  <p className="font-semibold text-forest mt-1">{t.philosophy.point1Title}</p>
                  <p>{t.philosophy.point1Text}</p>
                </div>
                <div>
                  <span className="philosophy-point-num">02</span>
                  <p className="font-semibold text-forest mt-1">{t.philosophy.point2Title}</p>
                  <p>{t.philosophy.point2Text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RITUAL */}
        <section className="shell section-ritual">
          <div className="section-head-row">
            <div>
              <p className="eyebrow text-gold">{t.ritual.eyebrow}</p>
              <h2 className="section-title mt-4">{t.ritual.titlePart1} <em>{t.ritual.titlePart2}</em></h2>
            </div>
            <span className="hidden text-6xl font-serif text-sage/20 md:block">02</span>
          </div>
          <div className="ritual-grid">
            <RitualStep
              time={t.ritual.morning}
              title={t.ritual.clearAir}
              text={t.ritual.morningDesc}
              product={t.ritual.withSacredBasil}
            />
            <RitualStep
              time={t.ritual.afternoon}
              title={t.ritual.wearMood}
              text={t.ritual.afternoonDesc}
              product={t.ritual.withSandalwood}
            />
            <RitualStep
              time={t.ritual.evening}
              title={t.ritual.comeBack}
              text={t.ritual.eveningDesc}
              product={t.ritual.withRoseClay}
            />
          </div>
        </section>

        {/* JOURNAL */}
        <section id="journal" className="journal-section">
          <div className="shell journal-grid">
            <div className="reveal is-visible">
              <p className="eyebrow text-gold">{t.journal.eyebrow}</p>
              <h2 className="section-title mt-4">{t.journal.titlePart1} <em>{t.journal.titlePart2}</em></h2>
              <p className="section-body max-w-lg">{t.journal.body}</p>
              <button className="button button-outline mt-8">{t.journal.exploreJournal} <ArrowRight size={15} /></button>
            </div>
            <div className="journal-card reveal is-visible">
              <div className="journal-card-head"><span>{t.journal.fieldNote}</span><span>01—06</span></div>
              <h3 className="journal-card-title">{t.journal.noteTitle}</h3>
              <p className="journal-card-text">{t.journal.noteText}</p>
              <span className="journal-card-arrow"><ArrowRight size={16} /></span>
            </div>
          </div>
        </section>

        {/* INSTAGRAM */}
        <section className="shell section-instagram">
          <div className="instagram-head">
            <p className="eyebrow text-gold">{t.instagram.eyebrow}</p>
            <h2 className="section-title mt-4">@the.ayurique</h2>
          </div>
          <div className="instagram-grid">
            {productImages.instagram.map((img) => (
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" key={img} className="instagram-tile" aria-label="Instagram post">
                <img src={img} alt="Ayurique ritual inspiration" loading="lazy" />
                <span className="instagram-overlay"><Instagram size={19} /></span>
              </a>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletter-section">
          <div className="shell newsletter-grid">
            <div>
              <p className="eyebrow text-gold">{t.newsletter.eyebrow}</p>
              <h2 className="section-title mt-4">{t.newsletter.titlePart1} <em>{t.newsletter.titlePart2}</em></h2>
              <p className="newsletter-sub">{t.newsletter.subtitle}</p>
            </div>
            <form onSubmit={submitNewsletter} className="newsletter-form">
              <label className="sr-only" htmlFor="newsletter">{t.newsletter.placeholder}</label>
              <div className="newsletter-input-row">
                <input
                  id="newsletter"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit">{t.newsletter.join} <ArrowRight size={15} /></button>
              </div>
              {newsletterMessage && <p className="newsletter-msg">{newsletterMessage}</p>}
            </form>
          </div>
        </section>
      </main>

      <Footer
        t={t}
        onNavigate={scrollTo}
        onCategorySelect={(cat) => setActiveCategory(cat)}
      />

      {/* Overlays */}
      <SearchBar
        open={isSearchOpen}
        t={t}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => openQuickView(p)}
        onSearchSubmit={(term) => {
          const q = term.toLowerCase();
          const match = products.find((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((tg) => tg.includes(q)));
          if (match) { setActiveCategory(match.category); }
          scrollTo('shop');
        }}
      />
      <CartDrawer
        open={isCartOpen}
        cart={cart}
        appliedCoupon={appliedCoupon}
        t={t}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onApplyCoupon={applyCoupon}
        onRemoveCoupon={removeCoupon}
        onCheckout={() => { setIsCartOpen(false); setCheckoutOpen(true); }}
        onContinueShopping={() => { setIsCartOpen(false); scrollTo('shop'); }}
      />
      <WishlistDrawer
        open={isWishlistOpen}
        wishlistIds={wishlist}
        t={t}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={toggleWishlist}
        onAddToCart={(p) => addToCart(p, 1, false)}
        onSelectProduct={(p) => openQuickView(p)}
        onExploreCollection={() => scrollTo('shop')}
      />
      <QuickView
        product={quickView}
        isWishlisted={quickView ? wishlist.includes(quickView.id) : false}
        t={t}
        onClose={() => setQuickView(null)}
        onAddToCart={(p, qty) => { addToCart(p, qty, true); setQuickView(null); }}
        onToggleWishlist={toggleWishlist}
        onBuyNow={buyNow}
      />
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        subtotal={subtotal}
        discount={discount}
        total={total}
        couponCode={appliedCoupon}
        t={t}
        onClose={() => setCheckoutOpen(false)}
        onClearCart={clearCart}
      />
      <Chatbot t={t} onProductClick={(p) => openQuickView(p)} />

      {/* Toast */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={16} /> <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  title,
  text,
  exploreLabel,
  image,
  onClick,
}: {
  title: string;
  text: string;
  exploreLabel: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <button className="category-card" onClick={onClick} aria-label={`Explore ${title}`}>
      <img src={image} alt={`${title} collection`} loading="lazy" />
      <div className="category-overlay" />
      <div className="category-content">
        <p className="eyebrow text-white/70">Collection</p>
        <h3 className="category-title">{title}</h3>
        <p className="category-text">{text}</p>
        <span className="category-explore">{exploreLabel} <ArrowRight size={15} /></span>
      </div>
    </button>
  );
}

function RitualStep({ time, title, text, product }: { time: string; title: string; text: string; product: string }) {
  return (
    <div className="ritual-step reveal is-visible">
      <div className="ritual-step-head">
        <span className="eyebrow text-gold">{time}</span>
        <Sparkles size={22} className="text-gold/60" />
      </div>
      <h3 className="ritual-step-title">{title}</h3>
      <p className="ritual-step-text">{text}</p>
      <span className="ritual-step-product">{product}</span>
    </div>
  );
}

export default App;

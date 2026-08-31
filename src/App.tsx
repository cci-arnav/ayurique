import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles, Instagram, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { SearchBar } from '@/components/SearchBar';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickView } from '@/components/QuickView';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Chatbot } from '@/components/Chatbot';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products, productImages, formatPrice, type Product, type Category } from '@/data/products';
import { SITE_CONFIG, promotion, coupons } from '@/data/config';
import {
  getCart, saveCart, clearCart, getCoupon, saveCoupon, clearCoupon,
  getWishlist, saveWishlist, addRecentlyViewed,
  type CartItem,
} from '@/lib/storage';

type FilterCategory = 'All' | Category;

function App() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist());
  const [appliedCoupon, setAppliedCoupon] = useState<string>(() => getCoupon());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { appliedCoupon ? saveCoupon(appliedCoupon) : clearCoupon(); }, [appliedCoupon]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    window.addEventListener('ayurique-open-cart', openCart);
    return () => window.removeEventListener('ayurique-open-cart', openCart);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const coupon = appliedCoupon ? coupons[appliedCoupon] : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.value) / 100) : 0;
  const total = subtotal - discount;

  const visibleProducts = useMemo(() => {
    return products.filter((p) => activeCategory === 'All' || p.category === activeCategory);
  }, [activeCategory]);

  const scrollTo = (id: string) => {
    setIsCartOpen(false);
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
    showToast(`${product.name} added to your bag`);
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
    setWishlist((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
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
    if (!newsletterEmail.includes('@')) { setNewsletterMessage('Please enter a valid email address.'); return; }
    setNewsletterMessage('Thank you. The circle is waiting for you.');
    setNewsletterEmail('');
  };

  return (
    <div className="app-root">
      <AnnouncementBar />
      <Navbar
        cartCount={cartCount}
        onNavigate={scrollTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        {/* HERO */}
        <section id="home" className="hero-section">
          <div className="hero-glow" />
          <div className="shell hero-grid">
            <div className="hero-copy reveal is-visible">
              <p className="eyebrow text-gold mb-6">Ancient Knowledge, Modern Science</p>
              <h1 className="hero-title">Rituals rooted in Ayurveda.<br /><em>Created for modern living.</em></h1>
              <p className="hero-sub">Thoughtfully crafted fragrances and personal care essentials inspired by traditional wisdom and refined for contemporary life.</p>
              <div className="hero-ctas">
                <button className="button button-dark" onClick={() => scrollTo('shop')}>Shop collection <ArrowRight size={15} /></button>
                <button className="button button-outline" onClick={() => scrollTo('story')}>Discover Ayurique</button>
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
                <div className="hero-frame-caption"><span>01 / 03</span><span>THE SIGNATURE RITUAL</span></div>
              </div>
              <div className="hero-stamp"><Sparkles size={16} /><span>Botanical<br />compositions</span></div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="shell section-story" id="story">
          <div className="story-grid">
            <div className="reveal">
              <p className="eyebrow text-gold">The Ayurique way</p>
              <span className="story-number">01</span>
            </div>
            <div className="max-w-3xl reveal">
              <h2 className="section-title">Ancient wisdom.<br /><em>Modern rituals.</em></h2>
              <p className="section-body">AYURIQUE brings together the timeless principles of Ayurveda with the precision and sensibility of modern formulation — creating everyday rituals that feel as beautiful as they are intentional.</p>
              <button className="link-button mt-8" onClick={() => scrollTo('philosophy')}>Read our philosophy <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="category-section">
          <div className="shell">
            <div className="section-head-row">
              <div>
                <p className="eyebrow text-gold">Begin your ritual</p>
                <h2 className="section-title mt-4">Find your everyday <em>essential.</em></h2>
              </div>
              <button className="link-button hidden md:flex" onClick={() => scrollTo('shop')}>View all products <ArrowRight size={16} /></button>
            </div>
            <div className="category-grid">
              <CategoryCard title="Perfumes" text="Signature fragrances for every mood." image={productImages.perfume} onClick={() => { setActiveCategory('Perfume'); scrollTo('shop'); }} />
              <CategoryCard title="Room fresheners" text="Transform the atmosphere around you." image={productImages.room} onClick={() => { setActiveCategory('Room Freshener'); scrollTo('shop'); }} />
              <CategoryCard title="Soaps" text="Everyday cleansing, thoughtfully reimagined." image={productImages.soap} onClick={() => { setActiveCategory('Soap'); scrollTo('shop'); }} />
            </div>
          </div>
        </section>

        {/* SHOP */}
        <section id="shop" className="shell section-shop">
          <div className="shop-head">
            <div>
              <p className="eyebrow text-gold">The collection</p>
              <h2 className="section-title mt-4">Small rituals, <em>beautifully made.</em></h2>
            </div>
            <div className="filter-row">
              {(['All', 'Perfume', 'Room Freshener', 'Soap'] as FilterCategory[]).map((cat) => (
                <button key={cat} className={`filter-button ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat === 'All' ? 'All' : cat === 'Room Freshener' ? 'Room fresheners' : `${cat}s`}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isWishlisted={wishlist.includes(product.id)}
                onAdd={() => addToCart(product, 1, false)}
                onQuickView={() => openQuickView(product)}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
          {visibleProducts.length === 0 && <p className="shop-empty">No rituals match your selection yet.</p>}
        </section>

        {/* PHILOSOPHY */}
        <section id="philosophy" className="philosophy-section">
          <div className="shell philosophy-grid">
            <div className="philosophy-image reveal">
              <img src={productImages.ritual} alt="Botanical shadows in warm afternoon light" />
              <div className="image-label">ROOTED IN TRADITION<br /><span>REFINED FOR TODAY</span></div>
            </div>
            <div className="max-w-xl reveal philosophy-copy">
              <p className="eyebrow text-gold">Ayurveda & science</p>
              <h2 className="section-title mt-5">Rooted in tradition.<br /><em>Refined for today.</em></h2>
              <p className="section-body">We look to the quiet intelligence of traditional rituals, then bring a modern eye to how they are experienced. The result is a collection made for pause, presence and the pleasure of a well-made everyday.</p>
              <div className="philosophy-points">
                <div><span className="philosophy-point-num">01</span><p>Intentional ingredients</p></div>
                <div><span className="philosophy-point-num">02</span><p>Sensory daily rituals</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* RITUAL */}
        <section className="shell section-ritual">
          <div className="section-head-row">
            <div>
              <p className="eyebrow text-gold">Moments of pause</p>
              <h2 className="section-title mt-4">Your everyday ritual, <em>elevated.</em></h2>
            </div>
            <span className="hidden text-6xl font-serif text-sage/20 md:block">02</span>
          </div>
          <div className="ritual-grid">
            <RitualStep time="Morning" title="Clear the air" text="A fresh botanical room mist to open the day with intention." product="Sacred Basil" />
            <RitualStep time="Afternoon" title="Wear your mood" text="A personal fragrance that becomes part of your quiet signature." product="Sandalwood & Oud" />
            <RitualStep time="Evening" title="Come back to yourself" text="A warm cleanse to close the day feeling restored and present." product="Rose Clay Bar" />
          </div>
        </section>

        {/* JOURNAL */}
        <section id="journal" className="journal-section">
          <div className="shell journal-grid">
            <div className="reveal">
              <p className="eyebrow text-gold">From the journal</p>
              <h2 className="section-title mt-4">A slower way to <em>feel good.</em></h2>
              <p className="section-body max-w-lg">Notes on scent, stillness and the small choices that make an ordinary day feel considered.</p>
              <button className="button button-outline mt-8">Explore the journal <ArrowRight size={15} /></button>
            </div>
            <div className="journal-card reveal">
              <div className="journal-card-head"><span>Field note no. 01</span><span>01—06</span></div>
              <h3 className="journal-card-title">The quiet luxury<br />of an evening ritual.</h3>
              <p className="journal-card-text">A few considered minutes can change the texture of an entire day.</p>
              <span className="journal-card-arrow"><ArrowRight size={16} /></span>
            </div>
          </div>
        </section>

        {/* INSTAGRAM */}
        <section className="shell section-instagram">
          <div className="instagram-head">
            <p className="eyebrow text-gold">Follow the Ayurique ritual</p>
            <h2 className="section-title mt-4">@the.ayurique</h2>
          </div>
          <div className="instagram-grid">
            {productImages.instagram.map((img) => (
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" key={img} className="instagram-tile">
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
              <p className="eyebrow text-gold">A little something beautiful</p>
              <h2 className="section-title mt-4">Join the Ayurique <em>circle.</em></h2>
              <p className="newsletter-sub">Be the first to discover new rituals, limited editions and seasonal offers.</p>
            </div>
            <form onSubmit={submitNewsletter} className="newsletter-form">
              <label className="sr-only" htmlFor="newsletter">Email address</label>
              <div className="newsletter-input-row">
                <input id="newsletter" type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Your email address" className="newsletter-input" />
                <button type="submit" className="newsletter-submit">Join <ArrowRight size={15} /></button>
              </div>
              {newsletterMessage && <p className="newsletter-msg">{newsletterMessage}</p>}
            </form>
          </div>
        </section>
      </main>

      <Footer onNavigate={scrollTo} onCategorySelect={(cat) => setActiveCategory(cat)} />

      {/* Overlays */}
      <SearchBar
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => openQuickView(p)}
        onSearchSubmit={(term) => {
          const q = term.toLowerCase();
          const match = products.find((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
          if (match) { setActiveCategory(match.category); }
          scrollTo('shop');
        }}
      />
      <CartDrawer
        open={isCartOpen}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onApplyCoupon={applyCoupon}
        onRemoveCoupon={removeCoupon}
        onCheckout={() => { setIsCartOpen(false); setCheckoutOpen(true); }}
        onContinueShopping={() => { setIsCartOpen(false); scrollTo('shop'); }}
      />
      <QuickView
        product={quickView}
        isWishlisted={quickView ? wishlist.includes(quickView.id) : false}
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
        onClose={() => setCheckoutOpen(false)}
        onClearCart={clearCart}
      />
      <Chatbot onProductClick={(p) => openQuickView(p)} />

      {/* Toast */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={16} /> <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ title, text, image, onClick }: { title: string; text: string; image: string; onClick: () => void }) {
  return (
    <button className="category-card" onClick={onClick} aria-label={`Explore ${title}`}>
      <img src={image} alt={`${title} collection`} loading="lazy" />
      <div className="category-overlay" />
      <div className="category-content">
        <p className="eyebrow text-white/70">Collection</p>
        <h3 className="category-title">{title}</h3>
        <p className="category-text">{text}</p>
        <span className="category-explore">Explore <ArrowRight size={15} /></span>
      </div>
    </button>
  );
}

function RitualStep({ time, title, text, product }: { time: string; title: string; text: string; product: string }) {
  return (
    <div className="ritual-step reveal">
      <div className="ritual-step-head">
        <span className="eyebrow text-gold">{time}</span>
        <Sparkles size={22} className="text-gold/60" />
      </div>
      <h3 className="ritual-step-title">{title}</h3>
      <p className="ritual-step-text">{text}</p>
      <span className="ritual-step-product">With {product}</span>
    </div>
  );
}

export default App;

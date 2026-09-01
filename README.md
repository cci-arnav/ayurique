# Ayurique

A modern e-commerce website for Ayurique, featuring premium Ayurvedic fragrances, soaps, and wellness essentials. The platform combines ancient Ayurvedic knowledge with contemporary design and technology.

## About Ayurique

Ayurique offers a curated collection of natural, Ayurveda-inspired personal care and home fragrance products. The brand focuses on intentional ingredients, sensory rituals, and the harmonious balance of traditional wisdom with modern science.

- **Brand Tagline**: Ancient Knowledge, Modern Science
- **Contact**: +91 96505 60277 | globalexpressgroup@gmail.com
- **Location**: Global Express Group, New Delhi, 110001, India

## Product Inventory

The website features **15 premium products** across 4 categories:

### Air Fresheners (5 products)
- Aqua Bliss Air Freshener
- Black Opium Air Freshener
- Golden Dust Air Freshener
- Lemongrass Air Freshener
- Rose Elegance Air Freshener

### Soaps (6 products)
- Aloe Vera Soap
- Black Opium Soap
- Lalchandan Soap
- Lemongrass Soap
- Neem Soap
- Rose Soap

### Attars (2 products)
- Black Opium Attar
- White Oud Attar

### Combo Offers (2 products)
- Black Opium Signature Combo
- Rose Elegance Signature Combo

## Website Features

- **Product Catalog**: Browse and filter products by category
- **Product Details**: View detailed information, images, and descriptions
- **Shopping Cart**: Add/remove items, apply coupons, and proceed to checkout
- **Wishlist**: Save favorite products for later
- **Quick View**: Preview product details without leaving the collection page
- **Hero Carousel**: Rotating banner with product imagery
- **Multi-Language Support**: Support for 14 languages (English, Hindi, Spanish, German, French, Italian, Portuguese, Japanese, Korean, Chinese, Arabic, Russian, Dutch, Turkish)
- **Light/Dark Theme**: Toggle between light and dark modes
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile devices
- **Newsletter Signup**: Join the Ayurique circle for updates and offers
- **Search**: Find products by name, category, or tags
- **Rituals Section**: Guided daily ritual suggestions with product recommendations

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Backend**: Supabase (for potential future features)
- **State Management**: React Hooks & Context
- **Internationalization**: Custom i18n system supporting 14 languages with RTL support

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AnnouncementBar.tsx
│   ├── CartDrawer.tsx
│   ├── Chatbot.tsx
│   ├── CheckoutModal.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── QuickView.tsx
│   ├── SearchBar.tsx
│   └── WishlistDrawer.tsx
├── data/                # Configuration and data
│   ├── chatbot.ts       # Chatbot responses
│   ├── config.ts        # Site configuration
│   ├── i18n.ts         # Translations for 14 languages
│   └── products.ts      # Product catalog with images
├── lib/                 # Utility functions
│   └── storage.ts       # localStorage management
├── App.tsx              # Main application component
├── index.css            # Global styles and component styling
├── main.tsx             # Entry point
└── vite-env.d.ts        # Vite type definitions

public/assets/
├── logo/
│   └── Ayurique.png
└── Products-img/
    ├── Air Freshners/           # 5 products + hover images + collection image
    ├── Soaps/                    # 6 products + hover images
    ├── Attar/                    # 2 products + hover images
    ├── Combo Offer/              # 2 products (no hover images)
    └── AllTogether/              # Air Fresheners collection image
```

## Product Data Architecture

Each product in the catalog follows this structure:

```typescript
{
  id: string;              // Unique identifier (e.g., 'aqua-bliss')
  name: string;            // Product name
  category: Category;      // 'Air Freshener' | 'Soap' | 'Attar' | 'Combo Offer'
  price?: number;          // Price in ₹ (optional - combos may use "Contact for pricing")
  compareAtPrice?: number; // Original price for discount display
  description: string;     // Short product description
  images: string[];        // Array of images [primary, hover]
  available: boolean;      // Availability status
  tags: string[];         // Search and filter tags
  lifestyleImage?: string; // Optional lifestyle/context image
  badge?: string;         // Optional badge (e.g., 'New ritual', 'Bestseller')
  note?: string;          // Optional product notes/ingredients
  use?: string;           // Optional usage instructions
}
```

All product images are stored in `/public/assets/Products-img/` and use public URL paths like:
- `/assets/Products-img/Air%20Freshners/Aqua%20Bliss%20Air%20Freshener.jpg`
- `/assets/Products-img/Soaps/Ayurique-roseSoap.jpg`

Hover images follow the same path with `-hover` suffix in the filename.

## Theme System

### Light Theme
- Clean, minimal aesthetic
- Cream/sand backgrounds
- Forest green and gold accents
- High contrast text

### Dark Theme
- Forest green background
- Light cream/gold text
- Warm, moody ambiance
- Preserved readability

Theme preference is persisted in `localStorage` with key `ayurique-theme`.

## Internationalization (i18n)

The website supports 14 languages with full UI translations:
- English (en) - LTR
- Hindi (hi) - LTR
- Spanish (es) - LTR
- German (de) - LTR
- French (fr) - LTR
- Italian (it) - LTR
- Portuguese (pt) - LTR
- Japanese (ja) - LTR
- Korean (ko) - LTR
- Chinese (zh) - LTR
- Arabic (ar) - RTL
- Russian (ru) - LTR
- Dutch (nl) - LTR
- Turkish (tr) - LTR

All translations are centralized in `src/data/i18n.ts`. Language selection is persisted in `localStorage` with key `ayurique-language`.

## Wishlist System

Products can be saved to a wishlist for later purchase:
- **Storage**: Persists in `localStorage` with key `ayurique-wishlist`
- **Identification**: Products are identified by unique `id` (not just images)
- **Features**:
  - Add/remove from wishlist with heart icon
  - View all wishlisted products in Wishlist drawer
  - Add to cart directly from wishlist
  - Wishlist count displayed in navigation bar
  - Persists across page refreshes and browser sessions

## Collection Filtering

Products can be filtered by category:
- **All** - Display all 15 products
- **Air Fresheners** - Display 5 products
- **Soaps** - Display 6 products
- **Attars** - Display 2 products
- **Combo Offers** - Display 2 products

Filter state is maintained in React state and UI updates dynamically.

## Product Hover Images

Product cards display a primary image by default. On desktop hover, they transition to a secondary hover image with a smooth animation:
- Uses CSS opacity and transform transitions
- Hover image path: `{filename}-hover.{extension}`
- Gracefully falls back to primary image if hover image is unavailable
- Mobile/touch devices: Primary image only (no hover state)

## Hero Carousel

The hero section features an auto-rotating carousel of Ayurique product images:
- **Slides**: 3 hero images showing different products
- **Auto-play**: Rotates every 4 seconds
- **Controls**: Previous/Next buttons and dot indicators
- **Responsive**: Adapts aspect ratio for mobile and desktop
- **Slide Counter**: Displays "01 / 03" style counter
- **Image Selection**: Uses actual Ayurique product photography

## Newsletter / "Join the Ayurique Circle"

Email subscription feature with client-side validation:
- **Validation**: Requires valid email format (contains '@')
- **Message on Success**: Shows "Thank you. The circle is waiting for you."
- **No fake backend**: Does not pretend to send or store emails
- **Future Configuration**: Email destination placeholder in `SITE_CONFIG.newsletter.destination`

When implemented, replace the empty `destination` value in `src/data/config.ts` with:
- An email address for mailto link: `mailto:newsletter@ayurique.com`
- An API endpoint: `/api/newsletter/subscribe`
- A Google Forms URL for form submission

## Footer Configuration

The footer displays contact information and navigation links:
- **Phone**: From `SITE_CONFIG.contact.phone`
- **Email**: From `SITE_CONFIG.contact.email` (clickable)
- **Address**: From `SITE_CONFIG.contact.address` (with map icon)
- **Social Links**: Instagram, WhatsApp, Email, Phone

### Placeholder Footer Links

The following footer links require configuration in `src/data/config.ts`:
- **Shipping**: `SITE_CONFIG.footerLinks.shipping` → Currently empty
- **Returns**: `SITE_CONFIG.footerLinks.returns` → Currently empty
- **Privacy Policy**: `SITE_CONFIG.footerLinks.privacyPolicy` → Currently empty
- **Terms**: `SITE_CONFIG.footerLinks.terms` → Currently empty

When these are configured, they will open as links. Until then, clicking them does nothing.

## Development Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ayurique

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev

# Server runs at http://localhost:5173
# Hot module replacement (HMR) enabled for instant updates
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Output: dist/ directory
# Minified and optimized for deployment
```

### Type Checking

```bash
# Check TypeScript types without compiling
npm run typecheck
```

### Linting

```bash
# Run ESLint on all source files
npm run lint
```

### Preview Production Build

```bash
# Build and serve production build locally
npm run build
npm run preview

# Serves at http://localhost:4173
```

## Configuration

### Site Configuration

Edit `src/data/config.ts` to update:

```typescript
SITE_CONFIG = {
  brand: 'AYURIQUE',
  tagline: 'Ancient Knowledge, Modern Science',
  instagramUrl: 'https://www.instagram.com/the.ayurique/',
  whatsappUrl: 'https://wa.me/910000000000',
  orderFormUrl: 'https://docs.google.com/forms/...',
  contact: {
    email: 'globalexpressgroup@gmail.com',
    phone: '+91 96505 60277',
    address: 'Global Express Group, New Delhi, 110001, India',
  },
  newsletter: {
    destination: '', // TODO: Configure newsletter endpoint
  },
  footerLinks: {
    shipping: '', // TODO: Configure shipping page URL
    returns: '', // TODO: Configure returns page URL
    privacyPolicy: '', // TODO: Configure privacy policy URL
    terms: '', // TODO: Configure terms page URL
  },
  freeShippingThreshold: 999,
};
```

### Promotional Campaigns

Edit promotion settings in `src/data/config.ts`:

```typescript
promotion = {
  active: true,
  title: 'Festive Ritual Sale',
  discountText: 'Up to 20% off — use code FESTIVE20',
  couponCode: 'FESTIVE20',
};
```

### Coupons

Edit coupon codes in `src/data/config.ts`:

```typescript
coupons = {
  AYU10: { value: 10, minimumOrder: 499 },
  WELCOME15: { value: 15, minimumOrder: 799 },
  FESTIVE20: { value: 20, minimumOrder: 999 },
};
```

## Styling

All styling uses Tailwind CSS classes combined with custom CSS in `src/index.css`.

### CSS Variables (Theming)
- `--forest`: Dark green color (#1C2117)
- `--gold`: Primary accent (#B89A5A)
- `--gold-soft`: Softer gold (#C9B580)
- `--sand`: Light background (#F8F6F0)
- `--sage`: Muted neutral (#4A4A4A)
- `--line`: Border color (theme-aware)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Using Tailwind's `sm:`, `md:`, `lg:` prefixes.

## Deployment

### Build Output
- Optimized for all modern browsers
- Static site generation (no server required)
- Can be deployed to any static hosting:
  - Vercel
  - Netlify
  - GitHub Pages
  - AWS S3 + CloudFront

### Environment Variables

No environment variables required for basic functionality. Optional for future:
- Analytics tracking
- API keys for email service
- Payment gateway credentials

## Future Enhancements

### To Implement

1. **Newsletter Email Destination**
   - Update `SITE_CONFIG.newsletter.destination` in `src/data/config.ts`
   - Implement email service integration (Mailchimp, SendGrid, etc.)
   - Or configure Google Forms endpoint for form-based submission

2. **Footer Link Destinations**
   - Update `SITE_CONFIG.footerLinks.*` in `src/data/config.ts`
   - Create pages for Shipping, Returns, Privacy Policy, Terms
   - Or link to external documentation

3. **Product Pricing**
   - Update individual product `price` values in `src/data/products.ts`
   - Some combo offers currently show "Contact for pricing"

4. **Order Management**
   - Connect to Supabase or backend API
   - Implement order tracking
   - Email confirmation integration

5. **Blog/Journal**
   - Implement article management
   - Create blog page and routing

6. **Reviews & Ratings**
   - Product review functionality
   - Star ratings and user testimonials

## Troubleshooting

### Images Not Loading
- Check image paths use correct URL encoding: `/assets/Products-img/Air%20Freshners/...`
- Verify files exist in `public/assets/Products-img/`
- Check browser console for 404 errors
- Ensure URLs start with `/` (absolute path from public folder)

### Hero Carousel Issues
- Clear browser cache
- Check that `productImages.ritualStepImages` has 3 images
- Verify image URLs are correct
- Check browser console for errors

### Theme Not Persisting
- Check that localStorage is enabled
- Look for `ayurique-theme` key in browser DevTools
- Try clearing localStorage and reloading

### Language Not Persisting
- Check that localStorage is enabled
- Look for `ayurique-language` key in browser DevTools
- Verify language code is in `SUPPORTED_LANGUAGES`

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## License

Proprietary - All rights reserved to Ayurique

## Support

For issues, questions, or feature requests:
- **Email**: globalexpressgroup@gmail.com
- **Phone**: +91 96505 60277
- **Location**: 13, Institutional Area, Lodhi Road, New Delhi 110 003

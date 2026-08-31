import { useState } from 'react';
import { Instagram, Mail, Phone, ChevronDown, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/data/config';

type FooterProps = {
  onNavigate: (id: string) => void;
  onCategorySelect: (category: 'Perfume' | 'Room Freshener' | 'Soap') => void;
};

type Column = { title: string; links: { label: string; action: () => void }[] };

export function Footer({ onNavigate, onCategorySelect }: FooterProps) {
  const [openCol, setOpenCol] = useState<string | null>(null);

  const columns: Column[] = [
    {
      title: 'Shop',
      links: [
        { label: 'Perfumes', action: () => { onCategorySelect('Perfume'); onNavigate('shop'); } },
        { label: 'Room Fresheners', action: () => { onCategorySelect('Room Freshener'); onNavigate('shop'); } },
        { label: 'Soaps', action: () => { onCategorySelect('Soap'); onNavigate('shop'); } },
        { label: 'All Products', action: () => { onNavigate('shop'); } },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About Ayurique', action: () => onNavigate('story') },
        { label: 'Our Philosophy', action: () => onNavigate('philosophy') },
        { label: 'Ayurvedic Inspiration', action: () => onNavigate('philosophy') },
        { label: 'Contact Us', action: () => onNavigate('footer') },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Cart', action: () => window.dispatchEvent(new CustomEvent('ayurique-open-cart')) },
        { label: 'Offers', action: () => onNavigate('shop') },
        { label: 'Shipping', action: () => onNavigate('footer') },
        { label: 'Returns', action: () => onNavigate('footer') },
        { label: 'Privacy Policy', action: () => onNavigate('footer') },
        { label: 'Terms', action: () => onNavigate('footer') },
      ],
    },
  ];

  return (
    <footer className="footer-section" id="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-name footer-brand-name">AYURIQUE</div>
            <p className="footer-tagline">Ancient Knowledge,<br /><em>Modern Science.</em></p>
            <div className="footer-socials">
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-link">
                <Instagram size={17} />
              </a>
              <a href={SITE_CONFIG.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="footer-social-link">
                <MessageCircle size={17} />
              </a>
              <a href={`mailto:${SITE_CONFIG.contact.email}`} aria-label="Email" className="footer-social-link">
                <Mail size={17} />
              </a>
              <a href={`tel:${SITE_CONFIG.contact.phone}`} aria-label="Phone" className="footer-social-link">
                <Phone size={16} />
              </a>
            </div>
          </div>

          <div className="footer-columns">
            {columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <button
                  className="footer-col-head"
                  onClick={() => setOpenCol(openCol === col.title ? null : col.title)}
                  aria-expanded={openCol === col.title}
                >
                  <span className="eyebrow text-gold">{col.title}</span>
                  <ChevronDown size={16} className={`footer-chevron ${openCol === col.title ? 'is-open' : ''}`} />
                </button>
                <div className={`footer-col-links ${openCol === col.title ? 'is-open' : ''}`}>
                  {col.links.map((link) => (
                    <button key={link.label} onClick={link.action} className="footer-link">{link.label}</button>
                  ))}
                </div>
              </div>
            ))}

            <div className="footer-col footer-contact">
              <p className="eyebrow text-gold">Contact</p>
              <p className="footer-contact-info">
                {SITE_CONFIG.contact.email}<br />{SITE_CONFIG.contact.phone}
              </p>
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" className="footer-link footer-insta">
                <Instagram size={14} /> @the.ayurique
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Ayurique. All rights reserved.</p>
          <p className="footer-payments">Orders via secure Google Form · No online payment</p>
        </div>
      </div>
    </footer>
  );
}

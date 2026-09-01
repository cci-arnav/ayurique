import { useState } from 'react';
import { Instagram, Mail, Phone, ChevronDown, MessageCircle, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/data/config';
import type { TranslationDict } from '@/data/i18n';
import type { Category } from '@/data/products';

type FooterProps = {
  t: TranslationDict;
  onNavigate: (id: string) => void;
  onCategorySelect: (category: Category) => void;
};

type Column = { title: string; links: { label: string; action: () => void }[] };

export function Footer({ t, onNavigate, onCategorySelect }: FooterProps) {
  const [openCol, setOpenCol] = useState<string | null>(null);

  const columns: Column[] = [
    {
      title: t.footer.shop,
      links: [
        { label: t.footer.perfumes, action: () => { onCategorySelect('Air Freshener'); onNavigate('shop'); } },
        { label: t.footer.roomFresheners, action: () => { onCategorySelect('Soap'); onNavigate('shop'); } },
        { label: t.footer.soaps, action: () => { onCategorySelect('Attar'); onNavigate('shop'); } },
        { label: t.footer.allProducts, action: () => { onNavigate('shop'); } },
      ],
    },
    {
      title: t.footer.about,
      links: [
        { label: t.footer.aboutAyurique, action: () => onNavigate('story') },
        { label: t.footer.ourPhilosophy, action: () => onNavigate('philosophy') },
        { label: t.footer.ayurvedicInspiration, action: () => onNavigate('philosophy') },
        { label: t.footer.contactUs, action: () => onNavigate('footer') },
      ],
    },
    {
      title: t.footer.quickLinks,
      links: [
        { label: t.footer.cart, action: () => window.dispatchEvent(new CustomEvent('ayurique-open-cart')) },
        { label: t.footer.offers, action: () => onNavigate('shop') },
        { label: t.footer.shipping, action: () => SITE_CONFIG.footerLinks.shipping ? window.open(SITE_CONFIG.footerLinks.shipping) : null },
        { label: t.footer.returns, action: () => SITE_CONFIG.footerLinks.returns ? window.open(SITE_CONFIG.footerLinks.returns) : null },
        { label: t.footer.privacyPolicy, action: () => SITE_CONFIG.footerLinks.privacyPolicy ? window.open(SITE_CONFIG.footerLinks.privacyPolicy) : null },
        { label: t.footer.terms, action: () => SITE_CONFIG.footerLinks.terms ? window.open(SITE_CONFIG.footerLinks.terms) : null },
      ],
    },
  ];

  return (
    <footer className="footer-section" id="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-name footer-brand-name">AYURIQUE</div>
            <p className="footer-tagline">{t.footer.taglinePart1}<br /><em>{t.footer.taglinePart2}</em></p>
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
              <p className="eyebrow text-gold">{t.footer.contact}</p>
              <div className="footer-contact-info">
                <div>{SITE_CONFIG.contact.email}</div>
                <div className="mt-1">{SITE_CONFIG.contact.phone}</div>
                {SITE_CONFIG.contact.address && (
                  <div className="footer-address flex items-start gap-1.5 mt-2">
                    <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                    <span>{SITE_CONFIG.contact.address}</span>
                  </div>
                )}
              </div>
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" className="footer-link footer-insta">
                <Instagram size={14} /> @the.ayurique
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.allRightsReserved}</p>
          <p className="footer-payments">{t.footer.ordersViaForm}</p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import '../legacy/theme.css';
import LegacyNav from '../legacy/nav';
import { getSiteSettings } from '@/lib/site-settings';

const RTL_LANGS = new Set(['ar', 'fa']);

const NAV_LABELS = {
  en: { projects: 'Projects', services: 'Services', citizenship: 'Citizenship', about: 'About', contact: 'Contact', cta: 'Book Consultation' },
  ar: { projects: 'المشاريع', services: 'الخدمات', citizenship: 'الجنسية', about: 'من نحن', contact: 'تواصل', cta: 'احجز استشارة' },
  zh: { projects: '项目', services: '服务', citizenship: '护照项目', about: '关于', contact: '联系', cta: '预约咨询' },
  ru: { projects: 'Проекты', services: 'Услуги', citizenship: 'Гражданство', about: 'О нас', contact: 'Контакт', cta: 'Консультация' },
  fa: { projects: 'پروژه\u200cها', services: 'خدمات', citizenship: 'شهروندی', about: 'درباره', contact: 'تماس', cta: 'مشاوره' },
  fr: { projects: 'Projets', services: 'Services', citizenship: 'Citoyenneté', about: 'À propos', contact: 'Contact', cta: 'Consultation' },
};

// Legacy Editorial shell — Cormorant Garamond + cream ground. Owns nav and
// the dark footer so page components only render sections.
export default async function LegacyShellOuter({ lang = 'en', children }) {
  const settings = await getSiteSettings();
  const isRtl = RTL_LANGS.has(lang);
  const labels = NAV_LABELS[lang] || NAV_LABELS.en;

  return (
    <div className="legacy" dir={isRtl ? 'rtl' : 'ltr'}>
      <LegacyNav
        lang={lang}
        labels={labels}
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
      />
      <main>{children}</main>

      <footer className="foot">
        <div className="container">
          <div className="foot-top">
            <div className="foot-brand">
              <span className="logo-group">
                <span className="logo-mark">G</span>
                <span>
                  <span className="logo-text">Gate International</span>
                  <span className="logo-sub" style={{ display: 'block' }}>EST. 2009</span>
                </span>
              </span>
              <p>A boutique advisory for premium Turkish residences. Istanbul, Bodrum and Bursa — sourced privately, underwritten carefully.</p>
            </div>
            <FootCol heading="Properties">
              <FootLink href={`/${lang}/projects?district=Beşiktaş`}>Istanbul</FootLink>
              <FootLink href={`/${lang}/districts/bodrum`}>Bodrum</FootLink>
              <FootLink href={`/${lang}/districts/bursa`}>Bursa</FootLink>
              <FootLink href={`/${lang}/projects`}>All Properties</FootLink>
            </FootCol>
            <FootCol heading="Services">
              <FootLink href={`/${lang}/citizenship`}>Citizenship</FootLink>
              <FootLink href={`/${lang}/about`}>Legal</FootLink>
              <FootLink href={`/${lang}/about`}>After-Sale</FootLink>
              <FootLink href={`/${lang}/about`}>Concierge</FootLink>
            </FootCol>
            <FootCol heading="Company">
              <FootLink href={`/${lang}/about`}>About</FootLink>
              <FootLink href={`/${lang}/about`}>Team</FootLink>
              <FootLink href={`/${lang}/about`}>Blog</FootLink>
              <FootLink href={`/${lang}/contact`}>Contact</FootLink>
            </FootCol>
            <FootCol heading="Connect">
              <FootLink href="https://instagram.com" external>Instagram</FootLink>
              <FootLink href="https://wa.me/" external>WhatsApp</FootLink>
              <FootLink href="https://linkedin.com" external>LinkedIn</FootLink>
              <FootLink href="https://youtube.com" external>YouTube</FootLink>
            </FootCol>
          </div>
          <div className="foot-bot">
            <span>© 2026 Gate International</span>
            <span>Privacy · Terms · Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FootCol({ heading, children }) {
  return (
    <div className="foot-col">
      <h4>{heading}</h4>
      <ul>{children}</ul>
    </div>
  );
}

function FootLink({ href, external, children }) {
  if (external) {
    return <li><a href={href} target="_blank" rel="noopener noreferrer">{children}</a></li>;
  }
  return <li><Link href={href}>{children}</Link></li>;
}

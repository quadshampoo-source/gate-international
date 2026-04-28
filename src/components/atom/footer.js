import Link from 'next/link';
import { getDict } from '@/lib/i18n';

export default function AtomFooter({ lang = 'en' }) {
  const t = getDict(lang).pages.footer;
  return (
    <footer style={{ background: 'var(--neutral-900)', color: '#fff' }}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 md:gap-12 pb-12 md:pb-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="inline-grid place-items-center font-bold"
                style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: 'var(--gradient-cta)',
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                G
              </span>
              <span className="font-semibold text-lg">Gate International</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.65, maxWidth: 320 }}>
              {t.tagline}
            </p>
          </div>

          <FooterCol heading={t.columns.properties.heading}>
            <FooterLink href={`/${lang}/projects?district=Beşiktaş`}>{t.columns.properties.istanbul}</FooterLink>
            <FooterLink href={`/${lang}/districts/bodrum`}>{t.columns.properties.bodrum}</FooterLink>
            <FooterLink href={`/${lang}/districts/bursa`}>{t.columns.properties.bursa}</FooterLink>
            <FooterLink href={`/${lang}/projects`}>{t.columns.properties.all}</FooterLink>
          </FooterCol>

          <FooterCol heading={t.columns.services.heading}>
            <FooterLink href={`/${lang}/citizenship`}>{t.columns.services.citizenship}</FooterLink>
            <FooterLink href={`/${lang}/services`}>{t.columns.services.legal}</FooterLink>
            <FooterLink href={`/${lang}/services`}>{t.columns.services.afterSale}</FooterLink>
            <FooterLink href={`/${lang}/calculator`}>{t.columns.services.roi}</FooterLink>
          </FooterCol>

          <FooterCol heading={t.columns.company.heading}>
            <FooterLink href={`/${lang}/about`}>{t.columns.company.about}</FooterLink>
            <FooterLink href={`/${lang}/why-us`}>{t.columns.company.why}</FooterLink>
            <FooterLink href={`/${lang}/compare`}>{t.columns.company.compare}</FooterLink>
            <FooterLink href={`/${lang}/contact`}>{t.columns.company.contact}</FooterLink>
          </FooterCol>

          <FooterCol heading={t.columns.connect.heading}>
            <FooterLink href="https://instagram.com" external>Instagram</FooterLink>
            <FooterLink href="https://wa.me/" external>WhatsApp</FooterLink>
            <FooterLink href="https://linkedin.com" external>LinkedIn</FooterLink>
            <FooterLink href="https://youtube.com" external>YouTube</FooterLink>
          </FooterCol>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
          <span>{t.copyright}</span>
          <span>{t.legal.privacy} · {t.legal.terms} · {t.legal.cookies}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ heading, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h4
        className="uppercase"
        style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, marginBottom: 8 }}
      >
        {heading}
      </h4>
      {children}
    </div>
  );
}

function FooterLink({ href, external, children }) {
  const cls = 'transition-colors hover:opacity-100';
  const style = { color: 'rgba(255,255,255,0.8)', fontSize: 14 };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  );
}

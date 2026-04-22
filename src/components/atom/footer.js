import Link from 'next/link';

export default function AtomFooter({ lang = 'en' }) {
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
              A boutique advisory for premium Turkish residences. Istanbul, Bodrum, and Bursa — sourced privately, underwritten with care.
            </p>
          </div>

          <FooterCol heading="Properties">
            <FooterLink href={`/${lang}/projects?district=Beşiktaş`}>Istanbul</FooterLink>
            <FooterLink href={`/${lang}/districts/bodrum`}>Bodrum</FooterLink>
            <FooterLink href={`/${lang}/districts/bursa`}>Bursa</FooterLink>
            <FooterLink href={`/${lang}/projects`}>All properties</FooterLink>
          </FooterCol>

          <FooterCol heading="Services">
            <FooterLink href={`/${lang}/citizenship`}>Citizenship</FooterLink>
            <FooterLink href={`/${lang}/services`}>Legal & title</FooterLink>
            <FooterLink href={`/${lang}/services`}>After-sale</FooterLink>
            <FooterLink href={`/${lang}/calculator`}>ROI calculator</FooterLink>
          </FooterCol>

          <FooterCol heading="Company">
            <FooterLink href={`/${lang}/about`}>About</FooterLink>
            <FooterLink href={`/${lang}/why-us`}>Why us</FooterLink>
            <FooterLink href={`/${lang}/compare`}>Compare</FooterLink>
            <FooterLink href={`/${lang}/contact`}>Contact</FooterLink>
          </FooterCol>

          <FooterCol heading="Connect">
            <FooterLink href="https://instagram.com" external>Instagram</FooterLink>
            <FooterLink href="https://wa.me/" external>WhatsApp</FooterLink>
            <FooterLink href="https://linkedin.com" external>LinkedIn</FooterLink>
            <FooterLink href="https://youtube.com" external>YouTube</FooterLink>
          </FooterCol>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
          <span>© 2026 Gate International</span>
          <span>Privacy · Terms · Cookies</span>
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

import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { districtLabel } from '@/lib/districts';

export default function Footer({ lang }) {
  const dict = getDict(lang);
  return (
    <footer className="bg-bg-sunken border-t border-line pt-20 pb-8">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-15 mb-15">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-2xl mb-3 block tracking-[0.04em]">{dict.brand}</span>
            <p className="text-fg-muted text-[13px] max-w-[280px]">
              {dict.tagline}. Maslak 1453, Istanbul.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-gold mb-5 font-normal">
              {dict.nav.projects}
            </h4>
            <ul className="list-none space-y-1.5">
              {['Sariyer', 'Beşiktaş', 'Beyoğlu', 'Şişli', 'Üsküdar'].map((d) => (
                <li key={d}>
                  <Link
                    href={`/${lang}/projects?district=${encodeURIComponent(d)}`}
                    className="text-fg-muted text-[13px] hover:text-fg transition-colors"
                  >
                    {districtLabel(d, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-gold mb-5 font-normal">
              {dict.nav.about}
            </h4>
            <ul className="list-none space-y-1.5">
              <li><Link href={`/${lang}/about`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">{dict.footer.theFirm}</Link></li>
              <li><Link href={`/${lang}/about`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">{dict.footer.teamLink}</Link></li>
              <li><Link href={`/${lang}/about`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">{dict.footer.licensesLink}</Link></li>
              <li><Link href={`/${lang}/finder`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">{dict.nav.finder}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-gold mb-5 font-normal">
              {dict.footer.contactCol}
            </h4>
            <ul className="list-none space-y-1.5">
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">WhatsApp</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">WeChat</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">Email</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">+90 212 000 1453</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-line flex flex-wrap justify-between gap-4 font-mono text-[11px] text-fg-dim tracking-[0.08em]">
          <span>{dict.footer.rights}</span>
          <span>{dict.footer.cities}</span>
        </div>
      </div>
    </footer>
  );
}

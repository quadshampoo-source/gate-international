import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { districtLabel } from '@/lib/districts';

export default function Footer({ lang, theme }) {
  const dict = getDict(lang);
  if (theme === 'editorial') {
    return (
      <footer className="py-16 md:py-20 text-center" style={{ borderTop: '1px solid #E0EBF0', background: '#FFFFFF', color: '#051A24' }}>
        <div className="container-x">
          <div className="font-editorial text-[26px] text-[#051A24] mb-3">
            Gate <span className="italic">International</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46] mb-6">
            {dict.footer.cities}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-[#273C46]">
            <Link href={`/${lang}/projects`} className="hover:text-[#051A24]">{dict.nav.projects}</Link>
            <Link href={`/${lang}/services`} className="hover:text-[#051A24]">{dict.nav.services}</Link>
            <Link href={`/${lang}/citizenship`} className="hover:text-[#051A24]">{dict.nav.citizenship}</Link>
            <Link href={`/${lang}/about`} className="hover:text-[#051A24]">{dict.nav.about}</Link>
            <Link href={`/${lang}/contact`} className="hover:text-[#051A24]">{dict.nav.contact}</Link>
          </div>
          <div className="font-mono text-[10px] tracking-[0.1em] mt-8" style={{ color: 'rgba(39,60,70,0.6)' }}>
            {dict.footer.rights}
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className="bg-bg-sunken border-t border-line pt-20 pb-8">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-15 mb-15">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-2xl mb-3 block tracking-[0.04em]">{dict.brand}</span>
            <p className="text-fg-muted text-[13px] max-w-[280px]">
              {dict.tagline}. Zorlu Residence, Beşiktaş, Istanbul.
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
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">Email</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-fg-muted text-[13px] hover:text-fg transition-colors">+90 535 520 6339</Link></li>
              <li><a href="https://instagram.com/gate.international" target="_blank" rel="noreferrer" className="text-fg-muted text-[13px] hover:text-fg transition-colors">Instagram</a></li>
              <li><a href="https://www.youtube.com/@gipturkey" target="_blank" rel="noreferrer" className="text-fg-muted text-[13px] hover:text-fg transition-colors">YouTube</a></li>
              <li><a href="https://www.linkedin.com/company/renovia-care/" target="_blank" rel="noreferrer" className="text-fg-muted text-[13px] hover:text-fg transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-line flex flex-wrap justify-between gap-4 font-mono text-[11px] text-fg-dim tracking-[0.08em]">
          <span>{dict.footer.rights}</span>
          <span className="text-gold">{dict.contact.renoviaBadge}</span>
          <span>{dict.footer.cities}</span>
        </div>
      </div>
    </footer>
  );
}

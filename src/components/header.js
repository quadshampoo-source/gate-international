'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDict } from '@/lib/i18n';
import ThemeToggle from '@/components/theme-toggle';
import LangDropdown from '@/components/lang-dropdown';

// Desktop nav (contact is promoted to a CTA button on the right)
const NAV = [
  { key: 'projects', path: 'projects' },
  { key: 'services', path: 'services' },
  { key: 'citizenship', path: 'citizenship' },
  { key: 'calculator', path: 'calculator' },
  { key: 'compare', path: 'compare' },
  { key: 'finder', path: 'finder' },
  { key: 'why', path: 'why-us' },
];

const MOBILE_NAV = [
  { key: 'home', path: '' },
  ...NAV,
  { key: 'about', path: 'about' },
  { key: 'contact', path: 'contact' },
];

export default function Header({ lang, theme }) {
  const dict = getDict(lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path) => {
    const root = `/${lang}`;
    if (path === '') return pathname === root || pathname === `${root}/`;
    return pathname === `${root}/${path}` || pathname.startsWith(`${root}/${path}/`);
  };

  if (theme === 'editorial') {
    return (
      <>
        <div className="fixed top-4 md:top-6 inset-x-0 z-[110] flex justify-center px-4 pointer-events-none">
          <nav
            className="pointer-events-auto flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'saturate(160%) blur(14px)',
              WebkitBackdropFilter: 'saturate(160%) blur(14px)',
              boxShadow: '0 10px 40px rgba(5,26,36,0.08), 0 1px 0 rgba(5,26,36,0.04)',
              border: '0.5px solid rgba(5,26,36,0.08)',
            }}
          >
            <Link
              href={`/${lang}`}
              className="font-editorial text-[16px] md:text-[17px] text-[#051A24] leading-none pr-2 md:pr-3 whitespace-nowrap"
            >
              Gate <span className="italic">International</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LangDropdown lang={lang} />
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="w-9 h-9 rounded-full flex flex-col items-center justify-center gap-[5px] bg-white/60 hover:bg-white/90 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span className={`w-4 h-px bg-[#051A24] transition-transform ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`w-4 h-px bg-[#051A24] transition-transform ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </button>
            </div>
          </nav>
        </div>
        <div
          className={`fixed inset-x-0 top-[88px] bottom-0 z-[100] px-8 py-10 flex flex-col overflow-y-auto transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)' }}
        >
          <Link
            href={`/${lang}/contact`}
            onClick={() => setMobileOpen(false)}
            className="self-start inline-flex items-center gap-3 h-12 px-6 mb-8 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
          >
            {dict.nav.contact}
            <span aria-hidden>→</span>
          </Link>
          {MOBILE_NAV.filter((l) => l.key !== 'contact').map((l) => (
            <Link
              key={l.key}
              href={`/${lang}${l.path ? `/${l.path}` : ''}`}
              onClick={() => setMobileOpen(false)}
              className="font-editorial text-[28px] py-3 text-[#051A24]"
              style={{ borderBottom: '1px solid #E0EBF0' }}
            >
              {dict.nav[l.key]}
            </Link>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <header className={`site-header${scrolled || pathname !== `/${lang}` ? ' scrolled' : ''}`}>
        <div className="container-x flex items-center justify-between gap-4 md:gap-6 py-[18px] md:py-[22px]">
          <Link href={`/${lang}`} className="flex items-baseline gap-2.5 cursor-pointer flex-shrink-0">
            <span className="w-2 h-2 bg-gold rounded-full self-center flex-shrink-0" />
            <span className="font-serif text-[15px] md:text-lg tracking-[0.08em] font-medium whitespace-nowrap">
              {dict.brand}
            </span>
          </Link>

          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <LangDropdown lang={lang} />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`w-5 h-px bg-fg transition-transform ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`w-5 h-px bg-fg transition-transform ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 top-[66px] bottom-0 bg-bg z-[90] px-8 py-10 flex flex-col overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
      >
        <Link
          href={`/${lang}/contact`}
          onClick={() => setMobileOpen(false)}
          className="self-start inline-flex items-center gap-3 px-5 py-3 mb-8 rounded-full bg-gold text-bg text-[12px] font-medium tracking-[0.12em] uppercase hover:brightness-110 transition"
        >
          {dict.nav.contact}
          <span aria-hidden>→</span>
        </Link>
        {MOBILE_NAV.filter((l) => l.key !== 'contact').map((l) => (
          <Link
            key={l.key}
            href={`/${lang}${l.path ? `/${l.path}` : ''}`}
            onClick={() => setMobileOpen(false)}
            className="font-serif text-[28px] py-3 border-b border-line text-fg"
          >
            {dict.nav[l.key]}
          </Link>
        ))}
      </div>
    </>
  );
}

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
    const editorialNav = [
      { key: 'projects', path: 'projects' },
      { key: 'services', path: 'services' },
      { key: 'citizenship', path: 'citizenship' },
      { key: 'about', path: 'about' },
    ];
    return (
      <>
        <div className="fixed top-4 md:top-6 inset-x-0 z-[110] flex justify-center px-4 pointer-events-none">
          <nav
            className="pointer-events-auto flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-full"
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
              className="font-editorial text-[16px] md:text-[17px] text-[#051A24] leading-none px-3 md:px-4 whitespace-nowrap"
            >
              Gate <span className="italic">International</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 px-2">
              {editorialNav.map((n) => (
                <Link
                  key={n.key}
                  href={`/${lang}/${n.path}`}
                  className={`px-3 py-2 text-[13px] transition-colors rounded-full ${
                    isActive(n.path) ? 'text-[#051A24]' : 'text-[#273C46] hover:text-[#051A24]'
                  }`}
                >
                  {dict.nav[n.key]}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-1 md:ml-0">
              <ThemeToggle />
              <LangDropdown lang={lang} />
              <Link
                href={`/${lang}/contact`}
                className="px-4 md:px-5 py-2 rounded-full bg-[#051A24] text-white text-[12px] md:text-[13px] font-medium hover:bg-[#0a2a38] transition-colors whitespace-nowrap"
              >
                {dict.nav.contact}
              </Link>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden w-9 h-9 rounded-full flex flex-col items-center justify-center gap-[5px] bg-white/60"
                aria-label="Toggle menu"
              >
                <span className={`w-4 h-px bg-[#051A24] transition-transform ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`w-4 h-px bg-[#051A24] transition-transform ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </button>
            </div>
          </nav>
        </div>
        <div
          className={`fixed inset-x-0 top-[88px] bottom-0 z-[100] px-8 py-10 flex flex-col gap-1 overflow-y-auto transition-transform duration-300 md:hidden ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)' }}
        >
          {MOBILE_NAV.map((l) => (
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
        <div className="container-x flex items-center justify-between gap-4 md:gap-8 py-[18px] md:py-[22px]">
          <Link href={`/${lang}`} className="flex items-baseline gap-2.5 cursor-pointer flex-shrink-0">
            <span className="w-2 h-2 bg-gold rounded-full self-center flex-shrink-0" />
            <span className="font-serif text-[15px] md:text-lg tracking-[0.08em] font-medium whitespace-nowrap">
              {dict.brand}
            </span>
          </Link>

          <nav className="hidden lg:flex gap-6 items-center">
            {NAV.map((l) => (
              <Link
                key={l.key}
                href={`/${lang}${l.path ? `/${l.path}` : ''}`}
                className={`text-[13px] tracking-[0.04em] py-1 relative transition-colors ${
                  isActive(l.path) ? 'text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {dict.nav[l.key]}
                {isActive(l.path) && (
                  <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gold" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <ThemeToggle />
            <LangDropdown lang={lang} />
            <Link
              href={`/${lang}/contact`}
              className="hidden lg:inline-flex items-center px-4 py-2 bg-gold text-bg text-[12px] font-medium tracking-[0.08em] rounded-full hover:brightness-110 transition"
            >
              {dict.nav.contact}
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-px bg-fg transition-transform ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`w-5 h-px bg-fg transition-transform ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 top-[66px] bottom-0 bg-bg z-[90] px-8 py-10 flex flex-col gap-1 overflow-y-auto transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
      >
        {MOBILE_NAV.map((l) => (
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

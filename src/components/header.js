'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LOCALES, getDict } from '@/lib/i18n';
import ThemeToggle from '@/components/theme-toggle';

const NAV = [
  { key: 'projects', path: 'projects' },
  { key: 'services', path: 'services' },
  { key: 'citizenship', path: 'citizenship' },
  { key: 'calculator', path: 'calculator' },
  { key: 'compare', path: 'compare' },
  { key: 'finder', path: 'finder' },
  { key: 'why', path: 'why-us' },
  { key: 'contact', path: 'contact' },
];

const MOBILE_NAV = [
  { key: 'home', path: '' },
  ...NAV,
  { key: 'about', path: 'about' },
];

export default function Header({ lang }) {
  const dict = getDict(lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const switchLang = (l) => {
    if (l === lang) return;
    let rest = pathname.replace(/^\/[^/]+/, '');
    if (!rest) rest = '/';
    router.push(`/${l}${rest === '/' ? '' : rest}`);
  };

  return (
    <>
      <header className={`site-header${scrolled || pathname !== `/${lang}` ? ' scrolled' : ''}`}>
        <div className="container-x flex items-center justify-between gap-8 py-[22px]">
          <Link href={`/${lang}`} className="flex items-baseline gap-2.5 cursor-pointer">
            <span className="w-2 h-2 bg-gold rounded-full self-center flex-shrink-0" />
            <span className="font-serif text-lg tracking-[0.08em] font-medium">{dict.brand}</span>
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

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center border border-line-strong rounded-sm overflow-hidden">
              {LOCALES.map((l, i) => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  className={`px-2.5 py-1.5 text-[11px] font-mono tracking-[0.12em] transition-colors ${
                    l === lang
                      ? 'bg-gold text-bg'
                      : 'text-fg-dim hover:text-fg'
                  } ${i < LOCALES.length - 1 ? 'border-r border-line-strong' : ''}`}
                >
                  {l === 'en' ? 'EN' : l === 'ar' ? 'عربي' : '中文'}
                </button>
              ))}
            </div>
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
        className={`fixed inset-x-0 top-[72px] bottom-0 bg-bg z-[90] px-8 py-10 flex flex-col gap-1 overflow-y-auto transition-transform duration-300 lg:hidden ${
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

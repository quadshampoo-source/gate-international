'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteLogo from '@/components/site-logo';

export default function LegacyNav({ lang, labels, logoUrl = null, logoAlt = null }) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('legacy-dark') : null;
    const prefer = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved == null ? prefer : saved === '1';
    setDark(isDark);
    document.querySelector('.legacy')?.classList.toggle('dark', isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.querySelector('.legacy')?.classList.toggle('dark', next);
    try { localStorage.setItem('legacy-dark', next ? '1' : '0'); } catch {}
  };

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <SiteLogo
        lang={lang}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        variant="legacy"
        height={32}
        className="logo-group"
      />

      <ul className="nav-links">
        <li><Link href={`/${lang}/projects`}>{labels.projects}</Link></li>
        <li><Link href={`/${lang}/about`}>{labels.services}</Link></li>
        <li><Link href={`/${lang}/citizenship`}>{labels.citizenship}</Link></li>
        <li><Link href={`/${lang}/about`}>{labels.about}</Link></li>
        <li><Link href={`/${lang}/contact`}>{labels.contact}</Link></li>
      </ul>

      <div className="nav-right">
        <span className="lang">{String(lang).toUpperCase()}</span>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <Link href={`/${lang}/contact`} className="btn-dark btn-arrow">{labels.cta}</Link>
      </div>
    </nav>
  );
}

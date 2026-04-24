'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import SiteLogo from '@/components/site-logo';
import ThemeToggle from '@/components/theme-toggle';
import LangDropdown from '@/components/lang-dropdown';
import { getDict } from '@/lib/i18n';

// Primary links stay inline on desktop (md+); the hamburger drawer mirrors
// the full editorial nav so every page is one tap away at every size.
const INLINE = [
  { key: 'projects', path: 'projects' },
  { key: 'services', path: 'services' },
  { key: 'citizenship', path: 'citizenship' },
  { key: 'calculator', path: 'calculator' },
];

const DRAWER = [
  { key: 'home', path: '' },
  { key: 'projects', path: 'projects' },
  { key: 'services', path: 'services' },
  { key: 'citizenship', path: 'citizenship' },
  { key: 'calculator', path: 'calculator' },
  { key: 'compare', path: 'compare' },
  { key: 'finder', path: 'finder' },
  { key: 'why', path: 'why-us' },
  { key: 'about', path: 'about' },
];

export default function AtomNav({ lang = 'en', logoUrl = null, logoAlt = null }) {
  const dict = getDict(lang);
  const labels = dict.nav;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const href = (p) => `/${lang}${p ? `/${p}` : ''}`;

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
        style={{
          background: scrolled || open ? 'rgba(255,255,255,0.88)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled || open ? 'blur(16px)' : 'none',
          borderBottom: scrolled || open ? '1px solid var(--neutral-200)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1360px] mx-auto flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
          <SiteLogo
            lang={lang}
            logoUrl={logoUrl}
            logoAlt={logoAlt}
            variant="atom"
            height={32}
          />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--neutral-700)' }}>
            {INLINE.map((l) => (
              <Link
                key={l.key}
                href={href(l.path)}
                className="hover:text-atom-primary-600 transition-colors"
              >
                {labels[l.key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <LangDropdown lang={lang} />
            <div className="hidden sm:block">
              <Button href={href('contact')} variant="primary" size="md" arrow>
                {labels.contact}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] transition-colors"
              style={{
                background: open ? 'var(--primary-50)' : 'transparent',
                border: '1px solid var(--neutral-200)',
              }}
            >
              <span
                className="block w-4 h-px transition-transform"
                style={{
                  background: 'var(--neutral-900)',
                  transform: open ? 'translateY(3px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-4 h-px transition-transform"
                style={{
                  background: 'var(--neutral-900)',
                  transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-x-0 top-[72px] md:top-[80px] bottom-0 z-40 px-6 md:px-10 py-10 overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full rtl:-translate-x-full pointer-events-none'
        }`}
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-[1360px] mx-auto flex flex-col">
          <Link
            href={href('contact')}
            onClick={() => setOpen(false)}
            className="self-start inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full text-sm font-medium transition-transform hover:scale-[1.02]"
            style={{
              background: 'var(--accent-coral)',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
            }}
          >
            {labels.contact}
            <span aria-hidden>→</span>
          </Link>
          {DRAWER.map((l) => (
            <Link
              key={l.key}
              href={href(l.path)}
              onClick={() => setOpen(false)}
              className="py-4 text-[28px] md:text-[32px] font-semibold transition-colors"
              style={{
                color: 'var(--neutral-900)',
                borderBottom: '1px solid var(--neutral-200)',
                letterSpacing: '-0.02em',
              }}
            >
              {labels[l.key]}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

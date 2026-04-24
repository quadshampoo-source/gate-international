'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LOCALES } from '@/lib/i18n';
import HeaderAction from './header-action';

const LABELS = {
  en: { short: 'EN', long: 'English' },
  ar: { short: 'عربي', long: 'عربي' },
  zh: { short: '中文', long: '中文' },
  ru: { short: 'РУ', long: 'Русский' },
  fa: { short: 'فا', long: 'فارسی' },
  fr: { short: 'FR', long: 'Français' },
};

export default function AtomLangDropdown({ lang = 'en' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const switchLang = (l) => {
    setOpen(false);
    if (l === lang) return;
    let rest = pathname.replace(/^\/[^/]+/, '');
    if (!rest) rest = '/';
    router.push(`/${l}${rest === '/' ? '' : rest}`);
  };

  const current = LABELS[lang] || LABELS.en;

  return (
    <div ref={ref} className="relative">
      <HeaderAction
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        active={open}
        className="px-3"
      >
        <span>{current.short}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </HeaderAction>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 min-w-[160px] overflow-hidden z-50"
          style={{
            background: '#fff',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-md)',
            boxShadow: 'var(--atom-shadow-lg)',
          }}
        >
          {LOCALES.map((l) => {
            const active = l === lang;
            const label = LABELS[l];
            return (
              <li key={l} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => switchLang(l)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{
                    background: active ? 'var(--primary-50)' : 'transparent',
                    color: active ? 'var(--primary-700)' : 'var(--neutral-700)',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span>{label.long}</span>
                  <span
                    className="text-xs"
                    style={{ color: active ? 'var(--primary-500)' : 'var(--neutral-400)' }}
                  >
                    {label.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

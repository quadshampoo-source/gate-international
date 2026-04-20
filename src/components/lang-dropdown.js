'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { LOCALES } from '@/lib/i18n';

const LABELS = {
  en: { short: 'EN', long: 'English' },
  ar: { short: 'عربي', long: 'عربي' },
  zh: { short: '中文', long: '中文' },
  ru: { short: 'РУ', long: 'Русский' },
  fa: { short: 'فا', long: 'فارسی' },
  fr: { short: 'FR', long: 'Français' },
};

export default function LangDropdown({ lang }) {
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
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-line-strong rounded-full text-[11px] font-mono tracking-[0.14em] text-fg hover:border-gold/50 transition-colors"
      >
        <span>{current.short}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 min-w-[130px] rounded-xl backdrop-blur-2xl bg-bg-raised/80 border border-gold/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[110]"
          >
            {LOCALES.map((l) => {
              const active = l === lang;
              const label = LABELS[l];
              return (
                <li key={l} role="option" aria-selected={active}>
                  <button
                    onClick={() => switchLang(l)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors ${
                      active ? 'text-gold bg-gold/10' : 'text-fg hover:bg-bg/60'
                    }`}
                  >
                    <span className="font-serif">{label.long}</span>
                    <span className="font-mono text-[10px] tracking-[0.14em] opacity-70">{label.short}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

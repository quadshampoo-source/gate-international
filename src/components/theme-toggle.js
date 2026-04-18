'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.2, 0.8, 0.2, 1];

const SunIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className={className}>
    <path d="M21 12.8a8.5 8.5 0 01-11.3-11.3 8.5 8.5 0 1011.3 11.3z" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(t);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('gate-theme', next); } catch (_) {}
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="relative w-12 h-7 rounded-full border border-line-strong flex items-center transition-colors hover:border-gold/40"
      style={{ padding: 2 }}
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-gold flex items-center justify-center text-bg"
        animate={{ x: mounted && isDark ? 0 : 20 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </motion.div>
    </button>
  );
}

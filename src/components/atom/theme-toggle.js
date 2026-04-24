'use client';

import { useEffect, useState } from 'react';
import HeaderAction from './header-action';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden>
    <path d="M21 12.8a8.5 8.5 0 01-11.3-11.3 8.5 8.5 0 1011.3 11.3z" />
  </svg>
);

export default function AtomThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(t);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('gate-theme', next); } catch (_) {}
  };

  const isDark = mounted && theme === 'dark';

  return (
    <HeaderAction
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="w-10 px-0"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </HeaderAction>
  );
}

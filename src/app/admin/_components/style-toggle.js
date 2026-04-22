'use client';

import { useEffect, useState } from 'react';

const KEY = 'admin-style';
const ATOM_CLASS = 'atom-admin';

/**
 * Toggles the admin panel between the classic (gold/dark) skin and the
 * new Atom skin. Applies `.atom-admin` to <body>, persists the choice
 * in localStorage, and rehydrates on mount without a FOUC flash —
 * InitScript below runs before paint.
 */
export default function AdminStyleToggle() {
  const [atom, setAtom] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      const isAtom = saved === 'atom';
      setAtom(isAtom);
      document.body.classList.toggle(ATOM_CLASS, isAtom);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !atom;
    setAtom(next);
    document.body.classList.toggle(ATOM_CLASS, next);
    try { localStorage.setItem(KEY, next ? 'atom' : 'classic'); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="admin-style-toggle"
      aria-pressed={atom}
      title={atom ? 'Atom style is active — click to switch back' : 'Classic style is active — click to try Atom'}
    >
      <span className="dot" aria-hidden />
      <span>{atom ? 'Atom' : 'Classic'}</span>
    </button>
  );
}

/**
 * No-flash initialiser. Drop `<AdminStyleInit />` into the admin layout so
 * the correct body class is applied before React hydrates.
 */
export function AdminStyleInit() {
  const code = `(function(){try{var s=localStorage.getItem(${JSON.stringify(KEY)});if(s==='atom'){document.body.classList.add(${JSON.stringify(ATOM_CLASS)});}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

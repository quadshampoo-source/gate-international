'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Bottom-fixed action bar. Hidden until the user has scrolled past 30% of the
// document, then fades up. WhatsApp primary, booking/contact secondary.
export default function StickyCTABar({ waHref, contactHref, bookLabel = 'Randevu Al', waLabel = 'WhatsApp' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      setVisible(window.scrollY / max > 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[120] pointer-events-none"
      aria-hidden={!visible}
    >
      <div
        className="flex items-center justify-center px-4 pb-[env(safe-area-inset-bottom)]"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(120%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div
          className="flex items-center gap-2 md:gap-3 m-4 p-2 rounded-full"
          style={{
            background: 'rgba(8,17,22,0.9)',
            color: '#EEF0EA',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '0.5px solid rgba(255,255,255,0.12)',
          }}
        >
          {contactHref && (
            <Link
              href={contactHref}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[12px] md:text-[13px] font-medium"
              style={{ background: '#C9A84C', color: '#081116' }}
            >
              {bookLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
          {waHref && (
            <Link
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-4 md:px-5 rounded-full text-[12px] md:text-[13px] font-medium text-white"
              style={{ background: '#25D366' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.46 0 .1 5.37.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.24-1.63a12 12 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.37 11.95-11.96 0-3.19-1.24-6.19-3.48-8.41z" />
              </svg>
              {waLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Sticky enquire bar — minimal, elegant, page-sympathetic. Ghost button
// (transparent background with a navy border) that fills in on hover.
// The bar itself is a frosted white pane that only slides up after the
// reader has passed 15% of the document, so it never overlaps the hero.
// Light + dark themes each get their own ink/border palette.
//
// Legacy {waHref, contactHref, bookLabel} props are still accepted so
// older callers keep working; preference is {href, label}.
export default function StickyCTABar({ href, label, contactHref, bookLabel }) {
  const [visible, setVisible] = useState(false);
  const finalHref = href || contactHref || '#enquire';
  const finalLabel = label || bookLabel || 'Enquire about this residence';

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      setVisible(window.scrollY / max > 0.15);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        .cta-sticky {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 100;
          padding: 12px 20px;
          padding-bottom: calc(12px + env(safe-area-inset-bottom));
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-sticky.visible { transform: translateY(0); }
        html[data-theme="dark"] .cta-sticky {
          background: rgba(12, 16, 20, 0.86);
          border-top-color: rgba(255, 255, 255, 0.08);
        }

        .cta-sticky a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 24px;
          background: transparent;
          color: #1a1a2e;
          border: 1.5px solid #1a1a2e;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.01em;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .cta-sticky a:hover {
          background: #1a1a2e;
          color: #ffffff;
        }
        .cta-sticky a svg {
          width: 16px; height: 16px;
          transition: transform 0.2s ease;
        }
        .cta-sticky a:hover svg { transform: translateX(3px); }

        html[data-theme="dark"] .cta-sticky a {
          color: #F5F0E2;
          border-color: rgba(245, 240, 226, 0.85);
        }
        html[data-theme="dark"] .cta-sticky a:hover {
          background: #F5F0E2;
          color: #0C1014;
          border-color: #F5F0E2;
        }

        @media (min-width: 768px) {
          .cta-sticky { padding: 12px 40px; padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
          .cta-sticky a { max-width: 360px; margin: 0 auto; }
        }
      `}</style>
      <div className={`cta-sticky${visible ? ' visible' : ''}`} aria-hidden={!visible}>
        <Link href={finalHref}>
          {finalLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </>
  );
}

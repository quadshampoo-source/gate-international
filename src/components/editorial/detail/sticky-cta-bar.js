'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Sticky enquire bar — one dark premium button, full-width on mobile,
// capped at 400 px on desktop. Appears after 15% scroll, blur-over-page
// background, safe-area bottom inset for iPhone notch. WhatsApp has moved
// elsewhere — this bar owns a single action.
//
// Accepts legacy {waHref, contactHref, bookLabel} props too so existing
// callers keep working; preference goes to `href` + `label`.
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
          padding: 16px 20px;
          padding-bottom: calc(16px + env(safe-area-inset-bottom));
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-sticky.visible { transform: translateY(0); }
        html[data-theme="dark"] .cta-sticky {
          background: rgba(10, 14, 18, 0.9);
          border-top-color: rgba(255, 255, 255, 0.08);
        }

        .cta-sticky .cta-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          background: #1a1a2e;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .cta-sticky .cta-button:hover { background: #24243d; }
        .cta-sticky .cta-button:active { transform: scale(0.98); }
        .cta-sticky .cta-button svg {
          width: 18px; height: 18px;
          transition: transform 0.2s ease;
        }
        .cta-sticky .cta-button:hover svg { transform: translateX(4px); }

        @media (min-width: 768px) {
          .cta-sticky { padding: 16px 40px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
          .cta-sticky .cta-button { max-width: 400px; margin: 0 auto; }
        }
      `}</style>
      <div className={`cta-sticky${visible ? ' visible' : ''}`} aria-hidden={!visible}>
        <Link href={finalHref} className="cta-button">
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

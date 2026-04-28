'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';
import { LANG_FLAGS, localizedTitle, sortTeamForLang } from '@/lib/team-constants';

// Brand-aligned WhatsApp FAB — pulses navy when idle, morphs to gold
// with an X icon when open. Popup is a glassmorphism card above the
// button with a staggered member list pulled from the already-fetched
// team data (no extra network call). No green anywhere — the WhatsApp
// colour cue lives inside the avatar badges only.
//
// Sticky Enquire bar coexistence: widget `bottom` is driven by a CSS
// `:has()` rule in the layout, no JS sync needed.
export default function WhatsappFab({ lang = 'en', team = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = (team || []).filter((m) => m.active !== false && m.whatsapp_number);
  const sorted = sortTeamForLang(active, lang);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!sorted.length) return null; // no team, no widget

  const msg = WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en;

  return (
    <>
      <style>{`
        .wa-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          /* Container itself must not eat clicks — only the button and the
             open popup should be hit-targets. Flex gap + an opacity-0 popup
             child can otherwise cover 320x488 of the bottom-right corner. */
          pointer-events: none;
        }
        .wa-button { pointer-events: auto; }
        .wa-widget.open .wa-popup { pointer-events: auto; }
        /* Lift above the Enquire sticky bar when it's on screen. */
        body:has(.cta-sticky.visible) .wa-widget { bottom: 88px; }
        /* Project detail mobile bar already includes its own WhatsApp action,
           so hide the floating FAB entirely on those pages — avoids duplicate
           CTAs stacked on top of the sticky bar. */
        body:has(.cta-with-wa.visible) .wa-widget { display: none; }
        html[dir="rtl"] .wa-widget { right: auto; left: 24px; align-items: flex-start; }

        .wa-button {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: #1a1a2e;
          color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s ease,
                      background 0.3s ease;
        }
        .wa-button:hover { transform: scale(1.08); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }
        .wa-button:active { transform: scale(0.95); }
        .wa-widget.open .wa-button { background: #C9A84C; }

        /* Pulse — navy ring expanding out. Pauses when popup is open
           and yields to prefers-reduced-motion. */
        .wa-button::before {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 50%;
          background: rgba(26, 26, 46, 0.18);
          animation: waPulse 2.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes waPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.15); opacity: 0; }
        }
        .wa-widget.open .wa-button::before { animation: none; opacity: 0; }
        @media (prefers-reduced-motion: reduce) {
          .wa-button::before { animation: none; }
        }

        .wa-icon, .wa-close {
          position: absolute;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .wa-close { opacity: 0; transform: rotate(-90deg) scale(0.5); }
        .wa-widget.open .wa-icon { opacity: 0; transform: rotate(90deg) scale(0.5); }
        .wa-widget.open .wa-close { opacity: 1; transform: rotate(0) scale(1); }

        .wa-popup {
          width: 320px;
          max-height: 420px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px) scale(0.92);
          transform-origin: bottom right;
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        html[dir="rtl"] .wa-popup { transform-origin: bottom left; }
        .wa-widget.open .wa-popup {
          opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
        }
        html[data-theme="dark"] .wa-popup {
          background: rgba(20,24,28,0.96);
          border-color: rgba(255,255,255,0.08);
        }

        .wa-popup-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        html[data-theme="dark"] .wa-popup-header { border-bottom-color: rgba(255,255,255,0.08); }
        .wa-popup-header h4 {
          font-size: 17px; font-weight: 600; color: #1a1a2e;
          margin: 0 0 2px; font-family: inherit;
        }
        .wa-popup-header p {
          font-size: 13px; color: rgba(0,0,0,0.45); margin: 0;
        }
        html[data-theme="dark"] .wa-popup-header h4 { color: #F5F0E2; }
        html[data-theme="dark"] .wa-popup-header p { color: rgba(255,255,255,0.55); }

        .wa-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 8px;
        }
        .wa-member {
          display: flex; align-items: center; gap: 12px;
          padding: 12px;
          border-radius: 12px;
          text-decoration: none; color: inherit;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          opacity: 0;
          transform: translateX(16px);
          animation: waMemberIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wa-member:nth-child(1) { animation-delay: 0.05s; }
        .wa-member:nth-child(2) { animation-delay: 0.10s; }
        .wa-member:nth-child(3) { animation-delay: 0.15s; }
        .wa-member:nth-child(4) { animation-delay: 0.20s; }
        .wa-member:nth-child(5) { animation-delay: 0.25s; }
        .wa-member:nth-child(6) { animation-delay: 0.30s; }
        .wa-member:nth-child(7) { animation-delay: 0.35s; }
        .wa-member:nth-child(8) { animation-delay: 0.40s; }
        .wa-member:nth-child(n+9) { animation-delay: 0.45s; }
        @keyframes waMemberIn {
          to { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-member { opacity: 1; transform: none; animation: none; }
        }
        .wa-member:hover { background: rgba(0,0,0,0.04); transform: translateX(2px); }
        .wa-member:active { transform: scale(0.98); }
        html[data-theme="dark"] .wa-member:hover { background: rgba(255,255,255,0.05); }

        .wa-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #C9A84C;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 600;
          flex-shrink: 0;
          overflow: hidden;
        }
        .wa-avatar[data-office="istanbul"]     { background: #1a1a2e; }
        .wa-avatar[data-office="jeddah"]       { background: #0F6E56; }
        .wa-avatar[data-office="french-desk"]  { background: #534AB7; }
        .wa-avatar[data-office="persian-desk"] { background: #D85A30; }
        .wa-avatar[data-office="russian-desk"] { background: #993556; }
        .wa-avatar[data-office="china"]        { background: #B4383B; }
        .wa-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .wa-info { flex: 1; min-width: 0; }
        .wa-name {
          font-size: 14px; font-weight: 500; color: #1a1a2e;
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wa-detail {
          font-size: 12px; color: rgba(0,0,0,0.48);
          display: flex; align-items: center; gap: 6px;
        }
        html[data-theme="dark"] .wa-name { color: #F5F0E2; }
        html[data-theme="dark"] .wa-detail { color: rgba(255,255,255,0.5); }
        .wa-flags { display: flex; gap: 3px; font-size: 13px; }

        .wa-arrow {
          width: 16px; height: 16px;
          color: rgba(0,0,0,0.2);
          flex-shrink: 0;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .wa-member:hover .wa-arrow { color: #C9A84C; transform: translateX(3px); }
        html[data-theme="dark"] .wa-arrow { color: rgba(255,255,255,0.25); }
        html[dir="rtl"] .wa-arrow { transform: rotate(180deg); }
        html[dir="rtl"] .wa-member:hover .wa-arrow { transform: rotate(180deg) translateX(3px); }

        .wa-popup-footer {
          padding: 10px 20px;
          border-top: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          font-size: 10.5px; letter-spacing: 0.06em;
          color: rgba(0,0,0,0.32);
        }
        html[data-theme="dark"] .wa-popup-footer {
          border-top-color: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
        }

        @media (max-width: 480px) {
          .wa-popup { width: calc(100vw - 32px); }
        }
      `}</style>

      <div ref={ref} className={`wa-widget${open ? ' open' : ''}`}>
        <div className="wa-popup" role="dialog" aria-modal="true" aria-hidden={!open}>
          <div className="wa-popup-header">
            <h4>Chat with our team</h4>
            <p>Choose your contact</p>
          </div>
          <div className="wa-list">
            {sorted.map((m) => {
              const initials = (m.name || '').split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
              const title = localizedTitle(m, lang);
              const waHref = `https://wa.me/${m.whatsapp_number}?text=${encodeURIComponent(msg)}`;
              return (
                <a
                  key={m.id}
                  className="wa-member"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <div className="wa-avatar" data-office={m.office}>
                    {m.photo_url ? (
                      <Image src={m.photo_url} alt="" width={40} height={40} sizes="40px" />
                    ) : initials}
                  </div>
                  <div className="wa-info">
                    <div className="wa-name">{m.name}</div>
                    <div className="wa-detail">
                      <span>{title}</span>
                      {(m.languages || []).length > 0 && (
                        <span className="wa-flags">
                          {m.languages.slice(0, 3).map((l) => (
                            <span key={l}>{LANG_FLAGS[l] || '🌐'}</span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="wa-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              );
            })}
          </div>
          <div className="wa-popup-footer">GATE INTERNATIONAL</div>
        </div>

        <button
          type="button"
          className="wa-button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close contacts' : 'Chat with our team'}
          aria-expanded={open}
        >
          <svg className="wa-icon" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <svg className="wa-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
}

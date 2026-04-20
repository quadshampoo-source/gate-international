'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsappIcon } from './icons';
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';
import { LANG_FLAGS, localizedTitle, sortTeamForLang } from '@/lib/team-constants';
import { getDict } from '@/lib/i18n';

function memberWaHref(number, lang) {
  if (!number) return null;
  const msg = WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function avatarHue(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

function Avatar({ name, photoUrl, size = 44 }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border border-gold/30 flex-shrink-0"
      />
    );
  }
  const initials = name.split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
  const hue = avatarHue(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 40% 28%), hsl(${(hue + 40) % 360} 40% 18%))`,
      }}
      className="rounded-full flex items-center justify-center font-serif text-[15px] text-fg border border-gold/30 flex-shrink-0"
    >
      {initials}
    </div>
  );
}

export default function WhatsappFab({ lang = 'en', team = [] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const t = getDict(lang);
  const sorted = sortTeamForLang(team || [], lang);
  const fallbackHref = whatsappLink(WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en, lang);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // If no team members are available (DB empty or table missing) fall back to a simple direct link.
  if (sorted.length === 0) {
    return (
      <motion.a
        className="wa-fab"
        href={fallbackHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, type: 'spring', bounce: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          className="flex items-center justify-center"
        >
          <WhatsappIcon />
        </motion.span>
      </motion.a>
    );
  }

  return (
    <>
      <motion.button
        type="button"
        className="wa-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Contact on WhatsApp"
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, type: 'spring', bounce: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          className="flex items-center justify-center"
        >
          <WhatsappIcon />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-[88px] end-5 z-[120] w-[calc(100vw-40px)] max-w-[360px] rounded-[20px] backdrop-blur-2xl bg-bg-raised/85 shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ border: '0.5px solid rgba(201,168,76,0.25)' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 py-4 flex items-start justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="min-w-0">
                <div className="font-serif text-[17px] leading-tight">{t.team.popupTitle}</div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-muted mt-1.5">
                  {t.team.popupSub}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-3 w-7 h-7 rounded-full flex items-center justify-center text-fg-muted hover:text-fg hover:bg-bg/60 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {sorted.map((m) => {
                const title = localizedTitle(m, lang);
                const href = memberWaHref(m.whatsapp_number, lang);
                if (!href) return null;
                return (
                  <a
                    key={m.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-bg/60 transition-colors"
                  >
                    <Avatar name={m.name} photoUrl={m.photo_url} />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[15px] leading-tight truncate">{m.name}</div>
                      <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-fg-muted mt-0.5 truncate">{title}</div>
                    </div>
                    <div className="flex items-center gap-1 mr-2">
                      {(m.languages || []).slice(0, 3).map((l) => (
                        <span key={l} className="text-[13px] leading-none">{LANG_FLAGS[l] || '🌐'}</span>
                      ))}
                    </div>
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-full text-white flex-shrink-0"
                      style={{ background: '#25D366' }}
                      aria-hidden="true"
                    >
                      <WhatsappIcon />
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

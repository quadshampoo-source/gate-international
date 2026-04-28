'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getDict } from '@/lib/i18n';

// Premium fullscreen lightbox.
// - Black backdrop with framer-motion fade-in / scale image transitions
// - Top bar: glass counter (left) + close (right)
// - Side nav arrows on desktop, swipe + keyboard on all
// - Caption pill bottom-center if image has one
// - Thumbnail strip pinned to bottom (80×56)
// - Body scroll locked while open, focus restored to opener on close
function normalize(images) {
  return (images || [])
    .filter(Boolean)
    .map((img) => (typeof img === 'string' ? { url: img } : img))
    .filter((img) => img && img.url);
}

function CloseIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeft({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Lightbox({ images, startIndex = 0, onClose, alt = 'Photo', lang = 'en' }) {
  const t = getDict(lang).pages.detail.gallery;
  const list = normalize(images);
  const [i, setI] = useState(startIndex);
  const last = list.length - 1;
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const thumbRefs = useRef([]);

  const next = useCallback(() => setI((v) => (v >= last ? 0 : v + 1)), [last]);
  const prev = useCallback(() => setI((v) => (v <= 0 ? last : v - 1)), [last]);

  useEffect(() => {
    triggerRef.current = typeof document !== 'undefined' ? document.activeElement : null;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog so screen readers + keyboard users land here.
    if (dialogRef.current && typeof dialogRef.current.focus === 'function') {
      dialogRef.current.focus();
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [next, prev, onClose]);

  // Keep the active thumbnail in view as the user navigates.
  useEffect(() => {
    const tn = thumbRefs.current[i];
    if (tn && typeof tn.scrollIntoView === 'function') {
      tn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [i]);

  // Touch swipe — single shared object so consecutive renders don't reset it.
  const touch = useState({ x: 0 })[0];
  const onTouchStart = (e) => { touch.x = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.x;
    if (dx > 50) prev();
    if (dx < -50) next();
  };

  const current = list[i];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${alt} viewer`}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[60] flex flex-col"
        style={{ background: '#000' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <style>{`
          .lb-thumbs::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-4">
          <div
            className="inline-flex items-center px-3 py-1.5"
            style={{
              color: '#fff',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.16)',
              fontSize: 13,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
            }}
          >
            {i + 1} / {list.length}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.16)',
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Side nav arrows (desktop) */}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t.prev}
              className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.next}
              className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Image stage */}
        <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-32">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={`img-${i}`}
              src={current.url}
              alt={current.alt || `${alt} ${i + 1}`}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-full max-h-full object-contain"
              style={{ display: 'block' }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Caption */}
        {current.caption && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10 px-4 py-2 max-w-[90vw] text-center"
            style={{
              bottom: list.length > 1 ? 96 : 24,
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#fff',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.14)',
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {current.caption}
          </div>
        )}

        {/* Bottom thumbnail strip */}
        {list.length > 1 && (
          <div className="absolute bottom-0 inset-x-0 z-10 px-4 pb-4 pt-2">
            <div
              className="lb-thumbs flex gap-2 overflow-x-auto justify-start md:justify-center"
              style={{
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {list.map((img, idx) => {
                const active = idx === i;
                return (
                  <button
                    key={idx}
                    type="button"
                    ref={(el) => { thumbRefs.current[idx] = el; }}
                    onClick={() => setI(idx)}
                    aria-label={`${alt} ${idx + 1} / ${list.length}`}
                    aria-current={active ? 'true' : undefined}
                    className="flex-shrink-0 transition-all duration-200"
                    style={{
                      width: 80,
                      height: 56,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: active ? '2px solid #fff' : '1px solid rgba(255,255,255,0.22)',
                      opacity: active ? 1 : 0.5,
                      padding: 0,
                      background: '#111',
                      cursor: 'pointer',
                    }}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      width={80}
                      height={56}
                      sizes="80px"
                      className="w-full h-full object-cover block"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

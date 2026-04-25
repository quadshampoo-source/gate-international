'use client';

import { useEffect, useState, useCallback } from 'react';

// 5-image mosaic hero (1 large left + 4 small right in 2x2). Click any
// image opens a lightbox; mobile collapses to a swipe carousel.
//
// Graceful fallback: 5+ images → mosaic, 3-4 → 2-up + small grid, 2 → side
// by side, 1 → full width, 0 → render nothing.
export default function GalleryMosaic({ images = [], alt = 'Gallery' }) {
  const valid = images.filter(Boolean);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (valid.length === 0) return null;

  const openAt = (i) => { setIndex(i); setOpen(true); };

  // --- mobile carousel ---
  return (
    <>
      <div className="md:hidden -mx-6">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {valid.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="snap-center flex-shrink-0 w-[92vw] mx-1 first:ml-6 last:mr-6"
              aria-label={`Open photo ${i + 1} of ${valid.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="w-full object-cover"
                style={{ aspectRatio: '4 / 3', borderRadius: 'var(--atom-radius-lg)', background: 'var(--neutral-100)' }}
              />
            </button>
          ))}
        </div>
        <div className="px-6 pt-2 text-xs" style={{ color: 'var(--neutral-500)' }}>
          {valid.length} photos · swipe →
        </div>
      </div>

      {/* --- desktop mosaic --- */}
      <div className="hidden md:block relative">
        <Mosaic images={valid} alt={alt} onOpen={openAt} />
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
          style={{
            background: '#fff',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-pill)',
            color: 'var(--neutral-900)',
            boxShadow: 'var(--atom-shadow-md)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Show all {valid.length} photos
        </button>
      </div>

      {open && <Lightbox images={valid} startIndex={index} onClose={() => setOpen(false)} alt={alt} />}
    </>
  );
}

function Mosaic({ images, alt, onOpen }) {
  const n = images.length;
  const radius = 'var(--atom-radius-lg)';
  const baseStyle = { background: 'var(--neutral-100)', overflow: 'hidden' };

  if (n === 1) {
    return (
      <button type="button" onClick={() => onOpen(0)} className="block w-full" style={{ borderRadius: radius, ...baseStyle, aspectRatio: '16 / 9' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
      </button>
    );
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-2" style={{ aspectRatio: '16 / 7' }}>
        {images.slice(0, 2).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpen(i)}
            className="block w-full h-full"
            style={{ borderRadius: radius, ...baseStyle }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
    );
  }

  // n >= 3 — 1 large + (up to 4) small mosaic
  const large = images[0];
  const small = images.slice(1, 5);
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: small.length >= 2 ? '1fr 1fr' : '1.6fr 1fr',
        aspectRatio: '16 / 8',
      }}
    >
      <button type="button" onClick={() => onOpen(0)} className="relative" style={{ borderRadius: radius, ...baseStyle }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={large} alt={`${alt} 1`} className="absolute inset-0 w-full h-full object-cover" />
      </button>
      {small.length > 0 && (
        <div className={`grid gap-2 ${small.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'}`}>
          {small.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onOpen(i + 1)}
              className="relative"
              style={{ borderRadius: radius, ...baseStyle }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ${i + 2}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Lightbox({ images, startIndex = 0, onClose, alt }) {
  const [i, setI] = useState(startIndex);
  const last = images.length - 1;

  const next = useCallback(() => setI((v) => (v >= last ? 0 : v + 1)), [last]);
  const prev = useCallback(() => setI((v) => (v <= 0 ? last : v - 1)), [last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [next, prev, onClose]);

  // touch swipe
  const touch = useState({ x: 0 })[0];
  const onTouchStart = (e) => { touch.x = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.x;
    if (dx > 50) prev();
    if (dx < -50) next();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} viewer`}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-12 h-12 rounded-full inline-flex items-center justify-center text-white"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="hidden md:inline-flex absolute left-4 w-12 h-12 rounded-full items-center justify-center text-white"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="hidden md:inline-flex absolute right-4 w-12 h-12 rounded-full items-center justify-center text-white"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="max-w-[95vw] max-h-[90vh] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[i]}
          alt={`${alt} ${i + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
      <div className="absolute bottom-4 inset-x-0 text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {i + 1} / {images.length}
      </div>
    </div>
  );
}

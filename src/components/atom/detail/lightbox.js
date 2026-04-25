'use client';

import { useEffect, useState, useCallback } from 'react';

// Shared lightbox: dark backdrop, prev/next, ESC, swipe, counter.
// Used by both GalleryMosaic (exterior set) and FloorPlans (interior set);
// each consumer passes its own image array so the two never mingle.
export default function Lightbox({ images, startIndex = 0, onClose, alt = 'Photo' }) {
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

  // Touch swipe — single shared object so consecutive renders don't reset it.
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
      {images.length > 1 && (
        <>
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
        </>
      )}
      <div className="max-w-[95vw] max-h-[90vh] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[i]}
          alt={`${alt} ${i + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {i + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

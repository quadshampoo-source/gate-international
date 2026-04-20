'use client';

import { useState, useEffect } from 'react';

export default function LightboxGallery({ images = [] }) {
  const [openAt, setOpenAt] = useState(-1);
  const isOpen = openAt >= 0;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenAt(-1);
      if (e.key === 'ArrowRight') setOpenAt((v) => (v + 1) % images.length);
      if (e.key === 'ArrowLeft') setOpenAt((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenAt(i)}
            className="group relative rounded-[22px] overflow-hidden aspect-[4/3] block"
            style={{ boxShadow: '0 14px 40px rgba(5,26,36,0.08)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(5,26,36,0.92)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpenAt(-1)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setOpenAt(-1); }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); setOpenAt((v) => (v - 1 + images.length) % images.length); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M13 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); setOpenAt((v) => (v + 1) % images.length); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openAt]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-[8px]"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/70">
            {openAt + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

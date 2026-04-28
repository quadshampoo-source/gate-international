'use client';

import { useState } from 'react';
import Lightbox from './lightbox';
import { getDict } from '@/lib/i18n';

// 5-image mosaic hero (1 large left + 4 small right in 2x2). Click any
// image opens a lightbox; mobile collapses to a swipe carousel.
//
// Graceful fallback: 5+ images → mosaic, 3-4 → 2-up + small grid, 2 → side
// by side, 1 → full width, 0 → render nothing.
export default function GalleryMosaic({ images = [], alt = 'Gallery', lang = 'en' }) {
  const t = getDict(lang).pages.detail.gallery;
  const valid = images.filter(Boolean);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (valid.length === 0) return null;

  const openAt = (i) => { setIndex(i); setOpen(true); };

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
              aria-label={`${alt} ${i + 1} / ${valid.length}`}
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
          {valid.length} {t.photosCount} · {t.swipeHint} →
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
          {t.showAll} {valid.length} {t.showAllSuffix}
        </button>
      </div>

      {open && <Lightbox images={valid} startIndex={index} onClose={() => setOpen(false)} alt={alt} lang={lang} />}
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

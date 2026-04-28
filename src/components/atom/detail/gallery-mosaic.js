'use client';

import { useEffect, useRef, useState } from 'react';
import Lightbox from './lightbox';
import { getDict } from '@/lib/i18n';

// 5-image mosaic hero (1 large left + 4 small right in 2x2). Click any
// image opens a lightbox; mobile collapses to a swipe carousel with a
// glassmorphism "1 / 4" counter overlay and clickable progress dots.
//
// Graceful fallback: 5+ images → mosaic, 3-4 → 2-up + small grid, 2 → side
// by side, 1 → full width, 0 → render nothing.
export default function GalleryMosaic({ images = [], alt = 'Gallery', lang = 'en' }) {
  const t = getDict(lang).pages.detail.gallery;
  const valid = images.filter(Boolean);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeMobile, setActiveMobile] = useState(0);
  const railRef = useRef(null);
  const slideRefs = useRef([]);

  // IntersectionObserver picks the slide with the highest visible ratio in
  // the rail viewport. Threshold list keeps the active state crisp during
  // scroll without flicker.
  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean);
    if (!slides.length || typeof IntersectionObserver === 'undefined' || !railRef.current) {
      return undefined;
    }
    let best = { idx: 0, ratio: 0 };
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number(e.target.dataset.idx);
          if (e.isIntersecting && e.intersectionRatio > best.ratio - 0.01) {
            best = { idx, ratio: e.intersectionRatio };
          }
        }
        // Recompute the leader every batch — necessary because entries only
        // include slides that crossed a threshold this tick.
        let leader = best;
        for (const s of slides) {
          const idx = Number(s.dataset.idx);
          const rect = s.getBoundingClientRect();
          const railRect = railRef.current.getBoundingClientRect();
          const visible =
            Math.max(0, Math.min(rect.right, railRect.right) - Math.max(rect.left, railRect.left));
          const ratio = visible / Math.max(1, rect.width);
          if (ratio > leader.ratio) leader = { idx, ratio };
        }
        best = leader;
        setActiveMobile(leader.idx);
      },
      { root: railRef.current, threshold: [0.25, 0.5, 0.75, 1] },
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [valid.length]);

  if (valid.length === 0) return null;

  const openAt = (i) => { setIndex(i); setOpen(true); };

  const goToSlide = (i) => {
    const target = slideRefs.current[i];
    if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <>
      <style>{`
        .gallery-rail::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Mobile carousel */}
      <div
        className="md:hidden -mx-6"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} ${valid.length} ${t.photosCount}`}
      >
        <div className="relative">
          {valid.length > 1 && (
            <div
              aria-live="polite"
              className="absolute top-4 right-4 z-10 px-3 py-1.5 text-xs font-semibold tabular-nums select-none pointer-events-none"
              style={{
                color: '#fff',
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.16)',
                marginRight: 16,
              }}
            >
              {activeMobile + 1} / {valid.length}
            </div>
          )}

          <div
            ref={railRef}
            className="gallery-rail flex overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {valid.map((src, i) => (
              <button
                key={i}
                type="button"
                ref={(el) => { slideRefs.current[i] = el; }}
                data-idx={i}
                onClick={() => openAt(i)}
                className="flex-shrink-0 w-[92vw] mx-1 first:ml-6 last:mr-6"
                style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
                aria-label={`${alt} ${i + 1} / ${valid.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full object-cover"
                  style={{
                    aspectRatio: '4 / 3',
                    borderRadius: 'var(--atom-radius-lg)',
                    background: 'var(--neutral-100)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {valid.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-3" role="tablist" aria-label={`${alt} navigation`}>
            {valid.map((_, i) => {
              const active = i === activeMobile;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${alt} ${i + 1} / ${valid.length}`}
                  onClick={() => goToSlide(i)}
                  className="transition-all duration-300 ease-out"
                  style={{
                    width: active ? 24 : 6,
                    height: 6,
                    borderRadius: 9999,
                    background: active ? 'var(--accent-coral)' : 'var(--neutral-300)',
                    border: 0,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              );
            })}
          </div>
        )}
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

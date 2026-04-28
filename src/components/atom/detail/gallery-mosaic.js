'use client';

import { useEffect, useRef, useState } from 'react';
import Lightbox from './lightbox';
import { getDict } from '@/lib/i18n';

// Premium real-estate gallery — Sotheby's / Knight Frank pattern.
//
// Mobile (md-): horizontal snap carousel with per-slide glass-pill counter,
// caption + "View all" overlay, dot indicator (Apple Photos pill style) and
// optional thumbnail strip.
// Desktop (md+): 1-large + 4-small mosaic with "Show all" CTA, click any tile
// to open the lightbox.
//
// Image input: accepts either `string[]` (legacy) or
// `{ url, caption?, alt?, blurDataUrl? }[]` — normalized internally so callers
// can incrementally adopt captions without migrating data.
function normalize(images) {
  return (images || [])
    .filter(Boolean)
    .map((img) => (typeof img === 'string' ? { url: img } : img))
    .filter((img) => img && img.url);
}

function CameraIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function MaximizeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function GridIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export default function GalleryMosaic({ images = [], alt = 'Gallery', lang = 'en' }) {
  const t = getDict(lang).pages.detail.gallery;
  const valid = normalize(images);
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [activeMobile, setActiveMobile] = useState(0);
  const railRef = useRef(null);
  const slideRefs = useRef([]);
  const thumbRefs = useRef([]);

  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean);
    if (!slides.length || typeof IntersectionObserver === 'undefined' || !railRef.current) {
      return undefined;
    }
    const obs = new IntersectionObserver(
      () => {
        // Recompute the leader from layout each tick — robust against
        // fractional thresholds / partial scroll positions.
        const railRect = railRef.current.getBoundingClientRect();
        let leader = { idx: 0, ratio: 0 };
        for (const s of slides) {
          const idx = Number(s.dataset.idx);
          const rect = s.getBoundingClientRect();
          const visible = Math.max(
            0,
            Math.min(rect.right, railRect.right) - Math.max(rect.left, railRect.left),
          );
          const ratio = visible / Math.max(1, rect.width);
          if (ratio > leader.ratio) leader = { idx, ratio };
        }
        setActiveMobile(leader.idx);
      },
      { root: railRef.current, threshold: [0.25, 0.5, 0.75, 1] },
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [valid.length]);

  // Keep the active thumbnail in view as the user swipes the main rail.
  useEffect(() => {
    const tn = thumbRefs.current[activeMobile];
    if (tn && typeof tn.scrollIntoView === 'function') {
      tn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeMobile]);

  if (valid.length === 0) return null;

  const openLightbox = (i) => {
    setOpenIndex(i);
    setOpen(true);
  };

  const goToSlide = (i) => {
    const target = slideRefs.current[i];
    if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const showThumbnails = valid.length >= 4 && valid.length <= 7;
  const dotCount = Math.min(valid.length, 5);
  const overflow = valid.length > 5 ? valid.length - 5 : 0;
  // When the active slide is past the visible dots, light up the last dot.
  const dotActiveIdx = activeMobile < dotCount ? activeMobile : dotCount - 1;
  const viewAllLabel = `${t.showAll || 'Show all'} ${valid.length} ${t.showAllSuffix || ''}`.trim();

  return (
    <>
      <style>{`
        .gallery-rail::-webkit-scrollbar,
        .gallery-thumbs::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Mobile carousel */}
      <div
        className="md:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} ${valid.length} ${t.photosCount || 'photos'}`}
      >
        {/* sr-only live region so screen readers announce active slide */}
        <span className="sr-only" aria-live="polite">
          {`${activeMobile + 1} / ${valid.length}`}
        </span>

        <div className="-mx-2">
          <div
            ref={railRef}
            className="gallery-rail flex overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {valid.map((img, i) => (
              <div
                key={i}
                ref={(el) => { slideRefs.current[i] = el; }}
                data-idx={i}
                className="flex-shrink-0 w-[88%] mx-1 first:ml-2 last:mr-2 relative"
                style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
              >
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="block w-full overflow-hidden"
                  style={{ borderRadius: 16, background: 'var(--neutral-100)' }}
                  aria-label={`${alt} ${i + 1} / ${valid.length}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || `${alt} ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    className="w-full object-cover"
                    style={{ aspectRatio: '4 / 3', display: 'block' }}
                  />
                </button>

                {/* Counter pill */}
                <div
                  className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 select-none pointer-events-none"
                  style={{
                    color: '#fff',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  <CameraIcon size={12} />
                  <span>{i + 1} / {valid.length}</span>
                </div>

                {/* Caption — bottom-left, gradient-backed for legibility */}
                {img.caption && (
                  <div
                    className="absolute bottom-3 left-3 z-10 max-w-[60%] px-3 py-1.5"
                    style={{
                      color: '#fff',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 8,
                      fontSize: 12,
                      lineHeight: 1.3,
                      letterSpacing: '0.005em',
                      opacity: 0.95,
                    }}
                  >
                    {img.caption}
                  </div>
                )}

                {/* View all — bottom-right, opens lightbox */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openLightbox(i); }}
                  aria-label={viewAllLabel}
                  className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    color: '#fff',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: 9999,
                    border: '1px solid rgba(255,255,255,0.18)',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <MaximizeIcon size={14} />
                  <span>{t.showAll || 'View all'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pill-style dot indicator (Apple Photos pattern) */}
        {valid.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3" role="tablist" aria-label={`${alt} navigation`}>
            {Array.from({ length: dotCount }).map((_, i) => {
              const active = i === dotActiveIdx;
              const targetIdx = i === dotCount - 1 && overflow > 0 ? activeMobile : i;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? 'true' : undefined}
                  aria-label={`${alt} ${targetIdx + 1} / ${valid.length}`}
                  onClick={() => goToSlide(targetIdx)}
                  className="transition-all duration-300 ease-out"
                  style={{
                    width: active ? 24 : 8,
                    height: 8,
                    borderRadius: 9999,
                    background: active ? 'var(--neutral-900)' : 'var(--neutral-300)',
                    border: 0,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              );
            })}
            {overflow > 0 && (
              <span
                className="ml-1 text-[11px] font-medium tabular-nums"
                style={{ color: 'var(--neutral-500)' }}
              >
                +{overflow}
              </span>
            )}
          </div>
        )}

        {/* Thumbnail strip — 4-7 photos only */}
        {showThumbnails && (
          <div className="relative mt-3">
            <div
              className="gallery-thumbs px-4 flex gap-2 overflow-x-auto"
              style={{
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {valid.map((img, i) => {
                const active = i === activeMobile;
                return (
                  <button
                    key={i}
                    type="button"
                    ref={(el) => { thumbRefs.current[i] = el; }}
                    onClick={() => goToSlide(i)}
                    aria-label={`${alt} ${i + 1} / ${valid.length}`}
                    aria-current={active ? 'true' : undefined}
                    className="flex-shrink-0 transition-all duration-200"
                    style={{
                      width: 60,
                      height: 44,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: active ? '2px solid var(--neutral-900)' : '1px solid var(--neutral-200)',
                      opacity: active ? 1 : 0.55,
                      transform: active ? 'scale(1.04)' : 'scale(1)',
                      padding: 0,
                      background: 'var(--neutral-100)',
                      cursor: 'pointer',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover block" />
                  </button>
                );
              })}
            </div>
            {/* Right-edge fade so users see the strip is scrollable */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 h-full w-8"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0), var(--neutral-50, #f8fafc))',
              }}
            />
          </div>
        )}
      </div>

      {/* --- desktop mosaic --- */}
      <div className="hidden md:block relative">
        <Mosaic images={valid} alt={alt} onOpen={openLightbox} />
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
          style={{
            background: 'var(--atom-surface)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-pill)',
            color: 'var(--neutral-900)',
            boxShadow: 'var(--atom-shadow-md)',
          }}
        >
          <GridIcon size={16} />
          {t.showAll} {valid.length} {t.showAllSuffix}
        </button>
      </div>

      {open && (
        <Lightbox
          images={valid}
          startIndex={openIndex}
          onClose={() => setOpen(false)}
          alt={alt}
          lang={lang}
        />
      )}
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
        <img src={images[0].url} alt={images[0].alt || alt} className="w-full h-full object-cover" />
      </button>
    );
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-2" style={{ aspectRatio: '16 / 7' }}>
        {images.slice(0, 2).map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpen(i)}
            className="block w-full h-full"
            style={{ borderRadius: radius, ...baseStyle }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || `${alt} ${i + 1}`} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
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
        <img src={large.url} alt={large.alt || `${alt} 1`} className="absolute inset-0 w-full h-full object-cover" />
      </button>
      {small.length > 0 && (
        <div className={`grid gap-2 ${small.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'}`}>
          {small.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onOpen(i + 1)}
              className="relative"
              style={{ borderRadius: radius, ...baseStyle }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `${alt} ${i + 2}`}
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

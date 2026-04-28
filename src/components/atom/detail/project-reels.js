'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/video';
import ReelLightbox from './reel-lightbox';
import { getDict } from '@/lib/i18n';

const CARD_WIDTH = 280;
const CARD_GAP = 16;
const TRANSITION_MS = 300;

function sortReels(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r && r.id)
    .map((r) => ({ id: String(r.id), title: r.title || '', order: Number(r.order) || 0 }))
    .sort((a, b) => a.order - b.order);
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isSlowConnection() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection;
  if (!c) return false;
  return c.effectiveType === '2g' || c.effectiveType === 'slow-2g' || c.saveData === true;
}

// Inline carousel of YouTube Shorts. Layout shows the active reel centred
// with neighbour posters peeking at the edges so users can see at a glance
// that there are more videos. Single iframe alive at any time — neighbours
// render as static <img> posters, only the active card mounts the embed
// once the transition settles. Tap a peeking poster to jump to it; tap the
// active card's expand button to open the fullscreen lightbox.
export default function ProjectReels({ reels, lang = 'en' }) {
  const list = sortReels(reels);
  const labels = getDict(lang).pages.detail.reels;
  const [index, setIndex] = useState(0);
  const [embedIndex, setEmbedIndex] = useState(-1);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [allowAutoplay, setAllowAutoplay] = useState(false);
  const [poster404, setPoster404] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sectionRef = useRef(null);
  const transitionTimer = useRef(null);
  const last = list.length - 1;

  useEffect(() => {
    setAllowAutoplay(!prefersReducedMotion() && !isSlowConnection());
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) setInView(e.isIntersecting); },
      { rootMargin: '0px', threshold: 0.25 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onVisibility = () => setTabVisible(!document.hidden);
    setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !list.length) return;
    const m = window.location.hash.match(/^#reel-(\d+)$/);
    if (m) {
      const reelNum = parseInt(m[1], 10);
      const startIdx = Math.max(0, Math.min(last, reelNum - 1));
      setIndex(startIdx);
      setLightboxOpen(true);
    }
  }, [list.length, last]);

  useEffect(() => {
    setEmbedIndex(-1);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setEmbedIndex(index);
    }, TRANSITION_MS);
    return () => clearTimeout(transitionTimer.current);
  }, [index]);

  const next = useCallback(() => setIndex((i) => (i >= last ? 0 : i + 1)), [last]);
  const prev = useCallback(() => setIndex((i) => (i <= 0 ? last : i - 1)), [last]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    },
    [next, prev],
  );

  const touch = useRef({ x: 0 });
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX }; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next(); else prev();
  };

  if (list.length === 0) return null;

  const active = list[index];
  const shouldEmbedActive =
    inView &&
    tabVisible &&
    allowAutoplay &&
    embedIndex === index;
  const stripOffsetPx = index * (CARD_WIDTH + CARD_GAP);

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={labels.heading}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {labels.heading}
      </h2>

      <div className="relative">
        <div
          className="relative"
          style={{ overflow: 'hidden' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative flex items-stretch"
            style={{
              gap: CARD_GAP,
              transform: `translateX(calc(50% - ${CARD_WIDTH / 2}px - ${stripOffsetPx}px))`,
              transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
              willChange: 'transform',
            }}
          >
            {list.map((reel, i) => {
              const isActive = i === index;
              const distance = Math.abs(i - index);
              return (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  isActive={isActive}
                  distance={distance}
                  posterFallback={poster404[reel.id]}
                  onPosterError={() => setPoster404((s) => ({ ...s, [reel.id]: true }))}
                  onClickPoster={() => {
                    if (!isActive) setIndex(i);
                  }}
                  onExpand={() => setLightboxOpen(true)}
                  onPlay={() => setLightboxOpen(true)}
                  embed={isActive && shouldEmbedActive}
                  expandLabel={labels.expand}
                  playLabel={labels.play}
                />
              );
            })}
          </div>
        </div>

        {list.length > 1 && (
          <>
            <NavButton
              direction="prev"
              ariaLabel={labels.prev}
              onClick={prev}
              className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 z-10"
            />
            <NavButton
              direction="next"
              ariaLabel={labels.next}
              onClick={next}
              className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 z-10"
            />
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={prev}
            aria-label={labels.prev}
            className="md:hidden inline-flex items-center justify-center"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-200)',
              color: 'var(--neutral-900)',
              boxShadow: '0 4px 12px rgba(15,22,36,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label={`${labels.heading}: ${index + 1} / ${list.length}`}
          >
            {list.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}${r.title ? ` — ${r.title}` : ''}`}
                onClick={() => setIndex(i)}
                className="transition-all"
                style={{
                  width: i === index ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === index ? 'var(--accent-coral)' : 'var(--neutral-300)',
                  border: 0,
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label={labels.next}
            className="md:hidden inline-flex items-center justify-center"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-200)',
              color: 'var(--neutral-900)',
              boxShadow: '0 4px 12px rgba(15,22,36,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {active.title && (
        <div className="text-sm text-center mt-3 mx-auto" style={{ color: 'var(--neutral-500)', maxWidth: 320 }}>
          {active.title}
        </div>
      )}

      <ReelLightbox
        reels={list}
        open={lightboxOpen}
        startIndex={index}
        onClose={() => setLightboxOpen(false)}
        lang={lang}
      />
    </section>
  );
}

function ReelCard({
  reel,
  isActive,
  distance,
  posterFallback,
  onPosterError,
  onClickPoster,
  onExpand,
  onPlay,
  embed,
  expandLabel,
  playLabel,
}) {
  const poster = posterFallback
    ? youtubeThumbnail(reel.id, 'hqdefault')
    : youtubeThumbnail(reel.id, 'maxresdefault');
  const src = embed ? youtubeEmbedUrl(reel.id, 'inline') : null;

  const opacity = isActive ? 1 : distance === 1 ? 0.55 : 0.3;
  const scale = isActive ? 1 : 0.92;

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width: CARD_WIDTH,
        aspectRatio: '9 / 16',
        borderRadius: 16,
        background: '#000',
        boxShadow: isActive ? '0 16px 40px rgba(15,22,36,0.18)' : '0 6px 16px rgba(15,22,36,0.08)',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow ${TRANSITION_MS}ms ease`,
        cursor: isActive ? 'default' : 'pointer',
      }}
      aria-roledescription="slide"
      aria-label={`${reel.title || ''}${isActive ? ' (active)' : ''}`}
      onClick={isActive ? undefined : onClickPoster}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          onError={onPosterError}
          className="absolute inset-0 w-full h-full object-cover"
          loading={distance > 1 ? 'lazy' : 'eager'}
          aria-hidden
        />
      )}

      {src && (
        <iframe
          key={`reel-${reel.id}`}
          src={src}
          title={reel.title || 'Reel'}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}

      {isActive && !src && (
        <button
          type="button"
          onClick={onPlay}
          aria-label={playLabel}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 64, height: 64,
              background: 'var(--accent-coral)',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(255,107,92,0.4)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ marginLeft: 4 }}>
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </span>
        </button>
      )}

      {isActive && (
        <button
          type="button"
          onClick={onExpand}
          aria-label={expandLabel}
          className="absolute top-3 right-3 w-9 h-9 rounded-full inline-flex items-center justify-center text-white"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      )}
    </div>
  );
}

function NavButton({ direction, ariaLabel, onClick, className }) {
  const path = direction === 'prev'
    ? <polyline points="15 18 9 12 15 6" />
    : <polyline points="9 18 15 12 9 6" />;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group items-center justify-center transition-transform hover:scale-105 active:scale-95 ${className || ''}`}
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'var(--atom-surface)',
        border: '1px solid var(--neutral-200)',
        color: 'var(--neutral-900)',
        boxShadow: '0 8px 24px rgba(15,22,36,0.15)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {path}
      </svg>
    </button>
  );
}

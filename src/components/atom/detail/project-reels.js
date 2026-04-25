'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/video';
import ReelLightbox from './reel-lightbox';

const STRINGS = {
  en: { heading: 'Highlights', prev: 'Previous reel', next: 'Next reel', expand: 'Expand video', play: 'Play video' },
  tr: { heading: 'Öne Çıkanlar', prev: 'Önceki video', next: 'Sonraki video', expand: 'Tam ekran', play: 'Videoyu oynat' },
  ar: { heading: 'أبرز اللحظات', prev: 'الفيديو السابق', next: 'الفيديو التالي', expand: 'تكبير الفيديو', play: 'تشغيل الفيديو' },
};

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

// Inline carousel of YouTube Shorts. One iframe is mounted only when the
// section is in view, the page is visible, and the user hasn't opted out of
// autoplay (reduced motion or slow connection). Navigating to a new reel
// destroys the previous iframe, so two never coexist.
export default function ProjectReels({ reels, lang = 'en' }) {
  const list = sortReels(reels);
  const labels = STRINGS[lang] || STRINGS.en;
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [allowAutoplay, setAllowAutoplay] = useState(false);
  const [poster404, setPoster404] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sectionRef = useRef(null);
  const last = list.length - 1;

  // Decide once on mount whether autoplay is allowed (motion + connection).
  useEffect(() => {
    setAllowAutoplay(!prefersReducedMotion() && !isSlowConnection());
  }, []);

  // Section-level intersection: mount iframe only while in view.
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { rootMargin: '0px', threshold: 0.25 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Tab visibility — pause when user switches tabs.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onVisibility = () => setTabVisible(!document.hidden);
    setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Hash sync on first mount: open lightbox to the matching reel.
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

  // Keyboard nav when section is focused.
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setIndex((i) => (i >= last ? 0 : i + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setIndex((i) => (i <= 0 ? last : i - 1)); }
    },
    [last],
  );

  // Mobile swipe.
  const touch = useRef({ x: 0, t: 0 });
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, t: Date.now() }; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) setIndex((i) => (i >= last ? 0 : i + 1));
    else setIndex((i) => (i <= 0 ? last : i - 1));
  };

  if (list.length === 0) return null;

  const current = list[index];
  const shouldEmbed = inView && tabVisible && allowAutoplay;
  const poster = poster404[current.id] ? youtubeThumbnail(current.id, 'hqdefault') : youtubeThumbnail(current.id, 'maxresdefault');
  const src = shouldEmbed ? youtubeEmbedUrl(current.id, 'inline') : null;

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

      <div
        className="flex flex-col items-center gap-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* Desktop prev */}
          <button
            type="button"
            onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))}
            aria-label={labels.prev}
            className="hidden md:inline-flex w-11 h-11 rounded-full items-center justify-center transition-colors flex-shrink-0"
            style={{
              background: '#fff',
              border: '1px solid var(--neutral-200)',
              color: 'var(--neutral-700)',
              opacity: list.length > 1 ? 1 : 0.3,
              pointerEvents: list.length > 1 ? 'auto' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Reel card */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width: 280,
              maxWidth: '70vw',
              aspectRatio: '9 / 16',
              background: '#000',
              borderRadius: 16,
              boxShadow: '0 12px 32px rgba(15,22,36,0.12)',
              transition: 'opacity 200ms ease',
              opacity: 1,
            }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${list.length}${current.title ? ` — ${current.title}` : ''}`}
          >
            {/* Poster (always rendered as background; iframe layers over it) */}
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt=""
                onError={() => setPoster404((s) => ({ ...s, [current.id]: true }))}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                aria-hidden
              />
            )}

            {src ? (
              <iframe
                key={`reel-${current.id}-${index}`}
                src={src}
                title={current.title || `Reel ${index + 1}`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              // Static play button when autoplay is suppressed (reduced motion,
              // offscreen, hidden tab, or slow connection).
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={labels.play}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              >
                <span
                  className="inline-flex items-center justify-center rounded-full transition-transform"
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

            {/* Expand button (top-right) */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={labels.expand}
              className="absolute top-3 right-3 w-9 h-9 rounded-full inline-flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>

          {/* Desktop next */}
          <button
            type="button"
            onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
            aria-label={labels.next}
            className="hidden md:inline-flex w-11 h-11 rounded-full items-center justify-center transition-colors flex-shrink-0"
            style={{
              background: '#fff',
              border: '1px solid var(--neutral-200)',
              color: 'var(--neutral-700)',
              opacity: list.length > 1 ? 1 : 0.3,
              pointerEvents: list.length > 1 ? 'auto' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dot indicator */}
        {list.length > 1 && (
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label={`Reel ${index + 1} of ${list.length}`}
          >
            {list.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Reel ${i + 1}${r.title ? ` — ${r.title}` : ''}`}
                onClick={() => setIndex(i)}
                className="transition-all"
                style={{
                  width: i === index ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === index ? 'var(--accent-coral)' : 'var(--neutral-300)',
                  border: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}

        {/* Caption */}
        {current.title && (
          <div className="text-sm text-center" style={{ color: 'var(--neutral-500)', maxWidth: 320 }}>
            {current.title}
          </div>
        )}
      </div>

      <ReelLightbox
        reels={list}
        open={lightboxOpen}
        startIndex={index}
        onClose={() => {
          setLightboxOpen(false);
        }}
        lang={lang}
      />
    </section>
  );
}

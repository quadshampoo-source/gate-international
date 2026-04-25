'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/video';

const STRINGS = {
  en: { close: 'Close', prev: 'Previous reel', next: 'Next reel', counter: '/' },
  tr: { close: 'Kapat', prev: 'Önceki video', next: 'Sonraki video', counter: '/' },
  ar: { close: 'إغلاق', prev: 'الفيديو السابق', next: 'الفيديو التالي', counter: '/' },
};

// Fullscreen TikTok-style modal: portrait iframe, nav buttons (desktop),
// vertical swipe (mobile up=next, down=prev), horizontal swipe right edge =
// close. Hash sync (#reel-N) so links are shareable. Sound on, controls
// visible, body scroll locked. Single iframe alive at any time.
export default function ReelLightbox({
  reels,
  open,
  startIndex = 0,
  onClose,
  lang = 'en',
}) {
  const [index, setIndex] = useState(startIndex);
  const [transitioning, setTransitioning] = useState(false);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const labels = STRINGS[lang] || STRINGS.en;
  const last = (reels?.length || 0) - 1;

  // Sync index when start changes from outside (e.g. clicking a different
  // inline reel while modal is closed → start there next time it opens).
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const goTo = useCallback(
    (newIdx) => {
      if (newIdx === index) return;
      const clamped = Math.max(0, Math.min(last, newIdx));
      setTransitioning(true);
      setIndex(clamped);
      // Brief unmount window so we never have two iframes alive.
      window.setTimeout(() => setTransitioning(false), 200);
    },
    [index, last],
  );

  const next = useCallback(() => {
    goTo(index >= last ? 0 : index + 1);
  }, [goTo, index, last]);

  const prev = useCallback(() => {
    goTo(index <= 0 ? last : index - 1);
  }, [goTo, index, last]);

  // Hash sync: write #reel-N when navigating; clear on close.
  useEffect(() => {
    if (!open) return undefined;
    if (typeof window === 'undefined') return undefined;
    const reelNum = index + 1;
    const newHash = `#reel-${reelNum}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${newHash}`);
    }
    return () => {
      // Clear only if hash still ours.
      if (window.location.hash.startsWith('#reel-')) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    };
  }, [open, index]);

  // Capture trigger on open, restore focus on close.
  useEffect(() => {
    if (!open) return undefined;
    triggerRef.current = typeof document !== 'undefined' ? document.activeElement : null;
    return () => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  // Body scroll lock + keyboard handlers.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, next, prev]);

  // Touch gestures: vertical swipe nav, big horizontal swipe = close.
  const touch = useRef({ x: 0, y: 0, t: 0 });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx < 40 && ady < 40) return;
    if (ady > adx) {
      if (dy < -50) next();        // swipe up → next
      else if (dy > 50) prev();    // swipe down → previous
    } else if (dx > 80) {
      onClose();                    // big swipe right → close
    }
  };

  if (!open || !Array.isArray(reels) || reels.length === 0) return null;
  const current = reels[index];
  const src = transitioning ? null : youtubeEmbedUrl(current.id, 'lightbox');
  const poster = youtubeThumbnail(current.id, 'maxresdefault');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project reels"
      ref={containerRef}
      className="fixed inset-0 z-[60]"
      style={{ background: '#000' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full inline-flex items-center justify-center text-white"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div
        className="absolute top-4 inset-x-0 z-10 text-center text-sm font-mono"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        {index + 1} {labels.counter} {reels.length}
      </div>

      {reels.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={labels.prev}
            className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full items-center justify-center text-white z-10"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={labels.next}
            className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full items-center justify-center text-white z-10"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '9 / 16',
            maxHeight: '90vh',
            width: 'auto',
            height: '90vh',
            maxWidth: '95vw',
            borderRadius: 16,
            background: '#000',
          }}
        >
          {/* Poster fallback during transition + as a fast-paint background. */}
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              aria-hidden
            />
          )}
          {transitioning && (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <span
                className="block"
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.25)',
                  borderTopColor: '#fff',
                  animation: 'reel-spin 0.7s linear infinite',
                }}
              />
              <style>{`@keyframes reel-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {src && (
            <iframe
              key={`lightbox-${current.id}-${index}`}
              src={src}
              title={current.title || `Reel ${index + 1}`}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </div>

      {current.title && (
        <div
          className="absolute bottom-6 inset-x-0 z-10 text-center text-base font-medium px-6"
          style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
        >
          {current.title}
        </div>
      )}
    </div>
  );
}

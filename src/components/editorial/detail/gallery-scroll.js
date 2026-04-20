'use client';

import { useEffect, useRef, useState } from 'react';

// Apple-style horizontal scroll gallery. Native CSS scroll-snap handles
// snapping; pointer-drag is layered on top for desktop mouse users. Touch
// falls through to native smooth swipe. Responsive card widths:
//   mobile  — 85vw (max 600 px)
//   tablet  — 42vw (max 560 px)
//   desktop — 30vw (max 520 px)
// scroll-snap-align: center keeps the focused card in the middle of the
// viewport. A thin gold progress bar (≤200 px, centred) replaces dot
// pagination — no small touch targets.
export default function GalleryScroll({ images = [] }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [images.length]);

  // Touch uses native swipe + CSS snap. Mouse/pen gets a drag layer so
  // desktop users don't have to find the scrollbar.
  const onPointerDown = (e) => {
    const el = scrollRef.current;
    if (!el || e.pointerType === 'touch') return;
    try { el.setPointerCapture(e.pointerId); } catch {}
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startScroll = el.scrollLeft;
    drag.current.moved = 0;
    setIsDragging(true);
    // Disable snap while the pointer is held so dragging feels continuous.
    el.style.scrollSnapType = 'none';
  };
  const onPointerMove = (e) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const walk = (e.clientX - drag.current.startX) * 1.2;
    drag.current.moved = Math.abs(walk);
    el.scrollLeft = drag.current.startScroll - walk;
  };
  const endDrag = () => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current.active = false;
    setIsDragging(false);
    // Re-enable snap — browser snaps to the nearest card on release.
    el.style.scrollSnapType = '';
  };
  const onClickCapture = (e) => {
    if (drag.current.moved > 5) { e.preventDefault(); e.stopPropagation(); }
  };

  if (!images.length) return null;

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: 'rgb(var(--c-bg))' }}>
      <div className="container-x mb-10 md:mb-14">
        <div
          className="font-mono mb-4"
          style={{
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}
        >
          № 04 — GALLERY
        </div>
        <h2
          className="font-editorial"
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Interior <em className="italic">studies.</em>
        </h2>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="gallery-scroll flex gap-4 overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 24,
          paddingRight: 24,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
      >
        <style>{`
          .gallery-scroll::-webkit-scrollbar { display: none; }
          .gallery-scroll .gallery-item { flex: 0 0 85vw; max-width: 600px; }
          @media (min-width: 768px) {
            .gallery-scroll .gallery-item { flex: 0 0 42vw; max-width: 560px; }
          }
          @media (min-width: 1024px) {
            .gallery-scroll .gallery-item { flex: 0 0 30vw; max-width: 520px; }
          }
          .gallery-scroll .gallery-item:hover img { transform: scale(1.04); }
        `}</style>

        {images.map((src, i) => (
          <figure
            key={i}
            className="gallery-item group overflow-hidden rounded-[12px] relative m-0"
            style={{
              aspectRatio: '4 / 3',
              scrollSnapAlign: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading={i <= 1 ? 'eager' : 'lazy'}
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </figure>
        ))}
      </div>

      {/* Progress bar — 2 px tall, centred, max 200 px wide, gold fill.
          Uses --c-line so the track stays visible on both light and dark. */}
      <div
        className="relative mx-auto mt-6 overflow-hidden"
        style={{
          height: 2,
          maxWidth: 200,
          background: 'rgb(var(--c-line))',
          borderRadius: 1,
        }}
      >
        <div
          className="h-full rounded-[1px]"
          style={{
            width: `${Math.max(8, progress * 100)}%`,
            background: '#C9A84C',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </section>
  );
}

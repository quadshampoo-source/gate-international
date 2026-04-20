'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Apple-style horizontal swipe carousel. One image per view, pointer-based
// drag on both desktop and touch via PointerEvents + setPointerCapture.
// Arrow keys (←/→) advance when the carousel has focus. Dot indicators
// snap to the target slide.
export default function GalleryCarousel({ images = [] }) {
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, pointerId: null, width: 0 });

  const clamp = useCallback((i) => Math.max(0, Math.min(images.length - 1, i)), [images.length]);
  const goTo = useCallback((i) => setIndex((cur) => clamp(i)), [clamp]);

  const onPointerDown = (e) => {
    const el = frameRef.current;
    if (!el) return;
    try { el.setPointerCapture(e.pointerId); } catch {}
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.pointerId = e.pointerId;
    drag.current.width = el.getBoundingClientRect().width;
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const deltaX = e.clientX - drag.current.startX;
    // Rubber-band at the ends so the edge feels soft.
    let adjusted = deltaX;
    if (index === 0 && deltaX > 0) adjusted = deltaX * 0.35;
    if (index === images.length - 1 && deltaX < 0) adjusted = deltaX * 0.35;
    setDragPx(adjusted);
  };

  const endDrag = (e) => {
    if (!drag.current.active) return;
    const w = drag.current.width || 1;
    const deltaX = dragPx;
    drag.current.active = false;
    setIsDragging(false);

    const threshold = w * 0.15;
    let nextIndex = index;
    if (deltaX <= -threshold) nextIndex = clamp(index + 1);
    else if (deltaX >= threshold) nextIndex = clamp(index - 1);

    setIndex(nextIndex);
    setDragPx(0);
    try { e?.currentTarget?.releasePointerCapture?.(drag.current.pointerId); } catch {}
    drag.current.pointerId = null;
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(images.length - 1); }
  };

  // Reset if the image set shrinks past the current index.
  useEffect(() => {
    if (index > images.length - 1) setIndex(Math.max(0, images.length - 1));
  }, [images.length, index]);

  if (!images.length) return null;

  const total = images.length;
  const offset = `calc(${-index * 100}% + ${dragPx}px)`;

  return (
    <div className="relative">
      <div
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Interior studies"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
        style={{
          touchAction: 'pan-y',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translate3d(${offset}, 0, 0)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
            willChange: 'transform',
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-full"
              style={{ aspectRatio: '16 / 10' }}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                loading={i <= 1 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover rounded-[12px] pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Carousel slide selector"
        className="flex items-center justify-center gap-[10px] mt-8"
      >
        {images.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2"
              style={{
                width: active ? 24 : 8,
                height: 8,
                background: active ? '#C9A84C' : 'rgba(5,26,36,0.2)',
                transitionDuration: '0.4s',
                transitionTimingFunction: 'ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

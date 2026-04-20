'use client';

import { useEffect, useRef, useState } from 'react';

// Horizontal scroll gallery (not a slider). Large images flow side-by-side.
// Supports mouse drag, native touch swipe, and a thin progress bar instead
// of dots. Images hover-zoom slightly. Scrollbar is hidden.
export default function GalleryScroll({ images = [] }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const [isDragging, setIsDragging] = useState(false);

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

  const onPointerDown = (e) => {
    const el = scrollRef.current;
    if (!el || e.pointerType === 'touch') return; // let touch do native scroll
    try { el.setPointerCapture(e.pointerId); } catch {}
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startScroll = el.scrollLeft;
    drag.current.moved = 0;
    setIsDragging(true);
    el.style.scrollBehavior = 'auto';
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
    el.style.scrollBehavior = '';
  };
  const onClickCapture = (e) => {
    if (drag.current.moved > 5) { e.preventDefault(); e.stopPropagation(); }
  };

  if (!images.length) return null;

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: 'rgb(var(--c-bg))' }}>
      <div className="container-x mb-10 md:mb-14">
        <div
          className="font-mono text-[10px] md:text-[11px] uppercase text-[#C9A84C] mb-4"
          style={{ letterSpacing: '3px' }}
        >
          № 04 — GALLERY
        </div>
        <h2 className="font-editorial text-[36px] md:text-[56px] leading-[1.08] tracking-[-0.02em]">
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
        className="gallery-scroll flex gap-5 md:gap-6 overflow-x-auto pb-4"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          userSelect: isDragging ? 'none' : 'auto',
        }}
      >
        <style>{`.gallery-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div className="shrink-0 w-6 md:w-10" aria-hidden />
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0 group overflow-hidden rounded-[12px]"
            style={{
              width: 'clamp(280px, 72vw, 960px)',
              aspectRatio: '16 / 10',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03] pointer-events-none"
            />
          </div>
        ))}
        <div className="shrink-0 w-6 md:w-10" aria-hidden />
      </div>

      {/* Thin progress bar */}
      <div className="container-x mt-4">
        <div className="relative h-[2px] rounded-full overflow-hidden" style={{ background: 'rgb(var(--c-line))' }}>
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-200"
            style={{ width: `${Math.max(8, progress * 100)}%`, background: '#C9A84C' }}
          />
        </div>
      </div>
    </section>
  );
}

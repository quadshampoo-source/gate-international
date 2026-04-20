'use client';

import { Children, useEffect, useRef, useState } from 'react';

// Horizontal card track with drag-to-scroll. Mouse drag on desktop, native
// touch-swipe on mobile. Snap-to-card on release. No auto-animation.
export default function EditorialMarquee({ children }) {
  const items = Children.toArray(children);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current.active = true;
    drag.current.startX = e.pageX - el.offsetLeft;
    drag.current.startScroll = el.scrollLeft;
    drag.current.moved = 0;
    setIsDragging(true);
    el.style.scrollBehavior = 'auto'; // disable snap smoothing while dragging
  };

  const onMouseMove = (e) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    drag.current.moved = Math.abs(walk);
    el.scrollLeft = drag.current.startScroll - walk;
  };

  const endDrag = () => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current.active = false;
    setIsDragging(false);
    el.style.scrollBehavior = ''; // restore CSS smooth + snap
  };

  // Suppress the click event that fires at the end of a drag — otherwise the
  // card's `<a>` would navigate mid-drag.
  const onClickCapture = (e) => {
    if (drag.current.moved > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const onUp = () => endDrag();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, []);

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={endDrag}
      onClickCapture={onClickCapture}
      className="editorial-marquee relative flex gap-5 md:gap-6 overflow-x-auto pb-2"
      style={{
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* hide native scrollbar in Chrome/Safari */}
      <style>{`.editorial-marquee::-webkit-scrollbar { display: none; }`}</style>

      {/* Left edge spacer so cards don't touch viewport edge on mobile */}
      <div className="shrink-0 w-6 md:w-10" aria-hidden="true" />

      {items.map((c, i) => (
        <div
          key={i}
          className="shrink-0"
          style={{ scrollSnapAlign: 'start' }}
        >
          {c}
        </div>
      ))}

      <div className="shrink-0 w-6 md:w-10" aria-hidden="true" />
    </div>
  );
}

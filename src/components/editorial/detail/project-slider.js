'use client';

import { useEffect, useRef, useState } from 'react';

// Unified image slider shared by Hero, Gallery and Video poster on the
// project detail page. Portrait on mobile (3:4), taller on tablet (4:5),
// landscape on desktop (16:10 capped at 70vh). Each slide may carry an
// overlay of { kicker, title, children }. Touch swipes with 50 px commit
// threshold; mouse users get the same drag behaviour via pointer events.
// Dots: 8 px dormant, 24×8 gold active pill; auto-hidden for single slides.
//
// `variant="dark"` keeps dot contrast on dark sections (Video, Location).
export default function ProjectSlider({
  slides = [],
  variant = 'auto',
  renderOverlay,
  className = '',
}) {
  const [current, setCurrent] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, pointerId: null, width: 0 });

  const count = slides.length;
  const hasMany = count > 1;

  const clamp = (i) => Math.max(0, Math.min(count - 1, i));
  const goTo = (i) => setCurrent(clamp(i));

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
    let dx = e.clientX - drag.current.startX;
    if (current === 0 && dx > 0) dx *= 0.35;
    if (current === count - 1 && dx < 0) dx *= 0.35;
    setDragPx(dx);
  };
  const endDrag = (e) => {
    if (!drag.current.active) return;
    const dx = dragPx;
    drag.current.active = false;
    setIsDragging(false);
    let next = current;
    if (dx <= -50) next = clamp(current + 1);
    else if (dx >= 50) next = clamp(current - 1);
    setCurrent(next);
    setDragPx(0);
    try { e?.currentTarget?.releasePointerCapture?.(drag.current.pointerId); } catch {}
    drag.current.pointerId = null;
  };

  const onKeyDown = (e) => {
    if (!hasMany) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  };

  useEffect(() => {
    if (current > count - 1) setCurrent(Math.max(0, count - 1));
  }, [count, current]);

  if (!count) return null;

  return (
    <div className={`project-slider relative w-full ${className}`}>
      <style>{`
        .project-slider .slide-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 12px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .project-slider .slide-frame { aspect-ratio: 4 / 5; }
        }
        @media (min-width: 1024px) {
          .project-slider .slide-frame { aspect-ratio: 16 / 10; max-height: 70vh; border-radius: 16px; }
        }
      `}</style>

      <div
        ref={frameRef}
        tabIndex={hasMany ? 0 : -1}
        role={hasMany ? 'region' : undefined}
        aria-roledescription={hasMany ? 'carousel' : undefined}
        onPointerDown={hasMany ? onPointerDown : undefined}
        onPointerMove={hasMany ? onPointerMove : undefined}
        onPointerUp={hasMany ? endDrag : undefined}
        onPointerCancel={hasMany ? endDrag : undefined}
        onKeyDown={onKeyDown}
        className="slide-frame outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
        style={{
          touchAction: 'pan-y',
          cursor: hasMany ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none',
          background: 'rgb(var(--c-bg-raised))',
        }}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translate3d(calc(${-current * 100}% + ${dragPx}px), 0, 0)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="shrink-0 w-full h-full relative"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${count}`}
            >
              {slide.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.image}
                  alt={slide.alt || ''}
                  loading={i <= 1 ? 'eager' : 'lazy'}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: slide.fallback || 'linear-gradient(135deg, #273C46 0%, #0B1418 100%)' }}
                />
              )}

              {(slide.kicker || slide.title || slide.children) && (
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    padding: '40px 24px 24px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)',
                  }}
                >
                  {slide.kicker && (
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.75)',
                        marginBottom: 4,
                      }}
                    >
                      {slide.kicker}
                    </div>
                  )}
                  {slide.title && (
                    <div
                      className="font-editorial"
                      style={{
                        fontSize: 'clamp(20px, 5vw, 28px)',
                        fontWeight: 500,
                        color: '#FFFFFF',
                        lineHeight: 1.15,
                      }}
                    >
                      {slide.title}
                    </div>
                  )}
                  {slide.children}
                </div>
              )}

              {/* Non-overlay children (e.g., play button) render on top */}
              {renderOverlay && renderOverlay(slide, i)}
            </div>
          ))}
        </div>
      </div>

      {hasMany && (
        <div
          role="tablist"
          aria-label="Slide selector"
          className="flex items-center justify-center"
          style={{ gap: 8, padding: '16px 0 8px' }}
        >
          {slides.map((_, i) => {
            const active = i === current;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="relative p-0 border-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2"
                style={{
                  width: active ? 24 : 8,
                  height: 8,
                  borderRadius: active ? 4 : '50%',
                  background: active
                    ? '#C9A84C'
                    : variant === 'dark'
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.25)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Invisible touch target — 44 px hit area per iOS HIG */}
                <span
                  aria-hidden
                  className="absolute"
                  style={{ inset: '-10px -6px' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

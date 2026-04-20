'use client';

import { Children } from 'react';

// Pause-on-hover marquee. Children are rendered twice so `translateX(-50%)` in the
// CSS keyframe (editorialMarquee) produces a seamless loop.
export default function EditorialMarquee({ children, speed = 38 }) {
  const items = Children.toArray(children);
  return (
    <div
      className="editorial-marquee relative overflow-hidden"
      onMouseEnter={(e) => { e.currentTarget.querySelector('.editorial-marquee-track').style.animationPlayState = 'paused'; }}
      onMouseLeave={(e) => { e.currentTarget.querySelector('.editorial-marquee-track').style.animationPlayState = 'running'; }}
    >
      <div
        className="editorial-marquee-track flex gap-5 md:gap-6 w-max"
        style={{ animation: `editorialMarquee ${speed}s linear infinite` }}
      >
        {items.map((c, i) => <div key={`a-${i}`} className="shrink-0">{c}</div>)}
        {items.map((c, i) => <div key={`b-${i}`} className="shrink-0" aria-hidden="true">{c}</div>)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20" style={{ background: 'linear-gradient(90deg, #FFFFFF, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20" style={{ background: 'linear-gradient(-90deg, #FFFFFF, transparent)' }} />
    </div>
  );
}

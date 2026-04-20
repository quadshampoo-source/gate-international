'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Horizontal scroll rail of neighbourhood cards. Each card:
//   - Enters with a fade-up + scale-in (stagger via nth-child delay)
//   - Zooms the image + deepens the overlay on hover
//   - Reveals an "Explore →" CTA on hover
// Uses native CSS scroll-snap so mobile flicks feel right without JS.
export default function LocationsRail({ items = [] }) {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setRevealed(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="py-14 md:py-20">
      <style>{`
        .loc-rail {
          display: flex; gap: 16px;
          padding: 0 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .loc-rail::-webkit-scrollbar { display: none; }
        .loc-card {
          flex: 0 0 72vw; max-width: 300px;
          scroll-snap-align: start;
          border-radius: 20px; overflow: hidden;
          text-decoration: none; color: inherit;
          position: relative; cursor: pointer;
          opacity: 0; transform: translateY(40px) scale(0.95);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .loc-rail.revealed .loc-card { opacity: 1; transform: translateY(0) scale(1); }
        .loc-rail.revealed .loc-card:nth-child(1) { transition-delay: 0s; }
        .loc-rail.revealed .loc-card:nth-child(2) { transition-delay: 0.08s; }
        .loc-rail.revealed .loc-card:nth-child(3) { transition-delay: 0.16s; }
        .loc-rail.revealed .loc-card:nth-child(4) { transition-delay: 0.24s; }
        .loc-rail.revealed .loc-card:nth-child(5) { transition-delay: 0.32s; }
        .loc-rail.revealed .loc-card:nth-child(6) { transition-delay: 0.40s; }

        .loc-visual {
          aspect-ratio: 3 / 4; overflow: hidden; position: relative;
        }
        .loc-visual img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loc-card:hover .loc-visual img { transform: scale(1.08); }
        .loc-visual::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top,
            rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%);
          transition: opacity 0.4s ease;
        }
        .loc-card:hover .loc-visual::after { opacity: 0.85; }

        .loc-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 20px; z-index: 2; color: #fff;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loc-card:hover .loc-info { transform: translateY(-8px); }
        .loc-info h3 {
          font-family: var(--font-editorial);
          font-size: 22px; font-weight: 500; margin: 0 0 4px;
          letter-spacing: -0.01em;
        }
        .loc-count {
          font-size: 13px; color: rgba(255,255,255,0.75);
          display: flex; align-items: center; gap: 6px;
        }
        .loc-cta {
          display: inline-flex; align-items: center; gap: 4px;
          margin-top: 12px; font-size: 13px; font-weight: 500;
          color: #C9A84C;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }
        .loc-card:hover .loc-cta { opacity: 1; transform: translateY(0); }
        .loc-cta svg { width: 14px; height: 14px; transition: transform 0.2s ease; }
        .loc-card:hover .loc-cta svg { transform: translateX(3px); }

        @media (min-width: 1024px) {
          .loc-rail { overflow: visible; padding: 0 40px; gap: 20px; }
          .loc-card { flex: 1; max-width: none; }
        }
      `}</style>

      <div className="container-x mb-8">
        <div
          className="font-mono mb-3"
          style={{
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}
        >
          EXPLORE
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
          By <em className="italic">neighbourhood.</em>
        </h2>
      </div>

      <div className={`loc-rail ${revealed ? 'revealed' : ''}`}>
        {items.map((it, i) => {
          let hue = 0;
          const seed = it.href || it.name || '';
          for (let j = 0; j < seed.length; j++) hue = (hue * 31 + seed.charCodeAt(j)) % 360;
          return (
            <Link key={i} href={it.href} className="loc-card" aria-label={`${it.name} · ${it.count} projects`}>
              <div className="loc-visual" style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 45%), hsl(${(hue + 40) % 360} 40% 22%))` }}>
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" loading="lazy" />
                )}
              </div>
              <div className="loc-info">
                <h3>{it.name}</h3>
                <div className="loc-count">
                  <span>{it.count} {it.count === 1 ? 'residence' : 'residences'}</span>
                </div>
                <div className="loc-cta">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

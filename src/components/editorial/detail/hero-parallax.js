'use client';

import { useEffect, useRef, useState } from 'react';

// Full-bleed hero with parallax background and an animated scroll chevron.
// Respects prefers-reduced-motion: parallax and the chevron bounce pause when
// the user has asked the OS for reduced motion.
export default function HeroParallax({ image, name, tagline, kicker, gradientSeed = '' }) {
  const bgRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const el = bgRef.current;
        if (el) {
          const offset = Math.min(window.scrollY * 0.25, 240);
          el.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.06)`;
        }
        rafId = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  // Gradient placeholder for projects without cover images.
  const gradient = (() => {
    let h = 0;
    const seed = gradientSeed || name || '';
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
    return `linear-gradient(135deg, hsl(${h} 35% 42%), hsl(${(h + 40) % 360} 40% 22%))`;
  })();

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight - 80, behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden isolate"
      style={{ height: '100svh', minHeight: 560 }}
      aria-label={name}
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            loading="eager"
            draggable={false}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" style={{ background: gradient }} />
        )}
      </div>

      {/* Dark gradient overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,15,20,0.55) 0%, rgba(5,15,20,0.1) 40%, rgba(5,15,20,0.85) 100%)',
        }}
      />

      <div className="relative z-[2] h-full w-full flex flex-col justify-end pb-[14svh]">
        <div className="container-x">
          {kicker && (
            <div
              className="font-mono text-[10px] md:text-[11px] uppercase text-[#C9A84C] mb-5"
              style={{ letterSpacing: '3px' }}
            >
              {kicker}
            </div>
          )}
          <h1 className="font-editorial text-[56px] md:text-[104px] leading-[0.98] tracking-[-0.02em] text-white max-w-[1100px]">
            {name}
          </h1>
          {tagline && (
            <p className="mt-6 md:mt-7 text-[15px] md:text-[19px] leading-relaxed text-white/85 max-w-[560px]">
              {tagline}
            </p>
          )}
        </div>
      </div>

      {/* Animated scroll chevron */}
      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll for more"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] w-12 h-12 rounded-full flex items-center justify-center text-white/85 hover:text-white"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <span className={reduced ? '' : 'hero-chevron'} aria-hidden>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <style>{`
        @keyframes heroChevronBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%      { transform: translateY(6px); opacity: 0.6; }
        }
        .hero-chevron { display: inline-block; animation: heroChevronBounce 1.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

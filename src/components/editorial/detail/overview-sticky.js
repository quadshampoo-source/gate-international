'use client';

import { useState } from 'react';
import FadeUp from '@/components/editorial/detail/fade-up';

// Text left, optional pinned image right. Typography:
//   section label   · 12 px · 0.15em · uppercase · gold
//   section heading · clamp(28, 5vw, 48) · serif 400 · LH 1.1
//   lead paragraph  · clamp(18, 2.8vw, 22) · sans · LH 1.55 · full ink
//   body paragraphs · clamp(15, 2.2vw, 17) · sans · LH 1.75 · ink @65%
//   measure         · max 640 px
//
// Only the lead (first) paragraph shows by default. Everything else hides
// behind a "Read more" toggle, and on expand the hidden paragraphs
// fade-up one after another (150 ms stagger). Reduced-motion skips the
// stagger (paragraphs appear instantly).
export default function OverviewSticky({ kicker, title, paragraphs = [], image, alt }) {
  const [expanded, setExpanded] = useState(false);
  const [lead, ...tail] = paragraphs;
  const hasTail = tail.length > 0;
  const hasImage = !!image;

  return (
    <section className="py-20 md:py-32" style={{ background: 'rgb(var(--c-bg-raised))' }}>
      <style>{`
        @keyframes overviewFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .overview-tail p {
          opacity: 0;
          transform: translateY(16px);
          will-change: opacity, transform;
        }
        .overview-tail.expanded p {
          animation: overviewFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .overview-tail.expanded p:nth-child(1) { animation-delay: 0ms; }
        .overview-tail.expanded p:nth-child(2) { animation-delay: 150ms; }
        .overview-tail.expanded p:nth-child(3) { animation-delay: 300ms; }
        .overview-tail.expanded p:nth-child(4) { animation-delay: 450ms; }
        .overview-tail.expanded p:nth-child(n+5) { animation-delay: 600ms; }
        @media (prefers-reduced-motion: reduce) {
          .overview-tail p { opacity: 1; transform: none; animation: none; }
        }
      `}</style>

      <div className="container-x">
        <div className={hasImage
          ? 'grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start'
          : 'max-w-[720px] mx-auto'
        }>
          <FadeUp className={hasImage ? 'md:pr-6 lg:pr-10 max-w-[640px]' : 'max-w-[640px] mx-auto'}>
            {kicker && (
              <div
                className="font-mono mb-5"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                }}
              >
                {kicker}
              </div>
            )}
            {title && (
              <h2
                className="font-editorial mb-8"
                style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h2>
            )}

            {/* Lead paragraph — always visible, larger, full ink */}
            {lead && (
              <p
                style={{
                  fontSize: 'clamp(18px, 2.8vw, 22px)',
                  lineHeight: 1.55,
                  color: 'rgb(var(--c-fg))',
                  marginBottom: 0,
                  letterSpacing: '-0.005em',
                }}
              >
                {lead}
              </p>
            )}

            {/* Tail paragraphs — behind "Read more" with staggered fade-up */}
            {hasTail && (
              <>
                <div
                  className={`overview-tail overflow-hidden${expanded ? ' expanded' : ''}`}
                  style={{
                    maxHeight: expanded ? '2000px' : '0px',
                    transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  aria-hidden={!expanded}
                >
                  <div className="space-y-5 pt-6">
                    {tail.map((p, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 'clamp(15px, 2.2vw, 17px)',
                          lineHeight: 1.75,
                          color: 'rgb(var(--c-fg) / 0.65)',
                        }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="mt-4 inline-flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity"
                  style={{
                    fontSize: 14,
                    letterSpacing: '0.02em',
                    color: '#C9A84C',
                    padding: '8px 0',
                  }}
                >
                  {expanded ? 'Show less' : 'Read more'}
                  <span
                    aria-hidden
                    style={{
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                      display: 'inline-flex',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
              </>
            )}
          </FadeUp>

          {hasImage && (
            <FadeUp
              delay={0.1}
              className="md:sticky overflow-hidden rounded-[16px] w-full aspect-[4/5]"
              style={{ top: 96 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={alt || ''}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}

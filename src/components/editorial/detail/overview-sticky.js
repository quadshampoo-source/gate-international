'use client';

import { useState } from 'react';
import FadeUp from '@/components/editorial/detail/fade-up';

// Text left, pinned image right. Apple-style typography rhythm:
//   section label   · 12 px · 0.15em tracking · uppercase · gold
//   section heading · clamp(28, 5vw, 48) · serif · weight 400 · line-height 1.1
//   body text       · clamp(16, 2.5vw, 18) · sans · line-height 1.7 · ink @75%
//   measure         · max 640 px so lines stay comfortable on wide viewports
// Paragraph gap is 24 px (space-y-6). When more than two paragraphs are
// passed, the remainder hides behind a "Read more" toggle with a max-height
// transition; honours prefers-reduced-motion via the FadeUp wrapper.
export default function OverviewSticky({ kicker, title, paragraphs = [], image, alt }) {
  const [expanded, setExpanded] = useState(false);
  const head = paragraphs.slice(0, 2);
  const tail = paragraphs.slice(2);
  const hasTail = tail.length > 0;

  return (
    <section className="py-20 md:py-32" style={{ background: 'rgb(var(--c-bg-raised))' }}>
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          <FadeUp className="md:pr-6 lg:pr-10 max-w-[640px]">
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
            <div
              className="space-y-6"
              style={{
                fontSize: 'clamp(16px, 2.5vw, 18px)',
                lineHeight: 1.7,
                color: 'rgb(var(--c-fg) / 0.75)',
              }}
            >
              {head.map((p, i) => <p key={i}>{p}</p>)}
              <div
                className="overflow-hidden transition-[max-height] duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ maxHeight: hasTail && expanded ? '2000px' : '0px' }}
                aria-hidden={!expanded}
              >
                <div className="space-y-6 pt-6">
                  {tail.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </div>
            {hasTail && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-6 inline-flex items-center gap-2 font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                }}
              >
                {expanded ? 'Show less' : 'Read more'}
                <span
                  aria-hidden
                  style={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            )}
          </FadeUp>

          <FadeUp
            delay={0.1}
            className="md:sticky overflow-hidden rounded-[16px] w-full aspect-[4/5]"
            style={{ top: 96 }}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={alt || ''}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #273C46 0%, #0B1418 100%)' }}
              />
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

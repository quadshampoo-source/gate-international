'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MOBILE_COLLAPSE_THRESHOLD = 600;

// Renders project.description as markdown. On mobile, collapses long bodies
// (>600 chars) behind a "Read more" toggle. Atom-styled prose without the
// Tailwind Typography plugin — small bespoke ruleset is enough.
export default function MarkdownDescription({ markdown }) {
  const [expanded, setExpanded] = useState(false);
  const text = (markdown || '').trim();
  if (!text) return null;

  const long = text.length > MOBILE_COLLAPSE_THRESHOLD;

  return (
    <section>
      <style>{`
        .atom-md p { margin: 0 0 16px; line-height: 1.7; color: var(--neutral-700); font-size: 16px; }
        .atom-md h1, .atom-md h2, .atom-md h3 { color: var(--neutral-900); font-weight: 600; line-height: 1.3; margin: 24px 0 12px; letter-spacing: -0.01em; }
        .atom-md h1 { font-size: 24px; }
        .atom-md h2 { font-size: 20px; }
        .atom-md h3 { font-size: 18px; }
        .atom-md ul, .atom-md ol { margin: 0 0 16px; padding-left: 24px; color: var(--neutral-700); }
        .atom-md li { margin-bottom: 6px; line-height: 1.6; }
        .atom-md a { color: var(--primary-600); text-decoration: underline; text-underline-offset: 3px; }
        .atom-md a:hover { color: var(--primary-700); }
        .atom-md strong { color: var(--neutral-900); font-weight: 600; }
        .atom-md em { color: var(--neutral-700); }
        .atom-md hr { border: 0; border-top: 1px solid var(--neutral-200); margin: 24px 0; }
        .atom-md blockquote { border-left: 3px solid var(--primary-200); padding-left: 16px; color: var(--neutral-500); margin: 0 0 16px; font-style: italic; }

        @media (max-width: 767px) {
          .atom-md-collapsed {
            max-height: 280px;
            overflow: hidden;
            position: relative;
            mask-image: linear-gradient(to bottom, #000 70%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent);
          }
        }
      `}</style>

      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        About this residence
      </h2>

      <div className={`atom-md ${long && !expanded ? 'atom-md-collapsed md:!max-h-none md:!mask-none' : ''}`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="md:hidden mt-3 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: 'var(--primary-600)' }}
        >
          {expanded ? 'Show less' : 'Read more'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </section>
  );
}

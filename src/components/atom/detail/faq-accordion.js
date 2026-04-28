'use client';

import { getDict } from '@/lib/i18n';

// Native <details>/<summary> accordion — no Radix dependency. Atom-styled.
export default function FaqAccordion({ faqs = [], lang = 'en' }) {
  const t = getDict(lang).pages.detail.faq;
  const items = (faqs || []).filter((f) => f && (f.question || f.answer));
  if (items.length === 0) return null;

  return (
    <section>
      <style>{`
        .atom-faq summary { list-style: none; cursor: pointer; }
        .atom-faq summary::-webkit-details-marker { display: none; }
        .atom-faq details[open] .chevron { transform: rotate(180deg); }
      `}</style>

      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div className="atom-faq flex flex-col gap-2">
        {items.map((f, i) => (
          <details
            key={i}
            className="group"
            style={{
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-md)',
            }}
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4">
              <span className="text-base font-semibold pr-4" style={{ color: 'var(--neutral-900)' }}>
                {f.question}
              </span>
              <svg
                className="chevron flex-shrink-0 transition-transform"
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden
                style={{ color: 'var(--neutral-500)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-5 pb-5 -mt-1 text-sm leading-relaxed" style={{ color: 'var(--neutral-700)' }}>
              {f.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState } from 'react';

export default function LegacyTestimonials({ items = [] }) {
  const groups = useMemo(() => {
    if (!items.length) return [];
    const out = [];
    for (let i = 0; i < items.length; i += 3) {
      const slice = items.slice(i, i + 3);
      while (slice.length < 3) slice.push(items[slice.length % items.length] || slice[0]);
      out.push(slice);
    }
    return out;
  }, [items]);

  const [page, setPage] = useState(0);
  if (!groups.length) return null;
  const trio = groups[page % groups.length];
  const next = () => setPage((p) => (p + 1) % groups.length);
  const prev = () => setPage((p) => (p - 1 + groups.length) % groups.length);

  return (
    <section className="testimonials">
      <div className="container">
        <div className="test-head">
          <span className="eyebrow center">— Client stories —</span>
          <h2 style={{ marginTop: 16 }}>Trusted by <span className="ital">investors.</span></h2>
        </div>
        <div className="test-grid">
          {trio.map((t, i) => (
            <article key={`${page}-${i}`} className={`test ${i === 1 ? 'featured' : ''}`}>
              <span className="test-quote-mark">&ldquo;</span>
              <q>{t.quote || t.body || '—'}</q>
              <div>
                <span className="test-rating">★★★★★</span>
              </div>
              <div className="test-author">
                {t.avatar_url || t.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={t.avatar_url || t.avatar} alt="" className="test-avatar" />
                ) : (
                  <span className="test-avatar" aria-hidden />
                )}
                <div>
                  <div className="test-name">{t.name || 'Anonymous'}</div>
                  <div className="test-role">{t.role || t.location || ''}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {groups.length > 1 && (
          <div className="test-nav">
            <button type="button" onClick={prev} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button type="button" onClick={next} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

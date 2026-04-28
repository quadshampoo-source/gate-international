'use client';

import AtomProjectCard from '../project-card';
import { getDict } from '@/lib/i18n';

// Picks 4-6 other projects in same district. Falls back to similar price
// tier if district yields fewer than 3.
export default function SimilarProperties({ projects = [], current, lang = 'en' }) {
  const t = getDict(lang).pages.detail.similar;
  const all = Array.isArray(projects) ? projects.filter((p) => p && p.id !== current?.id) : [];

  let pool = all.filter((p) => p.district === current?.district);
  if (pool.length < 3 && current?.priceUsd) {
    const price = Number(current.priceUsd);
    const lo = price * 0.5;
    const hi = price * 1.6;
    const tierMatches = all
      .filter((p) => Number(p.priceUsd ?? p.price_usd) > 0)
      .filter((p) => {
        const v = Number(p.priceUsd ?? p.price_usd);
        return v >= lo && v <= hi && p.district !== current.district;
      });
    pool = [...pool, ...tierMatches];
  }

  const items = pool.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div className="md:hidden -mx-6 px-6 flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {items.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[80vw] max-w-[340px]">
            <AtomProjectCard project={p} lang={lang} />
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 6).map((p) => (
          <AtomProjectCard key={p.id} project={p} lang={lang} />
        ))}
      </div>
    </section>
  );
}

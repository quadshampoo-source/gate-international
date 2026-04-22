'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function fmtPrice(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fmtFull(n) {
  if (n == null) return '';
  return `$${Number(n).toLocaleString()}`;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'istanbul', label: 'Istanbul', test: (p) => !['Bodrum', 'Bursa'].includes(p.district) },
  { key: 'bodrum', label: 'Bodrum', test: (p) => p.district === 'Bodrum' },
  { key: 'bursa', label: 'Bursa', test: (p) => p.district === 'Bursa' },
  { key: 'citizenship', label: 'Citizenship', test: (p) => (Number(p.priceUsd ?? p.price_usd) || 0) >= 400_000 },
  { key: 'bosphorus', label: 'Sea / Bosphorus', test: (p) => /bosphorus|marmara|sea/i.test(p.view || '') },
];

const SORTS = [
  { key: 'price-asc', label: 'SORT BY: PRICE ↑' },
  { key: 'price-desc', label: 'SORT BY: PRICE ↓' },
  { key: 'newest', label: 'SORT BY: NEWEST' },
];

export default function LegacyProperties({ projects = [], lang }) {
  const [filter, setFilter] = useState('all');
  const [sortIdx, setSortIdx] = useState(0);

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter);
    let list = projects;
    if (active?.test) list = list.filter(active.test);
    const sort = SORTS[sortIdx].key;
    const priceOf = (p) => Number(p.priceUsd ?? p.price_usd) || 0;
    if (sort === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    return list.slice(0, 9);
  }, [projects, filter, sortIdx]);

  return (
    <section className="props">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>— Portfolio —</span>
            <h2>Featured <span className="ital">residences.</span></h2>
          </div>
          <div className="right">
            <p>Hand-picked premium residences across Istanbul, Bodrum and Bursa — vetted for location, developer track record and investor-grade documentation.</p>
            <Link href={`/${lang}/projects`} className="btn-ghost btn-arrow">View All</Link>
          </div>
        </div>

        <div className="filter-row">
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`filter-chip ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" className="sort" onClick={() => setSortIdx((i) => (i + 1) % SORTS.length)}>
            {SORTS[sortIdx].label}
          </button>
        </div>

        <div className="prop-grid">
          {visible.map((p, i) => {
            const price = Number(p.priceUsd ?? p.price_usd) || 0;
            const img = (Array.isArray(p.exteriorImages) && p.exteriorImages[0])
              || (Array.isArray(p.gallery) && p.gallery[0])
              || p.img
              || null;
            const tag = (p.status === 'delivered' || p.deliveryStatus === 'DELIVERED') ? 'Delivered' : 'For Sale';
            const sale = tag === 'For Sale';
            const bed = p.bedrooms || '—';
            const area = p.area ? `${p.area} m²` : null;
            const view = p.view || null;
            return (
              <Link key={p.id} href={`/${lang}/project/${p.id}`} className="prop reveal in">
                <div className="prop-img">
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img} alt={p.name} loading="lazy" />
                  )}
                  <span className={`prop-tag ${sale ? 'sale' : ''}`}>{tag}</span>
                  <span className="prop-save" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  </span>
                </div>
                <div className="prop-body">
                  <div className="prop-top">
                    <span className="prop-title">{p.name}</span>
                    <span className="prop-price">{fmtFull(price)}<span className="cur">USD</span></span>
                  </div>
                  <div className="prop-loc">{(p.district || '').toUpperCase()}{p.developer ? ` · ${p.developer.toUpperCase()}` : ''}</div>
                  <div className="prop-meta">
                    <span>
                      <svg viewBox="0 0 24 24"><path d="M3 10h18v8H3zM7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" /></svg>
                      {bed} Bed
                    </span>
                    {area && (
                      <span>
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M9 3v18" /></svg>
                        {area}
                      </span>
                    )}
                    {view && (
                      <span>
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /></svg>
                        {view}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

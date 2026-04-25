'use client';

import { useState } from 'react';

const fmtUsd = (n) => {
  if (!n && n !== 0) return null;
  const v = typeof n === 'string' ? Number(String(n).replace(/[^\d.]/g, '')) : Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `$${v.toLocaleString()}`;
};

// Tab UI for project.options (unit types). Each tab body shows size + price.
export default function ConfigurationsTabs({ options = [], unitTypes = [] }) {
  const cleaned = (options || [])
    .filter((o) => o && (o.type || o.size || o.price))
    .map((o) => ({
      type: o.type || '—',
      size: o.size ? Number(String(o.size).replace(/\D/g, '')) || o.size : null,
      price: fmtUsd(o.price),
    }));

  const fallback = !cleaned.length && Array.isArray(unitTypes) && unitTypes.length
    ? unitTypes.map((t) => ({ type: t, size: null, price: null }))
    : [];

  const items = cleaned.length ? cleaned : fallback;
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;

  const current = items[active];

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        Available configurations
      </h2>

      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="flex-shrink-0 px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              background: active === i ? 'var(--primary-50)' : '#fff',
              border: '1px solid',
              borderColor: active === i ? 'var(--primary-200)' : 'var(--neutral-200)',
              color: active === i ? 'var(--primary-700)' : 'var(--neutral-700)',
              borderRadius: 'var(--atom-radius-pill)',
            }}
          >
            {o.type}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
        style={{
          background: '#fff',
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--atom-radius-lg)',
        }}
      >
        <Stat label="Layout" value={current.type} />
        <Stat label="Size" value={current.size ? `${current.size} m²` : '—'} />
        <Stat label="From" value={current.price || 'On request'} accent />
      </div>
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
        {label}
      </div>
      <div
        className="mt-2 text-xl md:text-2xl font-bold"
        style={accent ? {
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        } : { color: 'var(--neutral-900)' }}
      >
        {value}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { getDict } from '@/lib/i18n';

const fmtUsd = (n) => {
  if (!n && n !== 0) return null;
  const v = typeof n === 'string' ? Number(String(n).replace(/[^\d.]/g, '')) : Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `$${v.toLocaleString()}`;
};

// Renders pricing rows from project.priceTable (preferred — supports ranges
// + per-row notes) or falls back to project.options (legacy single-price
// shape) and then to plain unit_types names.
function normalize({ priceTable, options, unitTypes }) {
  if (Array.isArray(priceTable) && priceTable.length) {
    return priceTable
      .filter((r) => r && (r.type || r.priceUsd || r.areaM2))
      .map((r) => ({
        type: r.type || '—',
        size: r.areaM2 != null ? Number(r.areaM2) : null,
        sizeMax: r.areaM2Max != null ? Number(r.areaM2Max) : null,
        priceMin: r.priceUsd != null ? Number(r.priceUsd) : null,
        priceMax: r.priceUsdMax != null ? Number(r.priceUsdMax) : null,
        note: r.note || null,
      }));
  }
  if (Array.isArray(options) && options.length) {
    return options
      .filter((o) => o && (o.type || o.size || o.price))
      .map((o) => ({
        type: o.type || '—',
        size: o.size ? Number(String(o.size).replace(/\D/g, '')) || null : null,
        sizeMax: null,
        priceMin: o.price ? Number(String(o.price).replace(/\D/g, '')) || null : null,
        priceMax: null,
        note: null,
      }));
  }
  if (Array.isArray(unitTypes) && unitTypes.length) {
    return unitTypes.map((tp) => ({ type: tp, size: null, sizeMax: null, priceMin: null, priceMax: null, note: null }));
  }
  return [];
}

export default function ConfigurationsTabs({ priceTable, options, unitTypes, priceNote, priceLastUpdated, lang = 'en' }) {
  const t = getDict(lang).pages.detail.configurations;
  const items = normalize({ priceTable, options, unitTypes });
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;
  const current = items[active];

  const sizeLabel = current.sizeMax && current.size && current.sizeMax !== current.size
    ? `${current.size}–${current.sizeMax} m²`
    : current.size != null
      ? `${current.size} m²`
      : '—';

  const priceLabel = current.priceMin != null && current.priceMax != null && current.priceMax !== current.priceMin
    ? `${fmtUsd(current.priceMin)} – ${fmtUsd(current.priceMax)}`
    : current.priceMin != null
      ? `${fmtUsd(current.priceMin)}`
      : t.onRequest;

  const showFromPrefix = current.priceMin != null && (current.priceMax == null || current.priceMax === current.priceMin);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
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
        <Stat label={t.layout} value={current.type} />
        <Stat label={t.size} value={sizeLabel} />
        <Stat
          label={showFromPrefix ? t.from : t.priceRange}
          value={priceLabel}
          accent
          caption={current.note}
        />
      </div>

      {(priceNote || priceLastUpdated) && (
        <p className="mt-3 text-xs" style={{ color: 'var(--neutral-500)' }}>
          {priceNote}
          {priceNote && priceLastUpdated ? ' · ' : ''}
          {priceLastUpdated && `${t.updatedPrefix} ${formatDate(priceLastUpdated, lang)}`}
        </p>
      )}
    </section>
  );
}

function Stat({ label, value, accent, caption }) {
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
      {caption && (
        <div className="mt-1 text-xs" style={{ color: 'var(--neutral-500)' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function formatDate(d, lang) {
  const localeMap = { en: 'en-US', ar: 'ar-SA', zh: 'zh-CN', ru: 'ru-RU', fa: 'fa-IR', fr: 'fr-FR' };
  try {
    return new Date(d).toLocaleDateString(localeMap[lang] || 'en-US', { month: 'long', year: 'numeric' });
  } catch {
    return String(d);
  }
}

'use client';

import { getDict } from '@/lib/i18n';

// Top 5 amenities — horizontal scroll on mobile, 5-up grid on desktop.
export default function HighlightsList({ amenities = [], lang = 'en' }) {
  const t = getDict(lang).pages.detail.highlights;
  const items = (amenities || []).filter(Boolean).slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div
        className="md:hidden -mx-6 px-6 flex gap-3 overflow-x-auto"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((a, i) => <Card key={i} amenity={a} mobile />)}
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((a, i) => <Card key={i} amenity={a} />)}
      </div>
    </section>
  );
}

function Card({ amenity, mobile }) {
  return (
    <div
      className={mobile ? 'flex-shrink-0 w-[180px]' : ''}
      style={{
        background: 'var(--atom-surface)',
        border: '1px solid var(--neutral-200)',
        borderRadius: 'var(--atom-radius-lg)',
        padding: 16,
        boxShadow: 'var(--atom-shadow-sm)',
      }}
    >
      <div style={{ fontSize: 28, lineHeight: 1 }}>{amenity.icon || '✨'}</div>
      <div className="mt-3 text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>
        {amenity.label}
      </div>
      {amenity.description && (
        <div className="mt-1 text-xs leading-snug" style={{ color: 'var(--neutral-500)' }}>
          {amenity.description}
        </div>
      )}
    </div>
  );
}

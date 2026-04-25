'use client';

// Full grid of all amenities. Responsive: 4 cols desktop, 3 tablet, 2 mobile.
// Each cell: icon + label (no description — kept clean).
export default function AmenitiesGrid({ amenities = [] }) {
  const items = (amenities || []).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        Amenities
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4"
            style={{
              background: '#fff',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-md)',
            }}
          >
            <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{a.icon || '✓'}</div>
            <div className="text-sm font-medium leading-snug" style={{ color: 'var(--neutral-900)' }}>
              {a.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

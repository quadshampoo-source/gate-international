'use client';

import { getDict } from '@/lib/i18n';

// Building-level specs — distinct from unit specs (bedrooms/bathrooms/area).
// Reads from project.techSpecs (jsonb) so other projects without the field
// stay invisible. Renders as a compact icon-grid; hides if nothing matches.
function snakeKey(k) {
  return String(k).replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function pickFromTechSpecs(techSpecs, key) {
  if (!techSpecs || typeof techSpecs !== 'object') return null;
  if (techSpecs[key] != null) return techSpecs[key];
  // Some upstream callers may still hand us camelCase — accept both.
  for (const k of Object.keys(techSpecs)) {
    if (snakeKey(k) === key) return techSpecs[k];
  }
  return null;
}

export default function BuildingSpecs({ techSpecs, lang = 'en' }) {
  const t = getDict(lang).pages.detail.buildingSpecs;
  const FIELDS = [
    { key: 'floors_per_building', icon: '🏢', label: t.floors },
    { key: 'parking_lots', icon: '🅿️', label: t.parking },
    { key: 'guest_lifts', icon: '🛗', label: t.guestLifts },
    { key: 'service_lifts', icon: '🚪', label: t.serviceLifts },
    { key: 'ceiling_height_m', icon: '📏', label: t.ceilingHeight, suffix: ' m' },
    { key: 'size_range_m2', icon: '📐', label: t.sizeRange, suffix: ' m²' },
    { key: 'zone_number', icon: '📍', label: t.zone, prefix: t.zonePrefix },
    { key: 'parent_development', icon: '🏗️', label: t.parent },
  ];

  if (!techSpecs || typeof techSpecs !== 'object') return null;
  const cells = FIELDS
    .map((f) => {
      const raw = pickFromTechSpecs(techSpecs, f.key);
      if (raw == null || raw === '') return null;
      let display = String(raw);
      if (f.suffix) display = `${display}${f.suffix}`;
      if (f.prefix) display = `${f.prefix}${display}`;
      return { ...f, display };
    })
    .filter(Boolean);

  // Furnishing options is an array — render as joined string in its own cell.
  const furnishing = pickFromTechSpecs(techSpecs, 'furnishing_options');
  if (Array.isArray(furnishing) && furnishing.length) {
    cells.push({
      key: 'furnishing_options',
      icon: '🪑',
      label: t.furnishing,
      display: furnishing.join(' / '),
    });
  }

  if (cells.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cells.map((c) => (
          <div
            key={c.key}
            className="p-4"
            style={{
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-md)',
            }}
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
              <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>{c.icon}</span>
              {c.label}
            </div>
            <div className="mt-1 text-base md:text-lg font-semibold leading-tight" style={{ color: 'var(--neutral-900)' }}>
              {c.display}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

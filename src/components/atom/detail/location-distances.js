'use client';

import dynamic from 'next/dynamic';
import { getDict } from '@/lib/i18n';

// Lazy-load the map iframe — avoids shipping the embed to first paint.
const LazyMap = dynamic(() => Promise.resolve(MapEmbed), { ssr: false });

// Accept both snake_case and camelCase keys from upstream callers.
function snakeKey(k) {
  return String(k).replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function buildDistanceMeta(t) {
  return {
    metro_km: { icon: '🚇', label: t.metro, suffix: 'km' },
    mall_km: { icon: '🛍️', label: t.shopping, suffix: 'km' },
    school_km: { icon: '🎓', label: t.schools, suffix: 'km' },
    hospital_km: { icon: '🏥', label: t.hospital, suffix: 'km' },
    beach_km: { icon: '🏖️', label: t.beach, suffix: 'km' },
    ferry_km: { icon: '⛴️', label: t.ferry, suffix: 'km' },
    marina_km: { icon: '⛵', label: t.marina, suffix: 'km' },
    lake_km: { icon: '🏞️', label: t.lake, suffix: 'km' },
    ski_resort_km: { icon: '⛷️', label: t.skiResort, suffix: 'km' },
    airport_min: { icon: '✈️', label: t.airport, suffix: 'min' },
    bosphorus_min: { icon: '🌊', label: t.bosphorus, suffix: 'min' },
    business_district_min: { icon: '🏢', label: t.cbd, suffix: 'min' },
    city_center_min: { icon: '🏙️', label: t.cityCenter, suffix: 'min' },
    istiklal_avenue_min: { icon: '🚶', label: t.istiklal, suffix: 'min' },
    galataport_min: { icon: '⚓', label: t.galataport, suffix: 'min' },
    blue_mosque_min: { icon: '🕌', label: t.blueMosque, suffix: 'min' },
    grand_bazaar_min: { icon: '🏺', label: t.grandBazaar, suffix: 'min' },
    kalamis_marina_min: { icon: '⛵', label: t.kalamis, suffix: 'min' },
  };
}

export default function LocationDistances({ distances = {}, address, district, projectName, city = 'Istanbul', lang = 'en' }) {
  const t = getDict(lang).pages.detail.location;
  const DISTANCE_META = buildDistanceMeta(t);

  const pills = Object.entries(distances || {})
    .map(([k, v]) => [snakeKey(k), v])
    .filter(([k, v]) => DISTANCE_META[k] && v != null && v !== '')
    .map(([k, v]) => {
      const m = DISTANCE_META[k];
      return { key: k, icon: m.icon, label: m.label, value: `${v} ${m.suffix}` };
    });

  if (pills.length === 0 && !district) return null;

  const fullAddress = [address, district, city].filter(Boolean).join(', ');

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div
        className="overflow-hidden mb-4"
        style={{
          borderRadius: 'var(--atom-radius-lg)',
          border: '1px solid var(--neutral-200)',
          aspectRatio: '16 / 9',
          background: 'var(--neutral-100)',
        }}
      >
        <LazyMap query={fullAddress || `${district || projectName}, ${city}`} title={`${projectName || district} location`} />
      </div>

      {fullAddress && (
        <div className="text-sm mb-4" style={{ color: 'var(--neutral-500)' }}>
          {fullAddress}
        </div>
      )}

      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <span
              key={p.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm"
              style={{
                background: '#fff',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-pill)',
                color: 'var(--neutral-700)',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{p.icon}</span>
              <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>{p.label}</span>
              <span>{p.value}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function MapEmbed({ query, title }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  return (
    <iframe
      src={src}
      title={title}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

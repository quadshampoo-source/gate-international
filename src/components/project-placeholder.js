'use client';

// Premium fallback rendered when a project has no real image yet.
// - Regional gradient palette (Istanbul / Bodrum / Bursa)
// - Project name in italic serif, large
// - Sub-district + district caption
// - Geometric pattern overlay
// - Small GATE INTERNATIONAL monogram

const PALETTES = {
  // Istanbul — Bosphorus blues with gold hairline
  'maslak':     { from: '#0f1a2e', via: '#182b4d', to: '#0a0a0a', accent: '#C9A84C' },
  'levent':     { from: '#111f3a', via: '#1b2e52', to: '#0a0a0a', accent: '#C9A84C' },
  'beşiktaş':   { from: '#0a1e2f', via: '#10324d', to: '#050a12', accent: '#C9A84C' },
  'beyoğlu':    { from: '#1d1a2e', via: '#2b2345', to: '#0a0a0a', accent: '#C9A84C' },
  'şişli':      { from: '#151526', via: '#231d3a', to: '#0a0a0a', accent: '#C9A84C' },
  'sariyer':    { from: '#0e1c1a', via: '#143230', to: '#0a0f0d', accent: '#C9A84C' },
  'üsküdar':    { from: '#0e1c28', via: '#162c42', to: '#0a0a0a', accent: '#C9A84C' },
  'kağıthane':  { from: '#171b29', via: '#2a2f4a', to: '#0a0a0a', accent: '#C9A84C' },
  'ataşehir':   { from: '#131a2a', via: '#1f2a45', to: '#0a0a0a', accent: '#C9A84C' },
  'göktürk':    { from: '#0f1b15', via: '#142b22', to: '#0a0f0c', accent: '#C9A84C' },
  'güneşli':    { from: '#1d1a14', via: '#2e2920', to: '#0a0a0a', accent: '#C9A84C' },

  // Bodrum — Aegean turquoise + gold
  'bodrum':     { from: '#0a1e2a', via: '#0e3340', to: '#050d12', accent: '#C9A84C' },

  // Bursa — Uludağ emerald
  'bursa':      { from: '#0c1f18', via: '#123328', to: '#0a0f0c', accent: '#C9A84C' },
};

function paletteFor(district) {
  const key = (district || '').toLowerCase();
  return PALETTES[key] || { from: '#111110', via: '#1c1c1c', to: '#0a0a0a', accent: '#C9A84C' };
}

export default function ProjectPlaceholder({ project, className = '' }) {
  const name = project.name || '—';
  const district = (project.district || '').toUpperCase();
  const sub = (project.subDistrict || project.sub_district || '').toUpperCase();
  const pal = paletteFor(project.district);
  const gradient = `linear-gradient(135deg, ${pal.from} 0%, ${pal.via} 55%, ${pal.to} 100%)`;

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: gradient }}
      aria-hidden="true"
    >
      {/* Geometric architectural pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={pal.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#grid-pattern)" />
        {/* Stylised building silhouette */}
        <g fill="none" stroke={pal.accent} strokeWidth="1" strokeOpacity="0.3">
          <rect x="80"  y="200" width="60" height="260" />
          <rect x="150" y="150" width="80" height="310" />
          <rect x="240" y="220" width="50" height="240" />
          <rect x="300" y="170" width="70" height="290" />
        </g>
      </svg>

      {/* Soft gold orb */}
      <div
        className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(closest-side, ${pal.accent}, transparent 70%)` }}
      />

      {/* Top corner: number plate + accent line */}
      <div className="absolute top-5 left-5 right-5 flex items-center gap-3">
        <span
          className="font-mono text-[10px] tracking-[0.22em] px-2 py-1 rounded-sm"
          style={{ color: pal.accent, border: `1px solid ${pal.accent}55`, background: 'rgba(0,0,0,0.3)' }}
        >
          GATE
        </span>
        <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${pal.accent}66, transparent)` }} />
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-7">
        <div
          className="font-mono text-[10px] tracking-[0.2em] mb-3"
          style={{ color: pal.accent, opacity: 0.8 }}
        >
          {sub ? `${district} · ${sub}` : district}
        </div>
        <div className="font-serif italic text-white text-[26px] md:text-[30px] leading-[1.05] tracking-[-0.01em] max-w-[85%]">
          {name}
        </div>
      </div>

      {/* Subtle top-to-bottom vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.3) 100%)' }}
      />
    </div>
  );
}

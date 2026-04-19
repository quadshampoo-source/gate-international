'use client';

// Shared animated gradient orb backdrop for cinematic pages.
export default function OrbBackdrop({ hue = 0, intensity = 0.5 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
      <div
        className="absolute w-[110%] h-[80%] rounded-full blur-[140px] animate-orbFloat"
        style={{
          background: `radial-gradient(closest-side, rgb(201 168 76 / ${intensity * 0.55}), transparent 70%)`,
          top: '10%',
          left: '-30%',
          filter: `hue-rotate(${hue}deg)`,
        }}
      />
      <div
        className="absolute w-[80%] h-[60%] rounded-full blur-[120px] animate-orbFloat2"
        style={{
          background: `radial-gradient(closest-side, rgb(201 168 76 / ${intensity * 0.35}), transparent 70%)`,
          bottom: '-20%',
          right: '-20%',
          filter: `hue-rotate(${hue + 20}deg)`,
        }}
      />
    </div>
  );
}

import { ImageResponse } from 'next/og';

// Standard favicon — 32×32 PNG generated from the same gradient + G mark
// the Atom nav uses (--gradient-cta, white bold G in a rounded square).
// Next.js wires this up automatically; <link rel="icon"> appears in <head>.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from 'next/og';

// Apple touch icon — 180×180 PNG. Used when iOS users add the site to
// their home screen. Same gradient + G mark as the favicon, scaled up.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
          borderRadius: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 120,
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

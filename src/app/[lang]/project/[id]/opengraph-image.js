import { ImageResponse } from 'next/og';
import { getProject } from '@/lib/data';
import { localizedProjectName, OG_LOCALE_MAP } from '@/lib/seo';

// Per-project Open Graph image. Renders a 1200×630 social card with the
// hero photo as background, gradient overlay for text legibility, brand
// mark + localised project name + district + price. Generated at request
// time via next/og's ImageResponse — no build-time work needed.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Gate International — premium Turkish residences';

const fmtPrice = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(v / 1_000)}K`;
};

const pickHero = (p) => {
  if (Array.isArray(p.exteriorImages) && p.exteriorImages[0]) return p.exteriorImages[0];
  if (Array.isArray(p.gallery) && p.gallery[0]) return p.gallery[0];
  return p.img || null;
};

export default async function OpenGraphImage({ params }) {
  const { lang, id } = await params;
  const project = await getProject(id);
  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 96,
            fontWeight: 700,
          }}
        >
          Gate International
        </div>
      ),
      size,
    );
  }

  const name = localizedProjectName(project, lang);
  const district = project.district || project.subDistrict || project.sub_district || '';
  const price = fmtPrice(project.priceUsd ?? project.price_usd);
  const hero = pickHero(project);
  const developer = project.developer || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#0F1624',
          fontFamily: 'sans-serif',
        }}
      >
        {hero && (
          // Use plain <img>; ImageResponse handles fetch + render
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt=""
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {/* Dark gradient overlay for text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,22,36,0.35) 0%, rgba(15,22,36,0.55) 55%, rgba(15,22,36,0.92) 100%)',
            display: 'flex',
          }}
        />

        {/* Top-left brand */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            GATE INTERNATIONAL
          </div>
        </div>

        {/* Top-right district pill */}
        {district && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              right: 64,
              padding: '12px 24px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.28)',
              color: '#fff',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {district}
          </div>
        )}

        {/* Bottom: project name + meta row */}
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 64,
            bottom: 64,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: 1000,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              color: 'rgba(255,255,255,0.92)',
              fontSize: 28,
              fontWeight: 500,
            }}
          >
            {price && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 24px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: 30,
                }}
              >
                From {price}
              </div>
            )}
            {developer && (
              <div
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: 24,
                  display: 'flex',
                }}
              >
                {developer}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Locale tag in headers — useful for caches and CDN segmentation.
      headers: {
        'x-og-locale': OG_LOCALE_MAP[lang] || 'en_US',
      },
    },
  );
}

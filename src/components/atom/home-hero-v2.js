import { getDict } from '@/lib/i18n';
import AtomHeroSearch from './hero-search';
import AtomHomeHeroV1 from './home-hero';

// v2 home hero — full-bleed image background with dark overlay for text
// legibility. Same content structure as v1 (eyebrow pill, headline, sub,
// search bar, trust chips) — only the visuals change. Falls back to v1 if
// no image URL is set so the site never breaks.
export default function AtomHomeHeroV2({ lang = 'en', districtList = [], settings }) {
  const t = getDict(lang).pages.home.hero;
  const desktopUrl = settings?.heroImageUrl || null;
  const mobileUrl = settings?.heroImageMobileUrl || desktopUrl;
  const overlay = clamp(settings?.heroOverlayOpacity ?? 0.4, 0, 1);

  if (!desktopUrl) {
    // Empty image → render v1 verbatim. Admin chose v2 but didn't upload yet.
    return <AtomHomeHeroV1 lang={lang} districtList={districtList} />;
  }

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Mobile / desktop image stack — single <picture> would also work but
          keeping two layered <img>s keeps the markup zero-JS. */}
      {mobileUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mobileUrl}
          alt=""
          aria-hidden
          className="md:hidden absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktopUrl}
        alt=""
        aria-hidden
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: '#000', opacity: overlay }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 text-center">
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.14)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-coral)' }} />
          {t.eyebrow}
        </div>
        <h1
          className="atom-h1"
          style={{
            fontSize: 'clamp(40px, 6.5vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: '#fff',
            textShadow: '0 2px 24px rgba(0,0,0,0.35)',
          }}
        >
          {t.titleLead}{' '}
          <span style={{ color: 'var(--accent-coral)' }}>{t.titleHighlight}</span>
        </h1>
        <p
          className="atom-body-lg mt-6 max-w-[640px] mx-auto"
          style={{ color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
        >
          {t.sub}
        </p>

        <div className="mt-10">
          <AtomHeroSearch lang={lang} districts={districtList} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm">
          {t.trustPills.map((label, i) => (
            <TrustPillLight key={i}>{label}</TrustPillLight>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustPillLight({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.14)',
        color: 'rgba(255,255,255,0.92)',
        fontSize: 12,
        fontWeight: 500,
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {children}
    </span>
  );
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

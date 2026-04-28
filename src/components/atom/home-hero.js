import { getDict } from '@/lib/i18n';
import AtomHeroSearch from './hero-search';

// v1 home hero — gradient aura background with eyebrow pill, accent
// headline, sub paragraph, search bar and trust chips. Markup is a direct
// extraction of what used to live inline in `home.js`; output is identical
// pixel-for-pixel so flipping back to v1 is risk-free.
export default function AtomHomeHero({ lang = 'en', districtList = [] }) {
  const t = getDict(lang).pages.home.hero;
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <Aura />
      <div className="relative max-w-[1100px] mx-auto px-6 md:px-10 text-center">
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid var(--primary-200)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-500)' }} />
          {t.eyebrow}
        </div>
        <h1 className="atom-h1" style={{ fontSize: 'clamp(40px, 6.5vw, 72px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
          {t.titleLead}{' '}
          <span className="atom-accent">{t.titleHighlight}</span>
        </h1>
        <p className="atom-body-lg mt-6 max-w-[640px] mx-auto" style={{ color: 'var(--neutral-500)' }}>
          {t.sub}
        </p>

        <div className="mt-10">
          <AtomHeroSearch lang={lang} districts={districtList} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm" style={{ color: 'var(--neutral-500)' }}>
          {t.trustPills.map((label, i) => (
            <TrustPill key={i}>{label}</TrustPill>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustPill({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{ background: 'var(--neutral-100)', color: 'var(--neutral-500)', fontSize: 12, fontWeight: 500 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {children}
    </span>
  );
}

function Aura() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none -z-0"
      style={{
        background: 'radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0) 70%), radial-gradient(50% 60% at 80% 20%, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0) 70%), radial-gradient(40% 50% at 15% 40%, rgba(110,231,231,0.10) 0%, rgba(110,231,231,0) 70%)',
      }}
    />
  );
}

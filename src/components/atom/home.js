import Link from 'next/link';
import { getProjects, getDistricts } from '@/lib/data';
import { getTestimonials } from '@/lib/testimonials';
import AtomProjectCard from './project-card';
import AtomHeroSearch from './hero-search';
import { Button, Card, StatCard, PillTag, IconContainer } from '@/components/ui';

const SERVICES = [
  { title: 'Citizenship pathway', body: 'End-to-end legal guidance from purchase to passport — drafting, filing, follow-up with Nüfus.', link: 'Learn more' },
  { title: 'Property tours', body: 'Curated site visits across Istanbul, Bodrum and Bursa with private drivers and advisors.', link: 'Arrange a tour' },
  { title: 'Legal & title', body: 'Due diligence, TAPU transfer, notarised translations in EN · AR · ZH.', link: 'How it works' },
  { title: 'After-sale', body: 'Furniture procurement, rental management on Airbnb and Booking, tax filings.', link: 'Explore' },
  { title: 'Investment advisory', body: 'ROI and capital-gains modelling, off-plan vs ready, district thesis in plain language.', link: 'Book a call' },
  { title: 'Concierge', body: 'Bank accounts, residency permits, schools, private healthcare — handled on your behalf.', link: 'See list' },
];

export default async function AtomHome({ lang = 'en' }) {
  const [projects, districts, testimonials] = await Promise.all([
    getProjects(),
    getDistricts(),
    getTestimonials(),
  ]);
  const featured = projects.slice(0, 6);
  const districtList = (districts || [])
    .filter((d) => d?.name)
    .map((d) => ({ name: d.name, city: d.city || 'Istanbul' }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <AtomHero aura />
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
            Citizenship eligible from $400K
          </div>
          <h1 className="atom-h1" style={{ fontSize: 'clamp(40px, 6.5vw, 72px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
            Premium Turkish residences,{' '}
            <span className="atom-accent">sourced privately.</span>
          </h1>
          <p className="atom-body-lg mt-6 max-w-[640px] mx-auto" style={{ color: 'var(--neutral-500)' }}>
            A curated portfolio of investor-grade homes across Istanbul, Bodrum and Bursa — vetted for location, developer track record, and clean title.
          </p>

          <div className="mt-10">
            <AtomHeroSearch lang={lang} districts={districtList} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm" style={{ color: 'var(--neutral-500)' }}>
            <TrustPill>Bar-licensed legal</TrustPill>
            <TrustPill>Private listings</TrustPill>
            <TrustPill>6 languages</TrustPill>
            <TrustPill>15 years advisory</TrustPill>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Card padding="md" align="left">
              <StatCard number={String(projects.length)} accent="+" label="Residences" caption="Curated portfolio" />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="3" label="Cities" caption="Istanbul · Bodrum · Bursa" />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="$400" accent="K" label="Citizenship" caption="Minimum investment" />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="98" accent="%" label="Success" caption="Citizenship approvals" />
            </Card>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between gap-8 mb-10 md:mb-12 flex-wrap">
            <div>
              <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Portfolio —</span>
              <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Featured <span className="atom-accent">residences.</span>
              </h2>
            </div>
            <Button href={`/${lang}/projects`} variant="ghost">View all</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <PillTag active href={`/${lang}/projects`}>All</PillTag>
            <PillTag href={`/${lang}/projects?district=Beşiktaş`}>Istanbul</PillTag>
            <PillTag href={`/${lang}/districts/bodrum`}>Bodrum</PillTag>
            <PillTag href={`/${lang}/districts/bursa`}>Bursa</PillTag>
            <PillTag href={`/${lang}/projects?property_type=Villa`}>Villa</PillTag>
            <PillTag href={`/${lang}/projects?property_type=Penthouse`}>Penthouse</PillTag>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <AtomProjectCard key={p.id} project={p} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12 md:mb-16">
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— End-to-end —</span>
            <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Concierge <span className="atom-accent">for investors.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <Card key={i} padding="md" align="left" hairline={false} className="flex flex-col gap-4">
                <IconContainer size="md">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12l3 3 5-6" />
                  </svg>
                </IconContainer>
                <h3 className="atom-h3" style={{ fontSize: 22 }}>{s.title}</h3>
                <p className="atom-body-sm flex-1" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center gap-1 text-sm font-semibold mt-2"
                  style={{ color: 'var(--primary-600)' }}
                >
                  {s.link}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="text-center mb-12 md:mb-16">
              <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Client stories —</span>
              <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Trusted by <span className="atom-accent">investors.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.slice(0, 3).map((t, i) => (
                <Card key={i} padding="md" align="left" hairline={i === 1} className="flex flex-col gap-5">
                  <div
                    style={{
                      fontSize: 48,
                      lineHeight: 0.5,
                      color: 'var(--primary-400)',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    &ldquo;
                  </div>
                  <p className="atom-body" style={{ color: 'var(--neutral-700)' }}>{t.quote || t.body || '—'}</p>
                  <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: '1px solid var(--neutral-100)' }}>
                    {(t.avatar_url || t.avatar) && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={t.avatar_url || t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--neutral-900)' }}>{t.name || 'Anonymous'}</div>
                      <div className="text-xs" style={{ color: 'var(--neutral-400)' }}>{t.role || t.location || ''}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div
            className="relative overflow-hidden text-center p-10 md:p-16"
            style={{
              borderRadius: 'var(--atom-radius-2xl)',
              background: 'var(--gradient-primary)',
              color: '#fff',
              boxShadow: '0 20px 60px rgba(99,102,241,0.30)',
            }}
          >
            <span className="atom-caption" style={{ color: 'rgba(255,255,255,0.8)' }}>— Start here —</span>
            <h2 className="mt-4" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Begin your Turkish chapter.
            </h2>
            <p className="mt-5 max-w-[620px] mx-auto" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17 }}>
              Tell us what you&apos;re looking for. A senior advisor will send a tailored shortlist within one business day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={`/${lang}/contact`}
                variant="ghost"
                className="!bg-white !text-atom-primary-700 !border-transparent hover:!bg-atom-neutral-100"
              >
                Get in touch
              </Button>
              <Button href={`/${lang}/calculator`} variant="ghost" className="!bg-transparent !text-white !border-white/50 hover:!bg-white/10">
                Try the ROI calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

    </>
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

function AtomHero({ aura = false }) {
  if (!aura) return null;
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

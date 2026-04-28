import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getDistricts } from '@/lib/data';
import { getTestimonials } from '@/lib/testimonials';
import { getSiteSettings } from '@/lib/site-settings';
import { getDict } from '@/lib/i18n';
import AtomProjectCard from './project-card';
import AtomHomeHero from './home-hero';
import AtomHomeHeroV2 from './home-hero-v2';
import { Button, Card, StatCard, PillTag, IconContainer } from '@/components/ui';

export default async function AtomHome({ lang = 'en', searchParams }) {
  const t = getDict(lang).pages.home;
  const [projects, districts, testimonials, settings] = await Promise.all([
    getProjects(),
    getDistricts(),
    getTestimonials(),
    getSiteSettings(),
  ]);
  const featured = projects.slice(0, 6);
  const districtList = (districts || [])
    .filter((d) => d?.name)
    .map((d) => ({ name: d.name, city: d.city || 'Istanbul' }));

  // ?preview_hero=v2 (or v1) overrides the saved version — admins use this
  // to preview before committing. Anything else falls back to settings.
  const preview = searchParams?.preview_hero;
  const activeHeroVersion =
    preview === 'v1' || preview === 'v2' ? preview : settings.heroVersion;

  return (
    <>
      {activeHeroVersion === 'v2' ? (
        <AtomHomeHeroV2 lang={lang} districtList={districtList} settings={settings} />
      ) : (
        <AtomHomeHero lang={lang} districtList={districtList} />
      )}

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Card padding="md" align="left">
              <StatCard number={String(projects.length)} accent="+" label={t.stats.residences.label} caption={t.stats.residences.caption} />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="3" label={t.stats.cities.label} caption={t.stats.cities.caption} />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="$400" accent="K" label={t.stats.citizenship.label} caption={t.stats.citizenship.caption} />
            </Card>
            <Card padding="md" align="left">
              <StatCard number="98" accent="%" label={t.stats.success.label} caption={t.stats.success.caption} />
            </Card>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between gap-8 mb-10 md:mb-12 flex-wrap">
            <div>
              <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.featured.kicker} —</span>
              <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {t.featured.titleLead} <span className="atom-accent">{t.featured.titleHighlight}</span>
              </h2>
            </div>
            <Button href={`/${lang}/projects`} variant="ghost">{t.featured.viewAll}</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <PillTag active href={`/${lang}/projects`}>{t.featured.filterAll}</PillTag>
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
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.services.kicker} —</span>
            <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              {t.services.titleLead} <span className="atom-accent">{t.services.titleHighlight}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.services.items.map((s, i) => (
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
              <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.testimonials.kicker} —</span>
              <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {t.testimonials.titleLead} <span className="atom-accent">{t.testimonials.titleHighlight}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.slice(0, 3).map((te, i) => (
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
                  <p className="atom-body" style={{ color: 'var(--neutral-700)' }}>{te.quote || te.body || '—'}</p>
                  <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: '1px solid var(--neutral-100)' }}>
                    {(te.avatar_url || te.avatar) && (
                      <Image
                        src={te.avatar_url || te.avatar}
                        alt=""
                        width={40}
                        height={40}
                        sizes="40px"
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--neutral-900)' }}>{te.name || t.testimonials.anonymous}</div>
                      <div className="text-xs" style={{ color: 'var(--neutral-400)' }}>{te.role || te.location || ''}</div>
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
            <span className="atom-caption" style={{ color: 'rgba(255,255,255,0.8)' }}>— {t.cta.kicker} —</span>
            <h2 className="mt-4" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              {t.cta.title}
            </h2>
            <p className="mt-5 max-w-[620px] mx-auto" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17 }}>
              {t.cta.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={`/${lang}/contact`}
                variant="ghost"
                className="!bg-white !text-atom-primary-700 !border-transparent hover:!bg-atom-neutral-100"
              >
                {t.cta.buttonContact}
              </Button>
              <Button href={`/${lang}/calculator`} variant="ghost" className="!bg-transparent !text-white !border-white/50 hover:!bg-white/10">
                {t.cta.buttonCalc}
              </Button>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Button, Card, StatCard } from '@/components/ui';
import { getDict } from '@/lib/i18n';

export default async function AtomAbout({ lang = 'en' }) {
  const t = getDict(lang).pages.about;
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow={t.hero.eyebrow}
        title={<>{t.hero.titleLead} <span className="atom-accent">{t.hero.titleHighlight}</span></>}
        sub={t.hero.sub}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <Card padding="md" align="left"><StatCard number="15" accent="+" label={t.stats.years.label} caption={t.stats.years.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="6" label={t.stats.offices.label} caption={t.stats.offices.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="6" label={t.stats.languages.label} caption={t.stats.languages.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="250" accent="+" label={t.stats.citizenships.label} caption={t.stats.citizenships.caption} /></Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
          <div>
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.practice.kicker} —</span>
            <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.practice.title}</h2>
          </div>
          <div className="space-y-5">
            <p className="atom-body-lg" style={{ color: 'var(--neutral-700)' }}>
              {t.practice.p1}
            </p>
            <p className="atom-body" style={{ color: 'var(--neutral-500)' }}>
              {t.practice.p2}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.credentials.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.credentials.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.credentials.licenses.map((l, i) => (
              <Card key={i} padding="md" align="left" hairline={i === 0}>
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="inline-grid place-items-center flex-shrink-0"
                    style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-100)', color: 'var(--primary-700)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </span>
                  <div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>{l.title}</div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--neutral-500)' }}>{l.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em' }}>{t.cta.title}</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
              {t.cta.sub}
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={`/${lang}/contact`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">{t.cta.button}</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}

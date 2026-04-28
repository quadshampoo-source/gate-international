import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Button, Card, StatCard } from '@/components/ui';
import { getDict } from '@/lib/i18n';

const PARTNERS = ['Sümer Holding', 'Artaş', 'Sinpaş', 'Özyazıcı', 'Taş Yapı', 'Sur Yapı', 'Dap Yapı', 'Keleşoğlu', 'Rönesans', 'Ağaoğlu'];

export default async function AtomWhyUs({ lang = 'en' }) {
  const t = getDict(lang).pages.whyUs;
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow={t.hero.eyebrow}
        title={<>{t.hero.titleLead} <span className="atom-accent">{t.hero.titleHighlight}</span></>}
        sub={t.hero.sub}
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.pillars.map((p, i) => (
              <Card key={i} padding="md" align="left" hairline={false}>
                <span
                  className="inline-flex items-center justify-center font-mono text-xs mb-4"
                  style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-50)', color: 'var(--primary-700)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{p.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--neutral-500)' }}>{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <Card padding="md" align="left"><StatCard number="97" accent="+" label={t.stats.residences.label} caption={t.stats.residences.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="15" accent="+" label={t.stats.years.label} caption={t.stats.years.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="$1.8" accent="B" label={t.stats.transacted.label} caption={t.stats.transacted.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="98" accent="%" label={t.stats.success.label} caption={t.stats.success.caption} /></Card>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.partnersSection.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.partnersSection.title}</h2>
          <div className="flex flex-wrap gap-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'var(--atom-surface)', border: '1px solid var(--neutral-200)', color: 'var(--neutral-700)' }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>{t.cta.title}</h2>
            <p className="mt-3 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              {t.cta.sub}
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button href={`/${lang}/contact`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">{t.cta.buttonContact}</Button>
              <Button href={`/${lang}/projects`} variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/50">{t.cta.buttonBrowse}</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}

import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Button, Card, StatCard } from '@/components/ui';

const PILLARS = [
  { n: '01', title: 'Private sourcing', body: 'Off-market inventory via direct developer relationships, not portal listings.' },
  { n: '02', title: 'In-house legal', body: 'Bar-licensed lawyers on the team — no outsourced paperwork, no surprises.' },
  { n: '03', title: 'Transparent fees', body: 'One all-in fee, disclosed upfront. No referral kickbacks or hidden markups.' },
  { n: '04', title: 'Native-speaker desks', body: 'English, Arabic, Chinese, Russian, Farsi, French — every language, native.' },
  { n: '05', title: 'After-sale backbone', body: 'Rental management, tax filings, renovation, resale — one team, one thread.' },
  { n: '06', title: 'Fiduciary posture', body: 'If we wouldn\u2019t own it ourselves, we don\u2019t represent it.' },
];

const PARTNERS = ['Sümer Holding', 'Artaş', 'Sinpaş', 'Özyazıcı', 'Taş Yapı', 'Sur Yapı', 'Dap Yapı', 'Keleşoğlu', 'Rönesans', 'Ağaoğlu'];

export default async function AtomWhyUs({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="Why Gate"
        title={<>Discernment, <span className="atom-accent">not volume.</span></>}
        sub="Six habits that separate how we operate from the average Istanbul brokerage."
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((p) => (
              <Card key={p.n} padding="md" align="left" hairline={false}>
                <span
                  className="inline-flex items-center justify-center font-mono text-xs mb-4"
                  style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-50)', color: 'var(--primary-700)' }}
                >
                  {p.n}
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
            <Card padding="md" align="left"><StatCard number="97" accent="+" label="Residences" caption="Active portfolio" /></Card>
            <Card padding="md" align="left"><StatCard number="15" accent="+" label="Years" caption="In Turkish real estate" /></Card>
            <Card padding="md" align="left"><StatCard number="$1.8" accent="B" label="Transacted" caption="Lifetime volume" /></Card>
            <Card padding="md" align="left"><StatCard number="98" accent="%" label="Success" caption="Citizenship approvals" /></Card>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Developer network —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>Who we work with.</h2>
          <div className="flex flex-wrap gap-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: '#fff', border: '1px solid var(--neutral-200)', color: 'var(--neutral-700)' }}
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
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>Let&apos;s start with the brief.</h2>
            <p className="mt-3 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              Budget, timing, city, purpose — and we\u2019ll come back with a short list within one business day.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button href={`/${lang}/contact`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">Get in touch</Button>
              <Button href={`/${lang}/projects`} variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/50">Browse portfolio</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}

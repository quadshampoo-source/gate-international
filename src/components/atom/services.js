import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Button, Card, IconContainer } from '@/components/ui';

const CORE = [
  { title: 'Citizenship pathway', body: 'End-to-end filing — TAPU, appraisal, bank statement, translation, Nüfus follow-up.' },
  { title: 'Legal & title', body: 'Due diligence, contract drafting, notarised translations in EN · AR · ZH.' },
  { title: 'Private sourcing', body: 'Off-market and pre-launch inventory with developer relationships.' },
  { title: 'Property tours', body: 'Curated 3–4 day itineraries with private drivers and bilingual advisors.' },
  { title: 'Investment advisory', body: 'ROI modelling, rental yield scenarios, exit timing.' },
  { title: 'Mortgage structuring', body: 'Access to Turkish banks and developer-backed installment plans.' },
  { title: 'Rental management', body: 'Short-term letting platforms, tenant vetting, tax filings.' },
  { title: 'Furniture & interiors', body: 'Turnkey furnishing packages from local luxury suppliers.' },
  { title: 'Residency permits', body: 'Ikamet applications for the full family, renewal reminders.' },
  { title: 'Concierge', body: 'Bank accounts, schools, private healthcare, household staff.' },
];

const EXTRAS = [
  { title: 'Tax planning', body: 'Structuring across Turkish and home-country obligations.' },
  { title: 'Insurance', body: 'DASK earthquake + private home & contents.' },
  { title: 'Pre-delivery audit', body: 'Independent snag-list before acceptance.' },
  { title: 'Renovation oversight', body: 'Architect-led projects with milestone reporting.' },
  { title: 'Relocation', body: 'Shipping, customs, household move — door to door.' },
  { title: 'Private jet & airport', body: 'Partner service for tour arrivals.' },
  { title: 'Business setup', body: 'Company formation if you&apos;re investing via a Turkish entity.' },
  { title: 'Exit / resale', body: 'Marketing package and negotiation when you&apos;re ready to sell.' },
];

function Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function AtomServices({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="Services"
        title={<>End-to-end <span className="atom-accent">concierge.</span></>}
        sub="Eighteen services — ten core, eight on request — delivered by a single advisor who coordinates every specialist on your behalf."
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Core —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>Always included.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE.map((s, i) => (
              <Card key={i} padding="md" align="left" hairline={false}>
                <IconContainer size="md"><Icon /></IconContainer>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{s.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— On request —</span>
          <h2 className="atom-h2 mt-3 mb-8" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>Optional add-ons.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXTRAS.map((s, i) => (
              <div key={i} className="p-5 bg-white" style={{ borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--neutral-900)' }}>{s.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>One advisor, one brief, one thread.</h2>
            <p className="mt-3 max-w-[640px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              Tell us what you need. We&apos;ll coordinate everything else.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button href={`/${lang}/contact`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">Start a brief</Button>
              <Button href="https://wa.me/" external variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/50">WhatsApp</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}

'use client';

import { useState } from 'react';
import AtomPageHero from './page-hero';
import { Button, Card, StatCard } from '@/components/ui';

const STEPS = [
  { n: '01', title: 'Qualifying purchase', body: 'Buy a Turkish residence worth at least $400,000 and commit to holding it for three years.' },
  { n: '02', title: 'Appraisal & deed', body: 'Independent SPK-licensed appraisal, TAPU transfer, and certificate of conformity filed with the Land Registry.' },
  { n: '03', title: 'Application bundle', body: 'Passport, biometric photos, notarised translations, bank proof, marriage & birth certificates (family).' },
  { n: '04', title: 'Nüfus processing', body: 'Average 2–3 months for approval at the Citizenship Directorate. We track and follow up weekly.' },
  { n: '05', title: 'Oath & passport', body: 'Appointment at your nearest consulate to receive Turkish ID and apply for the e-passport.' },
];

const FAQ = [
  { q: 'Does the investment have to be a single property?', a: 'No — you can aggregate multiple properties as long as the combined appraisal meets the $400,000 threshold.' },
  { q: 'Who counts as family?', a: 'Your spouse and any children under 18. Dependent adults can be added with additional documentation.' },
  { q: 'Can I rent the property during the 3-year hold?', a: 'Yes — rental income is permitted. You must not sell, transfer, or encumber the property during the restriction period.' },
  { q: 'Which currency is the $400K threshold in?', a: 'It&apos;s fixed in USD. The TAPU value in TRY is converted at the Central Bank rate on the transaction date.' },
];

export default function AtomCitizenship({ lang = 'en' }) {
  const [open, setOpen] = useState(0);

  return (
    <>
      <AtomPageHero
        eyebrow="Citizenship by investment"
        title={<>Your family, <span className="atom-accent">Turkish.</span></>}
        sub="A qualifying residence from $400K gives your family Turkish citizenship — approved in roughly three months on average, with visa-free access to 110+ countries."
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <Card padding="md" align="left"><StatCard number="$400" accent="K" label="Minimum" caption="Investment threshold" /></Card>
            <Card padding="md" align="left"><StatCard number="3" label="Years" caption="Property hold period" /></Card>
            <Card padding="md" align="left"><StatCard number="110" accent="+" label="Countries" caption="Visa-free travel" /></Card>
            <Card padding="md" align="left"><StatCard number="98" accent="%" label="Approval" caption="Our client success rate" /></Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Process —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>Five steps, managed.</h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.n} className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 p-6 md:p-8 bg-white" style={{ borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)' }}>
                <div
                  className="inline-grid place-items-center font-bold"
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'var(--gradient-cta)', color: '#fff', fontSize: 15,
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{s.title}</h3>
                  <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— FAQ —</span>
          <h2 className="atom-h2 mt-3 mb-8" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>Common questions.</h2>
          <div className="bg-white" style={{ borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--neutral-100)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  style={{ color: 'var(--neutral-900)' }}
                >
                  <span className="font-semibold text-base md:text-lg">{item.q}</span>
                  <span
                    className="inline-grid place-items-center transition-transform"
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: open === i ? 'var(--primary-600)' : 'var(--primary-50)',
                      color: open === i ? '#fff' : 'var(--primary-700)',
                      transform: open === i ? 'rotate(45deg)' : 'none',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-sm md:text-base" style={{ color: 'var(--neutral-500)' }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>Ready to start?</h2>
            <p className="mt-3 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              A senior advisor will walk you through timing, cost, and documentation on a 30-minute call.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={`/${lang}/contact?topic=citizenship`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">Book a call</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

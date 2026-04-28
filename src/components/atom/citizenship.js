'use client';

import { useState } from 'react';
import AtomPageHero from './page-hero';
import { Button, Card, StatCard } from '@/components/ui';
import { getDict } from '@/lib/i18n';

export default function AtomCitizenship({ lang = 'en' }) {
  const t = getDict(lang).pages.citizenship;
  const [open, setOpen] = useState(0);

  return (
    <>
      <AtomPageHero
        eyebrow={t.hero.eyebrow}
        title={<>{t.hero.titleLead} <span className="atom-accent">{t.hero.titleHighlight}</span></>}
        sub={t.hero.sub}
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <Card padding="md" align="left"><StatCard number="$400" accent="K" label={t.stats.minimum.label} caption={t.stats.minimum.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="3" label={t.stats.years.label} caption={t.stats.years.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="110" accent="+" label={t.stats.countries.label} caption={t.stats.countries.caption} /></Card>
            <Card padding="md" align="left"><StatCard number="98" accent="%" label={t.stats.approval.label} caption={t.stats.approval.caption} /></Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.process.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.process.title}</h2>
          <div className="space-y-4">
            {t.process.steps.map((s, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 p-6 md:p-8" style={{ background: 'var(--atom-surface)', borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)' }}>
                <div
                  className="inline-grid place-items-center font-bold"
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'var(--gradient-cta)', color: '#fff', fontSize: 15,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
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
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.faq.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.faq.title}</h2>
          <div style={{ background: 'var(--atom-surface)', borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
            {t.faq.items.map((item, i) => (
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
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>{t.cta.title}</h2>
            <p className="mt-3 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              {t.cta.sub}
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={`/${lang}/contact?topic=citizenship`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">{t.cta.button}</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

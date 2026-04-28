'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { getDict } from '@/lib/i18n';
import { DISTRICTS } from '@/lib/projects';

// Indicative yield/appreciation per district — rough market averages.
const DISTRICT_ECON = {
  Maslak:     { yieldPct: 5.5, apprPct: 8.0 },
  Beşiktaş:   { yieldPct: 4.5, apprPct: 7.0 },
  Levent:     { yieldPct: 5.0, apprPct: 7.5 },
  Beyoğlu:    { yieldPct: 4.8, apprPct: 6.5 },
  Kağıthane:  { yieldPct: 5.5, apprPct: 8.5 },
  Şişli:      { yieldPct: 5.0, apprPct: 7.0 },
  Ataşehir:   { yieldPct: 5.2, apprPct: 7.0 },
  Sariyer:    { yieldPct: 4.5, apprPct: 7.8 },
  Üsküdar:    { yieldPct: 4.8, apprPct: 6.8 },
  Göktürk:    { yieldPct: 4.2, apprPct: 6.0 },
  Güneşli:    { yieldPct: 6.0, apprPct: 6.5 },
};

function CalculatorBody({ lang }) {
  const t = getDict(lang);
  const c = t.calculator;
  const [budget, setBudget] = useState(750000);
  const [district, setDistrict] = useState('any');

  const rate = useMemo(() => {
    if (district !== 'any' && DISTRICT_ECON[district]) return DISTRICT_ECON[district];
    const vals = Object.values(DISTRICT_ECON);
    const y = vals.reduce((s, v) => s + v.yieldPct, 0) / vals.length;
    const a = vals.reduce((s, v) => s + v.apprPct, 0) / vals.length;
    return { yieldPct: y, apprPct: a };
  }, [district]);

  const annualRent = Math.round(budget * (rate.yieldPct / 100));
  const year5Value = Math.round(budget * Math.pow(1 + rate.apprPct / 100, 5));
  const totalReturn = year5Value - budget + annualRent * 5;
  const totalPct = ((totalReturn / budget) * 100).toFixed(1);
  const citizen = budget >= 400000;

  const fmt = (n) => '$' + n.toLocaleString('en-US');

  return (
    <>
      <AtomPageHero
        eyebrow={c.kicker}
        title={c.title}
        sub={c.sub}
      />

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 md:gap-10 items-start">
            {/* Inputs */}
            <div
              className="p-6 md:p-8"
              style={{
                background: '#fff',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-xl)',
                boxShadow: 'var(--atom-shadow-sm)',
              }}
            >
              <Field label={c.budget}>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  className="w-full text-2xl font-bold px-4"
                  style={{
                    height: 56,
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--atom-radius-md)',
                    background: 'var(--neutral-50)',
                    color: 'var(--neutral-900)',
                  }}
                />
              </Field>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3"
                style={{ accentColor: 'var(--accent-coral)' }}
              />
              <div
                className="flex justify-between text-[10px] font-semibold uppercase tracking-wider mt-2"
                style={{ color: 'var(--neutral-400)' }}
              >
                <span>$200K</span>
                <span>$5M</span>
              </div>

              <div className="mt-6">
                <Field label={c.district}>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-sm font-medium px-4"
                    style={{
                      height: 48,
                      border: '1px solid var(--neutral-200)',
                      borderRadius: 'var(--atom-radius-md)',
                      background: 'var(--neutral-50)',
                      color: 'var(--neutral-900)',
                    }}
                  >
                    <option value="any">{c.anyDistrict}</option>
                    {DISTRICTS.filter((d) => DISTRICT_ECON[d]).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div
                className="mt-6 p-5"
                style={{
                  background: citizen ? 'var(--primary-50)' : 'var(--neutral-50)',
                  border: `1px solid ${citizen ? 'var(--primary-200)' : 'var(--neutral-200)'}`,
                  borderRadius: 'var(--atom-radius-lg)',
                }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: citizen ? 'var(--primary-700)' : 'var(--neutral-400)' }}
                >
                  {c.citizenship}
                </div>
                <div
                  className="text-lg font-semibold"
                  style={{ color: citizen ? 'var(--primary-700)' : 'var(--neutral-700)' }}
                >
                  {citizen ? `✓ ${c.yes}` : `✗ ${c.no}`}
                </div>
              </div>
            </div>

            {/* Results */}
            <div
              className="p-6 md:p-8"
              style={{
                background: 'var(--neutral-50)',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-xl)',
              }}
            >
              <div className="mb-6">
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--neutral-400)' }}
                >
                  {c.grossYield}
                </div>
                <div
                  className="text-5xl font-bold leading-none"
                  style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {rate.yieldPct.toFixed(1)}%
                </div>
              </div>

              <Metric label={c.rent} value={fmt(annualRent)} accent />
              <Metric label={c.year5Value} value={fmt(year5Value)} />
              <Metric label={c.appreciation} value={`+${rate.apprPct.toFixed(1)}% / yr`} />
              <Metric label={c.total} value={`${fmt(totalReturn)} (${totalPct}%)`} accent />

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--neutral-200)' }}>
                <Chart budget={budget} apprPct={rate.apprPct} />
              </div>

              <Link
                href={`/${lang}/contact`}
                className="mt-6 inline-flex items-center justify-center gap-2 w-full h-12 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                style={{
                  background: 'var(--accent-coral)',
                  borderRadius: 'var(--atom-radius-pill)',
                  boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
                }}
              >
                {c.ctaBtn}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--neutral-400)' }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div
      className="flex justify-between items-baseline py-3"
      style={{ borderBottom: '1px solid var(--neutral-200)' }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--neutral-500)' }}
      >
        {label}
      </span>
      <span
        className="text-lg font-bold"
        style={accent ? { color: 'var(--primary-600)' } : { color: 'var(--neutral-900)' }}
      >
        {value}
      </span>
    </div>
  );
}

function Chart({ budget, apprPct }) {
  const pts = Array.from({ length: 6 }, (_, y) => ({
    year: y,
    value: budget * Math.pow(1 + apprPct / 100, y),
  }));
  const max = Math.max(...pts.map((p) => p.value));
  const min = Math.min(...pts.map((p) => p.value));
  const W = 320, H = 120;
  const path = pts
    .map((p, i) => {
      const x = (i / 5) * (W - 10) + 5;
      const y = H - ((p.value - min) / (max - min || 1)) * (H - 20) - 10;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full h-auto">
      <defs>
        <linearGradient id="atom-chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${W - 5} ${H} L 5 ${H} Z`} fill="url(#atom-chart-grad)" />
      <path d={path} stroke="var(--primary-600)" strokeWidth="1.8" fill="none" />
      {pts.map((p, i) => (
        <text
          key={i}
          x={(i / 5) * (W - 10) + 5}
          y={H + 16}
          textAnchor="middle"
          fontSize="10"
          fill="var(--neutral-400)"
          fontWeight="600"
        >
          Y{i}
        </text>
      ))}
    </svg>
  );
}

export default async function AtomCalculator({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <CalculatorBody lang={lang} />
    </AtomShell>
  );
}

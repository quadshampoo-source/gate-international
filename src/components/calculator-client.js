'use client';

import { useState, useMemo } from 'react';
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

export default function CalculatorClient({ lang }) {
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
    <div className="fade-in">
      <section className="pt-[160px] pb-15 border-b border-line">
        <div className="container-x">
          <span className="kicker">{c.kicker}</span>
          <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[1.02] tracking-[-0.025em] my-4">
            {c.title}
          </h1>
          <p className="text-fg-muted text-[17px] max-w-[640px]">{c.sub}</p>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-20 items-start">
            <div>
              <div className="form-field">
                <label>{c.budget}</label>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                />
              </div>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-4 accent-gold"
              />
              <div className="flex justify-between font-mono text-[10px] text-fg-dim tracking-wider mt-2">
                <span>$200K</span>
                <span>$5M</span>
              </div>

              <div className="form-field mt-6">
                <label>{c.district}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="font-serif text-[18px] text-fg bg-transparent"
                >
                  <option value="any" className="bg-bg">{c.anyDistrict}</option>
                  {DISTRICTS.filter((d) => DISTRICT_ECON[d]).map((d) => (
                    <option key={d} value={d} className="bg-bg">{d}</option>
                  ))}
                </select>
              </div>

              <div className={`mt-8 p-5 border ${citizen ? 'border-gold bg-gold/5' : 'border-line'}`}>
                <div className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase mb-2">
                  {c.citizenship}
                </div>
                <div className="font-serif text-[22px]">
                  {citizen ? `✓ ${c.yes}` : `✗ ${c.no}`}
                </div>
              </div>
            </div>

            <div className="bg-bg-sunken border border-line p-6 md:p-10">
              <div className="mb-8">
                <div className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase mb-2">{c.grossYield}</div>
                <div className="font-serif text-[48px] text-fg leading-none tracking-[-0.02em]">
                  {rate.yieldPct.toFixed(1)}%
                </div>
              </div>

              <Metric label={c.rent} value={fmt(annualRent)} accent />
              <Metric label={c.year5Value} value={fmt(year5Value)} />
              <Metric label={c.appreciation} value={`+${rate.apprPct.toFixed(1)}% ${'/ yr'}`} />
              <Metric label={c.total} value={`${fmt(totalReturn)} (${totalPct}%)`} accent />

              <div className="mt-8 pt-6 border-t border-line">
                <Chart budget={budget} apprPct={rate.apprPct} />
              </div>

              <a
                href={`/${lang}/contact`}
                className="btn btn-gold btn-arrow w-full justify-center mt-8"
              >
                {c.ctaBtn}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-line last:border-b-0">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-dim">{label}</span>
      <span className={`font-serif text-[20px] ${accent ? 'text-gold' : 'text-fg'}`}>{value}</span>
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
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${W - 5} ${H} L 5 ${H} Z`} fill="url(#chart-grad)" />
      <path d={path} stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      {pts.map((p, i) => (
        <g key={i}>
          <text
            x={(i / 5) * (W - 10) + 5}
            y={H + 16}
            textAnchor="middle"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#9a9487"
          >
            Y{i}
          </text>
        </g>
      ))}
    </svg>
  );
}

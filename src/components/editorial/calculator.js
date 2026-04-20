'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { DISTRICTS } from '@/lib/projects';
import { districtLabel } from '@/lib/districts';

function renderTitle(title) {
  if (!title || typeof title !== 'string') return title;
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1];
  const match = last.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const core = match ? match[1] : last;
  const punct = match ? match[2] : '';
  const before = parts.slice(0, -1).join(' ');
  return (<>{before}{before ? ' ' : ''}<em className="italic">{core}</em>{punct}</>);
}

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

export default function EditorialCalculator({ lang }) {
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
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container-x">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
            {c.kicker}
          </span>
          <h1 className="font-editorial text-[48px] md:text-[84px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7 max-w-[860px]">
            {renderTitle(c.title)}
          </h1>
          <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[600px] mt-6">
            {c.sub}
          </p>
        </div>
      </section>

      {/* Calculator body */}
      <section className="pb-24">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-start">
            {/* Inputs */}
            <div className="p-8 md:p-10 rounded-[28px]" style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                  {c.budget}
                </label>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  className="w-full h-14 px-5 rounded-full font-editorial text-[24px] text-[#051A24]"
                  style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
                />
                <input
                  type="range"
                  min={200000}
                  max={5000000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full mt-5"
                  style={{ accentColor: '#C9A84C' }}
                />
                <div className="flex justify-between font-mono text-[10px] text-[#273C46]/70 tracking-wider mt-2">
                  <span>$200K</span>
                  <span>$5M</span>
                </div>
              </div>

              <div className="mt-8">
                <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                  {c.district}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-12 px-5 rounded-full text-[14px] text-[#051A24]"
                  style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
                >
                  <option value="any">{c.anyDistrict}</option>
                  {DISTRICTS.filter((d) => DISTRICT_ECON[d]).map((d) => (
                    <option key={d} value={d}>{districtLabel(d, lang)}</option>
                  ))}
                </select>
              </div>

              <div
                className={`mt-8 p-5 rounded-[20px]`}
                style={{
                  background: citizen ? '#F6ECCB' : '#FFFFFF',
                  border: `1px solid ${citizen ? '#C9A84C' : '#E0EBF0'}`,
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-2">
                  {c.citizenship}
                </div>
                <div className="font-editorial text-[22px] text-[#051A24]">
                  {citizen ? `✓ ${c.yes}` : `✗ ${c.no}`}
                </div>
              </div>
            </div>

            {/* Output */}
            <div
              className="relative rounded-[28px] p-8 md:p-10 overflow-hidden"
              style={{ background: '#051A24', color: '#FFFFFF' }}
            >
              <div className="editorial-grain" />
              <div className="relative">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                  {c.grossYield}
                </div>
                <div className="font-editorial text-[64px] md:text-[88px] leading-none tracking-[-0.03em]">
                  {rate.yieldPct.toFixed(1)}<span className="text-[#C9A84C]">%</span>
                </div>

                <div className="mt-10 space-y-px" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Metric label={c.rent} value={fmt(annualRent)} accent />
                  <Metric label={c.year5Value} value={fmt(year5Value)} />
                  <Metric label={c.appreciation} value={`+${rate.apprPct.toFixed(1)}% / yr`} />
                  <Metric label={c.total} value={`${fmt(totalReturn)} (${totalPct}%)`} accent />
                </div>

                <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Chart budget={budget} apprPct={rate.apprPct} />
                </div>

                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-white text-[#051A24] text-[13px] font-medium hover:bg-[#F6FCFF] transition-colors mt-8"
                >
                  {c.ctaBtn}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="flex justify-between items-baseline py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/60">{label}</span>
      <span className={`font-editorial text-[20px] ${accent ? 'text-[#C9A84C]' : 'text-white'}`}>{value}</span>
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
        <linearGradient id="ed-chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${W - 5} ${H} L 5 ${H} Z`} fill="url(#ed-chart-grad)" />
      <path d={path} stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      {pts.map((p, i) => (
        <text
          key={i}
          x={(i / 5) * (W - 10) + 5}
          y={H + 16}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize="9"
          fill="rgba(255,255,255,0.5)"
        >
          Y{i}
        </text>
      ))}
    </svg>
  );
}

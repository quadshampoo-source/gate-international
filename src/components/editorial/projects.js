'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDict } from '@/lib/i18n';
import { localizedName } from '@/lib/utils';
import { districtLabel, DISTRICT_NAMES } from '@/lib/districts';
import EditorialTileBg from '@/components/editorial/tile-bg';

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

function Tile({ project, lang, index, wide }) {
  const name = localizedName(project, lang);
  const district = districtLabel(project.district, lang);
  return (
    <Link
      href={`/${lang}/project/${project.id}`}
      className={`group block rounded-[22px] overflow-hidden relative ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
      style={{ boxShadow: '0 20px 50px rgba(5,26,36,0.08)' }}
    >
      <EditorialTileBg project={project} alt={name} />
      <div className="editorial-grain" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(5,26,36,0.65) 100%)' }} />
      {project.citizenship_eligible && (
        <div className="absolute top-5 end-5">
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
          >
            Citizenship
          </span>
        </div>
      )}
      <div
        className="absolute top-5 start-5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
      >
        № {String(index + 1).padStart(2, '0')}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white">
        <div className="font-editorial text-[22px] md:text-[26px] leading-[1.1] tracking-[-0.01em] line-clamp-2 break-words">{name}</div>
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-80 mt-2 truncate">{district}</div>
      </div>
    </Link>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full text-[12px] md:text-[13px] font-medium transition-colors whitespace-nowrap"
      style={{
        background: active ? '#051A24' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#273C46',
        border: '1px solid #E0EBF0',
      }}
    >
      {children}
    </button>
  );
}

export default function EditorialProjects({ lang, projects = [] }) {
  const t = getDict(lang);
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  // Accept ?district= from the URL (location cards + home filter bar). Only
  // honour values that actually exist in the current project set; otherwise
  // fall back to "all" rather than showing an unintentionally empty grid.
  const [district, setDistrict] = useState(() => {
    const d = searchParams?.get('district');
    return d && projects.some((p) => p.district === d) ? d : 'all';
  });
  const [budget, setBudget] = useState('all');

  const districtCodes = useMemo(() => {
    const used = new Set(projects.map((p) => p.district));
    return Object.keys(DISTRICT_NAMES).filter((d) => used.has(d));
  }, [projects]);

  // Memoised so we can pass a stable ref to useMemo below without tripping
  // the exhaustive-deps rule on a fresh array every render.
  const budgets = useMemo(() => [
    { key: 'all', label: t.projects.any, min: 0, max: Infinity },
    { key: '<1m', label: '< $1M', min: 0, max: 1_000_000 },
    { key: '1-3m', label: '$1M — $3M', min: 1_000_000, max: 3_000_000 },
    { key: '3-5m', label: '$3M — $5M', min: 3_000_000, max: 5_000_000 },
    { key: '>5m', label: '$5M+', min: 5_000_000, max: Infinity },
  ], [t.projects.any]);

  const filtered = useMemo(() => {
    const qlc = q.trim().toLowerCase();
    const b = budgets.find((x) => x.key === budget) || budgets[0];
    return projects.filter((p) => {
      if (district !== 'all' && p.district !== district) return false;
      const price = p.price_usd ?? p.priceUsd ?? 0;
      if (price && (price < b.min || price > b.max)) return false;
      if (qlc) {
        const hay = `${p.name || ''} ${p.developer || ''} ${p.district || ''}`.toLowerCase();
        if (!hay.includes(qlc)) return false;
      }
      return true;
    });
  }, [projects, q, district, budget, budgets]);

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container-x">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
            № 01 — Portfolio
          </span>
          <h1 className="font-editorial text-[48px] md:text-[84px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-4 md:mt-6 max-w-[960px]">
            {renderTitle(t.projects.title)}
          </h1>
          <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[640px] mt-6">
            {t.projects.sub}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] md:top-[88px] z-[50]">
        <div className="container-x">
          <div
            className="p-4 md:p-5 rounded-[24px]"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'saturate(160%) blur(14px)',
              WebkitBackdropFilter: 'saturate(160%) blur(14px)',
              border: '1px solid #E0EBF0',
              boxShadow: '0 10px 40px rgba(5,26,36,0.06)',
            }}
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.projectsExtra.search}
              className="w-full h-11 px-5 mb-3 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
            />
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 flex-1">
                <Pill active={district === 'all'} onClick={() => setDistrict('all')}>{t.projects.any}</Pill>
                {districtCodes.map((d) => (
                  <Pill key={d} active={district === d} onClick={() => setDistrict(d)}>
                    {districtLabel(d, lang)}
                  </Pill>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {budgets.map((b) => (
                  <Pill key={b.key} active={budget === b.key} onClick={() => setBudget(b.key)}>
                    {b.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Count */}
      <div className="container-x pt-6 pb-4">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#273C46]">
          {filtered.length} {t.projects.results}
        </div>
      </div>

      {/* Grid */}
      <section className="pb-24">
        <div className="container-x">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-editorial text-[28px] text-[#051A24] mb-4">{t.projects.noMatch}</p>
              <button
                onClick={() => { setQ(''); setDistrict('all'); setBudget('all'); }}
                className="inline-flex items-center gap-3 h-11 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
              >
                {t.projects.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6">
              {filtered.map((p, i) => (
                <div key={p.id} className={i % 6 === 0 || i % 6 === 5 ? 'md:col-span-3' : 'md:col-span-2'}>
                  <Tile project={p} lang={lang} index={i} wide={i % 6 === 0 || i % 6 === 5} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

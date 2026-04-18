'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ProjectCard from '@/components/project-card';
import { getDict } from '@/lib/i18n';
import { DISTRICTS, TYPOLOGIES, CATEGORIES, BUDGET_OPTS, BADGES, badgesFor } from '@/lib/projects';

function countActive(f) {
  let n = 0;
  if (f.district !== 'any') n++;
  if (f.budget !== 'any') n++;
  if (f.market !== 'any') n++;
  if (f.type !== 'any') n++;
  if (f.status !== 'any') n++;
  if (f.category !== 'any') n++;
  if (f.badge !== 'any') n++;
  if (f.metro) n++;
  if (f.q && f.q.trim()) n++;
  return n;
}

const SORT_OPTS = ['priceDesc', 'priceAsc', 'newest'];

export default function ProjectsClient({ lang, projects = [] }) {
  const t = getDict(lang);
  const ext = t.projectsExtra;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState({
    district: searchParams.get('district') || 'any',
    budget: searchParams.get('budget') || 'any',
    market: searchParams.get('market') || 'any',
    type: searchParams.get('type') || 'any',
    status: searchParams.get('status') || 'any',
    category: searchParams.get('category') || 'any',
    badge: searchParams.get('badge') || 'any',
    metro: searchParams.get('metro') === '1',
    q: searchParams.get('q') || '',
    sort: searchParams.get('sort') || 'priceDesc',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === 'any' || v === '' || v === false || (k === 'sort' && v === 'priceDesc')) return;
      params.set(k, v === true ? '1' : v);
    });
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [filters, pathname, router]);

  const filtered = useMemo(() => {
    const list = projects.filter((p) => {
      if (filters.district !== 'any' && p.district !== filters.district) return false;
      if (filters.type !== 'any' && p.typology !== filters.type) return false;
      if (filters.status !== 'any' && p.status !== filters.status) return false;
      if (filters.category !== 'any' && p.category !== filters.category) return false;
      if (filters.metro && !p.metro) return false;
      if (filters.market !== 'any') {
        if (filters.market === 'both' && p.market !== 'both') return false;
        if (filters.market === 'china' && p.market !== 'china' && p.market !== 'both') return false;
        if (filters.market === 'arab' && p.market !== 'arab' && p.market !== 'both') return false;
      }
      if (filters.budget !== 'any') {
        const opt = BUDGET_OPTS.find((b) => b.k === filters.budget);
        if (typeof p.priceUsd !== 'number') return false;
        if (opt && (p.priceUsd < opt.min || p.priceUsd > opt.max)) return false;
      }
      if (filters.badge !== 'any') {
        if (!badgesFor(p).includes(filters.badge)) return false;
      }
      if (filters.q && filters.q.trim()) {
        const q = filters.q.toLowerCase();
        const hay = `${p.name} ${p.developer || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filters.sort === 'priceAsc') {
      list.sort((a, b) => (a.priceUsd ?? Infinity) - (b.priceUsd ?? Infinity));
    } else if (filters.sort === 'newest') {
      list.sort((a, b) => projects.indexOf(b) - projects.indexOf(a));
    } else {
      list.sort((a, b) => (b.priceUsd ?? -1) - (a.priceUsd ?? -1));
    }
    return list;
  }, [filters, projects]);

  const reset = () => setFilters({
    district: 'any', budget: 'any', market: 'any', type: 'any',
    status: 'any', category: 'any', badge: 'any', metro: false, q: '', sort: 'priceDesc',
  });
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const budgetLabel = (b) => (lang === 'ar' ? b.labelAr : lang === 'zh' ? b.labelZh : b.label);

  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = countActive(filters);
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fade-in">
      <div className="pt-[180px] pb-10 border-b border-line">
        <div className="container-x">
          <span className="kicker">№ 02 — PORTFOLIO</span>
          <h1 className="font-serif text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] my-4">
            {t.projects.title}
          </h1>
          <p className="text-fg-muted max-w-[520px] text-base">{t.projects.sub}</p>
        </div>
      </div>

      <div className="container-x">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 py-15 md:py-30">
          <aside
            className={`
              fixed md:static inset-y-0 right-0 rtl:right-auto rtl:left-0
              z-[130] md:z-auto w-[86vw] max-w-[380px] md:w-auto md:max-w-none
              bg-bg md:bg-transparent
              p-6 md:p-0 pt-20 md:pt-0 overflow-y-auto md:overflow-y-auto
              border-l rtl:border-l-0 rtl:border-r border-line md:border-0
              transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
              ${mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}
              md:translate-x-0 rtl:md:translate-x-0
              md:sticky md:top-[100px] md:self-start md:max-h-[calc(100vh-120px)] pr-1
            `}
          >
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
              className="md:hidden absolute top-4 right-4 rtl:right-auto rtl:left-4 w-10 h-10 flex items-center justify-center border border-line-strong text-fg hover:text-gold hover:border-gold"
            >
              ✕
            </button>
            <div className="flex justify-between items-baseline mb-6">
              <span className="kicker">{t.projects.filters}</span>
              <button onClick={reset} className="text-[11px] font-mono tracking-[0.12em] text-gold">
                {t.projects.reset}
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={filters.q}
                onChange={(e) => set('q', e.target.value)}
                placeholder={ext.search}
                className="w-full px-3 py-2.5 bg-bg-raised border border-line text-[13px] text-fg placeholder-fg-dim focus:border-gold/50 transition-colors"
              />
            </div>

            <label className="flex items-center gap-2.5 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.metro}
                onChange={(e) => set('metro', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-[13px] text-fg-muted">{ext.metroOnly}</span>
            </label>

            <FilterGroup label={t.projects.district}>
              <FilterButton active={filters.district === 'any'} onClick={() => set('district', 'any')}>{t.projects.any}</FilterButton>
              {DISTRICTS.map((d) => (
                <FilterButton key={d} active={filters.district === d} onClick={() => set('district', d)}>{d}</FilterButton>
              ))}
            </FilterGroup>

            <FilterGroup label={ext.status}>
              <FilterButton active={filters.status === 'any'} onClick={() => set('status', 'any')}>{ext.statusAny}</FilterButton>
              <FilterButton active={filters.status === 'forSale'} onClick={() => set('status', 'forSale')}>{ext.statusForSale}</FilterButton>
              <FilterButton active={filters.status === 'construction'} onClick={() => set('status', 'construction')}>{ext.statusConstruction}</FilterButton>
              <FilterButton active={filters.status === 'delivered'} onClick={() => set('status', 'delivered')}>{ext.statusDelivered}</FilterButton>
            </FilterGroup>

            <FilterGroup label={t.projects.budget}>
              <FilterButton active={filters.budget === 'any'} onClick={() => set('budget', 'any')}>{t.projects.any}</FilterButton>
              {BUDGET_OPTS.map((b) => (
                <FilterButton key={b.k} active={filters.budget === b.k} onClick={() => set('budget', b.k)}>{budgetLabel(b)}</FilterButton>
              ))}
            </FilterGroup>

            <FilterGroup label={ext.category}>
              <FilterButton active={filters.category === 'any'} onClick={() => set('category', 'any')}>{ext.cat_any}</FilterButton>
              {CATEGORIES.map((c) => (
                <FilterButton key={c} active={filters.category === c} onClick={() => set('category', c)}>
                  {ext[`cat_${c}`] || c}
                </FilterButton>
              ))}
            </FilterGroup>

            <FilterGroup label={t.projects.market}>
              <FilterButton active={filters.market === 'any'} onClick={() => set('market', 'any')}>{t.projects.any}</FilterButton>
              <FilterButton active={filters.market === 'china'} onClick={() => set('market', 'china')}>{t.projects.market_china}</FilterButton>
              <FilterButton active={filters.market === 'arab'} onClick={() => set('market', 'arab')}>{t.projects.market_arab}</FilterButton>
              <FilterButton active={filters.market === 'both'} onClick={() => set('market', 'both')}>{t.projects.market_both}</FilterButton>
            </FilterGroup>

            <FilterGroup label={t.projects.type}>
              <FilterButton active={filters.type === 'any'} onClick={() => set('type', 'any')}>{t.projects.any}</FilterButton>
              {TYPOLOGIES.map((ty) => (
                <FilterButton key={ty} active={filters.type === ty} onClick={() => set('type', ty)}>{ty}</FilterButton>
              ))}
            </FilterGroup>

            <FilterGroup label={ext.badge}>
              <FilterButton active={filters.badge === 'any'} onClick={() => set('badge', 'any')}>{ext.badgeAny}</FilterButton>
              {BADGES.map((b) => (
                <FilterButton key={b} active={filters.badge === b} onClick={() => set('badge', b)}>
                  {ext[`badge_${b}`] || b}
                </FilterButton>
              ))}
            </FilterGroup>

            {/* Mobile-only: apply button at drawer bottom */}
            <div className="md:hidden sticky bottom-0 -mx-6 px-6 pt-4 pb-6 bg-bg border-t border-line mt-8">
              <button
                onClick={() => setMobileOpen(false)}
                className="btn btn-gold w-full justify-center"
              >
                Show {filtered.length} {t.projects.results}
              </button>
            </div>
          </aside>

          <div>
            <div className="flex justify-between items-center mb-6 pb-5 border-b border-line gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-gold text-gold font-mono text-[11px] tracking-[0.14em] uppercase"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round" />
                  </svg>
                  {t.projects.filters}
                  {activeCount > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-bg text-[10px] flex items-center justify-center font-semibold">
                      {activeCount}
                    </span>
                  )}
                </button>
                <div className="font-mono text-[13px] text-fg-muted">
                  <span className="text-gold font-medium">{String(filtered.length).padStart(2, '0')}</span>{' '}
                  {t.projects.results}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-fg-dim tracking-[0.14em] hidden sm:inline">{ext.sortLabel}:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => set('sort', e.target.value)}
                  className="bg-bg-raised border border-line px-2 py-1.5 text-[12px] text-fg-muted"
                >
                  <option value="priceDesc">{ext.sortPriceDesc}</option>
                  <option value="priceAsc">{ext.sortPriceAsc}</option>
                  <option value="newest">{ext.sortNewest}</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <LayoutGroup>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((p, i) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <ProjectCard project={p} index={i} lang={lang} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            ) : (
              <div className="p-20 text-center text-fg-muted border border-line">
                <div className="font-serif text-[28px] mb-3">{t.projects.noMatch}</div>
                <button onClick={reset} className="btn btn-outline mt-5">{t.projects.resetFilters}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="mb-8">
      <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted mb-3.5 font-normal">{label}</h4>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`filter-btn${active ? ' active' : ''}`}>{children}</button>
  );
}

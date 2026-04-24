'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import AtomProjectCard from './project-card';
import { PillTag } from '@/components/ui';

const CITY_FILTERS = [
  { key: 'any', label: 'All', test: null },
  { key: 'Istanbul', label: 'Istanbul', test: (p) => !['Bodrum', 'Bursa'].includes(p.district) },
  { key: 'Bodrum', label: 'Bodrum', test: (p) => p.district === 'Bodrum' },
  { key: 'Bursa', label: 'Bursa', test: (p) => p.district === 'Bursa' },
];

const TYPE_FILTERS = [
  { key: 'all', label: 'All types' },
  { key: 'Apartment', label: 'Apartment' },
  { key: 'Villa', label: 'Villa' },
  { key: 'Penthouse', label: 'Penthouse' },
  { key: 'Duplex', label: 'Duplex' },
  { key: 'Office', label: 'Office' },
];

const SORTS = [
  { key: 'sort', label: 'Editor picks' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
];

const priceOf = (p) => Number(p.priceUsd ?? p.price_usd) || 0;

// Match a URL param value case-insensitively to a canonical CITY_FILTERS key.
// Returns 'any' if nothing matches (so a bad param doesn't silently bypass).
function resolveCity(raw) {
  if (!raw) return 'any';
  const lc = raw.toLowerCase();
  const hit = CITY_FILTERS.find((f) => f.key.toLowerCase() === lc);
  return hit ? hit.key : 'any';
}

export default function AtomProjectsList({ lang = 'en', projects = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [city, setCity] = useState(() => resolveCity(searchParams.get('city')));
  const [district, setDistrict] = useState(() => searchParams.get('district') || 'any');
  const [bedrooms, setBedrooms] = useState(() => searchParams.get('bedrooms') || 'any');
  const [type, setType] = useState('all');
  const [sortKey, setSortKey] = useState('sort');

  useEffect(() => {
    const params = new URLSearchParams();
    if (city !== 'any') params.set('city', city);
    if (district !== 'any') params.set('district', district);
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms);
    const qs = params.toString();
    const next = `${pathname}${qs ? `?${qs}` : ''}`;
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    if (next !== current) router.replace(next, { scroll: false });
  }, [city, district, bedrooms, pathname, router, searchParams]);

  const visible = useMemo(() => {
    let list = projects;
    const cityFilter = CITY_FILTERS.find((f) => f.key === city);
    if (cityFilter?.test) list = list.filter(cityFilter.test);
    if (district !== 'any') {
      const dLc = district.toLowerCase();
      list = list.filter((p) => (p.district || '').toLowerCase() === dLc);
    }
    if (bedrooms !== 'any') {
      const min = parseInt(bedrooms, 10);
      if (!Number.isNaN(min)) {
        list = list.filter((p) => {
          const n = parseInt(p.bedrooms, 10);
          return !Number.isNaN(n) && n >= min;
        });
      }
    }
    if (type !== 'all') list = list.filter((p) => (p.propertyType || p.typology) === type);
    if (sortKey === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sortKey === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    return list;
  }, [projects, city, district, bedrooms, type, sortKey]);

  const pickCity = (k) => {
    setCity(k);
    setDistrict('any');
  };

  return (
    <>
      <section className="pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Portfolio —</span>
          <h1 className="atom-h1 mt-3" style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}>
            All <span className="atom-accent">residences.</span>
          </h1>
          <p className="atom-body-lg mt-4 max-w-[560px]" style={{ color: 'var(--neutral-500)' }}>
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
            {(district !== 'any' || bedrooms !== 'any' || city !== 'any') ? ' matching your filters' : ' across Istanbul, Bodrum, and Bursa'}
            {' '}— filter, compare, shortlist.
          </p>
          {(district !== 'any' || bedrooms !== 'any') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 text-sm" style={{ color: 'var(--neutral-500)' }}>
              {district !== 'any' && (
                <button
                  type="button"
                  onClick={() => setDistrict('any')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}
                >
                  District: {district}
                  <span aria-hidden>×</span>
                </button>
              )}
              {bedrooms !== 'any' && (
                <button
                  type="button"
                  onClick={() => setBedrooms('any')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}
                >
                  Bedrooms: {bedrooms}+
                  <span aria-hidden>×</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="sticky top-[72px] z-30" style={{ background: 'rgba(248,250,252,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {CITY_FILTERS.map((f) => (
              <PillTag key={f.key} active={city === f.key} onClick={() => pickCity(f.key)}>
                {f.label}
              </PillTag>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-sm font-medium rounded-atom-md px-3 py-2"
              style={{ border: '1px solid var(--neutral-200)', background: '#fff', color: 'var(--neutral-700)' }}
            >
              {TYPE_FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="text-sm font-medium rounded-atom-md px-3 py-2"
              style={{ border: '1px solid var(--neutral-200)', background: '#fff', color: 'var(--neutral-700)' }}
            >
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          {visible.length === 0 ? (
            <div className="text-center py-24" style={{ color: 'var(--neutral-500)' }}>
              No matches. Try relaxing the filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((p) => (
                <AtomProjectCard key={p.id} project={p} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>

    </>
  );
}

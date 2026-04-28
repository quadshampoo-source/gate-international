'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import AtomProjectCard from './project-card';
import { PillTag } from '@/components/ui';
import { getDict } from '@/lib/i18n';

const priceOf = (p) => Number(p.priceUsd ?? p.price_usd) || 0;

// Turkish-aware case fold. 'Şişli'.toLocaleLowerCase('tr') === 'şişli', and it
// treats İ/ı correctly (plain toLowerCase() on İ produces a combining dot).
const norm = (s) => (s == null ? '' : String(s)).trim().toLocaleLowerCase('tr');

// District semantics differ per city: for Istanbul the `district` column is
// the neighborhood (Beşiktaş, Şişli, ...); for Bodrum/Bursa `district` is the
// city name itself and `subDistrict` holds the real neighborhood (Yalıkavak,
// Mudanya, ...). This helper returns the neighborhood-level value regardless.
const cityTag = (p) => {
  if (p?.district === 'Bodrum') return 'Bodrum';
  if (p?.district === 'Bursa') return 'Bursa';
  return 'Istanbul';
};
const neighborhood = (p) => (cityTag(p) === 'Istanbul' ? p?.district : p?.subDistrict || p?.district);

function buildCityFilters(t) {
  return [
    { key: 'any', label: t.all, test: null },
    { key: 'Istanbul', label: t.istanbul, test: (p) => !['Bodrum', 'Bursa'].includes(p.district) },
    { key: 'Bodrum', label: t.bodrum, test: (p) => p.district === 'Bodrum' },
    { key: 'Bursa', label: t.bursa, test: (p) => p.district === 'Bursa' },
  ];
}

function buildTypeFilters(t) {
  return [
    { key: 'all', label: t.typeAll },
    { key: 'Apartment', label: t.apartment },
    { key: 'Villa', label: t.villa },
    { key: 'Penthouse', label: t.penthouse },
    { key: 'Duplex', label: t.duplex },
    { key: 'Office', label: t.office },
  ];
}

function buildSorts(t) {
  return [
    { key: 'sort', label: t.sortEditor },
    { key: 'price-asc', label: t.sortPriceAsc },
    { key: 'price-desc', label: t.sortPriceDesc },
  ];
}

function resolveCity(raw, cityFilters) {
  if (!raw) return 'any';
  const lc = norm(raw);
  const hit = cityFilters.find((f) => norm(f.key) === lc);
  return hit ? hit.key : 'any';
}

// Map a raw URL district value to the canonical spelling used in the project
// data, so case/accents from the URL still hit the filter. Falls back to the
// raw value when no match is found (so the "no matches" state still shows).
function resolveDistrict(raw, projects) {
  if (!raw) return 'any';
  const target = norm(raw);
  const match = projects.find((p) => norm(neighborhood(p)) === target);
  return match ? neighborhood(match) : raw;
}

export default function AtomProjectsList({ lang = 'en', projects = [] }) {
  const t = getDict(lang).pages.projectsList;
  const cityFilters = useMemo(() => buildCityFilters(t.filters), [t]);
  const typeFilters = useMemo(() => buildTypeFilters(t.filters), [t]);
  const sorts = useMemo(() => buildSorts(t.filters), [t]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [city, setCity] = useState(() => resolveCity(searchParams.get('city'), cityFilters));
  const [district, setDistrict] = useState(() => resolveDistrict(searchParams.get('district'), projects));
  const [bedrooms, setBedrooms] = useState(() => searchParams.get('bedrooms') || 'any');
  const [type, setType] = useState('all');
  const [sortKey, setSortKey] = useState('sort');

  // Districts available per city, derived from the live project data so the
  // chip row always reflects what actually has listings. Bodrum/Bursa end up
  // with just one district (same as their city name), so we hide the row for
  // those — the city chip is already enough.
  const districtsByCity = useMemo(() => {
    const buckets = { Istanbul: new Set(), Bodrum: new Set(), Bursa: new Set() };
    for (const p of projects) {
      const n = neighborhood(p);
      if (n) buckets[cityTag(p)].add(n);
    }
    return {
      Istanbul: [...buckets.Istanbul].sort((a, b) => a.localeCompare(b, 'tr')),
      Bodrum: [...buckets.Bodrum].sort((a, b) => a.localeCompare(b, 'tr')),
      Bursa: [...buckets.Bursa].sort((a, b) => a.localeCompare(b, 'tr')),
    };
  }, [projects]);

  const districtsForCurrentCity = city === 'any' ? [] : (districtsByCity[city] || []);
  const showDistrictRow = districtsForCurrentCity.length > 1;

  // If city and district disagree (e.g. city=Bodrum but district=Beşiktaş from
  // an old URL), drop the district. Keeps state consistent with the chip UI.
  useEffect(() => {
    if (district === 'any' || city === 'any') return;
    const belongs = (districtsByCity[city] || []).some((d) => norm(d) === norm(district));
    if (!belongs) setDistrict('any');
  }, [city, district, districtsByCity]);

  // Write the active filter state back to the URL so links are shareable.
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
    const cityFilter = cityFilters.find((f) => f.key === city);
    if (cityFilter?.test) list = list.filter(cityFilter.test);
    if (district !== 'any') {
      const d = norm(district);
      list = list.filter((p) => norm(neighborhood(p)) === d);
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
  }, [projects, city, district, bedrooms, type, sortKey, cityFilters]);

  const pickCity = (k) => {
    setCity(k);
    setDistrict('any');
  };

  const toggleDistrict = (d) => {
    setDistrict((prev) => (norm(prev) === norm(d) ? 'any' : d));
  };

  const hasFilters = city !== 'any' || district !== 'any' || bedrooms !== 'any';

  return (
    <>
      <section className="pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.kicker} —</span>
          <h1 className="atom-h1 mt-3" style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}>
            {t.titleLead} <span className="atom-accent">{t.titleHighlight}</span>
          </h1>
          <p className="atom-body-lg mt-4 max-w-[560px]" style={{ color: 'var(--neutral-500)' }}>
            {visible.length} {visible.length === 1 ? t.intro.projectSingular : t.intro.projectPlural}
            {hasFilters ? ` ${t.intro.matching}` : ` ${t.intro.acrossCities}`}
            {' '}{t.intro.suffix}
          </p>
          {bedrooms !== 'any' && (
            <div className="flex flex-wrap items-center gap-2 mt-4 text-sm" style={{ color: 'var(--neutral-500)' }}>
              <button
                type="button"
                onClick={() => setBedrooms('any')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}
              >
                {t.bedroomsChip}: {bedrooms}+
                <span aria-hidden>×</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="sticky top-[72px] z-30" style={{ background: 'rgba(248,250,252,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {cityFilters.map((f) => (
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
                {typeFilters.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="text-sm font-medium rounded-atom-md px-3 py-2"
                style={{ border: '1px solid var(--neutral-200)', background: '#fff', color: 'var(--neutral-700)' }}
              >
                {sorts.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {showDistrictRow && (
            <div className="flex flex-wrap gap-2 pt-1" style={{ borderTop: '1px solid var(--neutral-100)' }}>
              <PillTag active={district === 'any'} onClick={() => setDistrict('any')}>
                {t.filters.allDistricts}
              </PillTag>
              {districtsForCurrentCity.map((d) => (
                <PillTag key={d} active={norm(district) === norm(d)} onClick={() => toggleDistrict(d)}>
                  {d}
                </PillTag>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          {visible.length === 0 ? (
            <div className="text-center py-24" style={{ color: 'var(--neutral-500)' }}>
              {t.noMatches}
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

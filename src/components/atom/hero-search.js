'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const BEDROOMS = ['Any', '1+', '2+', '3+', '4+', '5+'];

function Field({ label, value, open, onToggle, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) onToggle(false); };
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onToggle]);
  return (
    <div ref={ref} className="relative w-full md:flex-1 md:min-w-[120px]">
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className="w-full text-left flex flex-col rounded-atom-md px-4 py-3 transition-all"
        style={{
          background: open ? 'var(--primary-50)' : 'transparent',
          border: '1px solid',
          borderColor: open ? 'var(--primary-200)' : 'transparent',
        }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
          {label}
        </span>
        <span className="text-sm font-medium flex items-center justify-between gap-2 mt-0.5" style={{ color: 'var(--neutral-900)' }}>
          <span className="truncate">{value}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--neutral-400)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-atom-md overflow-hidden overflow-y-auto z-30"
          style={{
            background: '#fff',
            border: '1px solid var(--neutral-200)',
            boxShadow: 'var(--atom-shadow-lg)',
            maxHeight: 280,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Option({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
      style={{
        background: active ? 'var(--primary-50)' : 'transparent',
        color: active ? 'var(--primary-700)' : 'var(--neutral-700)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

const ANY_CITY = 'Any city';
const ANY_DISTRICT = 'Any district';

export default function AtomHeroSearch({ lang = 'en', districts = [] }) {
  const router = useRouter();

  const cities = useMemo(() => {
    const set = new Set();
    districts.forEach((d) => { if (d?.city) set.add(d.city); });
    return [ANY_CITY, ...Array.from(set).sort()];
  }, [districts]);

  const [city, setCity] = useState(ANY_CITY);
  const [district, setDistrict] = useState(ANY_DISTRICT);
  const [beds, setBeds] = useState('Any');
  const [openIdx, setOpenIdx] = useState(-1);

  const districtOptions = useMemo(() => {
    const scoped = city === ANY_CITY
      ? districts
      : districts.filter((d) => d.city === city);
    const names = scoped.map((d) => d.name).filter(Boolean);
    return [ANY_DISTRICT, ...names];
  }, [city, districts]);

  const submit = () => {
    const qs = new URLSearchParams();
    // If a district is picked without a city, infer the city from the
    // districts prop so /projects knows which column to match against
    // (district for Istanbul, sub_district for Bodrum/Bursa).
    let effectiveCity = city;
    if (district !== ANY_DISTRICT && city === ANY_CITY) {
      const match = districts.find((d) => d?.name === district);
      if (match?.city) effectiveCity = match.city;
    }
    if (effectiveCity !== ANY_CITY) qs.set('city', effectiveCity);
    if (district !== ANY_DISTRICT) qs.set('district', district);
    if (beds !== 'Any') qs.set('bedrooms', beds);
    router.push(`/${lang}/projects${qs.toString() ? `?${qs}` : ''}`);
  };

  const pickCity = (c) => {
    setCity(c);
    setDistrict(ANY_DISTRICT);
    setOpenIdx(-1);
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      role="search"
      className="mx-auto w-full rounded-2xl md:rounded-full"
      style={{
        maxWidth: 860,
        padding: 2,
        background: 'var(--gradient-border)',
      }}
    >
      <div
        className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2 bg-white p-3 md:p-2 rounded-[14px] md:rounded-full"
        style={{ boxShadow: 'var(--atom-shadow-md)' }}
      >
        <Field label="City" value={city} open={openIdx === 0} onToggle={(o) => setOpenIdx(o ? 0 : -1)}>
          {cities.map((c) => (
            <Option key={c} active={city === c} onClick={() => pickCity(c)}>{c}</Option>
          ))}
        </Field>
        <div className="hidden md:block self-center" style={{ width: 1, background: 'var(--neutral-200)', height: 32 }} />
        <Field label="District" value={district} open={openIdx === 1} onToggle={(o) => setOpenIdx(o ? 1 : -1)}>
          {districtOptions.map((d) => (
            <Option key={d} active={district === d} onClick={() => { setDistrict(d); setOpenIdx(-1); }}>{d}</Option>
          ))}
        </Field>
        <div className="hidden md:block self-center" style={{ width: 1, background: 'var(--neutral-200)', height: 32 }} />
        <Field label="Bedrooms" value={beds} open={openIdx === 2} onToggle={(o) => setOpenIdx(o ? 2 : -1)}>
          {BEDROOMS.map((b) => (
            <Option key={b} active={beds === b} onClick={() => { setBeds(b); setOpenIdx(-1); }}>{b}</Option>
          ))}
        </Field>
        <button
          type="submit"
          onClick={(e) => { e.preventDefault(); submit(); }}
          aria-label="Search"
          className="w-full h-12 md:w-[52px] md:h-[52px] rounded-xl md:rounded-full inline-flex md:inline-grid items-center justify-center gap-2 md:gap-0 text-sm md:text-[0px] font-semibold text-white transition-transform hover:scale-[1.02] md:hover:scale-105 md:self-center md:flex-shrink-0"
          style={{
            background: 'var(--accent-coral)',
            boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="md:hidden">Search</span>
        </button>
      </div>
    </form>
  );
}

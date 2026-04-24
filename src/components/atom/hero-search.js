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
    <div ref={ref} className="relative flex-1 min-w-[120px]">
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
    if (district !== ANY_DISTRICT) qs.set('district', district);
    else if (city !== ANY_CITY) qs.set('city', city);
    if (beds !== 'Any') qs.set('bedrooms', beds);
    const href = `/${lang}/projects${qs.toString() ? `?${qs}` : ''}`;
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[hero-search] submit', { city, district, beds, href });
    }
    router.push(href);
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
      className="mx-auto"
      style={{
        maxWidth: 860,
        padding: 2,
        borderRadius: 'var(--atom-radius-pill)',
        background: 'var(--gradient-border)',
      }}
    >
      <div
        className="flex items-stretch gap-1 md:gap-2 bg-white rounded-full p-2"
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
          className="flex-shrink-0 inline-grid place-items-center transition-transform hover:scale-105 rounded-full"
          style={{
            width: 52, height: 52,
            background: 'var(--accent-coral)',
            color: '#fff',
            boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
            alignSelf: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  );
}

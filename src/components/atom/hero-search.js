'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchBottomSheet from './search-bottom-sheet';

const BEDROOMS = ['Any', '1+', '2+', '3+', '4+', '5+'];

const ANY_CITY = 'Any city';
const ANY_DISTRICT = 'Any district';

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

function SearchIcon({ size = 20, stroke = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const triggerRef = useRef(null);

  const districtOptions = useMemo(() => {
    const scoped = city === ANY_CITY
      ? districts
      : districts.filter((d) => d.city === city);
    const names = scoped.map((d) => d.name).filter(Boolean);
    return [ANY_DISTRICT, ...names];
  }, [city, districts]);

  const submit = () => {
    const qs = new URLSearchParams();
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

  const pickCityInSheet = (c) => {
    setCity(c);
    if (c !== city) setDistrict(ANY_DISTRICT);
  };

  const hasSelection = city !== ANY_CITY || district !== ANY_DISTRICT || beds !== 'Any';
  const selectionParts = [
    city !== ANY_CITY ? city : null,
    district !== ANY_DISTRICT ? district : null,
    beds !== 'Any' ? `${beds} beds` : null,
  ].filter(Boolean);
  const triggerText = hasSelection
    ? selectionParts.join(' · ')
    : 'Search by city, district, bedrooms';

  const clearAll = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCity(ANY_CITY);
    setDistrict(ANY_DISTRICT);
    setBeds('Any');
  };

  const closeSheet = () => {
    setSheetOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 80);
  };

  const openTrigger = () => setSheetOpen(true);

  return (
    <>
      {/* Desktop (md+) — horizontal pill */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        role="search"
        className="hidden md:block mx-auto w-full rounded-full"
        style={{
          maxWidth: 860,
          padding: 2,
          background: 'var(--gradient-border)',
        }}
      >
        <div
          className="flex flex-row items-stretch gap-2 bg-white p-2 rounded-full"
          style={{ boxShadow: 'var(--atom-shadow-md)' }}
        >
          <Field label="City" value={city} open={openIdx === 0} onToggle={(o) => setOpenIdx(o ? 0 : -1)}>
            {cities.map((c) => (
              <Option key={c} active={city === c} onClick={() => pickCity(c)}>{c}</Option>
            ))}
          </Field>
          <div className="self-center" style={{ width: 1, background: 'var(--neutral-200)', height: 32 }} />
          <Field label="District" value={district} open={openIdx === 1} onToggle={(o) => setOpenIdx(o ? 1 : -1)}>
            {districtOptions.map((d) => (
              <Option key={d} active={district === d} onClick={() => { setDistrict(d); setOpenIdx(-1); }}>{d}</Option>
            ))}
          </Field>
          <div className="self-center" style={{ width: 1, background: 'var(--neutral-200)', height: 32 }} />
          <Field label="Bedrooms" value={beds} open={openIdx === 2} onToggle={(o) => setOpenIdx(o ? 2 : -1)}>
            {BEDROOMS.map((b) => (
              <Option key={b} active={beds === b} onClick={() => { setBeds(b); setOpenIdx(-1); }}>{b}</Option>
            ))}
          </Field>
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); submit(); }}
            aria-label="Search"
            className="flex-shrink-0 inline-grid place-items-center transition-transform hover:scale-105 rounded-full self-center"
            style={{
              width: 52, height: 52,
              background: 'var(--accent-coral)',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* Mobile (< md) — collapsed trigger */}
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={openTrigger}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTrigger(); }
        }}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        aria-label={hasSelection ? `Edit search: ${triggerText}` : 'Open search'}
        className="md:hidden mx-auto flex items-center gap-3 pl-5 pr-2 cursor-pointer"
        style={{
          width: '100%',
          maxWidth: 560,
          height: 56,
          background: '#fff',
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--atom-radius-pill)',
          boxShadow: 'var(--atom-shadow-md)',
          color: 'var(--neutral-500)',
        }}
      >
        <SearchIcon size={20} stroke="var(--neutral-500)" />
        <span
          className="flex-1 truncate text-sm"
          style={{
            color: hasSelection ? 'var(--neutral-900)' : 'var(--neutral-500)',
            fontWeight: hasSelection ? 600 : 500,
          }}
        >
          {triggerText}
        </span>
        {hasSelection && (
          <button
            type="button"
            onClick={clearAll}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Clear search"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-[var(--neutral-100)]"
            style={{ color: 'var(--neutral-500)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <span
          aria-hidden
          className="inline-flex items-center justify-center flex-shrink-0 rounded-full"
          style={{
            width: 40,
            height: 40,
            background: 'var(--accent-coral)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(255, 107, 92, 0.35)',
          }}
        >
          <SearchIcon size={16} />
        </span>
      </div>

      <SearchBottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        onSubmit={submit}
        city={city}
        onCityChange={pickCityInSheet}
        cities={cities}
        district={district}
        onDistrictChange={setDistrict}
        districtOptions={districtOptions}
        beds={beds}
        onBedsChange={setBeds}
        bedroomOptions={BEDROOMS}
      />
    </>
  );
}

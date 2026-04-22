'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES = ['Any', 'Apartment', 'Villa', 'Penthouse', 'Duplex', 'Townhouse', 'Office', 'Land'];
const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: '$100K — $400K', min: 100_000, max: 400_000 },
  { label: '$400K — $1M', min: 400_000, max: 1_000_000 },
  { label: '$1M — $3M', min: 1_000_000, max: 3_000_000 },
  { label: '$3M — $8M', min: 3_000_000, max: 8_000_000 },
  { label: '$8M+', min: 8_000_000, max: Infinity },
];
const BEDROOMS = ['Any', 'Studio', '1+', '2+', '3+', '4+', '5+'];

function Field({ label, value, open, setOpen, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, setOpen]);
  return (
    <div ref={ref} className="search-field" onClick={() => setOpen((o) => !o)}>
      <span className="search-label">{label}</span>
      <span className="search-value">{value}</span>
      {open && <div className="search-pop" onClick={(e) => e.stopPropagation()}>{children}</div>}
    </div>
  );
}

export default function LegacySearchBar({ lang, districts = [] }) {
  const router = useRouter();
  const [district, setDistrict] = useState('Any');
  const [ptype, setPtype] = useState('Any');
  const [priceIdx, setPriceIdx] = useState(0);
  const [beds, setBeds] = useState('Any');
  const [openIdx, setOpenIdx] = useState(-1);

  const locations = ['Any', ...districts];
  const price = PRICE_RANGES[priceIdx];

  const submit = () => {
    const qs = new URLSearchParams();
    if (district !== 'Any') qs.set('district', district);
    if (ptype !== 'Any') qs.set('property_type', ptype);
    if (priceIdx > 0) {
      qs.set('price_min', String(price.min));
      if (Number.isFinite(price.max)) qs.set('price_max', String(price.max));
    }
    if (beds !== 'Any') qs.set('bedrooms', beds);
    const url = `/${lang}/projects${qs.toString() ? `?${qs}` : ''}`;
    router.push(url);
  };

  return (
    <div className="container">
      <div className="search-bar">
        <Field label="Location" value={district === 'Any' ? 'Any city, Turkey' : district} open={openIdx === 0} setOpen={(v) => setOpenIdx(v ? 0 : -1)}>
          {locations.map((d) => (
            <button key={d} className={district === d ? 'active' : ''} onClick={() => { setDistrict(d); setOpenIdx(-1); }}>{d}</button>
          ))}
        </Field>
        <Field label="Property Type" value={ptype} open={openIdx === 1} setOpen={(v) => setOpenIdx(v ? 1 : -1)}>
          {PROPERTY_TYPES.map((t) => (
            <button key={t} className={ptype === t ? 'active' : ''} onClick={() => { setPtype(t); setOpenIdx(-1); }}>{t}</button>
          ))}
        </Field>
        <Field label="Price Range" value={price.label} open={openIdx === 2} setOpen={(v) => setOpenIdx(v ? 2 : -1)}>
          {PRICE_RANGES.map((r, i) => (
            <button key={r.label} className={priceIdx === i ? 'active' : ''} onClick={() => { setPriceIdx(i); setOpenIdx(-1); }}>{r.label}</button>
          ))}
        </Field>
        <Field label="Bedrooms" value={beds} open={openIdx === 3} setOpen={(v) => setOpenIdx(v ? 3 : -1)}>
          {BEDROOMS.map((b) => (
            <button key={b} className={beds === b ? 'active' : ''} onClick={() => { setBeds(b); setOpenIdx(-1); }}>{b}</button>
          ))}
        </Field>
        <button type="button" className="search-submit" onClick={submit} aria-label="Search">Search</button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Glassmorphism filter bar that floats over the lower hero. Two
// custom dropdowns (city + district) with blurred open-state, and a
// dark "Search" pill that animates on hover. City choice wires the
// district list; Search navigates to /[lang]/projects with the
// picked params. Slides in from below when it enters the viewport.
//
// Props:
//   lang         — locale prefix for routing
//   cities       — [{ value, label, color, count }]
//   districtsBy  — { cityValue: [{ value, label, count }] }
export default function FilterBar({ lang, cities = [], districtsBy = {} }) {
  const router = useRouter();
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  const [city, setCity] = useState({ value: '', label: cities[0]?.label || 'All cities' });
  const [district, setDistrict] = useState({ value: '', label: 'Select city first' });
  const [openField, setOpenField] = useState(null); // 'city' | 'district' | null

  const districtOptions = city.value ? (districtsBy[city.value] || []) : [];

  // Scroll-reveal
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setRevealed(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    if (!openField) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenField(null);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpenField(null); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [openField]);

  const onPickCity = (opt) => {
    setCity(opt);
    setDistrict({ value: '', label: opt.value ? 'All districts' : 'Select city first' });
    setOpenField(null);
  };
  const onPickDistrict = (opt) => {
    setDistrict(opt);
    setOpenField(null);
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    if (district.value) params.set('district', district.value);
    const qs = params.toString();
    router.push(`/${lang}/projects${qs ? `?${qs}` : ''}`);
  };

  return (
    <div
      ref={ref}
      className="filter-bar relative z-20 mx-5 md:mx-10"
      style={{
        marginTop: -36,
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        .filter-bar .inner {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        html[data-theme="dark"] .filter-bar .inner {
          background: rgba(12,16,20,0.7);
          border-color: rgba(255,255,255,0.08);
        }
        .filter-bar .field { flex: 1; position: relative; }
        .filter-bar .field-label {
          display: block; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #C9A84C; margin-bottom: 6px; font-weight: 600;
        }
        .filter-bar .trigger {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 14px;
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          font-size: 15px; color: #1a1a2e; cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .filter-bar .trigger:hover { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.12); }
        .filter-bar .trigger:disabled { opacity: 0.4; cursor: not-allowed; }
        html[data-theme="dark"] .filter-bar .trigger {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: #F5F0E2;
        }
        .filter-bar .chev { opacity: 0.4; transition: transform 0.3s ease; }
        .filter-bar .field.open .chev { transform: rotate(180deg); }

        .filter-bar .dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          padding: 6px; z-index: 30;
          opacity: 0; transform: translateY(-8px) scale(0.96); pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 320px; overflow-y: auto;
        }
        .filter-bar .field.open .dropdown {
          opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
        }
        html[data-theme="dark"] .filter-bar .dropdown {
          background: rgba(20,24,28,0.96);
          border-color: rgba(255,255,255,0.08);
        }
        .filter-bar .option {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 10px 14px; background: none; border: none; border-radius: 10px;
          font-size: 14px; color: #1a1a2e; cursor: pointer; text-align: left;
          transition: background 0.15s ease;
        }
        .filter-bar .option:hover { background: rgba(0,0,0,0.04); }
        .filter-bar .option.active { background: rgba(201,168,76,0.12); font-weight: 500; }
        html[data-theme="dark"] .filter-bar .option { color: #F5F0E2; }
        html[data-theme="dark"] .filter-bar .option:hover { background: rgba(255,255,255,0.05); }
        .filter-bar .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .filter-bar .count {
          margin-left: auto; font-size: 12px; color: rgba(0,0,0,0.4);
        }
        html[data-theme="dark"] .filter-bar .count { color: rgba(255,255,255,0.4); }

        .filter-bar .search-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 24px; background: #1a1a2e; color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          white-space: nowrap; position: relative; overflow: hidden;
          transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding-right 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease;
        }
        .filter-bar .search-btn:hover { background: #2a2a4e; padding-right: 28px; }
        .filter-bar .search-btn:active { transform: scale(0.96); }
        .filter-bar .search-btn svg { transition: transform 0.3s ease; }
        .filter-bar .search-btn:hover svg { transform: rotate(90deg); }

        @media (max-width: 640px) {
          .filter-bar .inner { flex-direction: column; gap: 14px; padding: 24px 20px; }
          .filter-bar .search-btn { width: 100%; justify-content: center; padding: 14px 24px; }
        }
      `}</style>

      <div className="inner">
        {/* City */}
        <div className={`field ${openField === 'city' ? 'open' : ''}`}>
          <label className="field-label">City</label>
          <button
            type="button"
            className="trigger"
            onClick={() => setOpenField(openField === 'city' ? null : 'city')}
            aria-haspopup="listbox"
            aria-expanded={openField === 'city'}
          >
            <span>{city.label}</span>
            <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="dropdown" role="listbox">
            <button
              type="button"
              className={`option ${city.value === '' ? 'active' : ''}`}
              onClick={() => onPickCity({ value: '', label: 'All cities' })}
            >
              All cities
            </button>
            {cities.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`option ${city.value === c.value ? 'active' : ''}`}
                onClick={() => onPickCity(c)}
              >
                {c.color && <span className="dot" style={{ background: c.color }} />}
                {c.label}
                {c.count !== undefined && <span className="count">{c.count} projects</span>}
              </button>
            ))}
          </div>
        </div>

        {/* District */}
        <div className={`field ${openField === 'district' ? 'open' : ''}`}>
          <label className="field-label">District</label>
          <button
            type="button"
            className="trigger"
            onClick={() => {
              if (!city.value) return;
              setOpenField(openField === 'district' ? null : 'district');
            }}
            disabled={!city.value}
          >
            <span>{district.label}</span>
            <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="dropdown" role="listbox">
            <button
              type="button"
              className={`option ${district.value === '' ? 'active' : ''}`}
              onClick={() => onPickDistrict({ value: '', label: 'All districts' })}
            >
              All districts
            </button>
            {districtOptions.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`option ${district.value === d.value ? 'active' : ''}`}
                onClick={() => onPickDistrict(d)}
              >
                {d.label}
                {d.count !== undefined && <span className="count">{d.count} projects</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <button type="button" className="search-btn" onClick={onSearch}>
          <span>Search</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  );
}

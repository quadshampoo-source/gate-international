'use client';

import { useEffect, useRef, forwardRef } from 'react';

// Airbnb-style bottom sheet for the mobile hero search. State lives in the
// parent (hero-search), so the collapsed trigger and the expanded sheet
// stay in sync and a single submit() covers both.
export default function SearchBottomSheet({
  open,
  onClose,
  onSubmit,
  title = 'Find your residence',
  city,
  onCityChange,
  cities = [],
  district,
  onDistrictChange,
  districtOptions = [],
  beds,
  onBedsChange,
  bedroomOptions = [],
}) {
  const firstFieldRef = useRef(null);
  const sheetRef = useRef(null);

  // ESC to close, body scroll lock while open, focus first field on open.
  // The data-search-sheet attribute lets other fixed widgets (e.g. the
  // WhatsApp FAB) hide themselves via CSS while the sheet is up.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.setAttribute('data-search-sheet', 'open');
    const focusTimer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute('data-search-sheet');
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <div className="md:hidden">
      <style>{`
        html[data-search-sheet="open"] .wa-widget { display: none !important; }
      `}</style>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-sheet-title"
        aria-hidden={!open}
        className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          background: '#fff',
          borderTopLeftRadius: 'var(--atom-radius-2xl)',
          borderTopRightRadius: 'var(--atom-radius-2xl)',
          maxHeight: '60vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 60px rgba(15,22,36,0.18)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <span
            aria-hidden
            style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--neutral-200)' }}
          />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2
            id="search-sheet-title"
            className="text-lg font-semibold"
            style={{ color: 'var(--neutral-900)' }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-[var(--neutral-100)]"
            style={{ color: 'var(--neutral-700)' }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-4 pt-2 flex flex-col gap-[10px]">
          <SheetSelect
            ref={firstFieldRef}
            label="City"
            value={city}
            options={cities}
            onChange={onCityChange}
          />
          <SheetSelect
            label="District"
            value={district}
            options={districtOptions}
            onChange={onDistrictChange}
          />
          <SheetSelect
            label="Bedrooms"
            value={beds}
            options={bedroomOptions}
            onChange={onBedsChange}
          />
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold transition-transform hover:scale-[1.01]"
            style={{
              height: 52,
              borderRadius: 'var(--atom-radius-pill)',
              background: 'var(--accent-coral)',
              boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
            }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

// Native <select> keeps iOS/Android wheel pickers, which is the right call on
// mobile — nicer than re-implementing a virtualised list.
const SheetSelect = forwardRef(function SheetSelect(
  { label, value, options, onChange },
  ref,
) {
  return (
    <label className="flex flex-col gap-1">
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--neutral-400)' }}
      >
        {label}
      </span>
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm font-medium appearance-none"
        style={{
          height: 48,
          padding: '0 40px 0 16px',
          borderRadius: 'var(--atom-radius-md)',
          background: 'var(--neutral-50)',
          border: '1px solid var(--neutral-200)',
          color: 'var(--neutral-900)',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
});

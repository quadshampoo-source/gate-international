'use client';

import { useState } from 'react';

/**
 * Pill search bar with a gradient border and a coral circular submit.
 *
 * @param {Object} props
 * @param {string} [props.placeholder='Search…']
 * @param {(query: string) => void} [props.onSubmit]
 * @param {string} [props.defaultValue='']
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel='Search']
 */
export function SearchBar({
  placeholder = 'Search…',
  onSubmit,
  defaultValue = '',
  className = '',
  ariaLabel = 'Search',
}) {
  const [value, setValue] = useState(defaultValue);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label={ariaLabel}
      className={`relative w-full ${className}`.trim()}
      style={{
        padding: 2,
        borderRadius: 'var(--atom-radius-pill)',
        background: 'var(--gradient-border)',
      }}
    >
      <div
        className="flex items-center gap-3 pl-6 pr-2 h-16 bg-atom-white rounded-full"
        style={{ boxShadow: 'var(--atom-shadow-md)' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--neutral-400)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="flex-1 bg-transparent border-none outline-none text-base"
          style={{ color: 'var(--neutral-900)' }}
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="flex-shrink-0 rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            width: 48,
            height: 48,
            background: 'var(--accent-coral)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 6px 18px rgba(255, 107, 92, 0.35)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

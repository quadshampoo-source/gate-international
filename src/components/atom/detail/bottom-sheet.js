'use client';

import { useEffect, useRef } from 'react';

// Generalised bottom sheet — extracted from search-bottom-sheet.js so the
// detail page can reuse the same body-scroll-lock + ESC + backdrop click
// behaviour for the mobile info card and the Schedule Viewing modal.
export default function BottomSheet({
  open,
  onClose,
  title,
  closeLabel = 'Close',
  ariaLabelledById = 'bottom-sheet-title',
  maxHeight = '85vh',
  children,
}) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <>
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
        aria-labelledby={ariaLabelledById}
        aria-hidden={!open}
        className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          background: 'var(--atom-surface)',
          borderTopLeftRadius: 'var(--atom-radius-2xl)',
          borderTopRightRadius: 'var(--atom-radius-2xl)',
          maxHeight,
          overflowY: 'auto',
          boxShadow: '0 -20px 60px rgba(15,22,36,0.18)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <span aria-hidden style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--neutral-200)' }} />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 id={ariaLabelledById} className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-[var(--neutral-100)]"
              style={{ color: 'var(--neutral-700)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </>
  );
}

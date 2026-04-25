'use client';

import { useEffect, useState } from 'react';

const ESC = 'Escape';

// Schedule viewing modal — centered desktop dialog, full-screen sheet on
// mobile. Submits to console + shows toast for now (backend wiring deferred).
export default function ScheduleViewingModal({ open, onClose, projectName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === ESC) onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStatus(null);
      setForm({ name: '', email: '', phone: '', date: '', message: '' });
    }
  }, [open]);

  if (!open) return null;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStatus('submitting');
    // eslint-disable-next-line no-console
    console.log('[schedule-viewing] submit', { project: projectName, ...form });
    // Pretend network — keep it snappy (200ms)
    setTimeout(() => setStatus('success'), 200);
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-viewing-title"
        className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 md:p-6"
      >
        <div
          className="w-full md:max-w-lg overflow-y-auto"
          style={{
            background: '#fff',
            borderTopLeftRadius: 'var(--atom-radius-2xl)',
            borderTopRightRadius: 'var(--atom-radius-2xl)',
            borderBottomLeftRadius: 'var(--atom-radius-2xl)',
            borderBottomRightRadius: 'var(--atom-radius-2xl)',
            maxHeight: '90vh',
            boxShadow: '0 -20px 60px rgba(15,22,36,0.18)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <span aria-hidden style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--neutral-200)' }} />
          </div>

          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
            <div>
              <h2 id="schedule-viewing-title" className="text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>
                Schedule a viewing
              </h2>
              {projectName && (
                <div className="mt-1 text-sm" style={{ color: 'var(--neutral-500)' }}>
                  {projectName}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-[var(--neutral-100)]"
              style={{ color: 'var(--neutral-700)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {status === 'success' ? (
            <div className="px-6 pb-8 pt-2 text-center">
              <div
                className="inline-flex items-center justify-center mx-auto mb-4"
                style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--neutral-900)' }}>
                Request received
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--neutral-500)' }}>
                A senior advisor will reply within one business day to confirm.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center w-full md:w-auto md:px-8 h-12 text-sm font-semibold text-white"
                style={{ background: 'var(--accent-coral)', borderRadius: 'var(--atom-radius-pill)' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 pb-6 pt-2 flex flex-col gap-3">
              <Field label="Name" required value={form.name} onChange={update('name')} />
              <Field label="Email" type="email" required value={form.email} onChange={update('email')} />
              <Field label="Phone" type="tel" required value={form.phone} onChange={update('phone')} placeholder="+90 5XX XXX XX XX" />
              <Field label="Preferred date" type="date" value={form.date} onChange={update('date')} />
              <Field label="Message (optional)" textarea value={form.message} onChange={update('message')} />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 w-full inline-flex items-center justify-center text-white text-sm font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{
                  height: 52,
                  borderRadius: 'var(--atom-radius-pill)',
                  background: 'var(--accent-coral)',
                  boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
                }}
              >
                {status === 'submitting' ? 'Submitting…' : 'Request viewing'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, textarea, required }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
        {label}{required ? ' *' : ''}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full text-sm px-4 py-3"
          style={{
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-md)',
            background: 'var(--neutral-50)',
            color: 'var(--neutral-900)',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-sm px-4"
          style={{
            height: 48,
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-md)',
            background: 'var(--neutral-50)',
            color: 'var(--neutral-900)',
          }}
        />
      )}
    </label>
  );
}

'use client';

import { getDict } from '@/lib/i18n';

const fmtUsd = (n) => {
  if (!n && n !== 0) return null;
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `$${v.toLocaleString()}`;
};

export default function InvestmentBlock({ investment, lang = 'en' }) {
  const t = getDict(lang).pages.detail.investment;
  if (!investment || typeof investment !== 'object') return null;
  const {
    rental_yield_pct,
    appreciation_pct_5yr,
    roi_notes,
    citizenship_eligible,
    min_investment_for_citizenship,
  } = investment;

  const stats = [
    rental_yield_pct != null ? { label: t.rentalYield, value: `${rental_yield_pct}%`, hint: t.rentalYieldHint } : null,
    appreciation_pct_5yr != null ? { label: t.appreciation, value: `${appreciation_pct_5yr}%`, hint: t.appreciationHint } : null,
    {
      label: t.citizenship,
      value: citizenship_eligible ? t.eligible : t.notEligible,
      hint: citizenship_eligible
        ? min_investment_for_citizenship
          ? `${t.minPrefix} ${fmtUsd(min_investment_for_citizenship)}`
          : t.cbiBadge
        : null,
      eligible: !!citizenship_eligible,
    },
  ].filter(Boolean);

  if (stats.length === 0 && !roi_notes) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                background: '#fff',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-lg)',
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
                {s.label}
              </div>
              <div
                className="mt-2 text-2xl md:text-3xl font-bold"
                style={{
                  color: s.eligible ? 'var(--primary-600)' : 'var(--neutral-900)',
                }}
              >
                {s.value}
              </div>
              {s.hint && (
                <div className="mt-1 text-xs" style={{ color: 'var(--neutral-500)' }}>
                  {s.hint}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {citizenship_eligible && (
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-4"
          style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--atom-radius-pill)',
            color: 'var(--primary-700)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span className="text-sm font-semibold">
            {t.citizenshipBadge}{min_investment_for_citizenship ? ` · ${t.minPrefix} ${fmtUsd(min_investment_for_citizenship)}` : ''}
          </span>
        </div>
      )}

      {roi_notes && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--neutral-700)' }}>
          {roi_notes}
        </p>
      )}
    </section>
  );
}

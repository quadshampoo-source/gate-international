'use client';

// Renders payment_plan.stages as a horizontal timeline. Falls back to a
// compact "Down X% · Y months" line when the legacy shape is in use.
// Hides entirely when there's nothing to show.
export default function PaymentPlanTimeline({ paymentPlan }) {
  if (!paymentPlan || typeof paymentPlan !== 'object') return null;

  const stages = Array.isArray(paymentPlan.stages) ? paymentPlan.stages.filter(Boolean) : [];
  const hasStages = stages.length > 0;
  const hasLegacy = paymentPlan.downPct != null || paymentPlan.termMonths != null;
  const hasNoteOnly = !hasStages && !hasLegacy && !!paymentPlan.deadlineNote;
  if (!hasStages && !hasLegacy && !hasNoteOnly) return null;

  const totalPct = hasStages
    ? stages.reduce((sum, s) => sum + (Number(s.pct) || 0), 0)
    : null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        Payment plan
      </h2>

      {hasStages ? (
        <>
          {/* Mobile: vertical step list. Desktop: horizontal timeline. */}
          <ol className="md:hidden flex flex-col gap-3">
            {stages.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-4"
                style={{
                  background: '#fff',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--atom-radius-md)',
                }}
              >
                <span
                  aria-hidden
                  className="flex-shrink-0 inline-flex items-center justify-center text-sm font-bold"
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--primary-50)', color: 'var(--primary-700)',
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>
                    {s.label || s.timing || `Stage ${i + 1}`}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: 'var(--neutral-500)' }}>
                    {s.timing && s.label && s.timing !== s.label ? `${s.timing} · ` : ''}
                    <strong style={{ color: 'var(--primary-700)' }}>{s.pct ?? '—'}%</strong>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div
            className="hidden md:flex items-stretch gap-2 p-5"
            style={{
              background: '#fff',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-lg)',
            }}
          >
            {stages.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center min-w-0">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {s.pct ?? '—'}%
                </div>
                <div className="text-sm font-semibold leading-tight" style={{ color: 'var(--neutral-900)' }}>
                  {s.label || `Stage ${i + 1}`}
                </div>
                {s.timing && s.timing !== s.label && (
                  <div className="mt-1 text-xs" style={{ color: 'var(--neutral-500)' }}>
                    {s.timing}
                  </div>
                )}
                {i < stages.length - 1 && (
                  <div aria-hidden className="hidden lg:block absolute" style={{ height: 1 }} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--neutral-500)' }}>
            {totalPct != null && totalPct !== 100 && <span>Stages total: {totalPct}%</span>}
            {paymentPlan.interestPct != null && <span>Interest: {paymentPlan.interestPct}%</span>}
            {paymentPlan.totalMonths != null && <span>Total period: {paymentPlan.totalMonths} months</span>}
            {paymentPlan.deadlineNote && <span style={{ color: 'var(--neutral-700)' }}>{paymentPlan.deadlineNote}</span>}
          </div>
        </>
      ) : hasLegacy ? (
        <div
          className="p-5"
          style={{
            background: '#fff',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-lg)',
            color: 'var(--neutral-700)',
          }}
        >
          {paymentPlan.downPct != null && <span><strong>{paymentPlan.downPct}%</strong> down payment</span>}
          {paymentPlan.downPct != null && paymentPlan.termMonths != null && ' · '}
          {paymentPlan.termMonths != null && <span>{paymentPlan.termMonths}-month plan</span>}
          {paymentPlan.interestPct != null && (
            <span>{(paymentPlan.downPct != null || paymentPlan.termMonths != null) ? ' · ' : ''}{paymentPlan.interestPct}% interest</span>
          )}
          {paymentPlan.deadlineNote && (
            <div className="mt-2 text-xs" style={{ color: 'var(--neutral-500)' }}>{paymentPlan.deadlineNote}</div>
          )}
        </div>
      ) : (
        // Note-only fallback: Aliée Loft and similar where the plan is TBD.
        <div
          className="p-5 text-sm"
          style={{
            background: '#fff',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-lg)',
            color: 'var(--neutral-700)',
          }}
        >
          {paymentPlan.deadlineNote}
        </div>
      )}
    </section>
  );
}

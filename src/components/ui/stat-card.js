/**
 * Stat tile — big number on top, primary-coloured label, muted uppercase
 * caption. Accepts either a string number ("100K+") or split accent parts
 * via the `accent` prop.
 *
 * @param {Object} props
 * @param {string} props.number     Shown in the extra-bold neutral-900 figure.
 * @param {string} [props.accent]   Optional gradient suffix (e.g. "+", "K").
 * @param {string} props.label      Middle row, rendered in primary-500.
 * @param {string} [props.caption]  Uppercase caption underneath.
 * @param {string} [props.className]
 */
export function StatCard({ number, accent, label, caption, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div
        className="leading-none tracking-tight"
        style={{
          font: '800 48px/1 var(--atom-font-sans)',
          color: 'var(--neutral-900)',
        }}
      >
        {number}
        {accent && <span className="atom-accent" style={{ fontWeight: 800 }}>{accent}</span>}
      </div>
      {label && (
        <div
          style={{
            font: '500 16px/1.4 var(--atom-font-sans)',
            color: 'var(--primary-500)',
          }}
        >
          {label}
        </div>
      )}
      {caption && (
        <div
          style={{
            font: '500 12px/1.4 var(--atom-font-sans)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--neutral-400)',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

export default StatCard;

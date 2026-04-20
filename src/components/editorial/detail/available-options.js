import { fmtUsd } from '@/lib/utils';

export default function AvailableOptions({ kicker, heading, options = [] }) {
  const visible = (Array.isArray(options) ? options : []).filter((o) => o && (o.type || o.size || o.price));
  if (!visible.length) return null;

  return (
    <section className="py-20 md:py-28" style={{ background: 'rgb(var(--c-bg-raised))' }}>
      <div className="container-x">
        <div className="mb-10 md:mb-14 max-w-[780px]">
          {kicker && (
            <div
              className="font-mono mb-4"
              style={{
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}
            >
              {kicker}
            </div>
          )}
          {heading && (
            <h2
              className="font-editorial"
              style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {heading}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {visible.map((opt, i) => {
            const priceNum = Number(String(opt.price ?? '').replace(/\D/g, ''));
            const sizeNum = Number(String(opt.size ?? '').replace(/\D/g, ''));
            return (
              <div
                key={i}
                className="p-6 md:p-7 rounded-[16px]"
                style={{
                  background: 'rgb(var(--c-bg))',
                  border: '1px solid rgb(var(--c-line))',
                }}
              >
                <div className="flex items-baseline justify-between mb-4 gap-3">
                  <div className="font-editorial text-[24px] md:text-[28px] leading-none tracking-[-0.015em]">
                    {opt.type || '—'}
                  </div>
                  {sizeNum > 0 && (
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 12,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgb(var(--c-fg-muted))',
                      }}
                    >
                      {sizeNum} m²
                    </div>
                  )}
                </div>
                {priceNum > 0 && (
                  <div
                    className="font-editorial"
                    style={{
                      fontSize: 'clamp(24px, 3vw, 32px)',
                      color: '#C9A84C',
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {fmtUsd(priceNum)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

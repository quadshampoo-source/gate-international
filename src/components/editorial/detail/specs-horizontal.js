'use client';

import { useEffect, useRef, useState } from 'react';

function useInView(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -10%' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

function CountUp({ to, suffix = '', duration = 1.4 }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  const [value, setValue] = useState(0);
  const target = Number(to) || 0;

  useEffect(() => {
    if (!seen) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setValue(target); return; }
    const start = performance.now();
    const from = 0;
    let raf;
    const step = (t) => {
      const elapsed = (t - start) / 1000;
      const p = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export default function SpecsHorizontal({ kicker, heading, items = [] }) {
  const visible = items.filter((x) => x.value !== null && x.value !== undefined && x.value !== '');
  if (!visible.length) return null;
  return (
    <section className="py-20 md:py-28" style={{ background: 'rgb(var(--c-bg))' }}>
      <div className="container-x">
        {(kicker || heading) && (
          <div className="mb-10 md:mb-14 max-w-[780px]">
            {kicker && (
              <div
                className="font-mono text-[10px] md:text-[11px] uppercase text-[#C9A84C] mb-4"
                style={{ letterSpacing: '3px' }}
              >
                {kicker}
              </div>
            )}
            {heading && (
              <h2 className="font-editorial text-[36px] md:text-[52px] leading-[1.08] tracking-[-0.02em]">
                {heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {visible.map((it, i) => (
            <div
              key={i}
              className="p-6 md:p-8 rounded-[16px]"
              style={{
                background: 'rgb(var(--c-bg-raised))',
                border: '1px solid rgb(var(--c-line))',
              }}
            >
              <div
                className="font-mono text-[10px] uppercase mb-3"
                style={{ letterSpacing: '3px', color: '#C9A84C' }}
              >
                {it.label}
              </div>
              <div className="font-editorial text-[42px] md:text-[54px] leading-none tracking-[-0.02em]">
                {typeof it.value === 'number' ? (
                  <CountUp to={it.value} suffix={it.suffix || ''} />
                ) : (
                  it.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

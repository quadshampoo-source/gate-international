import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Card, PillTag } from '@/components/ui';

function fmtPrice(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

export default async function AtomCompare({ lang = 'en', projects = [] }) {
  // Aggregate per-district median price + count.
  const byDistrict = new Map();
  for (const p of projects) {
    const d = (p.district || '').trim();
    if (!d) continue;
    const price = Number(p.priceUsd ?? p.price_usd) || 0;
    if (!byDistrict.has(d)) byDistrict.set(d, { name: d, count: 0, prices: [], metroCount: 0 });
    const row = byDistrict.get(d);
    row.count += 1;
    if (price > 0) row.prices.push(price);
    if (p.metro) row.metroCount += 1;
  }
  const rows = [...byDistrict.values()]
    .map((r) => {
      const sorted = [...r.prices].sort((a, b) => a - b);
      const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
      const min = sorted[0] || 0;
      const max = sorted[sorted.length - 1] || 0;
      return { ...r, median, min, max, metroRatio: r.count ? r.metroCount / r.count : 0 };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="Compare"
        title={<>Districts, <span className="atom-accent">side by side.</span></>}
        sub="Entry price, median price, spread, metro access and inventory density — across the districts we cover."
      />

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Card padding="md" align="left" hairline={false} className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: 'var(--neutral-50)' }}>
                    <Th>District</Th>
                    <Th align="right">Projects</Th>
                    <Th align="right">Entry</Th>
                    <Th align="right">Median</Th>
                    <Th align="right">Top</Th>
                    <Th align="right">Metro access</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.name} style={{ borderTop: '1px solid var(--neutral-100)' }}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold" style={{ color: 'var(--neutral-900)' }}>{r.name}</span>
                          {r.metroRatio >= 0.6 && <PillTag>Metro-rich</PillTag>}
                        </div>
                      </Td>
                      <Td align="right">{r.count}</Td>
                      <Td align="right">{fmtPrice(r.min)}</Td>
                      <Td align="right" strong>{fmtPrice(r.median)}</Td>
                      <Td align="right">{fmtPrice(r.max)}</Td>
                      <Td align="right">{Math.round(r.metroRatio * 100)}%</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="text-xs mt-4" style={{ color: 'var(--neutral-400)' }}>
            Based on {projects.length} active residences. Prices in USD, listing values — not transacted. Metro access = % of projects within 500 m of a station.
          </p>
        </div>
      </section>
    </AtomShell>
  );
}

function Th({ children, align = 'left' }) {
  return (
    <th className="px-5 py-4 text-left atom-caption" style={{ textAlign: align, color: 'var(--neutral-500)', fontSize: 11, letterSpacing: '0.1em' }}>
      {children}
    </th>
  );
}
function Td({ children, align = 'left', strong = false }) {
  return (
    <td
      className="px-5 py-4"
      style={{
        textAlign: align,
        color: strong ? 'var(--neutral-900)' : 'var(--neutral-700)',
        fontWeight: strong ? 600 : 400,
      }}
    >
      {children}
    </td>
  );
}

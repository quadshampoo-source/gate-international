import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { DISTRICTS, districtStats, PROJECTS } from '@/lib/projects';

const GROWTH = {
  Maslak: 'high', Kağıthane: 'high', Levent: 'high', Güneşli: 'high',
  Beyoğlu: 'medium', Şişli: 'medium', Ataşehir: 'medium',
  Sariyer: 'medium', Beşiktaş: 'stable', Üsküdar: 'stable', Göktürk: 'medium',
};
const PRIMARY_MARKET = {
  Maslak: 'china', Kağıthane: 'china', Levent: 'china', Güneşli: 'china',
  Beşiktaş: 'arab', Beyoğlu: 'arab', Şişli: 'arab', Göktürk: 'arab',
  Sariyer: 'both', Üsküdar: 'both', Ataşehir: 'both',
};

const fmtUsd = (n) => {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
};

export default async function ComparePage({ params }) {
  const { lang } = await params;
  const t = getDict(lang);
  const c = t.compare;

  const rows = DISTRICTS.map((d) => {
    const count = PROJECTS.filter((p) => p.district === d).length;
    const stats = districtStats(d);
    return {
      d,
      count,
      avgPrice: stats?.avgPriceUsd || null,
      avgSqm: stats?.avgSqmUsd || null,
      metroPct: stats?.metroPct ?? null,
      bosphorus: stats?.hasBosphorus || false,
      growth: GROWTH[d] || 'stable',
      primary: PRIMARY_MARKET[d] || 'both',
    };
  });

  const growthLabel = (g) => (g === 'high' ? c.high : g === 'medium' ? c.medium : c.stable);
  const growthColor = (g) => (g === 'high' ? '#4ade80' : g === 'medium' ? '#C9A84C' : '#9a9487');

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-15 border-b border-line">
        <div className="container-x">
          <span className="kicker">{c.kicker}</span>
          <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[1.02] tracking-[-0.025em] my-4">
            {c.title}
          </h1>
          <p className="text-fg-muted text-[17px] max-w-[640px]">{c.sub}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="bg-bg-sunken">
                  <Th>{c.district}</Th>
                  <Th>{c.count}</Th>
                  <Th>{c.avgPrice}</Th>
                  <Th>{c.avgSqm}</Th>
                  <Th>{c.metro}</Th>
                  <Th>{c.bosphorus}</Th>
                  <Th>{c.market}</Th>
                  <Th>{c.growth}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.d} className="border-t border-line hover:bg-bg-raised transition-colors">
                    <Td>
                      <Link href={`/${lang}/projects?district=${encodeURIComponent(r.d)}`} className="font-serif text-[17px] hover:text-gold transition-colors">
                        {r.d}
                      </Link>
                    </Td>
                    <Td mono>{r.count}</Td>
                    <Td mono>{fmtUsd(r.avgPrice)}</Td>
                    <Td mono>{r.avgSqm ? `$${r.avgSqm.toLocaleString()}` : '—'}</Td>
                    <Td mono>{r.metroPct !== null ? `${r.metroPct}%` : '—'}</Td>
                    <Td mono>{r.bosphorus ? '✓' : '—'}</Td>
                    <Td mono>
                      {r.primary === 'china' ? '🇨🇳' : r.primary === 'arab' ? '🇸🇦' : '🇨🇳 🇸🇦'}
                    </Td>
                    <Td>
                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: growthColor(r.growth) }}>
                        {growthLabel(r.growth)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left rtl:text-right px-5 py-4 font-mono text-[10px] tracking-[0.18em] uppercase text-gold font-normal whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, mono }) {
  return (
    <td className={`px-5 py-4 text-[14px] ${mono ? 'font-mono text-fg' : 'text-fg'}`}>
      {children}
    </td>
  );
}

import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { districtLabel } from '@/lib/districts';
import { FadeIn, ScrollReveal } from '@/components/motion';

function renderTitle(title) {
  if (!title || typeof title !== 'string') return title;
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1];
  const match = last.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const core = match ? match[1] : last;
  const punct = match ? match[2] : '';
  const before = parts.slice(0, -1).join(' ');
  return (<>{before}{before ? ' ' : ''}<em className="italic">{core}</em>{punct}</>);
}

const fmtUsd = (n) => {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
};

function growthChip(g) {
  const map = {
    high: { label: 'High', bg: '#D7F0DC', fg: '#14532D' },
    medium: { label: 'Medium', bg: '#F6ECCB', fg: '#6D5A17' },
    stable: { label: 'Stable', bg: '#E0EBF0', fg: '#273C46' },
  };
  const s = map[g] || map.stable;
  return (
    <span className="font-mono text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export default function EditorialCompare({ lang, rows, c }) {
  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container-x">
          <FadeIn delay={0.1}>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
              {c.kicker}
            </span>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h1 className="font-editorial text-[48px] md:text-[84px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7 max-w-[900px]">
              {renderTitle(c.title)}
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[640px] mt-6">
              {c.sub}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Table card */}
      <section className="pb-24">
        <div className="container-x">
          <ScrollReveal>
            <div
              className="rounded-[28px] overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #E0EBF0', boxShadow: '0 20px 60px rgba(5,26,36,0.08)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse">
                  <thead>
                    <tr style={{ background: '#F6FCFF' }}>
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
                    {rows.map((r, i) => (
                      <tr key={r.d} style={{ borderTop: '1px solid #E0EBF0' }}>
                        <Td>
                          <Link
                            href={`/${lang}/projects?district=${encodeURIComponent(r.d)}`}
                            className="font-editorial text-[17px] text-[#051A24] hover:text-[#C9A84C] transition-colors"
                          >
                            {districtLabel(r.d, lang)}
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
                        <Td>{growthChip(r.growth)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left rtl:text-right px-5 py-4 font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-normal whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, mono }) {
  return (
    <td className={`px-5 py-4 text-[14px] ${mono ? 'font-mono text-[#051A24]' : 'text-[#051A24]'}`}>
      {children}
    </td>
  );
}

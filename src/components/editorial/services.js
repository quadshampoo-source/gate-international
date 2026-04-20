import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { FadeIn, ScrollReveal, Stagger } from '@/components/motion';
import EditorialServicesAccordion from '@/components/editorial/services-accordion';

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

const EXTRA_ICONS = ['💎', '💻', '🏢', '📋', '⛵', '🚗', '📖', '🎥'];

export default async function EditorialServices({ lang }) {
  const t = getDict(lang);
  const s = t.services;

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-x">
          <FadeIn delay={0.1}>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
              {s.kicker}
            </span>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h1 className="font-editorial text-[52px] md:text-[92px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-8 max-w-[960px]">
              {renderTitle(s.title)}
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="text-[15px] md:text-[19px] leading-relaxed text-[#273C46] max-w-[640px] mt-7">
              {s.sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.65}>
            <div
              className="mt-10 inline-flex items-center gap-4 px-6 py-4 rounded-full"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
            >
              <span className="text-2xl leading-none">🚗</span>
              <span className="font-editorial text-[17px] md:text-[19px] text-[#051A24]">{s.motto}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Core services — accordion */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                № 01 — {s.groupMain}
              </div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(s.groupMain)}
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialServicesAccordion items={s.items} />
          </ScrollReveal>
        </div>
      </section>

      {/* Extras grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                № 02 — {s.groupExtra}
              </div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(s.groupExtra)}
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.06}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(s.extras || []).map((item, i) => (
                <div
                  key={i}
                  className="p-6 md:p-7 rounded-[22px] h-full flex flex-col"
                  style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                >
                  <div className="text-3xl leading-none mb-4">{EXTRA_ICONS[i] || '✦'}</div>
                  <div className="font-editorial text-[18px] md:text-[20px] leading-tight text-[#051A24] mb-2">
                    {item.t}
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#273C46]">{item.d}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div
              className="relative rounded-[36px] p-10 md:p-16 overflow-hidden max-w-[960px] mx-auto"
              style={{ background: '#051A24', color: '#FFFFFF' }}
            >
              <div className="editorial-grain" />
              <div className="relative grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 items-center">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                    № 03 — Concierge
                  </div>
                  <h2 className="font-editorial text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mb-5">
                    {renderTitle(s.ctaTitle)}
                  </h2>
                  <p className="text-[15px] text-white/75 max-w-[420px]">{s.ctaBody}</p>
                </div>
                <div className="flex md:justify-end">
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-white text-[#051A24] text-[13px] font-medium hover:bg-[#F6FCFF] transition-colors"
                  >
                    {s.ctaBtn}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

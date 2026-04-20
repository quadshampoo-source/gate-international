import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';
import { FadeIn, ScrollReveal, Stagger, Counter } from '@/components/motion';
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

const STAT_METRICS = [
  { value: 250, suffix: '+' },
  { value: 10, suffix: '+' },
  { value: '6-9', raw: true },
  { value: 98, suffix: '%' },
];

const STEP_ICONS = ['🏠', '📋', '📄', '🇹🇷'];

export default function EditorialCitizenship({ lang }) {
  const t = getDict(lang).citizenshipV2;
  const waHref = whatsappLink(t.waMsg, lang);
  const faqItems = (t.faqs || []).map((f) => ({ t: f.q, d: f.a }));

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-x">
          <FadeIn delay={0.1}>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
              {t.heroKicker}
            </span>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h1 className="font-editorial text-[52px] md:text-[96px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-8 max-w-[960px]">
              {renderTitle(t.heroTitle)}
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="text-[15px] md:text-[19px] leading-relaxed text-[#273C46] max-w-[640px] mt-7">
              {t.heroSub}
            </p>
          </FadeIn>
          <FadeIn delay={0.65}>
            <div className="flex flex-wrap gap-2.5 mt-8">
              {[t.b1, t.b2, t.b3, t.b4].map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-mono tracking-[0.12em] uppercase"
                  style={{ background: '#F6FCFF', color: '#051A24', border: '1px solid #E0EBF0' }}
                >
                  <span className="text-[#C9A84C]">✓</span> {b}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <Stagger stagger={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {STAT_METRICS.map((m, i) => (
                <div
                  key={i}
                  className="relative rounded-[22px] p-6 md:p-8 text-center overflow-hidden"
                  style={{ background: '#FFFFFF', border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.05)' }}
                >
                  <div className="editorial-grain" />
                  <div className="relative">
                    <div className="font-editorial text-[42px] md:text-[56px] leading-none tracking-[-0.03em] text-[#051A24]">
                      {m.raw ? m.value : (<><Counter to={m.value} /><span className="text-[#C9A84C]">{m.suffix}</span></>)}
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#273C46] mt-3">
                      {t.stats[i]?.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                {t.processKicker}
              </div>
              <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.processTitle)}
              </h2>
            </div>
          </ScrollReveal>
          <div className="space-y-4">
            {(t.steps || []).map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div
                  className="grid grid-cols-[auto_1fr] md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-start p-6 md:p-10 rounded-[28px]"
                  style={{ background: i % 2 === 0 ? '#F6FCFF' : '#FFFFFF', border: '1px solid #E0EBF0' }}
                >
                  <div className="flex items-center gap-4 md:block">
                    <div className="font-editorial text-[52px] md:text-[88px] text-[#C9A84C] leading-none tracking-[-0.04em]">
                      0{i + 1}
                    </div>
                    <div className="text-4xl md:text-5xl md:mt-3">{STEP_ICONS[i]}</div>
                  </div>
                  <div>
                    <h3 className="font-editorial text-[24px] md:text-[30px] leading-tight tracking-[-0.01em] mb-3 text-[#051A24]">
                      {s.title}
                    </h3>
                    <p className="text-[15px] md:text-[16px] leading-relaxed text-[#273C46] max-w-[560px]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                {t.diffKicker}
              </div>
              <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.whyTitle)}
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(t.whyItems || []).map((w, i) => (
                <div
                  key={i}
                  className="p-7 md:p-9 rounded-[24px] bg-white"
                  style={{ border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.04)' }}
                >
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                    № {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-editorial text-[22px] md:text-[26px] mb-3 tracking-[-0.01em] text-[#051A24]">
                    {w.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#273C46]">{w.body}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x max-w-[960px]">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-14">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                {t.faqKicker}
              </div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.faqTitle)}
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialServicesAccordion items={faqItems} />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div
              className="relative rounded-[36px] p-10 md:p-16 text-center overflow-hidden max-w-[960px] mx-auto"
              style={{ background: '#051A24', color: '#FFFFFF' }}
            >
              <div className="editorial-grain" />
              <div className="relative">
                <h2 className="font-editorial text-[36px] md:text-[56px] leading-[1.05] tracking-[-0.02em] mb-4">
                  {renderTitle(t.ctaTitle)}
                </h2>
                <p className="text-[15px] text-white/75 mb-8">{t.ctaSub}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-white text-[#051A24] text-[13px] font-medium hover:bg-[#F6FCFF] transition-colors"
                  >
                    {t.ctaBtn}
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full text-white text-[13px] font-medium hover:bg-white/10 transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    {t.otherContact}
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

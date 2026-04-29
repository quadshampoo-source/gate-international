import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { DEVELOPERS } from '@/lib/projects';
import { FadeIn, ScrollReveal, Counter, Stagger } from '@/components/motion';
import EditorialTestimonials from '@/components/editorial/testimonials-carousel';
import EditorialMarquee from '@/components/editorial/marquee';

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

const PRESS = ['Bloomberg', 'Reuters', 'Al Arabiya', '财经', 'Hurriyet', 'Forbes'];

export default function EditorialWhyUs({ lang, testimonials }) {
  const t = getDict(lang);
  const w = t.why;

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-x">
          <FadeIn delay={0.1}>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
              {w.kicker}
            </span>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h1 className="font-editorial text-[52px] md:text-[92px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7 max-w-[960px]">
              {renderTitle(w.title)}
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="text-[15px] md:text-[19px] leading-relaxed text-[#273C46] max-w-[640px] mt-7">
              {w.sub}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 01 — Pillars</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                Five <em className="italic">promises.</em>
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.06}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(w.items || []).map((it, i) => (
                <div
                  key={i}
                  className="p-7 rounded-[24px] bg-white h-full"
                  style={{ border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.04)' }}
                >
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                    № {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-editorial text-[22px] text-[#051A24] leading-tight mb-2">{it.t}</div>
                  <p className="text-[14px] text-[#273C46] leading-relaxed">{it.d}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* Developers marquee */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-x mb-8">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — Partners</div>
          <h2 className="font-editorial text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
            {renderTitle(w.developers)}
          </h2>
        </div>
        <EditorialMarquee speed={40}>
          {DEVELOPERS.map((d) => (
            <div
              key={d}
              className="font-editorial text-[#051A24] text-[24px] md:text-[32px] px-6 whitespace-nowrap"
            >
              {d}
            </div>
          ))}
        </EditorialMarquee>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-14">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 03 — Clients</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(w.testimonials)}
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialTestimonials items={testimonials} />
          </ScrollReveal>
        </div>
      </section>

      {/* Counter row */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div
              className="relative rounded-[28px] p-8 md:p-10 overflow-hidden"
              style={{ background: '#051A24', color: '#FFFFFF' }}
            >
              <div className="editorial-grain" />
              <div className="relative">
                <div className="font-editorial text-[72px] md:text-[96px] leading-none tracking-[-0.03em] text-[#C9A84C]">
                  <Counter to={w.salesCounterNumber} duration={2.5} />
                </div>
                <p className="text-[15px] text-white/75 mt-5 max-w-[380px]">{w.salesCounter}</p>
              </div>
            </div>
            <div
              className="relative rounded-[28px] p-8 md:p-10 overflow-hidden"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
            >
              <div className="font-editorial text-[72px] md:text-[96px] leading-none tracking-[-0.03em] text-[#051A24]">
                {w.yieldValue}
              </div>
              <p className="text-[15px] text-[#273C46] mt-5 max-w-[380px]">
                {w.yieldLine} <span className="text-[#C9A84C]">{w.yieldValue}</span> {w.yieldSuffix}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 md:py-20" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-8 text-center">
            № 04 — {w.press}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {PRESS.map((p) => (
              <div
                key={p}
                className="h-20 flex items-center justify-center rounded-[16px] font-editorial text-[18px] md:text-[20px] text-[#273C46]"
                style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 05 — Offices</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(w.offices)}
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { city: w.officeIst, flag: '🇹🇷', addr: 'Zorlu Residence R1 Blok, Teras Evler No:124\nBeşiktaş, Istanbul / Turkey', code: '+90 535 520 6339' },
                { city: w.officeRyd, flag: '🇸🇦', addr: 'King Fahd Road, Al Olaya\nRiyadh 12213', code: '' },
                { city: w.officeSha, flag: '🇨🇳', addr: 'Huaihai Road, Xuhui\nShanghai 200031', code: '' },
              ].map((o) => (
                <div
                  key={o.city}
                  className="p-7 rounded-[24px]"
                  style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[18px] leading-none">{o.flag}</span>
                    <div className="font-editorial text-[22px] text-[#051A24]">{o.city}</div>
                  </div>
                  <div className="text-[13px] text-[#273C46] whitespace-pre-line leading-relaxed mb-4">{o.addr}</div>
                  <div className="font-mono text-[11px] text-[#C9A84C] tracking-[0.1em]">{o.code}</div>
                </div>
              ))}
            </div>
          </Stagger>
          <div className="mt-10 text-center">
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
            >
              {t.nav.contact}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

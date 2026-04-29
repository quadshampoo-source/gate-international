import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { DEVELOPERS } from '@/lib/projects';
import { ShieldIcon, AwardIcon, GlobeIcon, KeyIcon, CheckIcon } from '@/components/icons';
import { FadeIn, ScrollReveal, Counter, Marquee } from '@/components/motion';
import EditorialWhyUs from '@/components/editorial/why-us';
import AtomWhyUs from '@/components/atom/why-us';
import { getActiveTheme } from '@/lib/theme';
import { getTestimonials } from '@/lib/testimonials';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const w = getDict(lang).why;
  return buildPageMetadata({
    lang,
    path: '/why-us',
    title: w.title,
    description: w.sub,
  });
}

const TESTIMONIALS = [
  { name: 'Ahmed Al-Saud', role: 'Riyadh → Istanbul', q: 'Gate handled everything from airport pickup to TAPU registration. Flawless.', lang: 'EN' },
  { name: '王建国', role: 'Shanghai → Istanbul', q: '从第一次看房到入住,整个过程非常专业和透明。', lang: 'ZH' },
  { name: 'Khalid Al-Rashid', role: 'Jeddah → Istanbul', q: 'أفضل تجربة استثمار عقاري عبر الحدود مررت بها.', lang: 'AR' },
  { name: 'Fatima Al-Mansouri', role: 'Abu Dhabi → Istanbul', q: 'The legal team understood the nuances of cross-border purchase perfectly.', lang: 'EN' },
  { name: '李梦', role: 'Beijing → Istanbul', q: '从选房到入籍一条龙服务,非常满意。', lang: 'ZH' },
  { name: 'Salman Al-Bader', role: 'Kuwait → Istanbul', q: 'خدمة احترافية بلغة عربية أصيلة ونتائج ملموسة.', lang: 'AR' },
];

const PRESS = ['Bloomberg', 'Reuters', 'Al Arabiya', '财经', 'Hurriyet', 'Forbes'];

export default async function WhyUsPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomWhyUs lang={lang} />;
  if (theme === 'editorial') {
    const testimonials = await getTestimonials();
    const mapped = testimonials.map((r) => ({ name: r.name, role: r.role, quote: r.quote }));
    return <EditorialWhyUs lang={lang} testimonials={mapped.length ? mapped : undefined} />;
  }
  const t = getDict(lang);
  const w = t.why;

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-15 border-b border-line">
        <div className="container-x">
          <span className="kicker">{w.kicker}</span>
          <h1 className="font-serif text-[clamp(48px,6.5vw,96px)] leading-[1.02] tracking-[-0.025em] my-4 text-fg">
            {w.title}
          </h1>
          <p className="text-fg-muted text-[17px] max-w-[640px]">{w.sub}</p>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div>
              <span className="kicker block mb-3">№ 01 — PILLARS</span>
              <h2 className="section-title">Five promises.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
              {w.items.map((it, i) => {
                const icons = [<ShieldIcon key="s" />, <CheckIcon key="c" />, <KeyIcon key="k" />, <GlobeIcon key="g" />, <AwardIcon key="a" />];
                return (
                  <div key={i} className="bg-bg p-6 min-h-[180px] flex flex-col gap-3">
                    <div className="w-10 h-10 border border-gold/35 flex items-center justify-center text-gold">
                      {icons[i] || <CheckIcon />}
                    </div>
                    <div className="font-serif text-[20px] leading-tight">{it.t}</div>
                    <p className="text-fg-muted text-[13px] leading-relaxed">{it.d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-20">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 02 — PARTNERS</span>
            <h2 className="section-title">{w.developers}</h2>
          </div>
          <Marquee speed={40} className="border-y border-line py-8">
            {DEVELOPERS.map((d) => (
              <div key={d} className="font-serif text-fg-muted hover:text-gold transition-colors text-[20px] md:text-[26px] px-4 whitespace-nowrap">
                {d}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 03 — CLIENTS</span>
            <h2 className="section-title">{w.testimonials}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t2, i) => (
              <div key={i} className="bg-bg border border-line p-6 min-h-[220px] flex flex-col gap-4">
                <div className="text-gold text-5xl font-serif leading-none">&ldquo;</div>
                <p className="text-fg-muted text-[14px] leading-relaxed flex-1" style={{ direction: t2.lang === 'AR' ? 'rtl' : 'ltr' }}>
                  {t2.q}
                </p>
                <div>
                  <div className="font-serif text-[17px]">{t2.name}</div>
                  <div className="font-mono text-[10px] text-gold tracking-[0.14em] uppercase mt-1">{t2.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-15 md:py-20">
        <div className="container-x">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 flex-wrap">
            <div>
              <div className="font-serif text-[56px] md:text-[80px] text-gold leading-none tracking-[-0.03em]">
                <Counter to={w.salesCounterNumber} duration={2.5} />
              </div>
              <p className="text-fg-muted mt-3 text-[15px] max-w-[360px]">{w.salesCounter}</p>
            </div>
            <div className="text-right rtl:text-left">
              <div className="font-serif text-[44px] md:text-[64px] text-fg leading-none tracking-[-0.02em]">
                {w.yieldValue}
              </div>
              <p className="text-fg-muted mt-3 text-[15px] max-w-[360px] ml-auto rtl:ml-0 rtl:mr-auto">
                {w.yieldLine} <span className="text-gold">{w.yieldValue}</span> {w.yieldSuffix}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <span className="kicker block mb-4">№ 04 — {w.press.toUpperCase()}</span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-line border border-line">
            {PRESS.map((p) => (
              <div key={p} className="bg-bg p-6 min-h-[80px] flex items-center justify-center font-serif text-fg-muted text-[15px]">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 05 — OFFICES</span>
            <h2 className="section-title">{w.offices}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {[
              { city: w.officeIst, addr: 'Zorlu Residence R1 Blok, Teras Evler No:124\nBeşiktaş, Istanbul / Turkey', code: '+90 535 520 6339' },
              { city: w.officeRyd, addr: 'King Fahd Road, Al Olaya\nRiyadh 12213', code: '' },
              { city: w.officeSha, addr: 'Huaihai Road, Xuhui\nShanghai 200031', code: '' },
            ].map((o) => (
              <div key={o.city} className="bg-bg p-7 min-h-[200px] flex flex-col gap-4">
                <div className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">{o.city}</div>
                <div className="font-serif text-[18px] whitespace-pre-line leading-snug flex-1">{o.addr}</div>
                <div className="font-mono text-[12px] text-fg-muted">{o.code}</div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">{w.offices}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

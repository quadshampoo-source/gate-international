import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';
import { ScrollReveal, Counter, FadeIn } from '@/components/motion';
import BlurText from '@/components/cinematic/blur-text';
import Accordion from '@/components/cinematic/accordion';
import OrbBackdrop from '@/components/cinematic/orb-backdrop';
import { ShieldIcon, AwardIcon, GlobeIcon, CheckIcon } from '@/components/icons';
import EditorialCitizenship from '@/components/editorial/citizenship';
import AtomCitizenship from '@/components/atom/citizenship';
import AtomShell from '@/components/atom/shell';
import { getActiveTheme } from '@/lib/theme';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).citizenshipV2;
  return { title: `${t.heroTitle} — Gate International`, description: t.heroSub };
}

const STAT_METRICS = [
  { value: 250, suffix: '+' },
  { value: 10, suffix: '+' },
  { value: '6-9', raw: true },
  { value: 98, suffix: '%' },
];

const STEP_DECOR = [
  { n: '01', icon: '🏠' },
  { n: '02', icon: '📋' },
  { n: '03', icon: '📄' },
  { n: '04', icon: '🇹🇷' },
];

const WHY_ICONS = [
  <ShieldIcon key="shield" />,
  <GlobeIcon key="globe" />,
  <AwardIcon key="award" />,
  <CheckIcon key="check" />,
];

export default async function CitizenshipPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomShell lang={lang}><AtomCitizenship lang={lang} /></AtomShell>;
  if (theme === 'editorial') return <EditorialCitizenship lang={lang} />;
  const t = getDict(lang).citizenshipV2;
  const badges = [t.b1, t.b2, t.b3, t.b4];

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-28 pb-20">
        <OrbBackdrop intensity={0.6} />
        <div
          className="absolute inset-0 -z-0"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(201,168,76,0.08), transparent 60%), linear-gradient(180deg, rgb(var(--c-bg-sunken)) 0%, rgb(var(--c-bg)) 100%)',
          }}
        />
        <div className="container-x relative z-10">
          <div className="max-w-[860px]">
            <FadeIn delay={0.1}>
              <span className="kicker">{t.heroKicker}</span>
            </FadeIn>
            <BlurText
              as="h1"
              text={t.heroTitle}
              className="font-serif text-[clamp(40px,6.5vw,84px)] leading-[1.02] tracking-[-0.03em] my-6"
              delay={0.1}
            />
            <FadeIn delay={0.9}>
              <p className="text-[17px] md:text-[20px] text-fg/85 max-w-[640px] leading-relaxed mb-10">
                {t.heroSub}
              </p>
            </FadeIn>
            <div className="flex flex-wrap gap-2.5">
              {badges.map((b, i) => (
                <FadeIn key={i} delay={1.1 + i * 0.1}>
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-bg-raised/50 text-[12px] font-mono tracking-[0.12em] uppercase"
                    style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >
                    <span className="text-gold">✓</span>
                    {b}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-20">
        <OrbBackdrop hue={20} intensity={0.3} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div
              className="backdrop-blur-2xl bg-bg-raised/50 rounded-[28px] md:rounded-[36px] p-8 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
              style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STAT_METRICS.map((m, i) => (
                  <div key={i} className="text-center">
                    <div className="font-serif text-[44px] md:text-[60px] leading-none tracking-[-0.03em] text-fg">
                      {m.raw ? (
                        m.value
                      ) : (
                        <>
                          <Counter to={m.value} />
                          {m.suffix && <span className="text-gold">{m.suffix}</span>}
                        </>
                      )}
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-fg-muted mt-3">
                      {t.stats[i]?.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={-15} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">{t.processKicker}</span>
              <h2 className="section-title">{t.processTitle}</h2>
            </div>
          </ScrollReveal>
          <div className="space-y-6">
            {t.steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div
                  className="grid grid-cols-[auto_1fr] md:grid-cols-[200px_1fr] gap-6 md:gap-12 items-start backdrop-blur-xl bg-bg-raised/40 p-6 md:p-10 rounded-[24px]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="flex items-center gap-4 md:block">
                    <div className="font-serif text-[56px] md:text-[96px] text-gold leading-none tracking-[-0.04em]">
                      {STEP_DECOR[i]?.n}
                    </div>
                    <div className="text-4xl md:text-5xl md:mt-4">{STEP_DECOR[i]?.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-serif text-[24px] md:text-[32px] leading-tight tracking-[-0.01em] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-fg-muted text-[15px] md:text-[16px] leading-relaxed max-w-[560px]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={30} intensity={0.4} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">{t.diffKicker}</span>
              <h2 className="section-title">{t.whyTitle}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {t.whyItems.map((w, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  className="group backdrop-blur-xl bg-bg-raised/40 p-7 md:p-9 rounded-[22px] h-full hover:bg-bg-raised/60 transition-all hover:-translate-y-1"
                  style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="w-12 h-12 rounded-2xl backdrop-blur-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold mb-5 group-hover:scale-110 transition-transform">
                    {WHY_ICONS[i]}
                  </div>
                  <h3 className="font-serif text-[22px] mb-3 tracking-[-0.01em]">{w.title}</h3>
                  <p className="text-fg-muted text-[14px] leading-relaxed">{w.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={10} intensity={0.3} />
        <div className="container-x relative z-10 max-w-[880px]">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="kicker block mb-4">{t.faqKicker}</span>
              <h2 className="section-title">{t.faqTitle}</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Accordion items={t.faqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28">
        <OrbBackdrop hue={40} intensity={0.7} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div
              className="backdrop-blur-2xl bg-surface/60 p-10 md:p-16 rounded-[32px] max-w-[960px] mx-auto text-center shadow-[0_50px_120px_rgba(0,0,0,0.5)]"
              style={{ border: '0.5px solid rgba(255,255,255,0.2)' }}
            >
              <h2 className="font-serif text-[clamp(32px,5vw,60px)] leading-[1.05] tracking-[-0.02em] mb-5">
                {t.ctaTitle}
              </h2>
              <p className="text-fg-muted mb-10 text-[16px]">{t.ctaSub}</p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[600px] mx-auto mb-6">
                <input
                  type="text"
                  placeholder={t.formName}
                  className="px-5 py-4 bg-bg-raised/60 backdrop-blur rounded-xl text-fg placeholder-fg-dim font-serif text-[15px]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                />
                <input
                  type="email"
                  placeholder={t.formEmail}
                  className="px-5 py-4 bg-bg-raised/60 backdrop-blur rounded-xl text-fg placeholder-fg-dim font-serif text-[15px]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                />
                <input
                  type="tel"
                  placeholder={t.formPhone}
                  className="px-5 py-4 bg-bg-raised/60 backdrop-blur rounded-xl text-fg placeholder-fg-dim font-serif text-[15px]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                />
                <select
                  className="px-5 py-4 bg-bg-raised/60 backdrop-blur rounded-xl text-fg font-serif text-[15px]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  defaultValue=""
                >
                  <option value="" className="bg-bg">{t.budgetPlaceholder}</option>
                  {t.budgetOptions.map((opt, i) => (
                    <option key={i} value={['400-700k', '700k-1m', '1-3m', '3m+'][i] || i} className="bg-bg">{opt}</option>
                  ))}
                </select>
              </form>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={whatsappLink(t.waMsg, lang)}
                  className="btn btn-gold btn-arrow shadow-[0_10px_30px_rgba(201,168,76,0.25)]"
                >
                  {t.ctaBtn}
                </Link>
                <Link href={`/${lang}/contact`} className="btn btn-outline">
                  {t.otherContact}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

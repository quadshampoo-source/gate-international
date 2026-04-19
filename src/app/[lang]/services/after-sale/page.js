import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';
import { ScrollReveal, FadeIn } from '@/components/motion';
import BlurText from '@/components/cinematic/blur-text';
import OrbBackdrop from '@/components/cinematic/orb-backdrop';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).afterSale;
  return { title: `${t.heroTitle} — Gate International`, description: t.heroSub };
}

const SERVICES = [
  { icon: '🏠', title: 'Property Management', body: 'Rental management, tenant finding, and maintenance handled by our local team.' },
  { icon: '🇹🇷', title: 'Citizenship Support', body: 'Full legal process with specialised attorneys — documents, translations, Ministry liaison.' },
  { icon: '🛋️', title: 'Furniture & Interior', body: 'Complete home setup from curated suppliers with quality guarantee and white-glove delivery.' },
  { icon: '💰', title: 'Payment Tracking', body: 'Installment monitoring, deadline reminders, and currency guidance for international transfers.' },
  { icon: '📸', title: 'Construction Updates', body: 'Regular photo and video updates from site until delivery — you see progress from anywhere.' },
  { icon: '🔄', title: 'Resale & Rental', body: 'When you want to sell or rent, we manage the listing, viewings and contract.' },
  { icon: '📋', title: 'Residence Permit', body: 'Application support and process guidance, renewal tracking, family member documentation.' },
  { icon: '🏦', title: 'Bank Account Setup', body: 'Introductions to private banking, account opening with Turkish-IBAN and multi-currency setup.' },
];

const TIMELINE = [
  { n: '01', title: 'Purchase', body: 'Contract signed, deposit received.' },
  { n: '02', title: 'TAPU Transfer', body: 'Title deed registered in your name.' },
  { n: '03', title: 'Furniture', body: 'Interior design & setup complete.' },
  { n: '04', title: 'Rental / Residence', body: 'Tenant sourced or move-in support.' },
  { n: '05', title: 'Citizenship', body: 'Turkish passport in hand.' },
];

export default async function AfterSalePage({ params }) {
  const { lang } = await params;
  const t = getDict(lang).afterSale;

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-20">
        <OrbBackdrop intensity={0.55} />
        <div
          className="absolute inset-0 -z-0"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(201,168,76,0.08), transparent 60%), linear-gradient(180deg, rgb(var(--c-bg-sunken)) 0%, rgb(var(--c-bg)) 100%)',
          }}
        />
        <div className="container-x relative z-10">
          <div className="max-w-[900px]">
            <FadeIn delay={0.1}>
              <span className="kicker">AFTER-SALE · CONCIERGE</span>
            </FadeIn>
            <BlurText
              as="h1"
              text={t.heroTitle}
              className="font-serif italic text-[clamp(44px,7vw,96px)] leading-[1.02] tracking-[-0.03em] my-6"
              delay={0.1}
            />
            <FadeIn delay={1.0}>
              <p className="text-[17px] md:text-[20px] text-fg/85 max-w-[620px] leading-relaxed">
                {t.heroSub}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SERVICES — horizontal scroll on mobile, grid on desktop */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={20} intensity={0.35} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">№ 01 — SERVICES</span>
              <h2 className="section-title">{t.servicesTitle}</h2>
            </div>
          </ScrollReveal>

          {/* Mobile: horizontal snap scroll */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-4">
            {SERVICES.map((s, i) => (
              <ServiceCard key={i} s={s} mobile />
            ))}
          </div>

          {/* Desktop: 4-col grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <ServiceCard s={s} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={-10} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">№ 02 — JOURNEY</span>
              <h2 className="section-title">{t.timelineTitle}</h2>
            </div>
          </ScrollReveal>
          <div className="relative max-w-[860px]">
            <div className="absolute left-[32px] md:left-[38px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent" />
            {TIMELINE.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className="relative pl-20 md:pl-24 pb-12 last:pb-0">
                  <div
                    className="absolute left-0 top-0 w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full backdrop-blur-xl bg-gold/15 flex items-center justify-center font-serif text-[20px] md:text-[24px] text-gold"
                    style={{ border: '1px solid rgba(201,168,76,0.4)' }}
                  >
                    {step.n}
                  </div>
                  <h3 className="font-serif text-[24px] md:text-[28px] leading-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-fg-muted text-[15px] leading-relaxed max-w-[500px]">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <OrbBackdrop hue={35} intensity={0.6} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div
              className="backdrop-blur-2xl bg-surface/60 p-10 md:p-14 rounded-[32px] max-w-[880px] mx-auto text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
              style={{ border: '0.5px solid rgba(255,255,255,0.2)' }}
            >
              <h2 className="font-serif text-[clamp(28px,4.5vw,48px)] leading-[1.1] tracking-[-0.02em] mb-4">
                {t.ctaTitle}
              </h2>
              <p className="text-fg-muted mb-10 text-[16px] max-w-[480px] mx-auto">{t.ctaSub}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={whatsappLink('Hello, I need after-sale support.', lang)}
                  className="btn btn-gold btn-arrow shadow-[0_10px_30px_rgba(201,168,76,0.25)]"
                >
                  {t.ctaBtn}
                </Link>
                <Link href={`/${lang}/contact`} className="btn btn-outline">
                  Contact form
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ s, mobile }) {
  return (
    <div
      className={`${mobile ? 'snap-start flex-shrink-0 w-[78vw]' : ''} group h-full backdrop-blur-xl bg-bg-raised/40 p-6 md:p-7 rounded-[22px] hover:bg-bg-raised/60 hover:-translate-y-1 hover:scale-[1.02] transition-all`}
      style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
    >
      <div className="w-14 h-14 rounded-2xl backdrop-blur-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
        {s.icon}
      </div>
      <h3 className="font-serif text-[20px] leading-tight mb-2.5">{s.title}</h3>
      <p className="text-fg-muted text-[13px] leading-relaxed">{s.body}</p>
    </div>
  );
}

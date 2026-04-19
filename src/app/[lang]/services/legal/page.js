import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';
import { ScrollReveal, FadeIn } from '@/components/motion';
import BlurText from '@/components/cinematic/blur-text';
import Accordion from '@/components/cinematic/accordion';
import OrbBackdrop from '@/components/cinematic/orb-backdrop';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).legal;
  return { title: `${t.heroTitle} — Gate International`, description: t.heroSub };
}

const SERVICES = [
  { icon: '⚖️', title: 'Turkish Citizenship', body: 'Full legal process management, Ministry liaison, document preparation.' },
  { icon: '📜', title: 'Title Deed (TAPU)', body: 'Transfer, registration, and verification with the Land Registry.' },
  { icon: '📝', title: 'Sales Contracts', body: 'Review, preparation, bilingual drafting and negotiation.' },
  { icon: '🏢', title: 'Company Formation', body: 'Business setup in Turkey — LLC, JSC, branch offices.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Inheritance', body: 'Estate planning, succession rights, cross-border coordination.' },
  { icon: '🤝', title: 'Dispute Resolution', body: 'Mediation, arbitration and court representation when needed.' },
  { icon: '📋', title: 'Power of Attorney', body: 'Notary procedures and representation — purchase remotely.' },
  { icon: '🏗️', title: 'Construction Law', body: 'Project compliance, permits, developer agreements.' },
  { icon: '💼', title: 'Partnership Agreements', body: 'Shareholder contracts, joint ventures, structuring.' },
];

const TEAM = [
  { name: 'Cemre Özkan', role: 'Managing Partner', years: '22y', langs: 'TR · EN', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
  { name: 'Leyla Aksoy', role: 'Real Estate Law', years: '14y', langs: 'TR · EN · AR', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80' },
  { name: 'Mehmet Demir', role: 'Citizenship Desk', years: '11y', langs: 'TR · EN', photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80' },
];

const FAQ = [
  { q: 'Is legal support free?', a: 'Yes — full legal support is included with any property purchase through Gate International. Separate engagements (inheritance, disputes) are quoted individually.' },
  { q: 'Can you represent me remotely?', a: 'Yes. With a notarised power of attorney issued at a Turkish consulate abroad, we can complete the entire transaction without you travelling.' },
  { q: 'What languages do your lawyers speak?', a: 'Turkish and English are standard across the team. Several partners are fluent in Arabic; Mandarin support is available through our Shanghai office coordination.' },
  { q: 'Are you independent of the developer?', a: 'Yes — our legal team represents the buyer exclusively. We review developer contracts on your behalf.' },
];

export default async function LegalPage({ params }) {
  const { lang } = await params;
  const t = getDict(lang).legal;

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-20">
        <OrbBackdrop intensity={0.55} hue={-10} />
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
              <span className="kicker">LEGAL COUNSEL</span>
            </FadeIn>
            <BlurText
              as="h1"
              text={t.heroTitle}
              className="font-serif italic text-[clamp(42px,6.5vw,88px)] leading-[1.02] tracking-[-0.03em] my-6"
              delay={0.1}
            />
            <FadeIn delay={1.0}>
              <p className="text-[17px] md:text-[20px] text-fg/85 max-w-[640px] leading-relaxed">
                {t.heroSub}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 9-CARD GRID */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={15} intensity={0.35} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">№ 01 — PILLARS</span>
              <h2 className="section-title">{t.gridTitle}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={i} delay={(i % 3) * 0.06 + Math.floor(i / 3) * 0.08}>
                <div
                  className="group h-full backdrop-blur-xl bg-bg-raised/40 p-7 md:p-8 rounded-[22px] hover:bg-bg-raised/60 hover:-translate-y-1 transition-all hover:shadow-[0_20px_60px_rgba(201,168,76,0.12)]"
                  style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="w-16 h-16 rounded-full backdrop-blur-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="font-serif italic text-[22px] leading-tight mb-3">{s.title}</h3>
                  <p className="text-fg-muted text-[13px] leading-relaxed">{s.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={30} intensity={0.3} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-4">№ 02 — COUNSEL</span>
              <h2 className="section-title">{t.teamTitle}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 0.1}>
                <div
                  className="group backdrop-blur-xl bg-bg-raised/40 rounded-[22px] overflow-hidden"
                  style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[30%] saturate-[0.85] group-hover:grayscale-0 group-hover:saturate-100 transition-all duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="font-serif text-[22px] mb-1">{m.name}</div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-gold mb-2">{m.role}</div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted">
                      <span>{m.years}</span>
                      <span>{m.langs}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20">
        <OrbBackdrop intensity={0.3} />
        <div className="container-x relative z-10 max-w-[880px]">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="kicker block mb-4">№ 03 — FAQ</span>
              <h2 className="section-title">{t.faqTitle}</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Accordion items={FAQ} />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <OrbBackdrop hue={45} intensity={0.6} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div
              className="backdrop-blur-2xl bg-surface/60 p-10 md:p-14 rounded-[32px] max-w-[880px] mx-auto text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
              style={{ border: '0.5px solid rgba(255,255,255,0.2)' }}
            >
              <h2 className="font-serif text-[clamp(28px,4.5vw,48px)] leading-[1.1] tracking-[-0.02em] mb-4">
                {t.ctaTitle}
              </h2>
              <p className="text-fg-muted mb-10 text-[16px] max-w-[520px] mx-auto">{t.ctaSub}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={whatsappLink('Hello, I would like a legal consultation.', lang)}
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

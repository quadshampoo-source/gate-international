import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { districtLabel } from '@/lib/districts';
import { getProjects } from '@/lib/data';
import { FadeIn, ScrollReveal, Counter } from '@/components/motion';
import GlassHero from '@/components/cinematic/hero';
import GlassCard from '@/components/cinematic/glass-card';

export default async function HomeCinematic({ lang }) {
  const t = getDict(lang);
  const all = await getProjects();
  const featured = all.slice(0, 6);

  const districts = ['Sariyer', 'Beşiktaş', 'Beyoğlu', 'Şişli', 'Bodrum', 'Bursa'];
  const counts = districts.map((d) => ({
    name: d,
    label: districtLabel(d, lang),
    count: all.filter((p) => p.district === d).length,
    href:
      d === 'Bodrum' ? `/${lang}/districts/bodrum` :
      d === 'Bursa' ? `/${lang}/districts/bursa` :
      `/${lang}/projects?district=${encodeURIComponent(d)}`,
  }));

  return (
    <div className="fade-in relative overflow-hidden">
      <GlassHero lang={lang} t={t} />

      {/* Mobile-only finder CTA strip */}
      <section className="md:hidden py-6 border-y border-gold/15 bg-bg-raised/40 backdrop-blur-sm">
        <div className="container-x">
          <Link
            href={`/${lang}/finder`}
            className="flex items-center justify-between gap-4 text-[13px]"
          >
            <span className="font-mono tracking-[0.14em] uppercase text-gold">
              {t.home.finderCta}
            </span>
            <span className="font-serif text-gold">→</span>
          </Link>
        </div>
      </section>

      {/* Featured — glass card grid */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop />
        <div className="container-x relative z-[1]">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-15 gap-10">
              <div>
                <span className="kicker block mb-4">№ 01 — CURATED</span>
                <h2 className="section-title">{t.home.featured}</h2>
                <p className="text-fg-muted max-w-[400px] text-sm mt-3">{t.home.featuredSub}</p>
              </div>
              <Link href={`/${lang}/projects`} className="btn btn-ghost btn-arrow">{t.home.viewAll}</Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.08}>
                <GlassCard project={p} lang={lang} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — glass panel */}
      <section className="relative py-20 md:py-25">
        <OrbBackdrop hue={40} opacity={0.35} bottom />
        <div className="container-x relative z-[1]">
          <ScrollReveal>
            <div className="backdrop-blur-2xl bg-bg-raised/50 border border-gold/20 rounded-[28px] p-8 md:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-10 md:gap-16 items-start">
                <div>
                  <span className="kicker">№ 02 — RECORD</span>
                  <h2 className="section-title mt-4">{t.home.trustTitle}</h2>
                  <p className="text-fg-muted mt-5 text-base max-w-[400px]">{t.home.trustSub}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <StatGlass value={16} suffix="yr" label={t.home.stat1} />
                  <StatGlass value={412} label={t.home.stat2} />
                  <StatGlass value={1.8} prefix="$" suffix="B" decimals={1} label={t.home.stat3} />
                  <StatGlass value={27} label={t.home.stat4} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Districts — liquid pills */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={-20} />
        <div className="container-x relative z-[1]">
          <ScrollReveal>
            <div className="mb-12">
              <span className="kicker block mb-3">№ 03 — GEOGRAPHY</span>
              <h2 className="section-title">{t.home.districts}</h2>
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap gap-3">
            {counts.map((d, i) => (
              <ScrollReveal key={d.name} delay={i * 0.04}>
                <Link
                  href={d.href}
                  className="group inline-flex items-baseline gap-3 px-6 py-4 rounded-full backdrop-blur-xl bg-bg-raised/60 border border-gold/15 hover:border-gold/50 hover:bg-bg-raised/90 transition-all"
                >
                  <span className="font-mono text-[10px] text-gold/70 tracking-wider">
                    № {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-[22px] group-hover:text-gold transition-colors">{d.label}</span>
                  <span className="font-mono text-[11px] text-fg-muted">{d.count}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge CTA — glass */}
      <section className="relative py-20 md:py-25">
        <OrbBackdrop hue={30} opacity={0.4} />
        <div className="container-x relative z-[1]">
          <ScrollReveal>
            <div className="backdrop-blur-2xl bg-surface/60 border border-gold/25 rounded-[32px] p-10 md:p-16 max-w-[900px] mx-auto text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <span className="kicker">№ 04 — CONCIERGE</span>
              <h2 className="section-title mt-5 mb-6">{t.home.conciergeTitle}</h2>
              <p className="text-[17px] text-fg-muted mb-10 max-w-[580px] mx-auto">{t.home.conciergeSub}</p>
              <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">{t.home.conciergeCta}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function StatGlass({ value, prefix = '', suffix, decimals = 0, label }) {
  return (
    <div className="rounded-2xl backdrop-blur-lg bg-gold/5 border border-gold/15 p-5 flex flex-col gap-2">
      <div className="font-serif text-[36px] leading-none tracking-[-0.02em] text-fg">
        <Counter to={value} prefix={prefix} decimals={decimals} />
        {suffix && <span className="font-mono text-[14px] text-gold ml-1">{suffix}</span>}
      </div>
      <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-fg-muted">{label}</div>
    </div>
  );
}

// Animated gradient orb used as section backdrop.
function OrbBackdrop({ hue = 0, opacity = 0.5, bottom = false }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-[110%] h-[80%] rounded-full blur-[120px] animate-orbFloat"
        style={{
          background: `radial-gradient(closest-side, rgb(201 168 76 / ${opacity * 0.8}), transparent 70%)`,
          top: bottom ? 'auto' : '10%',
          bottom: bottom ? '-10%' : 'auto',
          left: hue >= 0 ? '-30%' : 'auto',
          right: hue < 0 ? '-30%' : 'auto',
          filter: `hue-rotate(${hue}deg)`,
        }}
      />
      <div
        className="absolute w-[80%] h-[60%] rounded-full blur-[100px] animate-orbFloat2"
        style={{
          background: `radial-gradient(closest-side, rgb(201 168 76 / ${opacity * 0.4}), transparent 70%)`,
          bottom: '-20%',
          right: hue >= 0 ? '-20%' : 'auto',
          left: hue < 0 ? '-20%' : 'auto',
          filter: `hue-rotate(${hue + 20}deg)`,
        }}
      />
    </div>
  );
}

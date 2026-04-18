import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { DISTRICT_NAMES_AR, DISTRICT_NAMES_ZH } from '@/lib/projects';
import { getProjects } from '@/lib/data';
import ProjectCard from '@/components/project-card';
import { ShieldIcon, AwardIcon, GlobeIcon, KeyIcon } from '@/components/icons';
import { FadeIn, ScrollReveal, Counter, Stagger, Parallax } from '@/components/motion';

export const revalidate = 60;

export default async function HomePage({ params }) {
  const { lang } = await params;
  const t = getDict(lang);
  const allProjects = await getProjects();
  const featured = allProjects.slice(0, 6);
  const districtCounts = allProjects.reduce((acc, p) => {
    acc[p.district] = (acc[p.district] || 0) + 1;
    return acc;
  }, {});
  const districts = ['Sariyer', 'Beşiktaş', 'Beyoğlu', 'Şişli', 'Üsküdar', 'Bodrum'].map((d) => ({
    name: d,
    nameAr: DISTRICT_NAMES_AR[d],
    nameZh: DISTRICT_NAMES_ZH[d],
    count: districtCounts[d] || 0,
    href: d === 'Bodrum' ? `/${lang}/districts/bodrum` : `/${lang}/projects?district=${encodeURIComponent(d)}`,
  }));

  const heroImg = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=2400&q=85';

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative min-h-screen flex items-end overflow-hidden p-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Parallax speed={0.5} className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center ken-burns"
              style={{ backgroundImage: `url(${heroImg})`, transform: 'scale(1.1)' }}
            />
          </Parallax>
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/10 to-black/95" />
        </div>
        <div className="hero-frame">
          <span /><span /><span /><span />
        </div>
        <div className="relative z-[3] pb-24 w-full max-w-container mx-auto">
          <div className="px-8 max-w-[900px]">
            <FadeIn delay={0.2}><span className="kicker">{t.home.kicker}</span></FadeIn>
            <FadeIn delay={0.35}><h1 className="display mt-5 mb-8">{t.home.heroTitle}</h1></FadeIn>
            <FadeIn delay={0.55}>
              <p className="text-[17px] text-fg-muted max-w-[540px] mb-12 leading-snug">{t.home.heroSub}</p>
            </FadeIn>
            <FadeIn delay={0.75}>
              <div className="flex gap-4 flex-wrap">
                <Link href={`/${lang}/projects`} className="btn btn-gold btn-arrow">{t.home.exploreCta}</Link>
                <Link href={`/${lang}/finder`} className="btn btn-outline">{t.home.finderCta}</Link>
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 rtl:right-auto rtl:left-10 z-[3] font-mono text-[10px] tracking-[0.2em] text-fg-dim flex flex-col items-end rtl:items-start gap-2 hidden md:flex">
          <div>41.10°N · 29.05°E</div>
          <div>ISTANBUL · TURKEY</div>
          <div>FILE № 2026-Q2-IST</div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3] font-mono text-[10px] tracking-[0.2em] text-fg-dim flex flex-col items-center gap-3 hidden md:flex">
          <span>SCROLL</span>
          <span className="w-px h-10 bg-gradient-to-b from-gold/35 to-transparent" />
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-20 md:py-30">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-15 gap-10">
              <div>
                <span className="kicker block mb-4">№ 01 — COLLECTION</span>
                <h2 className="section-title">{t.home.featured}</h2>
                <p className="text-fg-muted max-w-[400px] text-sm mt-3">{t.home.featuredSub}</p>
              </div>
              <Link href={`/${lang}/projects`} className="btn btn-ghost btn-arrow">{t.home.viewAll}</Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-5 md:gap-8">
            {featured.map((p, i) => {
              const wide = i === 0 || i === 3;
              return (
                <ScrollReveal
                  key={p.id}
                  delay={i * 0.08}
                  className={wide ? 'col-span-2 md:col-span-6' : 'col-span-2 md:col-span-4'}
                >
                  <ProjectCard project={p} index={i} lang={lang} wide={wide} showFromPrefix />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-10 md:gap-20 items-start">
            <ScrollReveal>
              <span className="kicker">№ 02 — THE HOUSE</span>
              <h2 className="section-title mt-4">{t.home.trustTitle}</h2>
              <p className="text-fg-muted mt-5 text-base max-w-[400px]">{t.home.trustSub}</p>
            </ScrollReveal>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border-y border-line">
                <Stat value={16} suffix="yr" label={t.home.stat1} />
                <Stat value={412} label={t.home.stat2} />
                <Stat value={1.8} prefix="$" suffix="B" decimals={1} label={t.home.stat3} />
                <Stat value={27} label={t.home.stat4} />
              </div>
              <div className="flex justify-between gap-10 flex-wrap py-10 border-t border-line opacity-85">
                <Badge icon={<ShieldIcon />} label="TAPU CERTIFIED №0418" />
                <Badge icon={<AwardIcon />} label="GYODER MEMBER" />
                <Badge icon={<GlobeIcon />} label="RE/MAX GLOBAL" />
                <Badge icon={<KeyIcon />} label="CITIZENSHIP CERT." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-20 md:py-30">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-15 gap-10">
              <div>
                <span className="kicker block mb-4">№ 03 — GEOGRAPHY</span>
                <h2 className="section-title">{t.home.districts}</h2>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-line border-y border-line">
            {districts.map((d, i) => {
              const name = lang === 'ar' ? d.nameAr : lang === 'zh' ? d.nameZh : d.name;
              return (
                <Link
                  key={d.name}
                  href={d.href}
                  className="bg-bg p-5 md:p-7 cursor-pointer transition-colors hover:bg-bg-raised group"
                >
                  <div className="font-mono text-[10px] text-fg-dim tracking-[0.12em] mb-8">
                    № {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-serif text-[22px] leading-tight transition-colors group-hover:text-gold">
                    {name}
                  </div>
                  <div className="font-mono text-[11px] text-fg-muted mt-1.5">
                    {d.count} residences
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Concierge */}
      <section className="concierge bg-surface py-20 md:py-25 border-t border-line"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(201,168,76,0.04), transparent 50%)',
        }}>
        <div className="container-x relative z-[1] max-w-[760px]">
          <ScrollReveal>
            <span className="kicker">№ 04 — CONCIERGE</span>
            <h2 className="section-title mt-5 mb-6">{t.home.conciergeTitle}</h2>
            <p className="text-[17px] text-fg-muted mb-10 max-w-[580px]">{t.home.conciergeSub}</p>
            <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">{t.home.conciergeCta}</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, prefix = '', suffix, decimals = 0, label }) {
  return (
    <div className="bg-bg-sunken p-6 md:p-8 flex flex-col gap-2">
      <div className="font-serif text-[56px] font-normal leading-none text-fg tracking-[-0.03em]">
        <Counter to={value} prefix={prefix} decimals={decimals} />
        {suffix && (
          <span className="font-mono text-[18px] text-gold ml-1 align-baseline tracking-normal">{suffix}</span>
        )}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mt-2">{label}</div>
    </div>
  );
}

function Badge({ icon, label }) {
  return (
    <div className="flex items-center gap-3.5 text-fg-muted font-mono text-[11px] tracking-[0.12em]">
      <div className="w-9 h-9 border border-gold/35 flex items-center justify-center text-gold">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { getProjects } from '@/lib/data';
import { BURSA_SUB_DISTRICTS } from '@/lib/projects';
import ProjectCard from '@/components/project-card';
import { ScrollReveal, FadeIn, Counter } from '@/components/motion';
import BlurText from '@/components/cinematic/blur-text';
import OrbBackdrop from '@/components/cinematic/orb-backdrop';
import EditorialDistrict from '@/components/editorial/district';
import AtomDistrict from '@/components/atom/district';
import { getActiveTheme } from '@/lib/theme';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Bursa — Ottoman capital, modern investment · Gate International',
    description:
      'Premium real estate in Bursa: Osmangazi, Nilüfer and Mudanya seaside. Half the Istanbul price, Uludağ skiing and Marmara ferry in reach.',
  };
}

const ADVANTAGES = [
  { icon: '💰', title: 'Half the Istanbul price', body: 'Citizenship-eligible residences start around $400K — a third of comparable stock in Istanbul prime.' },
  { icon: '⛷️', title: 'Uludağ in 30 minutes', body: 'Turkey\'s most famous ski resort, plus 4-season natural parks and mountain retreats.' },
  { icon: '⛴️', title: '2 hours to Istanbul', body: 'Mudanya ferry connects you to the Istanbul European side in under two hours, door to door.' },
  { icon: '♨️', title: 'Thermal heritage', body: 'Çekirge and Kükürtlü thermal springs — centuries of Ottoman bathing tradition.' },
  { icon: '🇸🇦', title: 'GCC favourite', body: 'The #1 choice for Saudi and Kuwaiti investors — summer climate, family culture, halal-friendly.' },
  { icon: '🏭', title: 'Industrial backbone', body: 'Home to Turkey\'s automotive sector — stable rental demand from expat engineers and families.' },
];

export default async function BursaGuidePage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  const t = getDict(lang);
  const all = await getProjects();
  const bursa = all.filter((p) => p.district === 'Bursa');

  if (theme === 'atom') return <AtomDistrict lang={lang} district="Bursa" projects={all} />;

  if (theme === 'editorial') {
    return (
      <EditorialDistrict
        lang={lang}
        districtCode="Bursa"
        heroImage="https://images.unsplash.com/photo-1542317854-b935c7dc9bb6?w=2400&q=85"
        heroKicker="BURSA · OTTOMAN CAPITAL"
        heroTitle="Ottoman heritage, modern investment."
        heroSub="Citizenship-eligible residences from $400K. Mudanya ferry to Istanbul, Uludağ in half an hour, Çekirge thermal springs — a third of prime Istanbul pricing."
        advantages={ADVANTAGES.map((a) => ({ t: a.title, d: a.body }))}
        subRegions={BURSA_SUB_DISTRICTS}
        projects={bursa}
      />
    );
  }
  const avgPrice = (() => {
    const prices = bursa.filter((p) => typeof p.priceUsd === 'number').map((p) => p.priceUsd);
    if (!prices.length) return null;
    return Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
  })();

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden p-0 border-b border-line">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center ken-burns"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542317854-b935c7dc9bb6?w=2400&q=85')",
            }}
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/20 to-black/95" />
        </div>
        <OrbBackdrop intensity={0.4} />
        <div className="relative z-[3] pb-20 pt-40 w-full max-w-container mx-auto">
          <div className="px-8 max-w-[980px]">
            <FadeIn delay={0.15}>
              <span className="kicker">BURSA · OTTOMAN CAPITAL</span>
            </FadeIn>
            <BlurText
              as="h1"
              text="Premium living, half the Istanbul price."
              className="font-serif text-[clamp(40px,7vw,92px)] leading-[1.02] tracking-[-0.03em] my-6"
              delay={0.2}
            />
            <FadeIn delay={1.1}>
              <p className="text-[17px] text-fg-muted max-w-[640px] mb-10 leading-snug">
                Turkey&rsquo;s first capital — Ottoman heritage, Uludağ ski resort on the doorstep, the Mudanya
                ferry to Istanbul, and the #1 choice for Gulf investors seeking citizenship-eligible property.
              </p>
            </FadeIn>
            <FadeIn delay={1.3}>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${lang}/projects?district=Bursa`} className="btn btn-gold btn-arrow">
                  View {bursa.length} residences
                </Link>
                <Link href={`/${lang}/contact`} className="btn btn-outline">
                  Arrange inspection trip
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative bg-bg-sunken border-b border-line py-15 md:py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border-y border-line">
            <Stat num={bursa.length} label="Bursa residences" />
            <Stat num={avgPrice ? `$${Math.round(avgPrice / 1000)}K` : '—'} label="Avg. starting" raw />
            <Stat num={30} suffix="m" label="Uludağ distance" />
            <Stat num={BURSA_SUB_DISTRICTS.length} label="Sub-regions" />
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="relative py-20 md:py-30">
        <OrbBackdrop hue={20} intensity={0.35} />
        <div className="container-x relative z-10">
          <ScrollReveal>
            <div className="mb-15">
              <span className="kicker block mb-3">№ 01 — WHY BURSA</span>
              <h2 className="section-title">Six reasons investors choose Bursa</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((a, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div
                  className="h-full backdrop-blur-xl bg-bg-raised/40 p-7 rounded-[22px] hover:bg-bg-raised/60 hover:-translate-y-1 transition-all"
                  style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="text-4xl mb-4">{a.icon}</div>
                  <div className="font-serif text-[22px] mb-2 leading-tight">{a.title}</div>
                  <p className="text-fg-muted text-[13px] leading-relaxed">{a.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-regions */}
      <section className="relative py-20 md:py-30 bg-bg-sunken border-y border-line">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10">
              <span className="kicker block mb-3">№ 02 — SUB-REGIONS</span>
              <h2 className="section-title">Where in Bursa</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-line border border-line">
            {BURSA_SUB_DISTRICTS.map((sub, i) => {
              const count = bursa.filter((p) => p.subDistrict === sub).length;
              return (
                <Link
                  key={sub}
                  href={`/${lang}/projects?district=Bursa&q=${encodeURIComponent(sub)}`}
                  className="bg-bg p-5 md:p-6 hover:bg-bg-raised transition-colors group"
                >
                  <div className="font-mono text-[10px] text-fg-dim tracking-[0.12em] mb-3">
                    № {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-serif text-[20px] leading-tight group-hover:text-gold transition-colors">
                    {sub}
                  </div>
                  <div className="font-mono text-[10px] text-fg-muted mt-1">
                    {count} {count === 1 ? 'residence' : 'residences'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-20 md:py-30">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <span className="kicker block mb-3">№ 03 — PORTFOLIO</span>
                <h2 className="section-title">Featured residences</h2>
              </div>
              <Link href={`/${lang}/projects?district=Bursa`} className="btn btn-ghost btn-arrow">
                View all {bursa.length} Bursa residences
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bursa.slice(0, 6).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.06}>
                <ProjectCard project={p} index={i} lang={lang} showFromPrefix />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="concierge bg-surface py-20 border-t border-line"
        style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 50%)' }}>
        <div className="container-x relative z-[1] max-w-[760px]">
          <ScrollReveal>
            <span className="kicker">№ 04 — NEXT STEP</span>
            <h2 className="section-title mt-5 mb-6">A private tour of Bursa.</h2>
            <p className="text-[17px] text-fg-muted mb-10 max-w-[580px]">
              One-day inspection trip from Istanbul — Mudanya ferry, 4 residences, lunch overlooking the Marmara,
              back in Istanbul by evening. Or stay two days and include Uludağ.
            </p>
            <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">Arrange a visit</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ num, label, raw, suffix }) {
  return (
    <div className="bg-bg-sunken p-6 md:p-8 flex flex-col gap-2">
      <div className="font-serif text-[44px] md:text-[56px] font-normal leading-none text-fg tracking-[-0.03em]">
        {raw ? num : <Counter to={num} />}
        {suffix && <span className="font-mono text-[18px] text-gold ml-1">{suffix}</span>}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mt-2">{label}</div>
    </div>
  );
}

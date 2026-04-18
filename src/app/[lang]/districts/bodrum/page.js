import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { getProjects } from '@/lib/data';
import { BODRUM_SUB_DISTRICTS } from '@/lib/projects';
import ProjectCard from '@/components/project-card';
import { ScrollReveal, FadeIn, Counter } from '@/components/motion';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Bodrum — Ultra-luxury villas on the Aegean · Gate International',
    description:
      'Ritz-Carlton, Mandarin Oriental, Aman and Kempinski branded residences on the Bodrum peninsula. Private beaches, invitation-only villas, citizenship-eligible investment.',
  };
}

export default async function BodrumGuidePage({ params }) {
  const { lang } = await params;
  const t = getDict(lang);
  const all = await getProjects();
  const bodrum = all.filter((p) => p.district === 'Bodrum');

  const countByBrand = {
    branded: bodrum.filter((p) => p.category === 'branded-residence').length,
    ultra: bodrum.filter((p) => p.category === 'ultra-luxury').length,
    resort: bodrum.filter((p) => p.category === 'resort').length,
  };
  const avgPrice = (() => {
    const prices = bodrum.filter((p) => typeof p.priceUsd === 'number').map((p) => p.priceUsd);
    if (!prices.length) return null;
    return Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
  })();

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden p-0 border-b border-line">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center ken-burns"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=2400&q=85')" }}
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/20 to-black/95" />
        </div>
        <div className="relative z-[3] pb-20 pt-40 w-full max-w-container mx-auto">
          <div className="px-8 max-w-[900px]">
            <FadeIn delay={0.2}><span className="kicker">BODRUM · TURKISH RIVIERA</span></FadeIn>
            <FadeIn delay={0.35}>
              <h1 className="display mt-5 mb-6">Aegean villas, branded to the world&rsquo;s finest names.</h1>
            </FadeIn>
            <FadeIn delay={0.55}>
              <p className="text-[17px] text-fg-muted max-w-[620px] mb-10 leading-snug">
                Ritz-Carlton, Mandarin Oriental, Aman and Kempinski have chosen the Bodrum peninsula for their most
                exclusive Turkish residences. Private beaches, marina access, citizenship eligibility from $400K.
              </p>
            </FadeIn>
            <FadeIn delay={0.75}>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${lang}/projects?district=Bodrum`} className="btn btn-gold btn-arrow">View {bodrum.length} residences</Link>
                <Link href={`/${lang}/contact`} className="btn btn-outline">Arrange inspection trip</Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg-sunken border-b border-line py-15 md:py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border-y border-line">
            <Stat num={bodrum.length} label="Bodrum residences" />
            <Stat num={countByBrand.branded + countByBrand.ultra} label="Branded & ultra" />
            <Stat num={avgPrice ? `$${(avgPrice / 1_000_000).toFixed(1)}M` : '—'} label="Avg. starting" raw />
            <Stat num={BODRUM_SUB_DISTRICTS.length} label="Coastal sub-regions" />
          </div>
        </div>
      </section>

      {/* Sub-regions */}
      <section className="py-20 md:py-30">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10">
              <span className="kicker block mb-3">№ 01 — GEOGRAPHY</span>
              <h2 className="section-title">Sub-regions of the peninsula</h2>
              <p className="text-fg-muted max-w-[540px] mt-5 text-base">
                The Bodrum peninsula curves north and south from the old town, each bay with its own character —
                from Yalıkavak&rsquo;s super-yacht marina to Türkbükü&rsquo;s celebrity enclave.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-16 items-start">
            <div className="grid grid-cols-2 gap-px bg-line border border-line">
              {BODRUM_SUB_DISTRICTS.map((sub, i) => {
                const count = bodrum.filter((p) => p.subDistrict === sub).length;
                return (
                  <Link
                    key={sub}
                    href={`/${lang}/projects?district=Bodrum&q=${encodeURIComponent(sub)}`}
                    className="bg-bg p-4 md:p-5 hover:bg-bg-raised transition-colors group"
                  >
                    <div className="font-mono text-[10px] text-fg-dim tracking-[0.12em] mb-3">
                      № {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="font-serif text-[18px] leading-tight group-hover:text-gold transition-colors">
                      {sub}
                    </div>
                    <div className="font-mono text-[10px] text-fg-muted mt-1">
                      {count} {count === 1 ? 'residence' : 'residences'}
                    </div>
                  </Link>
                );
              })}
            </div>

            <PeninsulaMap />
          </div>
        </div>
      </section>

      {/* Featured Bodrum projects */}
      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <span className="kicker block mb-3">№ 02 — COLLECTION</span>
                <h2 className="section-title">Featured residences</h2>
              </div>
              <Link href={`/${lang}/projects?district=Bodrum`} className="btn btn-ghost btn-arrow">
                View all {bodrum.length} Bodrum residences
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bodrum.slice(0, 6).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.06}>
                <ProjectCard project={p} index={i} lang={lang} showFromPrefix />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="concierge bg-surface py-20 border-t border-line"
        style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 50%)' }}>
        <div className="container-x relative z-[1] max-w-[760px]">
          <ScrollReveal>
            <span className="kicker">№ 03 — NEXT STEP</span>
            <h2 className="section-title mt-5 mb-6">A private tour of the peninsula.</h2>
            <p className="text-[17px] text-fg-muted mb-10 max-w-[580px]">
              Our Bodrum directors arrange inspection visits in two days — flight, hotel, six residences, one director
              throughout. Invitation to the Aman is subject to availability.
            </p>
            <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">Arrange a visit</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ num, label, raw }) {
  return (
    <div className="bg-bg-sunken p-6 md:p-8 flex flex-col gap-2">
      <div className="font-serif text-[48px] md:text-[56px] font-normal leading-none text-fg tracking-[-0.03em]">
        {raw ? num : <Counter to={num} />}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mt-2">{label}</div>
    </div>
  );
}

function PeninsulaMap() {
  // Stylised SVG of the Bodrum peninsula with pins at each sub-region.
  const pins = [
    { n: 'Yalıkavak', x: 220, y: 160 },
    { n: 'Türkbükü', x: 330, y: 130 },
    { n: 'Gölköy', x: 380, y: 170 },
    { n: 'Torba', x: 470, y: 210 },
    { n: 'Güvercinlik', x: 540, y: 240 },
    { n: 'Bodrum', x: 460, y: 310 },
    { n: 'Turgutreis', x: 170, y: 280 },
  ];
  return (
    <div className="relative aspect-[4/3] bg-bg-sunken border border-line overflow-hidden">
      <svg viewBox="0 0 700 480" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1419" />
            <stop offset="100%" stopColor="#060d12" />
          </linearGradient>
          <pattern id="land2" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#120f07" />
            <circle cx="1" cy="1" r="0.3" fill="#2a2720" />
          </pattern>
        </defs>
        <rect width="700" height="480" fill="url(#sea)" />
        {/* Peninsula land */}
        <path
          d="M 80,250 Q 60,190 120,170 Q 180,150 240,180 Q 300,140 360,130 Q 440,115 520,160 Q 580,200 600,260 Q 610,320 560,340 Q 500,360 440,340 Q 380,360 320,380 Q 260,410 180,390 Q 100,370 80,330 Z"
          fill="url(#land2)"
          stroke="rgba(201,168,76,0.2)"
          strokeWidth="1"
        />
        {/* Grid */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="480" stroke="#1e1d17" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="700" y2={i * 50} stroke="#1e1d17" strokeWidth="0.5" />
        ))}

        {pins.map((p) => (
          <g key={p.n} transform={`translate(${p.x},${p.y})`}>
            <circle r="14" fill="#C9A84C" fillOpacity="0.12" />
            <circle r="7" fill="#C9A84C" fillOpacity="0.35" />
            <circle r="3" fill="#C9A84C" />
            <text y="-14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C9A84C" letterSpacing="1.2">
              {p.n.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Compass */}
        <g transform="translate(640, 60)">
          <circle r="18" fill="none" stroke="#C9A84C" strokeOpacity="0.4" />
          <path d="M 0,-12 L 4,8 L 0,4 L -4,8 Z" fill="#C9A84C" />
          <text y="-22" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#C9A84C">N</text>
        </g>

        <text x="20" y="460" fontFamily="JetBrains Mono" fontSize="9" fill="#6b6659" letterSpacing="1.4">
          BODRUM PENINSULA  ·  AEGEAN SEA  ·  36.99°N · 27.31°E
        </text>
      </svg>
    </div>
  );
}

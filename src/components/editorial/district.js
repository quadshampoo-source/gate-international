import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { localizedName } from '@/lib/utils';
import { districtLabel } from '@/lib/districts';
import { FadeIn, ScrollReveal, Stagger } from '@/components/motion';
import EditorialTileBg from '@/components/editorial/tile-bg';

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

function Tile({ project, lang, index }) {
  return (
    <Link
      href={`/${lang}/project/${project.id}`}
      className="group block rounded-[22px] overflow-hidden relative aspect-[4/5]"
      style={{ boxShadow: '0 20px 50px rgba(5,26,36,0.08)' }}
    >
      <EditorialTileBg project={project} alt={localizedName(project, lang)} />
      <div className="editorial-grain" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(5,26,36,0.65) 100%)' }} />
      <div
        className="absolute top-5 start-5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
      >
        № {String(index + 1).padStart(2, '0')}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="font-editorial text-[22px] leading-[1.1] line-clamp-2 break-words">{localizedName(project, lang)}</div>
      </div>
    </Link>
  );
}

export default function EditorialDistrict({
  lang,
  districtCode,
  heroImage,
  heroKicker,
  heroTitle,
  heroSub,
  advantages = [],
  subRegions = [],
  projects = [],
}) {
  const t = getDict(lang);
  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero with image */}
      <section className="relative min-h-[70svh] md:min-h-[80svh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.55) 100%)' }} />
        </div>
        <div className="relative z-[2] w-full pt-32 pb-16 md:pb-20">
          <div className="container-x">
            <FadeIn delay={0.1}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
                {heroKicker}
              </span>
            </FadeIn>
            <FadeIn delay={0.25}>
              <h1 className="font-editorial text-[56px] md:text-[100px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7 max-w-[960px]">
                {renderTitle(heroTitle)}
              </h1>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p className="text-[15px] md:text-[19px] leading-relaxed text-[#273C46] max-w-[640px] mt-7">
                {heroSub}
              </p>
            </FadeIn>
            <FadeIn delay={0.65}>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href={`/${lang}/projects?district=${encodeURIComponent(districtCode)}`}
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
                >
                  View {projects.length} residences
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full text-[#051A24] text-[13px] font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #E0EBF0' }}
                >
                  Arrange inspection
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Advantages */}
      {advantages.length > 0 && (
        <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
          <div className="container-x">
            <ScrollReveal>
              <div className="mb-10 md:mb-14 max-w-[780px]">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 01 — Why {districtLabel(districtCode, lang)}</div>
                <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                  {renderTitle(`Reasons investors choose ${districtLabel(districtCode, lang)}.`)}
                </h2>
              </div>
            </ScrollReveal>
            <Stagger stagger={0.06}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {advantages.map((a, i) => (
                  <div
                    key={i}
                    className="p-7 rounded-[22px] bg-white flex flex-col"
                    style={{ border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.04)' }}
                  >
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                      № {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="font-editorial text-[22px] text-[#051A24] leading-tight mb-2">{a.t}</div>
                    <p className="text-[14px] text-[#273C46] leading-relaxed">{a.d}</p>
                  </div>
                ))}
              </div>
            </Stagger>
          </div>
        </section>
      )}

      {/* Sub-regions */}
      {subRegions.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container-x">
            <ScrollReveal>
              <div className="mb-10 md:mb-14 max-w-[780px]">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — Geography</div>
                <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                  Where in <em className="italic">{districtLabel(districtCode, lang)}.</em>
                </h2>
              </div>
            </ScrollReveal>
            <div className="flex flex-wrap gap-3">
              {subRegions.map((sub) => (
                <Link
                  key={sub}
                  href={`/${lang}/projects?district=${encodeURIComponent(districtCode)}&q=${encodeURIComponent(sub)}`}
                  className="px-4 py-2 rounded-full text-[13px] text-[#273C46] hover:text-[#051A24] transition-colors"
                  style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                >
                  {sub}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured residences */}
      {projects.length > 0 && (
        <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
          <div className="container-x">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 03 — Residences</div>
                  <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                    Featured <em className="italic">residences</em>
                  </h2>
                </div>
                <Link
                  href={`/${lang}/projects?district=${encodeURIComponent(districtCode)}`}
                  className="inline-flex items-center gap-2 text-[13px] text-[#051A24] self-start md:self-auto"
                >
                  {t.home.viewAll}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </ScrollReveal>
            <Stagger stagger={0.08}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {projects.slice(0, 8).map((p, i) => (
                  <Tile key={p.id} project={p} lang={lang} index={i} />
                ))}
              </div>
            </Stagger>
          </div>
        </section>
      )}
    </div>
  );
}

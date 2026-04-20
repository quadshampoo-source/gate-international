import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { localizedName, whatsappLink, WHATSAPP_DEFAULT_MESSAGES, fmtUsd } from '@/lib/utils';
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

function SimilarTile({ project, lang, index }) {
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
        className="absolute bottom-5 start-5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
      >
        № {String(index + 1).padStart(2, '0')}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="font-editorial text-[22px] leading-[1.1]">{localizedName(project, lang)}</div>
      </div>
    </Link>
  );
}

function Fact({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="p-5 rounded-[18px]" style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}>
      <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#C9A84C]">{label}</div>
      <div className="font-editorial text-[22px] text-[#051A24] mt-2 leading-tight">{value}</div>
    </div>
  );
}

export default function EditorialProjectDetail({ project, lang, allProjects = [] }) {
  const t = getDict(lang);
  const d = t.detail;
  const name = localizedName(project, lang);
  const district = districtLabel(project.district, lang);
  const similar = allProjects.filter((p) => p.id !== project.id && p.district === project.district).slice(0, 4);

  const waMsg = `${WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en} — ${name}`;
  const waHref = whatsappLink(waMsg, lang);

  const priceFrom = project.price_usd ?? project.priceUsd;

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-16">
        <div className="container-x">
          <Link href={`/${lang}/projects`} className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46] hover:text-[#051A24] inline-flex items-center gap-2">
            ← {t.nav.projects}
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mt-8">
            <div>
              <FadeIn delay={0.1}>
                <span className="font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#C9A84C]">
                  {district}
                </span>
              </FadeIn>
              <FadeIn delay={0.25}>
                <h1 className="font-editorial text-[48px] md:text-[88px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-4">
                  {renderTitle(name)}
                </h1>
              </FadeIn>
              {priceFrom && (
                <FadeIn delay={0.45}>
                  <div className="mt-8 flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46]">{t.projects.from}</span>
                    <span className="font-editorial text-[40px] md:text-[56px] text-[#051A24] leading-none">{fmtUsd(priceFrom)}</span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46]">{d.perTaxIncl}</span>
                  </div>
                </FadeIn>
              )}
              <FadeIn delay={0.55}>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
                  >
                    {d.contact}
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full text-[#051A24] text-[13px] font-medium transition-colors"
                    style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                  >
                    {d.requestShortlist}
                  </Link>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.35}>
              <div
                className="group relative rounded-[28px] overflow-hidden aspect-[4/5]"
                style={{ boxShadow: '0 30px 80px rgba(5,26,36,0.12)' }}
              >
                <EditorialTileBg project={project} alt={name} />
                <div className="editorial-grain" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(5,26,36,0.55) 100%)' }} />
                <div className="absolute bottom-6 start-6 end-6 text-white">
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-80">{d.overview}</div>
                  <div className="font-editorial text-[26px] mt-1 leading-tight">{name}</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Overview copy */}
      <section className="py-16 md:py-20" style={{ background: '#F6FCFF' }}>
        <div className="container-x max-w-[900px]">
          <ScrollReveal>
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-4">
              № 01 — {d.overview}
            </div>
            <h2 className="font-editorial text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[#051A24] mb-8">
              {renderTitle(d.overviewTitle)}
            </h2>
            <p className="text-[15px] md:text-[17px] leading-[1.8] text-[#273C46] mb-6">
              {d.overviewP1.replace('{name}', name).replace('{district}', district)}
            </p>
            <p className="text-[15px] md:text-[17px] leading-[1.8] text-[#273C46]">
              {d.overviewP2}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Specs */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — {d.specs}</div>
              <h2 className="font-editorial text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                Facts & <em className="italic">figures.</em>
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.05}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Fact label={d.bedrooms} value={project.bedrooms} />
              <Fact label={d.bathrooms} value={project.bathrooms} />
              <Fact label={d.area} value={project.area ? `${project.area} m²` : null} />
              <Fact label={d.terrace} value={project.terrace ? `${project.terrace} m²` : null} />
              <Fact label={d.orientation} value={project.orientation} />
              <Fact label={d.delivery} value={project.delivery} />
              <Fact label={d.tenure} value={d.freehold} />
              <Fact label={d.parking} value={project.parking ? `${project.parking} · ${d.coveredParking}` : null} />
              <Fact label={d.view} value={project.view} />
              <Fact label={t.detailExtra.developer} value={project.developer} />
              <Fact label={t.detailExtra.totalUnits} value={project.total_units ?? project.totalUnits} />
              <Fact label={t.detailExtra.blocks} value={project.blocks} />
            </div>
          </Stagger>
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
          <div className="container-x">
            <ScrollReveal>
              <div className="mb-10 md:mb-14 max-w-[780px]">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 03 — {d.similar}</div>
                <h2 className="font-editorial text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                  {renderTitle(d.similarTitle.replace('{district}', district))}
                </h2>
              </div>
            </ScrollReveal>
            <Stagger stagger={0.08}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {similar.map((p, i) => (
                  <SimilarTile key={p.id} project={p} lang={lang} index={i} />
                ))}
              </div>
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div
              className="relative rounded-[36px] p-10 md:p-16 overflow-hidden max-w-[960px] mx-auto"
              style={{ background: '#051A24', color: '#FFFFFF' }}
            >
              <div className="editorial-grain" />
              <div className="relative grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">
                    {d.contact}
                  </div>
                  <h2 className="font-editorial text-[36px] md:text-[48px] leading-[1.08] tracking-[-0.02em]">
                    {renderTitle(`Arrange a private viewing.`)}
                  </h2>
                  <p className="text-[15px] text-white/75 mt-4 max-w-[420px]">
                    Weekday or weekend, VIP transfer from your hotel — our concierge handles everything.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Link
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-white text-[#051A24] text-[13px] font-medium hover:bg-[#F6FCFF] transition-colors"
                  >
                    WhatsApp
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center gap-3 h-12 px-6 rounded-full text-white text-[13px] font-medium transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    {t.contact.formTitle}
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

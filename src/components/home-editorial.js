import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { districtLabel } from '@/lib/districts';
import { getProjects } from '@/lib/data';
import { localizedName } from '@/lib/utils';
import { FadeIn, ScrollReveal, Stagger } from '@/components/motion';
import EditorialNavbar from '@/components/editorial/navbar';
import EditorialServicesAccordion from '@/components/editorial/services-accordion';
import EditorialTestimonials from '@/components/editorial/testimonials-carousel';
import EditorialPricingCards from '@/components/editorial/pricing-cards';
import EditorialMarquee from '@/components/editorial/marquee';
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';

// Stable pastel gradient from name/id.
function tileHue(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

function ProjectTile({ project, lang, index, size = 'small' }) {
  const hue = tileHue(project.id || project.name);
  const name = localizedName(project, lang);
  const district = districtLabel(project.district, lang);
  const wide = size === 'wide';
  return (
    <Link
      href={`/${lang}/project/${project.id}`}
      className={`group block rounded-[22px] overflow-hidden relative ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
      style={{ boxShadow: '0 20px 50px rgba(5,26,36,0.08)' }}
    >
      <div
        className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
        style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 72%), hsl(${(hue + 40) % 360} 40% 54%))` }}
      />
      <div className="editorial-grain" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(5,26,36,0.65) 100%)' }} />

      {/* Top-right tags */}
      {project.citizenship_eligible && (
        <div className="absolute top-5 end-5 flex flex-col gap-1.5 items-end">
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
          >
            Citizenship Eligible
          </span>
        </div>
      )}

      {/* Bottom-left number badge */}
      <div
        className="absolute bottom-5 start-5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)', color: '#051A24', backdropFilter: 'blur(8px)' }}
      >
        № {String(index + 1).padStart(2, '0')}
      </div>

      {/* Name block */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white">
        <div className="font-editorial text-[22px] md:text-[26px] leading-[1.1] tracking-[-0.01em]">{name}</div>
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-80 mt-2">{district}</div>
      </div>
    </Link>
  );
}

export default async function HomeEditorial({ lang }) {
  const t = getDict(lang);
  const all = await getProjects();
  const featured = all.slice(0, 6);
  const marqueeSource = all.slice(0, 18);

  const waHref = whatsappLink(WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en, lang);
  const servicesItems = t.services?.items?.slice(0, 4) || [];

  const stats = [
    { big: `${all.length || 96}+`, caption: t.home?.trustSub?.split('.')[0] || 'Premium residences across Istanbul, Bodrum & Bursa' },
    { big: '3', caption: 'Cities. Three cultures. One curated portfolio.' },
    { big: '$400K', caption: 'Minimum investment for the Turkish citizenship pathway.' },
  ];

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      <EditorialNavbar lang={lang} dict={t} contactHref={`/${lang}/contact`} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center ken-burns"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=2400&q=85')",
              transform: 'scale(1.05)',
            }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{ background: 'rgba(255,255,255,0.78)' }}
          />
        </div>

        <div className="relative z-[2] w-full px-6 md:px-10 pt-28 pb-20">
          <div className="max-w-[880px] mx-auto text-center">
            <FadeIn delay={0.15}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
                {t.home.kicker}
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="font-editorial text-[46px] md:text-[84px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-8">
                {renderHeroTitle(t.home.heroTitle)}
              </h1>
            </FadeIn>
            <FadeIn delay={0.55}>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[540px] mx-auto mt-6 md:mt-8">
                {t.home.heroSub}
              </p>
            </FadeIn>
            <FadeIn delay={0.75}>
              <div className="flex flex-wrap justify-center gap-3 mt-8 md:mt-10">
                <Link
                  href={`/${lang}/projects`}
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
                >
                  {t.home.exploreCta}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${lang}/finder`}
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full text-[#051A24] text-[13px] font-medium transition-colors"
                  style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
                >
                  {t.home.finderCta}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <EditorialMarquee>
          {marqueeSource.map((p) => {
            const hue = tileHue(p.id || p.name);
            return (
              <Link
                key={p.id}
                href={`/${lang}/project/${p.id}`}
                className="w-[260px] md:w-[300px] aspect-[4/3] rounded-[22px] overflow-hidden relative block"
                style={{ boxShadow: '0 14px 40px rgba(5,26,36,0.08)' }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 72%), hsl(${(hue + 40) % 360} 40% 54%))` }}
                />
                <div className="editorial-grain" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(5,26,36,0.6))' }} />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="font-editorial text-[18px] leading-tight line-clamp-1">{localizedName(p, lang)}</div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-80 mt-1.5">{districtLabel(p.district, lang)}</div>
                </div>
              </Link>
            );
          })}
        </EditorialMarquee>
      </section>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <Stagger stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {stats.map((s, i) => {
                const palettes = [
                  { from: '#F6FCFF', to: '#E0EBF0', text: '#051A24' },
                  { from: '#051A24', to: '#0a2a38', text: '#FFFFFF' },
                  { from: '#C9A84C1A', to: '#C9A84C33', text: '#051A24' },
                ];
                const p = palettes[i % palettes.length];
                return (
                  <div
                    key={i}
                    className="relative rounded-[28px] p-8 md:p-10 overflow-hidden"
                    style={{ background: `linear-gradient(160deg, ${p.from}, ${p.to})`, color: p.text, boxShadow: '0 20px 50px rgba(5,26,36,0.08)' }}
                  >
                    <div className="editorial-grain" />
                    <div className="relative">
                      <div className="font-editorial text-[56px] md:text-[76px] leading-none tracking-[-0.03em]">
                        {s.big}
                      </div>
                      <p className="text-[14px] leading-relaxed mt-5 opacity-85 max-w-[280px]">
                        {s.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Stagger>
        </div>
      </section>

      {/* ── Featured projects grid ─────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 01 — Portfolio</div>
                <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                  {renderHeroTitle(t.home.featured, { italic: 'Residences' })}
                </h2>
              </div>
              <Link
                href={`/${lang}/projects`}
                className="inline-flex items-center gap-2 text-[13px] text-[#051A24] self-start md:self-auto"
              >
                {t.home.viewAll}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </ScrollReveal>

          <Stagger stagger={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6">
              {featured.slice(0, 2).map((p, i) => (
                <div key={p.id} className="md:col-span-3">
                  <ProjectTile project={p} lang={lang} index={i} size="wide" />
                </div>
              ))}
              {featured.slice(2, 6).map((p, i) => (
                <div key={p.id} className="md:col-span-3">
                  <ProjectTile project={p} lang={lang} index={i + 2} />
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* ── Services accordion ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — Services</div>
              <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                Two sides of one <span className="italic">service.</span>
              </h2>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] mt-5 max-w-[560px]">
                {t.services.sub}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialServicesAccordion items={servicesItems} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-14">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 03 — Testimony</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                Words from our <span className="italic">clients.</span>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialTestimonials />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pricing / CTA ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-14 max-w-[680px] mx-auto">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 04 — Engage</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                Two ways <span className="italic">in.</span>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <EditorialPricingCards lang={lang} dict={t} waHref={waHref} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Minimal footer ─────────────────────────────────────────────── */}
      <footer className="py-16 md:py-20 text-center border-t" style={{ borderColor: '#E0EBF0', background: '#FFFFFF' }}>
        <div className="container-x">
          <div className="font-editorial text-[26px] text-[#051A24] mb-3">
            Gate <span className="italic">International</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46] mb-6">
            {t.footer.cities}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-[#273C46]">
            <Link href={`/${lang}/projects`} className="hover:text-[#051A24]">{t.nav.projects}</Link>
            <Link href={`/${lang}/services`} className="hover:text-[#051A24]">{t.nav.services}</Link>
            <Link href={`/${lang}/citizenship`} className="hover:text-[#051A24]">{t.nav.citizenship}</Link>
            <Link href={`/${lang}/about`} className="hover:text-[#051A24]">{t.nav.about}</Link>
            <Link href={`/${lang}/contact`} className="hover:text-[#051A24]">{t.nav.contact}</Link>
          </div>
          <div className="font-mono text-[10px] tracking-[0.1em] text-[#273C46]/60 mt-8">
            {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Renders the hero title with the last noun-like token italicised in serif.
// Language-aware: picks the last word and wraps it, preserving RTL pairs.
function renderHeroTitle(title, opts = {}) {
  if (!title || typeof title !== 'string') return title;
  // Heuristic: find the last word longer than 3 chars, italicise it.
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  let idx = parts.length - 1;
  // Strip trailing punctuation when choosing, but re-attach after wrapping.
  const last = parts[idx];
  const match = last.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const core = match ? match[1] : last;
  const punct = match ? match[2] : '';
  if (core.length < 3 && parts.length > 2) {
    idx = parts.length - 2;
  }
  const before = parts.slice(0, idx).join(' ');
  const target = parts[idx];
  const targetMatch = target.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const targetCore = targetMatch ? targetMatch[1] : target;
  const targetPunct = targetMatch ? targetMatch[2] : '';
  const after = parts.slice(idx + 1).join(' ');
  return (
    <>
      {before}{before ? ' ' : ''}
      <em className="italic font-[var(--font-editorial)]">{targetCore}</em>{targetPunct}
      {after ? ' ' + after : ''}
      {opts.italic ? null : null}
    </>
  );
}

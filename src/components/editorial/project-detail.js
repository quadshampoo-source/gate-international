import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { localizedName, whatsappLink, WHATSAPP_DEFAULT_MESSAGES, fmtUsd } from '@/lib/utils';
import { districtLabel } from '@/lib/districts';
import { resolveVideo } from '@/lib/video';

import HeroSlider from '@/components/editorial/detail/hero-slider';
import OverviewSticky from '@/components/editorial/detail/overview-sticky';
import SpecsHorizontal from '@/components/editorial/detail/specs-horizontal';
import ImageSection from '@/components/editorial/detail/image-section';
import VideoFacade from '@/components/editorial/detail/video-facade';
import LocationMap from '@/components/editorial/detail/location-map';
import StickyCTABar from '@/components/editorial/detail/sticky-cta-bar';

// Apple-style immersive project detail — 7-section scroll experience.
// Hero → Overview (sticky image) → Specs (count-up) → Gallery (horizontal
// scroll) → Video (facade) → Location (map) → Sticky CTA. All sections honour
// the light/dark theme variables; Hero, Video and Location keep a dark
// palette so the imagery stays cinematic regardless of the user's choice.
export default function EditorialProjectDetail({ project, lang, allProjects = [] }) {
  const t = getDict(lang);
  const d = t.detail;
  const name = localizedName(project, lang);
  const district = districtLabel(project.district, lang);
  const video = resolveVideo(project);

  // Split media: exterior shots → hero, interior shots → gallery.
  // Legacy single `gallery` column falls back to exterior so existing rows
  // don't show a blank hero before an editor migrates them.
  const exterior = (Array.isArray(project.exteriorImages) && project.exteriorImages.length > 0)
    ? project.exteriorImages
    : (Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery
      : (project.img ? [project.img] : []));
  const interior = (Array.isArray(project.interiorImages) && project.interiorImages.length > 0)
    ? project.interiorImages
    : [];
  const coverImage = exterior[0] || project.img || null;

  const priceFrom = project.priceUsd ?? project.price_usd;
  const tagline = priceFrom
    ? `${t.projects.from.charAt(0).toUpperCase() + t.projects.from.slice(1)} ${fmtUsd(priceFrom)} · ${district}`
    : district;

  const waMsg = `${WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en} — ${name}`;
  const waHref = whatsappLink(waMsg, lang);

  const overviewParagraphs = [
    d.overviewP1.replace('{name}', name).replace('{district}', district),
    d.overviewP2,
  ];

  // Specs cards — push the figures we actually have, cap at four.
  const specItems = [];
  const asSpecValue = (v) => {
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : String(v);
  };
  if (project.area) specItems.push({ label: d.area, value: Number(project.area), suffix: ' m²' });
  if (project.bedrooms) specItems.push({ label: d.bedrooms, value: asSpecValue(project.bedrooms) });
  if (project.bathrooms) specItems.push({ label: d.bathrooms, value: asSpecValue(project.bathrooms) });
  if (project.blocks) specItems.push({ label: t.detailExtra.blocks, value: Number(project.blocks) });
  if (project.totalUnits && specItems.length < 4) specItems.push({ label: t.detailExtra.totalUnits, value: Number(project.totalUnits) });
  if (specItems.length < 4 && project.delivery) specItems.push({ label: d.delivery, value: project.delivery });

  // Hero stays a clean cover — just the first shot. The full Exterior
  // gallery is a dedicated labelled section further down the page.
  const heroImages = coverImage ? [coverImage] : [];

  // Dynamic numbering — emotion first (visuals), then logic (facts), then
  // action (CTA). Sections collapse out of the count when their data is
  // absent so the sequence stays consistent.
  const pad = (n) => String(n).padStart(2, '0');
  let n = 1;
  const nOverview = ++n;
  const nExterior = exterior.length ? ++n : null;
  const nInterior = interior.length ? ++n : null;
  const nSpecs = ++n;
  const nVideo = video ? ++n : null;
  const nLocation = ++n;

  return (
    // Bottom padding keeps the tail of the page content from hiding
    // behind the sticky enquire bar (~72 px tall).
    <div style={{ background: 'rgb(var(--c-bg))', color: 'rgb(var(--c-fg))', paddingBottom: 80 }}>
      <HeroSlider
        images={heroImages}
        kicker="RESIDENCE"
        title={name}
        gradientSeed={project.id}
      />

      {/* Overview is text-only now; the hero above carries the cover.
          Exterior and Interior get their own labelled sections below. */}
      <OverviewSticky
        kicker={`№ ${pad(nOverview)} — OVERVIEW`}
        title={d.overviewTitle}
        paragraphs={overviewParagraphs}
        image={null}
      />

      {exterior.length > 0 && (
        <ImageSection
          images={exterior}
          kicker={`№ ${pad(nExterior)} — EXTERIOR`}
          heading={<>Facade &amp; <em className="italic">grounds.</em></>}
          sublabel="EXTERIOR"
          projectName={name}
          background="rgb(var(--c-bg))"
        />
      )}

      {interior.length > 0 && (
        <ImageSection
          images={interior}
          kicker={`№ ${pad(nInterior)} — INTERIOR`}
          heading={<>Interior <em className="italic">studies.</em></>}
          sublabel="INTERIOR"
          projectName={name}
          background="rgb(var(--c-bg-raised))"
        />
      )}

      <SpecsHorizontal
        kicker={`№ ${pad(nSpecs)} — FACTS`}
        heading={<>Facts &amp; <em className="italic">figures.</em></>}
        items={specItems}
      />

      {video && (
        <VideoFacade
          video={video}
          poster={coverImage || interior[0]}
          title={`${name} — video tour`}
          kicker={`№ ${pad(nVideo)} — VIDEO`}
        />
      )}

      <LocationMap
        district={district}
        city="Istanbul"
        projectName={name}
        kicker={`№ ${pad(nLocation)} — LOCATION`}
      />

      <SimilarEpilogue project={project} allProjects={allProjects} lang={lang} label={d.similar} />

      {/* Small WhatsApp text link above the global footer — WA lives here
          now that the sticky bar is single-action. */}
      <section className="py-10 border-t" style={{ borderColor: 'rgb(var(--c-line))' }}>
        <div className="container-x text-center">
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono"
            style={{
              fontSize: 13,
              letterSpacing: '0.08em',
              color: 'rgb(var(--c-fg-muted))',
            }}
          >
            Prefer WhatsApp? Message us directly
            <span aria-hidden style={{ color: '#C9A84C' }}>→</span>
          </Link>
        </div>
      </section>

      <StickyCTABar
        href={`/${lang}/contact`}
        label={d.contact}
      />
    </div>
  );
}

function SimilarEpilogue({ project, allProjects, lang, label }) {
  const similar = (allProjects || [])
    .filter((p) => p.id !== project.id && p.district === project.district)
    .slice(0, 4);
  if (!similar.length) return null;
  return (
    <section
      className="py-20 md:py-28 pb-28 md:pb-40"
      style={{ background: 'rgb(var(--c-bg-raised))' }}
    >
      <div className="container-x">
        <div
          className="font-mono text-[10px] md:text-[11px] uppercase text-[#C9A84C] mb-5"
          style={{ letterSpacing: '3px' }}
        >
          № 07 — {label}
        </div>
        <h2 className="font-editorial text-[32px] md:text-[48px] leading-[1.08] tracking-[-0.02em] mb-10">
          Also in this <em className="italic">neighbourhood.</em>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similar.map((p) => {
            const img = (Array.isArray(p.gallery) && p.gallery[0]) || p.img;
            let hue = 0;
            const seed = p.id || p.name || '';
            for (let i = 0; i < seed.length; i++) hue = (hue * 31 + seed.charCodeAt(i)) % 360;
            return (
              <Link
                key={p.id}
                href={`/${lang}/project/${p.id}`}
                className="group block rounded-[14px] overflow-hidden aspect-[4/5] relative"
                style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 42%), hsl(${(hue + 40) % 360} 40% 22%))` }}
              >
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(5,26,36,0.7) 100%)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="font-editorial text-[18px] leading-tight line-clamp-2">
                    {localizedName(p, lang)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

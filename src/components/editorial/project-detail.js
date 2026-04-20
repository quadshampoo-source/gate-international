import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { localizedName, whatsappLink, WHATSAPP_DEFAULT_MESSAGES, fmtUsd } from '@/lib/utils';
import { districtLabel } from '@/lib/districts';
import { resolveVideo } from '@/lib/video';

import HeroSlider from '@/components/editorial/detail/hero-slider';
import OverviewSticky from '@/components/editorial/detail/overview-sticky';
import SpecsHorizontal from '@/components/editorial/detail/specs-horizontal';
import GalleryScroll from '@/components/editorial/detail/gallery-scroll';
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

  const coverImage = (Array.isArray(project.gallery) && project.gallery[0]) || project.img || null;
  const galleryImages = (Array.isArray(project.gallery) && project.gallery.length > 0)
    ? project.gallery
    : (project.img ? [project.img] : []);

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
  if (project.area) specItems.push({ label: d.area, value: Number(project.area), suffix: ' m²' });
  if (project.bedrooms) specItems.push({ label: d.bedrooms, value: Number(project.bedrooms) });
  if (project.bathrooms) specItems.push({ label: d.bathrooms, value: Number(project.bathrooms) });
  if (project.blocks) specItems.push({ label: t.detailExtra.blocks, value: Number(project.blocks) });
  if (project.totalUnits && specItems.length < 4) specItems.push({ label: t.detailExtra.totalUnits, value: Number(project.totalUnits) });
  if (specItems.length < 4 && project.delivery) specItems.push({ label: d.delivery, value: project.delivery });

  return (
    <div style={{ background: 'rgb(var(--c-bg))', color: 'rgb(var(--c-fg))' }}>
      <HeroSlider
        images={galleryImages.length ? galleryImages : (coverImage ? [coverImage] : [])}
        kicker="OVERVIEW"
        title={name}
        gradientSeed={project.id}
      />

      <OverviewSticky
        kicker="№ 02 — OVERVIEW"
        title={d.overviewTitle}
        paragraphs={overviewParagraphs}
        image={galleryImages[1] || coverImage}
        alt={name}
      />

      <SpecsHorizontal
        kicker="№ 03 — FACTS"
        heading={<>Facts &amp; <em className="italic">figures.</em></>}
        items={specItems}
      />

      {galleryImages.length > 0 && <GalleryScroll images={galleryImages} projectName={name} />}

      {video && (
        <VideoFacade
          video={video}
          poster={coverImage || galleryImages[2]}
          title={`${name} — video tour`}
        />
      )}

      <LocationMap district={district} city="Istanbul" projectName={name} />

      <SimilarEpilogue project={project} allProjects={allProjects} lang={lang} label={d.similar} />

      <StickyCTABar
        waHref={waHref}
        contactHref={`/${lang}/contact`}
        bookLabel={d.contact}
        waLabel="WhatsApp"
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

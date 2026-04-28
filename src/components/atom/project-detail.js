import Link from 'next/link';
import GalleryMosaic from './detail/gallery-mosaic';
import StickyInfoCard from './detail/sticky-info-card';
import HighlightsList from './detail/highlights-list';
import MarkdownDescription from './detail/markdown-description';
import ConfigurationsTabs from './detail/configurations-tabs';
import PaymentPlanTimeline from './detail/payment-plan-timeline';
import FloorPlans from './detail/floor-plans';
import AmenitiesGrid from './detail/amenities-grid';
import LocationDistances from './detail/location-distances';
import DeveloperCard from './detail/developer-card';
import InvestmentBlock from './detail/investment-block';
import VideoTour from './detail/video-tour';
import FaqAccordion from './detail/faq-accordion';
import SimilarProperties from './detail/similar-properties';
import BuildingSpecs from './detail/building-specs';
import ProjectReels from './detail/project-reels';
import { getDict } from '@/lib/i18n';
import { localizedField } from '@/lib/i18n-content';
import { localizedName, localizedDistrict } from '@/lib/utils';

// Hero gallery is exterior-only. If a project has no exterior images we
// fall through to the legacy unified `gallery` array, then to the cover
// `img`. Interior shots never join this set — they get their own
// FloorPlans section below the configurations.
function getHeroGallery(project) {
  const seen = new Set();
  const out = [];
  const push = (src) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    out.push(src);
  };
  if (Array.isArray(project.exteriorImages)) project.exteriorImages.forEach(push);
  if (out.length === 0 && Array.isArray(project.gallery)) project.gallery.forEach(push);
  if (out.length === 0 && project.img) push(project.img);
  return out;
}

function buildSpecs(project, t) {
  const specs = [];
  if (project.bedrooms) specs.push({ label: t.bedrooms, value: project.bedrooms });
  if (project.bathrooms) specs.push({ label: t.bathrooms, value: project.bathrooms });
  if (project.area) specs.push({ label: t.area, value: `${project.area} m²` });
  if (project.propertyType || project.typology) specs.push({ label: t.type, value: project.propertyType || project.typology });
  if (project.deliveryStatus === 'DELIVERED') specs.push({ label: t.delivery, value: t.delivered });
  else if (project.deliveryMonth && project.deliveryYear) specs.push({ label: t.delivery, value: `${String(project.deliveryMonth).padStart(2, '0')}/${project.deliveryYear}` });
  else if (project.delivery) specs.push({ label: t.delivery, value: project.delivery });
  if (project.view) specs.push({ label: t.view, value: project.view });
  return specs;
}

export default function AtomProjectDetail({ project, lang = 'en', allProjects = [] }) {
  const t = getDict(lang).pages.detail;
  const heroGallery = getHeroGallery(project);
  const interiorImages = Array.isArray(project.interiorImages) ? project.interiorImages.filter(Boolean) : [];
  const specs = buildSpecs(project, t.specs);
  const developerInfo = project.developerInfo || project.developer_info;
  const distances = project.distances || {};
  // Localized content: prefers the per-locale jsonb bundle, falls back to
  // the legacy column when the bundle has no entry for `lang`.
  const heroTagline = localizedField(project, 'hero_tagline', lang);
  const description = localizedField(project, 'description', lang);
  const localizedAmenities = localizedField(project, 'amenities', lang);
  const amenities = Array.isArray(localizedAmenities) ? localizedAmenities : [];
  const localizedFaqs = localizedField(project, 'faqs', lang);
  const faqs = Array.isArray(localizedFaqs) ? localizedFaqs : [];
  const localName = localizedName(project, lang);
  const localDistrict = localizedDistrict(project, lang);
  const investment = project.investment;
  const techSpecs = project.techSpecs || project.tech_specs;
  const paymentPlan = project.payment_plan || project.paymentPlan;
  const priceTable = project.price_table || project.priceTable;
  const priceNote = project.priceNote || project.price_note;
  const priceLastUpdated = project.priceLastUpdated || project.price_last_updated;
  const reels = Array.isArray(project.reels) ? project.reels : [];

  // sub-district has no per-locale columns yet, so it stays in the legacy
  // (English) value; the parent district uses the localized form.
  const subDistrict = project.subDistrict || project.sub_district;
  const districtLabel = subDistrict && project.district !== subDistrict
    ? `${subDistrict}, ${localDistrict}`
    : localDistrict;

  return (
    <>
      {/* Breadcrumb + gallery hero */}
      <section className="pt-24 md:pt-32 pb-6 md:pb-10">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm mb-5" style={{ color: 'var(--neutral-500)' }}>
            <Link href={`/${lang}/projects`} className="hover:text-atom-primary-600 transition-colors">
              {t.breadcrumb.allResidences}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--neutral-900)' }}>{localName}</span>
          </div>

          <GalleryMosaic images={heroGallery} alt={localName} lang={lang} />
        </div>
      </section>

      {/* Title + tagline */}
      <section className="pb-6 md:pb-10">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              {districtLabel && (
                <div className="atom-caption mb-3" style={{ color: 'var(--primary-600)' }}>
                  {districtLabel.toUpperCase()}
                  {project.developer ? ` · ${project.developer.toUpperCase()}` : ''}
                </div>
              )}
              <h1 className="atom-h1" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.025em' }}>
                {localName}
              </h1>
              {heroTagline && (
                <p className="mt-3 max-w-[700px] text-lg" style={{ color: 'var(--neutral-500)', lineHeight: 1.5 }}>
                  {heroTagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main two-column body */}
      <section className="pb-32 md:pb-24">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-8 md:gap-12">
            {/* Main column */}
            <div className="flex flex-col gap-12 md:gap-16 min-w-0">
              {specs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 -mt-2">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="p-4"
                      style={{
                        background: 'var(--atom-surface)',
                        border: '1px solid var(--neutral-200)',
                        borderRadius: 'var(--atom-radius-md)',
                      }}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
                        {s.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <BuildingSpecs techSpecs={techSpecs} lang={lang} />
              <HighlightsList amenities={amenities} lang={lang} />
              <MarkdownDescription markdown={description} lang={lang} />
              <ProjectReels reels={reels} lang={lang} />
              <ConfigurationsTabs
                priceTable={priceTable}
                options={project.options}
                unitTypes={project.unit_types || project.unitTypes}
                priceNote={priceNote}
                priceLastUpdated={priceLastUpdated}
                lang={lang}
              />
              <PaymentPlanTimeline paymentPlan={paymentPlan} lang={lang} />
              <FloorPlans images={interiorImages} alt={`${localName} interior`} lang={lang} />
              <AmenitiesGrid amenities={amenities} lang={lang} />
              <LocationDistances
                distances={distances}
                district={localDistrict}
                projectName={localName}
                lang={lang}
              />
              <DeveloperCard developerInfo={developerInfo} lang={lang} />
              <InvestmentBlock investment={investment} lang={lang} />
              <VideoTour project={project} lang={lang} />
              <FaqAccordion faqs={faqs} lang={lang} />
            </div>

            {/* Sticky / mobile bottom CTA */}
            <StickyInfoCard project={project} lang={lang} />
          </div>
        </div>
      </section>

      {/* Similar */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <SimilarProperties projects={allProjects} current={project} lang={lang} />
        </div>
      </section>
    </>
  );
}

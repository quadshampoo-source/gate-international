// /[lang]/_dev/components — internal preview of the atom detail-page
// component set. Underscore prefix marks this folder private in Next App
// Router (not exposed as a route in production builds).

import GalleryMosaic from '@/components/atom/detail/gallery-mosaic';
import HighlightsList from '@/components/atom/detail/highlights-list';
import MarkdownDescription from '@/components/atom/detail/markdown-description';
import ConfigurationsTabs from '@/components/atom/detail/configurations-tabs';
import AmenitiesGrid from '@/components/atom/detail/amenities-grid';
import LocationDistances from '@/components/atom/detail/location-distances';
import DeveloperCard from '@/components/atom/detail/developer-card';
import InvestmentBlock from '@/components/atom/detail/investment-block';
import VideoTour from '@/components/atom/detail/video-tour';
import FaqAccordion from '@/components/atom/detail/faq-accordion';
import SimilarProperties from '@/components/atom/detail/similar-properties';
import StickyInfoCard from '@/components/atom/detail/sticky-info-card';
import { getProject, getProjects } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function DevComponentsPage() {
  // Pull a known-rich project for default props.
  const [zorlu, all] = await Promise.all([
    getProject('zorlu-center-residence'),
    getProjects(),
  ]);

  const sample = zorlu || {};
  const gallery = [
    ...(Array.isArray(sample.exteriorImages) ? sample.exteriorImages : []),
    ...(Array.isArray(sample.interiorImages) ? sample.interiorImages : []),
    ...(Array.isArray(sample.gallery) ? sample.gallery : []),
  ].filter(Boolean);

  return (
    <main className="pt-32 pb-24" style={{ background: 'var(--neutral-50)' }}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex flex-col gap-16">
        <header>
          <h1 className="text-3xl md:text-5xl font-bold" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
            Atom detail components
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--neutral-500)' }}>
            Source: <code>{sample.id || '—'}</code>. Each block below renders a
            standalone component with its production props.
          </p>
        </header>

        <Section title="01 — GalleryMosaic" caption="Hero mosaic + lightbox">
          <GalleryMosaic images={gallery} alt={sample.name || 'Sample'} />
        </Section>

        <Section title="02 — HighlightsList" caption="First 5 amenities">
          <HighlightsList amenities={sample.amenities} />
        </Section>

        <Section title="03 — MarkdownDescription" caption="react-markdown body">
          <MarkdownDescription markdown={sample.description} />
        </Section>

        <Section title="04 — ConfigurationsTabs" caption="project.options tabs">
          <ConfigurationsTabs options={sample.options} unitTypes={sample.unit_types || sample.unitTypes} />
        </Section>

        <Section title="05 — AmenitiesGrid" caption="Full amenities grid">
          <AmenitiesGrid amenities={sample.amenities} />
        </Section>

        <Section title="06 — LocationDistances" caption="Keyless map + distance pills">
          <LocationDistances
            distances={sample.distances}
            district={sample.district}
            projectName={sample.name}
          />
        </Section>

        <Section title="07 — DeveloperCard" caption="developer_info object">
          <DeveloperCard developerInfo={sample.developerInfo || sample.developer_info} />
        </Section>

        <Section title="08 — InvestmentBlock" caption="3 stats + ROI notes">
          <InvestmentBlock investment={sample.investment} />
        </Section>

        <Section title="09 — VideoTour" caption="Click-to-play (vimeo/youtube)">
          <VideoTour project={sample} />
        </Section>

        <Section title="10 — FaqAccordion" caption="Native details/summary">
          <FaqAccordion faqs={sample.faqs} />
        </Section>

        <Section title="11 — SimilarProperties" caption="District-tier match">
          <SimilarProperties projects={all} current={sample} lang="en" />
        </Section>

        <Section title="12 — StickyInfoCard (preview only)" caption="Right rail / mobile bottom bar — see full layout on a real detail page">
          <div className="max-w-[400px]">
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-xl)',
                boxShadow: 'var(--atom-shadow-lg)',
                padding: 24,
              }}
            >
              {/* Render content shape only; the real component handles its own
                  positioning/modals which we don't want to layer here. */}
              <StickyPreview project={sample} />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, caption, children }) {
  return (
    <section>
      <div className="mb-6">
        <div className="atom-caption" style={{ color: 'var(--primary-600)' }}>{title}</div>
        {caption && <div className="text-sm mt-1" style={{ color: 'var(--neutral-500)' }}>{caption}</div>}
      </div>
      <div
        style={{
          background: '#fff',
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--atom-radius-xl)',
          padding: 24,
        }}
      >
        {children}
      </div>
    </section>
  );
}

// Tiny static preview to render the sticky card's content shape without
// triggering its sticky / fixed-bar positioning logic.
function StickyPreview({ project }) {
  const price = project.priceUsd ?? project.price_usd;
  return (
    <div>
      {price && (
        <>
          <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--neutral-400)' }}>From</span>
          <div className="text-3xl font-bold" style={{ color: 'var(--neutral-900)' }}>${Number(price).toLocaleString()}</div>
        </>
      )}
      <div className="text-sm mt-3" style={{ color: 'var(--neutral-500)' }}>
        On a real detail page this card sticks to the right rail (desktop) or
        renders as a fixed bottom bar with a sheet trigger (mobile).
      </div>
    </div>
  );
}

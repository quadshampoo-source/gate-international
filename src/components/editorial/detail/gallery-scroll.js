'use client';

import ProjectSlider from '@/components/editorial/detail/project-slider';

// Unified gallery — uses the shared ProjectSlider so every image block on
// the detail page shares the same aspect, radius, and dot pagination.
// Slides are labelled "№ 0N — INTERIOR" above the project title so the
// overlay stays consistent with the spec.
export default function GalleryScroll({ images = [], projectName }) {
  const list = (images || []).filter(Boolean);
  if (!list.length) return null;

  const slides = list.map((src, i) => ({
    image: src,
    alt: projectName ? `${projectName} — ${i + 1}` : '',
    kicker: `№ ${String(i + 1).padStart(2, '0')} · INTERIOR`,
    title: null,
  }));

  return (
    <section className="py-20 md:py-28" style={{ background: 'rgb(var(--c-bg))' }}>
      <div className="container-x mb-10 md:mb-14">
        <div
          className="font-mono mb-4"
          style={{
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}
        >
          № 04 — GALLERY
        </div>
        <h2
          className="font-editorial"
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Interior <em className="italic">studies.</em>
        </h2>
      </div>

      <div className="container-x">
        <ProjectSlider slides={slides} />
      </div>
    </section>
  );
}

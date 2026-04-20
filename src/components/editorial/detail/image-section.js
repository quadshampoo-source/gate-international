'use client';

import ProjectSlider from '@/components/editorial/detail/project-slider';

// Reusable labelled image section — used twice on the detail page
// (Exterior + Interior). Delegates to ProjectSlider so the visual
// language stays identical to Hero and Video. Hides itself when
// the image list is empty, so we can just drop both sections in
// unconditionally and the layout collapses cleanly.
export default function ImageSection({
  images = [],
  kicker,
  heading,
  sublabel,          // overlay label inside each slide (e.g. "EXTERIOR")
  projectName,
  background = 'rgb(var(--c-bg))',
}) {
  const list = (images || []).filter(Boolean);
  if (!list.length) return null;

  const slides = list.map((src, i) => ({
    image: src,
    alt: projectName ? `${projectName} — ${i + 1}` : '',
    kicker: `№ ${String(i + 1).padStart(2, '0')}${sublabel ? ` · ${sublabel}` : ''}`,
    title: null,
  }));

  return (
    <section className="py-20 md:py-28" style={{ background }}>
      <div className="container-x mb-10 md:mb-14">
        {kicker && (
          <div
            className="font-mono mb-4"
            style={{
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A84C',
            }}
          >
            {kicker}
          </div>
        )}
        {heading && (
          <h2
            className="font-editorial"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {heading}
          </h2>
        )}
      </div>
      <div className="container-x">
        <ProjectSlider slides={slides} />
      </div>
    </section>
  );
}

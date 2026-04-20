'use client';

import ProjectSlider from '@/components/editorial/detail/project-slider';

// Hero built on the unified ProjectSlider. Shows one or more header images
// with an overlay "OVERVIEW — {project name}" on the first slide, and a
// lower-key "№ 0N" label on additional slides. Contained to container-x
// width (no 100svh full-bleed) so it shares the gallery rhythm.
export default function HeroSlider({ images = [], kicker = 'OVERVIEW', title, gradientSeed = '' }) {
  const list = (images || []).filter(Boolean);

  // Build a gradient fallback from a stable seed for empty projects.
  const gradient = (() => {
    let h = 0;
    for (let i = 0; i < gradientSeed.length; i++) h = (h * 31 + gradientSeed.charCodeAt(i)) % 360;
    return `linear-gradient(135deg, hsl(${h} 35% 42%), hsl(${(h + 40) % 360} 40% 22%))`;
  })();

  const slides = list.length
    ? list.map((src, i) => ({
        image: src,
        alt: title || '',
        kicker: i === 0 ? kicker : `№ ${String(i + 1).padStart(2, '0')}`,
        title: i === 0 ? title : null,
      }))
    : [{ fallback: gradient, kicker, title }];

  return (
    <section className="pt-28 md:pt-32 pb-6 md:pb-10">
      <div className="container-x">
        <ProjectSlider slides={slides} variant="dark" />
      </div>
    </section>
  );
}

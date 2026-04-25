'use client';

import { useState } from 'react';
import Lightbox from './lightbox';

// Interior gallery — surfaces project.interiorImages as a 1/2/3-col grid
// with its own lightbox so floor plans never get shuffled together with
// exterior renders in the hero mosaic. Renders nothing when the array is
// empty or absent — keeps sparse projects clean.
export default function FloorPlans({ images = [], alt = 'Interior' }) {
  const valid = (images || []).filter(Boolean);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (valid.length === 0) return null;

  const openAt = (i) => { setIndex(i); setOpen(true); };

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        Floor Plans &amp; Interiors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {valid.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            className="block w-full overflow-hidden transition-transform hover:scale-[1.01]"
            style={{
              aspectRatio: '4 / 3',
              background: 'var(--neutral-100)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-lg)',
            }}
            aria-label={`Open ${alt.toLowerCase()} ${i + 1} of ${valid.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {open && (
        <Lightbox
          images={valid}
          startIndex={index}
          onClose={() => setOpen(false)}
          alt={alt}
        />
      )}
    </section>
  );
}

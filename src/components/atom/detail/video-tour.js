'use client';

import { useState } from 'react';
import { resolveVideo } from '@/lib/video';

// Click-to-play poster pattern. resolveVideo() handles vimeo_id and
// youtube_url priority; returns null if neither is set, in which case
// the whole section disappears.
export default function VideoTour({ project, poster }) {
  const [playing, setPlaying] = useState(false);
  const video = resolveVideo(project);
  if (!video) return null;

  const cover = poster
    || (Array.isArray(project?.exteriorImages) && project.exteriorImages[0])
    || (Array.isArray(project?.interiorImages) && project.interiorImages[0])
    || project?.img;

  const src = playing
    ? `${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        Video tour
      </h2>

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          background: '#000',
          borderRadius: 'var(--atom-radius-lg)',
        }}
      >
        {playing && src ? (
          <iframe
            src={src}
            title={`${project?.name || 'Project'} video tour`}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            {...video.iframeProps}
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play video tour"
            className="absolute inset-0 w-full h-full group"
          >
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div
              className="absolute inset-0 flex items-center justify-center transition-colors"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <span
                className="inline-flex items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{
                  width: 80,
                  height: 80,
                  background: 'var(--accent-coral)',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(255,107,92,0.4)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ marginLeft: 4 }}>
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              </span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

// Lazy video section: shows a poster image + a gold play button. The iframe
// is only mounted when the user clicks Play, so YouTube/Vimeo scripts stay
// off the page until they're needed. The iframe's props come from resolveVideo
// so both providers (Vimeo, YouTube nocookie) work.
export default function VideoFacade({ video, poster, title, kicker = '№ 05 — VIDEO' }) {
  const [playing, setPlaying] = useState(false);
  if (!video) return null;

  const src = `${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`;

  return (
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#081116', color: '#EEF0EA' }}
    >
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
          {kicker}
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
          Watch the <em className="italic">residence.</em>
        </h2>
      </div>
      <div className="container-x">
        <div
          className="relative mx-auto rounded-[16px] overflow-hidden aspect-video"
          style={{
            background: '#000',
            maxHeight: '80vh',
            boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
          }}
        >
          {playing ? (
            <iframe
              src={src}
              {...video.iframeProps}
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={title || 'Video tour'}
            />
          ) : (
            <>
              {poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }}
              />
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center group focus-visible:outline-none"
              >
                <span
                  className="flex items-center justify-center rounded-full transition-transform group-hover:scale-105"
                  style={{
                    width: 96,
                    height: 96,
                    background: '#C9A84C',
                    color: '#081116',
                    boxShadow: '0 20px 60px rgba(201,168,76,0.4)',
                  }}
                >
                  <svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" aria-hidden="true">
                    <path d="M3 2l22 14L3 30z" />
                  </svg>
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

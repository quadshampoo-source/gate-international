'use client';

import { useState } from 'react';

// Lazy video section — unified with the other image blocks. Shows a poster
// image sized to the shared slider aspect (3:4 → 4:5 → 16:10 desktop) with
// a gold play button centred. Clicking mounts the iframe (Vimeo/YouTube via
// resolveVideo) with autoplay; until then no third-party scripts load.
export default function VideoFacade({ video, poster, title, kicker = '№ 05 — VIDEO' }) {
  const [playing, setPlaying] = useState(false);
  if (!video) return null;

  const src = `${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`;

  return (
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#081116', color: '#EEF0EA' }}
    >
      <style>{`
        .video-facade-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 12px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .video-facade-frame { aspect-ratio: 4 / 5; }
        }
        @media (min-width: 1024px) {
          .video-facade-frame { aspect-ratio: 16 / 10; max-height: 70vh; border-radius: 16px; }
        }
      `}</style>

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
          className="video-facade-frame mx-auto"
          style={{
            background: '#000',
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

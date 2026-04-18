'use client';

import { useEffect } from 'react';

export default function VideoModal({ open, onClose, vimeoId }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1100px] aspect-video bg-black border border-line-strong relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-xs tracking-[0.14em] text-fg-muted hover:text-gold"
        >
          CLOSE ✕
        </button>
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            title="Property video tour"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-black">
            <div className="font-mono text-[11px] tracking-[0.2em] text-gold">● REC · RESIDENCE TOUR · 04:32</div>
            <div className="font-serif text-[28px] text-fg">Video player</div>
            <div className="font-mono text-[10px] tracking-[0.16em] text-fg-dim">[ VIMEO EMBED PLACEHOLDER ]</div>
          </div>
        )}
      </div>
    </div>
  );
}

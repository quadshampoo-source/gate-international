'use client';

import { useState } from 'react';
import { extractYouTubeId, youtubeThumbnail } from '@/lib/video';

const MAX_REELS = 10;

function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r && r.id)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map((r, i) => ({ id: String(r.id), title: r.title || '', order: i + 1 }));
}

// Repeatable list of YouTube Shorts. Uses the same ↑↓ pattern as the
// amenities/faqs editors — no extra DnD library — and a small "Add reel"
// inline form that auto-extracts the YouTube id from any URL shape.
export default function ReelsEditor({ initialReels = [], name = 'reels_json' }) {
  const [rows, setRows] = useState(normalize(initialReels));
  const [pending, setPending] = useState({ url: '', title: '' });
  const [error, setError] = useState('');

  const move = (i, dir) => {
    setRows((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((r, idx) => ({ ...r, order: idx + 1 }));
    });
  };

  const remove = (i) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, order: idx + 1 })));
  };

  const updateTitle = (i, value) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, title: value } : r)));
  };

  const add = () => {
    setError('');
    if (rows.length >= MAX_REELS) {
      setError(`Max ${MAX_REELS} reels per project.`);
      return;
    }
    const id = extractYouTubeId(pending.url);
    if (!id) {
      setError('Could not parse a YouTube video id from that URL.');
      return;
    }
    if (rows.some((r) => r.id === id)) {
      setError('That reel is already in the list.');
      return;
    }
    setRows((prev) => [...prev, { id, title: pending.title.trim(), order: prev.length + 1 }]);
    setPending({ url: '', title: '' });
  };

  // Persist clean rows; drop empty titles, ensure 1-based order.
  const cleaned = rows.map((r, i) => {
    const out = { id: r.id, order: i + 1 };
    if (r.title) out.title = r.title;
    return out;
  });

  const limitReached = rows.length >= MAX_REELS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="form-hint">Up to {MAX_REELS} YouTube Shorts. Use ↑↓ to reorder.</p>

      {rows.map((row, i) => {
        const thumb = youtubeThumbnail(row.id, 'mqdefault');
        return (
          <div
            key={row.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 10,
              border: '1px solid var(--line, #2a2a2a)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="btn-remove"
                style={{ width: 24, height: 24, opacity: i === 0 ? 0.3 : 1 }}
              >↑</button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label="Move down"
                className="btn-remove"
                style={{ width: 24, height: 24, opacity: i === rows.length - 1 ? 0.3 : 1 }}
              >↓</button>
            </div>
            <div
              aria-hidden
              style={{
                width: 80,
                height: 60,
                borderRadius: 4,
                overflow: 'hidden',
                background: '#000',
                flexShrink: 0,
              }}
            >
              {thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <input
                type="text"
                value={row.title}
                onChange={(e) => updateTitle(i, e.target.value)}
                placeholder="Title (optional)"
                className="admin-input"
              />
              <div className="text-[11px] text-fg-dim font-mono" style={{ wordBreak: 'break-all' }}>
                youtube.com/shorts/{row.id}
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="btn-remove"
              aria-label="Remove reel"
              title="Remove"
            >×</button>
          </div>
        );
      })}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 12,
          border: '1px dashed var(--line, #2a2a2a)',
          borderRadius: 8,
          opacity: limitReached ? 0.5 : 1,
        }}
      >
        <input
          type="url"
          value={pending.url}
          onChange={(e) => setPending((p) => ({ ...p, url: e.target.value }))}
          placeholder="YouTube Shorts URL (https://youtube.com/shorts/... or https://youtu.be/...)"
          className="admin-input font-mono"
          disabled={limitReached}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={pending.title}
            onChange={(e) => setPending((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title (optional)"
            className="admin-input"
            style={{ flex: 1 }}
            disabled={limitReached}
          />
          <button
            type="button"
            onClick={add}
            className="btn-add-option"
            disabled={limitReached || !pending.url.trim()}
          >
            + Add Reel
          </button>
        </div>
        {error && <div className="text-[11px]" style={{ color: '#ef4444' }}>{error}</div>}
        {limitReached && !error && (
          <div className="text-[11px] text-fg-dim">Limit reached — remove a reel to add another.</div>
        )}
      </div>

      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
    </div>
  );
}

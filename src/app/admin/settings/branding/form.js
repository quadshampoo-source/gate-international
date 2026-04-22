'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

async function sniffPng(file) {
  const buf = await file.slice(0, 4).arrayBuffer();
  const v = new Uint8Array(buf);
  return v.length === 4 && PNG_MAGIC.every((b, i) => v[i] === b);
}

export default function LogoUploader({ initialUrl, initialAlt }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);

    if (!/\.png$/i.test(file.name) && file.type !== 'image/png') {
      setError('File must be a PNG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File exceeds 2 MB.');
      return;
    }
    const ok = await sniffPng(file);
    if (!ok) {
      setError('File does not look like a real PNG.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/logo-upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const p = await res.json().catch(() => ({}));
        throw new Error(p.error || `upload failed (${res.status})`);
      }
      const { url: newUrl } = await res.json();
      setUrl(newUrl);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!confirm('Remove the current logo? The wordmark fallback will be shown.')) return;
    setUploading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/logo-upload', { method: 'DELETE' });
      if (!res.ok) {
        const p = await res.json().catch(() => ({}));
        throw new Error(p.error || `remove failed (${res.status})`);
      }
      setUrl('');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Remove failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-[780px]">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <PreviewCard label="On light" bg="#F8FAFC" src={url} alt={initialAlt || 'Gate International'} />
        <PreviewCard label="On dark" bg="#0F1624" src={url} alt={initialAlt || 'Gate International'} dark />
      </div>

      <div className="admin-row">
        <label>Logo PNG</label>
        <div>
          <input
            type="file"
            accept="image/png,.png"
            onChange={onFile}
            disabled={uploading}
            className="text-[12px] text-fg-muted"
          />
          <p className="text-[11px] text-fg-dim mt-2">
            PNG only, max 2 MB. Transparent background recommended. Height displayed at 28 px (mobile) / 32 px (desktop).
          </p>
          {error && <p className="text-[12px] text-[#ef4444] mt-2">{error}</p>}
          {uploading && <p className="text-[12px] text-fg-muted mt-2">Uploading…</p>}
          {url && !uploading && (
            <button
              type="button"
              onClick={remove}
              className="admin-btn danger mt-3"
            >
              Remove logo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ label, bg, src, alt, dark }) {
  return (
    <div
      className="border border-line p-8 flex flex-col items-center justify-center gap-4"
      style={{ background: bg, minHeight: 160 }}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt={alt} style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
      ) : (
        <div style={{ color: dark ? '#fff' : '#0F1624', fontSize: 18, fontFamily: 'Georgia, serif' }}>
          Gate <em style={{ fontStyle: 'italic' }}>International</em>
        </div>
      )}
      <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,22,36,0.55)' }}>
        {label}
      </span>
    </div>
  );
}

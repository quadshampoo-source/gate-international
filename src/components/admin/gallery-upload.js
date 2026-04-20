'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const MAX_ITEMS = 12;
const LONG_EDGE = 1920;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif';

// ── File processing ──────────────────────────────────────────────────────

function isHeic(file) {
  const t = (file.type || '').toLowerCase();
  if (t === 'image/heic' || t === 'image/heif') return true;
  return /\.hei[cf]$/i.test(file.name || '');
}

async function decodeHeic(file) {
  // Dynamic import so heic2any only loads when a HEIC arrives.
  const mod = await import('heic2any');
  const heic2any = mod.default || mod;
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  return new File([blob], file.name.replace(/\.hei[cf]$/i, '.jpg'), { type: 'image/jpeg' });
}

// Resize to 1920px long edge, re-encode as WebP (JPEG fallback), strip EXIF.
async function processImage(rawFile) {
  let file = rawFile;
  if (isHeic(file)) {
    file = await decodeHeic(file);
  }

  // createImageBitmap honours EXIF orientation when available.
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bitmap = await createImageBitmap(file);
  }

  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > LONG_EDGE ? LONG_EDGE / longest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  // Prefer WebP where supported; fall back to JPEG.
  const webpSupported = await new Promise((res) => {
    canvas.toBlob((b) => res(!!b), 'image/webp', 0.85);
  });
  const mime = webpSupported ? 'image/webp' : 'image/jpeg';
  const quality = webpSupported ? 0.85 : 0.85;
  const blob = await new Promise((res) => canvas.toBlob(res, mime, quality));
  if (!blob) throw new Error('encode failed');

  const ext = mime === 'image/webp' ? 'webp' : 'jpg';
  const baseName = (file.name || 'image').replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.${ext}`, { type: mime });
}

// ── Upload ───────────────────────────────────────────────────────────────

function uploadWithProgress(file, projectId, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload-image');
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url);
        else reject(new Error(body.error || `HTTP ${xhr.status}`));
      } catch (e) {
        reject(new Error('bad response'));
      }
    };
    xhr.onerror = () => reject(new Error('network error'));
    const fd = new FormData();
    fd.append('file', file);
    fd.append('projectId', projectId || '');
    xhr.send(fd);
  });
}

// ── Component ────────────────────────────────────────────────────────────

let seq = 0;
const nextId = () => `${Date.now()}-${++seq}`;

export default function GalleryUpload({ initialUrls = [], projectIdRef, name = 'gallery_lines' }) {
  const [items, setItems] = useState(() =>
    (initialUrls || []).filter(Boolean).map((url) => ({ id: nextId(), url, status: 'done', progress: 100 }))
  );
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dragIndex = useRef(-1);

  const urls = useMemo(() => items.filter((i) => i.status === 'done' && i.url).map((i) => i.url), [items]);
  const remaining = MAX_ITEMS - items.length;

  // Read the project id from the sibling <input name="id"> at upload time.
  // This lets new projects (where the slug is user-entered) also upload.
  const resolveProjectId = () => {
    if (projectIdRef?.current) return projectIdRef.current.value;
    const el = document.querySelector('input[name="id"]');
    return el?.value || '';
  };

  const handleFiles = async (list) => {
    setError(null);
    const files = Array.from(list || []);
    if (!files.length) return;
    const room = MAX_ITEMS - items.length;
    if (files.length > room) {
      setError(`En fazla ${MAX_ITEMS} görsel yükleyebilirsin. ${room} alanın kaldı.`);
      files.length = room;
      if (!files.length) return;
    }

    const ids = files.map(() => nextId());
    setItems((cur) => [
      ...cur,
      ...files.map((f, i) => ({ id: ids[i], url: null, status: 'queued', progress: 0, rawName: f.name })),
    ]);

    const projectId = resolveProjectId();

    for (let i = 0; i < files.length; i++) {
      const id = ids[i];
      try {
        setItems((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'processing' } : x)));
        const processed = await processImage(files[i]);
        setItems((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'uploading', progress: 0 } : x)));
        const url = await uploadWithProgress(processed, projectId, (pct) => {
          setItems((cur) => cur.map((x) => (x.id === id ? { ...x, progress: pct } : x)));
        });
        setItems((cur) => cur.map((x) => (x.id === id ? { ...x, url, status: 'done', progress: 100 } : x)));
      } catch (e) {
        setItems((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'error', error: e.message } : x)));
      }
    }
  };

  const removeAt = (id) => setItems((cur) => cur.filter((x) => x.id !== id));

  const onDragStart = (idx) => { dragIndex.current = idx; };
  const onDragOverItem = (e, idx) => {
    e.preventDefault();
    if (dragIndex.current === -1 || dragIndex.current === idx) return;
    setItems((cur) => {
      const next = [...cur];
      const [moved] = next.splice(dragIndex.current, 1);
      next.splice(idx, 0, moved);
      dragIndex.current = idx;
      return next;
    });
  };
  const onDragEnd = () => { dragIndex.current = -1; };

  const onDropZone = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files?.length) handleFiles(files);
  };

  const busyCount = items.filter((x) => x.status === 'uploading' || x.status === 'processing').length;
  const doneCount = items.filter((x) => x.status === 'done').length;
  const errorCount = items.filter((x) => x.status === 'error').length;

  return (
    <div>
      {/* Hidden field consumed by the server action — one URL per line. */}
      <input type="hidden" name={name} value={urls.join('\n')} readOnly />

      {items.length < MAX_ITEMS && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDropZone}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center text-center py-10 px-6 rounded-[12px] transition-colors"
          style={{
            border: `2px dashed ${dragOver ? 'rgb(var(--c-gold))' : 'rgb(var(--c-line-strong))'}`,
            background: dragOver ? 'rgb(var(--c-gold) / 0.05)' : 'rgb(var(--c-bg-raised))',
          }}
        >
          <div className="font-serif text-[20px] text-fg mb-1">Görselleri sürükleyin veya tıklayarak seçin</div>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-muted">
            JPEG · PNG · WebP · HEIC · {remaining} alan kaldı
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {error && (
        <div className="mt-3 text-[13px] text-[#ef4444] border border-[#ef4444]/40 bg-[#ef4444]/5 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {(busyCount > 0 || doneCount > 0) && (
        <div className="mt-3 font-mono text-[11px] tracking-[0.14em] uppercase text-fg-muted">
          {doneCount} / {items.length} yüklendi
          {busyCount > 0 ? ` · ${busyCount} işleniyor` : ''}
          {errorCount > 0 ? ` · ${errorCount} hata` : ''}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <div
              key={it.id}
              draggable={it.status === 'done'}
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOverItem(e, idx)}
              onDragEnd={onDragEnd}
              className="relative rounded-[10px] overflow-hidden group"
              style={{
                background: 'rgb(var(--c-bg-raised))',
                border: '1px solid rgb(var(--c-line-strong))',
                aspectRatio: '4 / 3',
                cursor: it.status === 'done' ? 'grab' : 'default',
              }}
            >
              {it.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono tracking-wider text-fg-muted">
                  {it.status === 'processing' ? 'Optimize ediliyor…' : 'Sıraya alındı'}
                </div>
              )}

              {(it.status === 'uploading' || it.status === 'processing') && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/40">
                  <div
                    className="h-full bg-gold transition-[width] duration-150"
                    style={{ width: `${it.progress || 0}%` }}
                  />
                </div>
              )}

              {it.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-3 bg-[#ef4444]/20 text-[12px] text-[#ef4444]">
                  {it.error || 'Hata'}
                </div>
              )}

              {idx === 0 && it.url && (
                <div
                  className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.16em] uppercase px-2 py-1 rounded"
                  style={{ background: 'rgb(var(--c-gold))', color: 'rgb(var(--c-bg))' }}
                >
                  Kapak
                </div>
              )}

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeAt(it.id); }}
                aria-label="Görseli sil"
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

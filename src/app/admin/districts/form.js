'use client';

import { useState } from 'react';

const CITIES = ['Istanbul', 'Bodrum', 'Bursa', 'Jeddah'];

export default function DistrictForm({ action, district }) {
  const [image, setImage] = useState(district.image || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('projectId', `district-${district.slug}`);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
      if (!res.ok) {
        const p = await res.json().catch(() => ({}));
        throw new Error(p.error || `upload failed (${res.status})`);
      }
      const { url } = await res.json();
      setImage(url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={action} className="max-w-[780px]">
      <input type="hidden" name="slug" value={district.slug} />

      <Row label="Name (EN)">
        <input name="name" required defaultValue={district.name || ''} className="admin-input" />
      </Row>
      <Row label="Name (AR)">
        <input name="name_ar" defaultValue={district.name_ar || ''} className="admin-input" dir="rtl" />
      </Row>
      <Row label="Name (ZH)">
        <input name="name_zh" defaultValue={district.name_zh || ''} className="admin-input" />
      </Row>

      <Row label="City">
        <select name="city" defaultValue={district.city || 'Istanbul'} className="admin-select">
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Row>

      <Row label="Image">
        <div className="flex items-start gap-4">
          <div className="w-32 h-40 border border-line bg-bg-raised flex items-center justify-center overflow-hidden flex-shrink-0">
            {image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-fg-dim">No image</span>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              disabled={uploading}
              className="text-[12px] text-fg-muted"
            />
            <p className="text-[11px] text-fg-dim mt-2">
              {uploading ? 'Uploading…' : 'JPG, PNG or WebP. 3:4 portrait works best for the homepage rail.'}
            </p>
            {uploadError && <p className="text-[11px] text-[#ef4444] mt-1">{uploadError}</p>}
            {image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-[11px] text-fg-muted hover:text-[#ef4444] mt-2 underline"
              >
                Remove image
              </button>
            )}
            <input type="hidden" name="image" value={image} />
          </div>
        </div>
      </Row>

      <Row label="Sort order">
        <input
          type="number"
          name="sort_order"
          defaultValue={district.sort_order ?? 0}
          className="admin-input w-32"
        />
      </Row>

      <Row label="Visible">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_visible" defaultChecked={district.is_visible !== false} className="w-4 h-4 accent-gold" />
          <span className="text-sm">Show on homepage rail</span>
        </label>
      </Row>

      <div className="flex gap-3 mt-10 pt-6 border-t border-line">
        <button type="submit" className="admin-btn" disabled={uploading}>
          Save changes
        </button>
        <a href="/admin/districts" className="admin-btn secondary">Cancel</a>
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div className="admin-row">
      <label>{label}</label>
      <div>{children}</div>
    </div>
  );
}

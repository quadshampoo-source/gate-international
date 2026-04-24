'use client';

import { useState } from 'react';

const MAX_ITEMS = 20;

function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((a) => ({
    icon: a?.icon ?? '',
    label: a?.label ?? '',
    description: a?.description ?? '',
  }));
}

export default function AmenitiesEditor({ initialAmenities = [], name = 'amenities_json' }) {
  const [rows, setRows] = useState(normalize(initialAmenities));

  const update = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };
  const add = () => {
    if (rows.length >= MAX_ITEMS) return;
    setRows((prev) => [...prev, { icon: '', label: '', description: '' }]);
  };
  const remove = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    setRows((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const cleaned = rows
    .filter((r) => r.label.trim() || r.icon.trim())
    .map((r) => {
      const out = { icon: r.icon.trim(), label: r.label.trim() };
      if (r.description.trim()) out.description = r.description.trim();
      return out;
    });

  return (
    <div>
      <p className="form-hint">Up to {MAX_ITEMS} items. Icon can be an emoji or unicode glyph.</p>

      {rows.map((row, i) => (
        <div key={i} className="option-row" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Move up"
              className="btn-remove"
              title="Move up"
              style={{ width: 24, height: 24, opacity: i === 0 ? 0.3 : 1 }}
            >↑</button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              aria-label="Move down"
              className="btn-remove"
              title="Move down"
              style={{ width: 24, height: 24, opacity: i === rows.length - 1 ? 0.3 : 1 }}
            >↓</button>
          </div>
          <input
            type="text"
            value={row.icon}
            onChange={(e) => update(i, 'icon', e.target.value)}
            placeholder="🏊"
            className="admin-input"
            style={{ width: 56, textAlign: 'center' }}
            maxLength={4}
          />
          <input
            type="text"
            value={row.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Label (e.g. Outdoor pool)"
            className="admin-input"
            style={{ flex: 1 }}
          />
          <input
            type="text"
            value={row.description}
            onChange={(e) => update(i, 'description', e.target.value)}
            placeholder="Description (optional)"
            className="admin-input"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="btn-remove"
            title="Remove"
            aria-label="Remove"
          >×</button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="btn-add-option"
        disabled={rows.length >= MAX_ITEMS}
      >
        + Add amenity {rows.length >= MAX_ITEMS ? '(limit reached)' : ''}
      </button>

      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
    </div>
  );
}

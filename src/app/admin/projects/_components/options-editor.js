'use client';

import { useState } from 'react';

const TYPE_OPTIONS = [
  'Studio',
  '1+1',
  '2+1',
  '2+1 Duplex',
  '3+1',
  '3+1 Duplex',
  '4+1',
  '4+1 Duplex',
  '5+1',
  'Penthouse',
  'Villa',
  'Office',
  'Shop',
];
const SIZE_OPTIONS = Array.from({ length: 50 }, (_, i) => (i + 1) * 10);

function normalizeOptions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((o) => ({
    type: o?.type ?? '',
    size: o?.size != null ? String(o.size) : '',
    price: o?.price != null ? String(o.price) : '',
  }));
}

export default function OptionsEditor({ initialOptions = [], name = 'options_json' }) {
  const [rows, setRows] = useState(normalizeOptions(initialOptions));

  const update = (index, field, value) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const add = () => {
    setRows((prev) => [...prev, { type: '', size: '', price: '' }]);
  };

  const remove = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const formatPrice = (raw) => {
    const digits = String(raw).replace(/\D/g, '');
    return digits ? Number(digits).toLocaleString() : '';
  };

  const cleaned = rows
    .filter((r) => r.type || r.size || r.price)
    .map((r) => ({
      type: r.type || '',
      size: r.size ? Number(String(r.size).replace(/\D/g, '')) || r.size : '',
      price: r.price ? Number(String(r.price).replace(/\D/g, '')) || r.price : '',
    }));

  return (
    <div>
      <p className="form-hint">Add unit types with sizes and prices</p>

      {rows.map((row, i) => (
        <div key={i} className="option-row">
          <select
            value={row.type}
            onChange={(e) => update(i, 'type', e.target.value)}
            className="admin-select option-type"
          >
            <option value="">Type</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={row.size}
            onChange={(e) => update(i, 'size', e.target.value)}
            className="admin-select option-size"
          >
            <option value="">m²</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s} m²</option>
            ))}
          </select>

          <div className="option-price-wrapper">
            <span className="price-prefix">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Price"
              value={formatPrice(row.price)}
              onChange={(e) => update(i, 'price', e.target.value.replace(/\D/g, ''))}
              className="admin-input option-price"
            />
          </div>

          <button
            type="button"
            onClick={() => remove(i)}
            className="btn-remove"
            title="Remove"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-add-option">
        + Add Option
      </button>

      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
    </div>
  );
}

'use client';

import { useState } from 'react';

const MAX_ITEMS = 15;

function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((f) => ({
    question: f?.question ?? '',
    answer: f?.answer ?? '',
  }));
}

export default function FaqsEditor({ initialFaqs = [], name = 'faqs_json' }) {
  const [rows, setRows] = useState(normalize(initialFaqs));

  const update = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };
  const add = () => {
    if (rows.length >= MAX_ITEMS) return;
    setRows((prev) => [...prev, { question: '', answer: '' }]);
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
    .filter((r) => r.question.trim() || r.answer.trim())
    .map((r) => ({ question: r.question.trim(), answer: r.answer.trim() }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="form-hint">Up to {MAX_ITEMS} Q&amp;A pairs. Answer supports markdown.</p>

      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 12,
            border: '1px solid var(--line, #2a2a2a)',
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted, #888)', minWidth: 32 }}>Q{i + 1}</span>
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="btn-remove"
              title="Move up"
              style={{ width: 24, height: 24, opacity: i === 0 ? 0.3 : 1 }}
            >↑</button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              className="btn-remove"
              title="Move down"
              style={{ width: 24, height: 24, opacity: i === rows.length - 1 ? 0.3 : 1 }}
            >↓</button>
            <input
              type="text"
              value={row.question}
              onChange={(e) => update(i, 'question', e.target.value)}
              placeholder="Question"
              className="admin-input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="btn-remove"
              title="Remove"
              aria-label="Remove FAQ"
            >×</button>
          </div>
          <textarea
            value={row.answer}
            onChange={(e) => update(i, 'answer', e.target.value)}
            placeholder="Answer (markdown supported)"
            rows={4}
            className="admin-textarea"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="btn-add-option"
        disabled={rows.length >= MAX_ITEMS}
      >
        + Add FAQ {rows.length >= MAX_ITEMS ? '(limit reached)' : ''}
      </button>

      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
    </div>
  );
}

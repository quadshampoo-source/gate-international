'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="5" cy="3" r="1.5" />
      <circle cx="11" cy="3" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="13" r="1.5" />
      <circle cx="11" cy="13" r="1.5" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function ProjectListClient({ initialProjects, canReorder }) {
  const [projects, setProjects] = useState(initialProjects);
  const [baseline, setBaseline] = useState(initialProjects);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [armedRow, setArmedRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const router = useRouter();

  const hasChanges = projects.some((p, i) => p.id !== baseline[i]?.id);

  const reorderList = (list, from, to) => {
    if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const handleDragStart = (index) => (e) => {
    if (!canReorder) return;
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(index)); } catch {}
  };

  const handleDragEnter = (index) => () => {
    if (!canReorder) return;
    dragOverItem.current = index;
    setOverIndex(index);
  };

  const handleDragOver = (e) => {
    if (!canReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    setDragIndex(null);
    setOverIndex(null);
    setArmedRow(null);
    if (from === null || to === null || from === to) return;
    setProjects((prev) => reorderList(prev, from, to));
  };

  const moveProject = (index, direction) => {
    const target = index + direction;
    setProjects((prev) => reorderList(prev, index, target));
  };

  const cancel = () => {
    setProjects(baseline);
    setError(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    setError(null);
    try {
      const order = projects.map((p, i) => ({ id: p.id, sort_index: i + 1 }));
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `save failed (${res.status})`);
      }
      setBaseline(projects);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {canReorder && hasChanges && (
        <div className="save-order-bar">
          <span>Sıralama değiştirildi — kaydetmeden sayfadan ayrılmayın.</span>
          {error && <span className="save-order-error">{error}</span>}
          <button
            type="button"
            onClick={saveOrder}
            disabled={saving}
            className="save-order-btn"
          >
            {saving ? 'Kaydediliyor…' : 'Sıralamayı Kaydet'}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            className="cancel-order-btn"
          >
            İptal
          </button>
        </div>
      )}

      <div className="border border-line overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {canReorder && <th aria-label="Reorder" />}
              <th>#</th>
              <th>Name</th>
              <th>District</th>
              <th>Developer</th>
              <th>Price (USD)</th>
              <th>Status</th>
              <th>Category</th>
              {canReorder && <th aria-label="Move" />}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const trClass = [
                dragIndex === i ? 'dragging' : '',
                overIndex === i && dragIndex !== null && dragIndex !== i ? 'drag-over' : '',
              ].filter(Boolean).join(' ');
              return (
                <tr
                  key={p.id}
                  className={trClass}
                  draggable={canReorder && armedRow === i}
                  onDragStart={handleDragStart(i)}
                  onDragEnter={handleDragEnter(i)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
                >
                  {canReorder && (
                    <td
                      className="drag-handle"
                      title="Sıralamak için sürükle"
                      onMouseDown={() => setArmedRow(i)}
                      onMouseUp={() => setArmedRow(null)}
                      onMouseLeave={() => setArmedRow((prev) => (prev === i ? prev : null))}
                    >
                      <GripIcon />
                    </td>
                  )}
                  <td className="font-mono text-xs text-fg-muted">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td>
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="hover:text-gold"
                      draggable={false}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td>{p.district}</td>
                  <td className="text-fg-muted">{p.developer || '—'}</td>
                  <td className="font-mono">
                    {p.price_usd ? `$${Number(p.price_usd).toLocaleString()}` : '—'}
                  </td>
                  <td className="text-xs font-mono uppercase tracking-wider">
                    {p.status || '—'}
                  </td>
                  <td className="text-xs text-fg-muted">{p.category || '—'}</td>
                  {canReorder && (
                    <td className="order-buttons">
                      <button
                        type="button"
                        onClick={() => moveProject(i, -1)}
                        disabled={i === 0}
                        className="move-btn"
                        title="Yukarı taşı"
                        aria-label="Move up"
                      >
                        <ChevronUp />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(i, 1)}
                        disabled={i === projects.length - 1}
                        className="move-btn"
                        title="Aşağı taşı"
                        aria-label="Move down"
                      >
                        <ChevronDown />
                      </button>
                    </td>
                  )}
                  <td className="text-right">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-xs text-gold hover:underline"
                      draggable={false}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

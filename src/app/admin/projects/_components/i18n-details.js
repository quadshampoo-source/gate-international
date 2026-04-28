'use client';

import { useState } from 'react';
import { translateProjectField } from '../actions';

// Collapsible 5-locale editor (AR/ZH/RU/FA/FR) for fields that have a
// flagship EN field above. Reads the EN value at translate time directly
// from the form input named `fieldKey`, so the operator can edit EN, hit
// "Translate", then tweak the drafts before saving.

const TRANSLATION_LANGS = [
  { code: 'ar', label: 'العربية (AR)', dir: 'rtl' },
  { code: 'zh', label: '中文 (ZH)', dir: 'ltr' },
  { code: 'ru', label: 'Русский (RU)', dir: 'ltr' },
  { code: 'fa', label: 'فارسی (FA)', dir: 'rtl' },
  { code: 'fr', label: 'Français (FR)', dir: 'ltr' },
];

export default function I18nDetails({
  label,
  fieldKey,
  bundleKey,
  project,
  kind,
  rows,
  maxLength,
}) {
  const initialBundle = (project && project[bundleKey] && typeof project[bundleKey] === 'object')
    ? project[bundleKey]
    : {};
  const [values, setValues] = useState(() => {
    const init = {};
    for (const l of TRANSLATION_LANGS) init[l.code] = initialBundle[l.code] || '';
    return init;
  });
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const filled = TRANSLATION_LANGS.filter((l) => values[l.code]?.trim()).length;
  const translateKind = kind === 'textarea' ? 'long' : 'short';

  const onTranslate = async () => {
    setError(null);
    const enInput = document.querySelector(`[name="${fieldKey}"]`);
    const enText = (enInput?.value || '').trim();
    if (!enText) {
      setError('EN field above is empty — fill it first.');
      return;
    }
    setTranslating(true);
    try {
      const result = await translateProjectField(enText, translateKind);
      setValues((prev) => ({ ...prev, ...result }));
    } catch (e) {
      setError(e?.message || 'translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <details className="admin-row" style={{ marginTop: -8 }}>
      <summary style={{ cursor: 'pointer', fontSize: 13, padding: '6px 0' }}>
        {label} ({filled}/5 filled)
      </summary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={onTranslate}
            disabled={translating}
            className="admin-btn secondary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            {translating ? 'Translating…' : 'Translate from EN with AI'}
          </button>
          {error && (
            <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
          )}
          {!error && !translating && (
            <span style={{ fontSize: 11, color: 'var(--admin-fg-muted, #888)' }}>
              Existing entries are overwritten only for locales the model returns.
            </span>
          )}
        </div>
        {TRANSLATION_LANGS.map((l) => (
          <div key={l.code}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'var(--admin-fg-muted, #888)' }}>
              {l.label}
            </label>
            {kind === 'textarea' ? (
              <textarea
                name={`${fieldKey}_${l.code}`}
                value={values[l.code]}
                onChange={(e) => setValues((prev) => ({ ...prev, [l.code]: e.target.value }))}
                rows={rows || 6}
                dir={l.dir}
                className="admin-textarea"
              />
            ) : (
              <input
                name={`${fieldKey}_${l.code}`}
                value={values[l.code]}
                onChange={(e) => setValues((prev) => ({ ...prev, [l.code]: e.target.value }))}
                maxLength={maxLength}
                dir={l.dir}
                className="admin-input"
              />
            )}
          </div>
        ))}
      </div>
    </details>
  );
}

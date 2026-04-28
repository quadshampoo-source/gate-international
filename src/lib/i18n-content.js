import { DEFAULT_LOCALE } from '@/lib/i18n';

// Localized field reader for DB rows that follow the JSONB-locale-bundle
// convention. Read the migration in
// `supabase/migration_project_i18n_content.sql` for the column shape.
//
// Lookup priority:
//   1. row[key + '_i18n'][lang]              ← exact locale match
//   2. row[key + '_i18n'][DEFAULT_LOCALE]    ← English fallback inside the bundle
//   3. row[camelCase(key + '_i18n')][lang]   ← same, but camelCase shape
//   4. row[camelCase(key + '_i18n')][...]
//   5. row[camelCase(key)] / row[key]        ← legacy non-i18n column
//
// Components stay locale-agnostic — they accept the resolved value as
// a prop and don't know whether it came from the i18n bundle or the
// legacy column. Plays well with both server-rendered detail pages
// and the admin form (which writes the bundle directly via Supabase).

function camelCase(s) {
  return String(s).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function pickFromBundle(bundle, lang) {
  if (!bundle || typeof bundle !== 'object') return undefined;
  if (bundle[lang] != null && bundle[lang] !== '') return bundle[lang];
  if (bundle[DEFAULT_LOCALE] != null && bundle[DEFAULT_LOCALE] !== '') {
    return bundle[DEFAULT_LOCALE];
  }
  return undefined;
}

export function localizedField(row, key, lang = DEFAULT_LOCALE) {
  if (!row || !key) return null;
  const snakeI18n = `${key}_i18n`;
  const camelI18n = camelCase(snakeI18n);
  const fromSnakeBundle = pickFromBundle(row[snakeI18n], lang);
  if (fromSnakeBundle !== undefined) return fromSnakeBundle;
  const fromCamelBundle = pickFromBundle(row[camelI18n], lang);
  if (fromCamelBundle !== undefined) return fromCamelBundle;
  const camelKey = camelCase(key);
  if (row[camelKey] != null) return row[camelKey];
  if (row[key] != null) return row[key];
  return null;
}

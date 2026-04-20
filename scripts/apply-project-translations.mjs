// Apply project name + district translations to Supabase projects table.
// Requires the RU/FA/FR columns to exist (run migration_add_lang_columns.sql first).
// Usage: node scripts/apply-project-translations.mjs
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { PROJECT_TRANSLATIONS } from './project-translations.mjs';

// Inline district map (no TS/Next import machinery available here).
const DISTRICT_NAMES = {
  Sariyer:       { ru: 'Сарыер',       fa: 'ساری‌یر',    fr: 'Sarıyer' },
  'Beşiktaş':    { ru: 'Бешикташ',     fa: 'بشیکتاش',    fr: 'Beşiktaş' },
  'Beyoğlu':     { ru: 'Бейоглу',      fa: 'بی‌اوغلو',   fr: 'Beyoğlu' },
  'Şişli':       { ru: 'Шишли',        fa: 'شیشلی',      fr: 'Şişli' },
  'Üsküdar':     { ru: 'Ускюдар',      fa: 'اسکودار',    fr: 'Üsküdar' },
  Zekeriyaköy:   { ru: 'Зекериякёй',   fa: 'زکریاکوی',   fr: 'Zekeriyaköy' },
  Maslak:        { ru: 'Маслак',       fa: 'مسلک',       fr: 'Maslak' },
  Levent:        { ru: 'Левент',       fa: 'لوانت',      fr: 'Levent' },
  Kağıthane:     { ru: 'Кягытхане',    fa: 'کاغدهانه',   fr: 'Kağıthane' },
  Ataşehir:      { ru: 'Аташехир',     fa: 'آتاشهیر',    fr: 'Ataşehir' },
  'Göktürk':     { ru: 'Гёктюрк',      fa: 'گوک‌تورک',   fr: 'Göktürk' },
  'Güneşli':     { ru: 'Гюнешли',      fa: 'گونشلی',     fr: 'Güneşli' },
  Bodrum:        { ru: 'Бодрум',       fa: 'بدروم',      fr: 'Bodrum' },
  Bursa:         { ru: 'Бурса',        fa: 'بورسا',      fr: 'Bursa' },
  'Çekmeköy':    { ru: 'Чекмекёй',     fa: 'چکمه‌کوی',   fr: 'Çekmeköy' },
};

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Preflight — make sure the columns exist.
const preflight = await supabase.from('projects').select('id, name_ru, name_fa, name_fr, district_ru, district_fa, district_fr').limit(1);
if (preflight.error) {
  console.error('Preflight failed:', preflight.error.message);
  console.error('→ Run supabase/migration_add_lang_columns.sql in Supabase SQL Editor first.');
  process.exit(2);
}

// Load all projects from DB to match ids.
const { data: rows, error: selErr } = await supabase.from('projects').select('id, name, district');
if (selErr) {
  console.error('Select failed:', selErr);
  process.exit(1);
}

let applied = 0;
let skipped = 0;
const missing = [];

for (const row of rows) {
  const t = PROJECT_TRANSLATIONS[row.id];
  const d = DISTRICT_NAMES[row.district];
  if (!t) {
    missing.push(row.id);
    skipped += 1;
    continue;
  }
  const patch = {
    name_ru: t.ru,
    name_fa: t.fa,
    name_fr: t.fr,
    district_ru: d?.ru || null,
    district_fa: d?.fa || null,
    district_fr: d?.fr || null,
  };
  const { error } = await supabase.from('projects').update(patch).eq('id', row.id);
  if (error) {
    console.error(`✗ ${row.id} →`, error.message);
    skipped += 1;
  } else {
    applied += 1;
  }
}

console.log(`\nApplied: ${applied}`);
console.log(`Skipped: ${skipped}`);
if (missing.length) {
  console.log(`Missing translations for ids:`);
  missing.forEach((id) => console.log('  ' + id));
}

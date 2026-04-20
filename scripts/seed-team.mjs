// Seed placeholder team members. Idempotent: re-running only inserts names that aren't already present.
// Usage: node scripts/seed-team.mjs
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

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

// Placeholders — replace in /admin/team once infra is live.
const MEMBERS = [
  // ─── Istanbul ──────────────────────────────────────────────
  {
    name: 'Mehmet Yılmaz',
    title_en: 'Regional Manager',
    title_ar: 'المدير الإقليمي',
    title_zh: '区域经理',
    title_ru: 'Региональный директор',
    title_fa: 'مدیر منطقه‌ای',
    title_fr: 'Directeur régional',
    whatsapp_number: '905355206339',
    email: 'mehmet@gateinternational.co',
    languages: ['tr', 'en'],
    office: 'istanbul',
    sort_order: 10,
  },
  {
    name: 'Ayşe Demir',
    title_en: 'Sales Consultant',
    title_ar: 'مستشارة مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseillère commerciale',
    whatsapp_number: '905355206340',
    email: 'ayse@gateinternational.co',
    languages: ['tr', 'en'],
    office: 'istanbul',
    sort_order: 20,
  },
  {
    name: 'Emre Kaya',
    title_en: 'Sales Consultant',
    title_ar: 'مستشار مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseiller commercial',
    whatsapp_number: '905355206341',
    email: 'emre@gateinternational.co',
    languages: ['tr', 'ar'],
    office: 'istanbul',
    sort_order: 30,
  },

  // ─── Jeddah ────────────────────────────────────────────────
  {
    name: 'Abdullah Al-Harbi',
    title_en: 'Chief Executive Officer',
    title_ar: 'الرئيس التنفيذي',
    title_zh: '首席执行官',
    title_ru: 'Генеральный директор',
    title_fa: 'مدیرعامل',
    title_fr: 'Directeur général',
    whatsapp_number: '966500110830',
    email: 'abdullah@gateinternational.co',
    languages: ['ar', 'en'],
    office: 'jeddah',
    sort_order: 10,
  },
  {
    name: 'Khalid Al-Saud',
    title_en: 'Sales Consultant',
    title_ar: 'مستشار مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseiller commercial',
    whatsapp_number: '966500110831',
    email: 'khalid@gateinternational.co',
    languages: ['ar', 'en'],
    office: 'jeddah',
    sort_order: 20,
  },
  {
    name: 'Omar Al-Zahrani',
    title_en: 'Sales Consultant',
    title_ar: 'مستشار مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseiller commercial',
    whatsapp_number: '966500110832',
    email: 'omar@gateinternational.co',
    languages: ['ar'],
    office: 'jeddah',
    sort_order: 30,
  },

  // ─── Russian Desk ──────────────────────────────────────────
  {
    name: 'Dmitry Volkov',
    title_en: 'Sales Consultant',
    title_ar: 'مستشار مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseiller commercial',
    whatsapp_number: '905355206342',
    email: 'dmitry@gateinternational.co',
    languages: ['ru', 'en'],
    office: 'russian-desk',
    sort_order: 10,
  },

  // ─── Persian Desk ──────────────────────────────────────────
  {
    name: 'Reza Hosseini',
    title_en: 'Sales Consultant',
    title_ar: 'مستشار مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseiller commercial',
    whatsapp_number: '905355206343',
    email: 'reza@gateinternational.co',
    languages: ['fa', 'en'],
    office: 'persian-desk',
    sort_order: 10,
  },

  // ─── French Desk ───────────────────────────────────────────
  {
    name: 'Sophie Laurent',
    title_en: 'Sales Consultant',
    title_ar: 'مستشارة مبيعات',
    title_zh: '销售顾问',
    title_ru: 'Консультант по продажам',
    title_fa: 'مشاور فروش',
    title_fr: 'Conseillère commerciale',
    whatsapp_number: '905355206344',
    email: 'sophie@gateinternational.co',
    languages: ['fr', 'en'],
    office: 'french-desk',
    sort_order: 10,
  },
];

const { data: existing, error: selErr } = await supabase.from('team_members').select('name');
if (selErr) {
  console.error('Select failed:', selErr.message);
  process.exit(1);
}
const existingNames = new Set((existing || []).map((r) => r.name));

const toInsert = MEMBERS.filter((m) => !existingNames.has(m.name));
if (!toInsert.length) {
  console.log('✓ All placeholder members already present — nothing to insert.');
  process.exit(0);
}

const { data, error } = await supabase.from('team_members').insert(toInsert).select();
if (error) {
  console.error('Insert failed:', error.message);
  process.exit(1);
}

console.log(`✓ Inserted ${data.length} team members:`);
data.forEach((m) => console.log(`  - ${m.name} (${m.office})`));

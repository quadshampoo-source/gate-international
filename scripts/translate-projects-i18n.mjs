// Batch-translate every project's EN hero_tagline / description / amenities /
// faqs into AR / ZH / RU / FA / FR and write the locale bundles to the
// `*_i18n` jsonb columns.
//
// Prerequisites:
//   1. Apply supabase/migration_project_i18n_content.sql in Supabase SQL Editor.
//   2. Add OPENAI_API_KEY=sk-... to .env.local.
//
// Usage:
//   node scripts/translate-projects-i18n.mjs --dry-run --limit=1
//   node scripts/translate-projects-i18n.mjs --only=aman-bodrum
//   node scripts/translate-projects-i18n.mjs                # full run, skip already-translated locales
//   node scripts/translate-projects-i18n.mjs --force        # overwrite even already-translated locales
//
// Cost estimate at gpt-4o-mini rates: ~$0.05 per project across all 4 fields.
// Full 100-project run ≈ $5.

import { readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE env vars missing in .env.local'); process.exit(2);
}
if (!OPENAI_KEY) {
  console.error('OPENAI_API_KEY missing in .env.local'); process.exit(2);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const LIMIT = (() => {
  const a = args.find((x) => x.startsWith('--limit='));
  return a ? Math.max(1, parseInt(a.split('=')[1], 10)) : 0;
})();
const ONLY_ID = (() => {
  const a = args.find((x) => x.startsWith('--only='));
  return a ? a.split('=')[1] : null;
})();
const DUMP_DRY = (() => {
  const a = args.find((x) => x.startsWith('--dump='));
  return a ? a.split('=')[1] : null;
})();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TARGET_LANGS = ['ar', 'zh', 'ru', 'fa', 'fr'];

const SYSTEM_BASE = [
  'You translate Turkish real estate marketing copy from English into five target languages:',
  '- ar: Modern Standard Arabic',
  '- zh: Simplified Chinese',
  '- ru: Russian',
  '- fa: Persian (Farsi)',
  '- fr: French',
  '',
  'Style: refined, factual, luxury real-estate editorial. Translate idioms naturally — do not transliterate.',
  'Preserve any markdown formatting (headings, lists, bold, links) exactly as in the source.',
  'Do not translate proper nouns: project names, developer names, district names, neighbourhood names, brand names. Keep them in their original Latin script.',
  'Numbers, prices, areas (m²), dates: keep numerals as-is, translate only the units / surrounding words.',
].join('\n');

async function callOpenAI(systemSuffix, userText, { retries = 2 } = {}) {
  const body = {
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0.3,
    messages: [
      { role: 'system', content: SYSTEM_BASE + '\n\n' + systemSuffix },
      { role: 'user', content: userText },
    ],
  };
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        if ((res.status === 429 || res.status >= 500) && i < retries) {
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
          continue;
        }
        throw new Error(`OpenAI ${res.status}: ${t.slice(0, 250)}`);
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || '';
      try { return JSON.parse(content); }
      catch { throw new Error('Non-JSON response: ' + content.slice(0, 200)); }
    } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function translateString(text, { short = false } = {}) {
  const suffix = (short ? 'Keep each translation under 120 characters. ' : '')
    + 'Return JSON exactly: {"ar":"...","zh":"...","ru":"...","fa":"...","fr":"..."}.';
  const out = await callOpenAI(suffix, text);
  const result = {};
  for (const l of TARGET_LANGS) {
    if (typeof out[l] === 'string' && out[l].trim()) result[l] = out[l];
  }
  return result;
}

async function translateAmenities(items) {
  // Each item: { icon, label, description }. Translate label + description,
  // re-attach the technical icon code.
  const payload = items.map(({ label, description }) => ({ label: label || '', description: description || '' }));
  const suffix = [
    'Input is a JSON array of {label, description} objects. Translate each item.',
    'Return JSON exactly: {"ar":[...],"zh":[...],"ru":[...],"fa":[...],"fr":[...]} where each array has the SAME LENGTH and SAME ORDER as the input.',
    'Each output array element must be {"label":"...","description":"..."}.',
  ].join('\n');
  const out = await callOpenAI(suffix, JSON.stringify(payload));
  const result = {};
  for (const l of TARGET_LANGS) {
    if (!Array.isArray(out[l]) || out[l].length !== items.length) continue;
    result[l] = items.map((src, i) => ({
      icon: src.icon,
      label: out[l][i]?.label || src.label,
      description: out[l][i]?.description || src.description,
    }));
  }
  return result;
}

async function translateFaqs(items) {
  const payload = items.map(({ question, answer }) => ({ question: question || '', answer: answer || '' }));
  const suffix = [
    'Input is a JSON array of {question, answer} objects. Translate each item.',
    'Return JSON exactly: {"ar":[...],"zh":[...],"ru":[...],"fa":[...],"fr":[...]} where each array has the SAME LENGTH and SAME ORDER as the input.',
    'Each output array element must be {"question":"...","answer":"..."}.',
  ].join('\n');
  const out = await callOpenAI(suffix, JSON.stringify(payload));
  const result = {};
  for (const l of TARGET_LANGS) {
    if (!Array.isArray(out[l]) || out[l].length !== items.length) continue;
    result[l] = out[l].map((it, i) => ({
      question: it?.question || items[i].question,
      answer: it?.answer || items[i].answer,
    }));
  }
  return result;
}

function bundleHasNonEn(bundle) {
  if (!bundle || typeof bundle !== 'object') return false;
  return TARGET_LANGS.some((l) => {
    const v = bundle[l];
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return false;
  });
}

const dryDump = [];

async function processProject(p) {
  const updates = {};
  const log = [];

  // hero_tagline
  if (p.hero_tagline) {
    if (FORCE || !bundleHasNonEn(p.hero_tagline_i18n)) {
      try {
        const t = await translateString(p.hero_tagline, { short: true });
        updates.hero_tagline_i18n = { en: p.hero_tagline, ...t };
        log.push(`    hero_tagline ✓ (${Object.keys(t).join(',')})`);
      } catch (e) { log.push(`    hero_tagline ✗ ${e.message}`); }
    } else log.push('    hero_tagline · skip (already populated)');
  }

  // description
  if (p.description) {
    if (FORCE || !bundleHasNonEn(p.description_i18n)) {
      try {
        const t = await translateString(p.description);
        updates.description_i18n = { en: p.description, ...t };
        log.push(`    description ✓ (${Object.keys(t).join(',')})`);
      } catch (e) { log.push(`    description ✗ ${e.message}`); }
    } else log.push('    description · skip');
  }

  // amenities (array)
  if (Array.isArray(p.amenities) && p.amenities.length) {
    if (FORCE || !bundleHasNonEn(p.amenities_i18n)) {
      try {
        const t = await translateAmenities(p.amenities);
        updates.amenities_i18n = { en: p.amenities, ...t };
        log.push(`    amenities ✓ (${p.amenities.length} items × ${Object.keys(t).length} langs)`);
      } catch (e) { log.push(`    amenities ✗ ${e.message}`); }
    } else log.push('    amenities · skip');
  }

  // faqs (array)
  if (Array.isArray(p.faqs) && p.faqs.length) {
    if (FORCE || !bundleHasNonEn(p.faqs_i18n)) {
      try {
        const t = await translateFaqs(p.faqs);
        updates.faqs_i18n = { en: p.faqs, ...t };
        log.push(`    faqs ✓ (${p.faqs.length} items × ${Object.keys(t).length} langs)`);
      } catch (e) { log.push(`    faqs ✗ ${e.message}`); }
    } else log.push('    faqs · skip');
  }

  for (const line of log) console.log(line);

  if (Object.keys(updates).length === 0) return false;

  if (DRY_RUN) {
    dryDump.push({ id: p.id, name: p.name, updates });
    console.log(`    [DRY RUN] would update: ${Object.keys(updates).join(', ')}`);
    return true;
  }

  const { error } = await supabase.from('projects').update(updates).eq('id', p.id);
  if (error) {
    console.log(`    ✗ DB UPDATE FAILED: ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  // Preflight — confirm the i18n columns actually exist.
  const probe = await supabase.from('projects').select('id, hero_tagline_i18n').limit(1);
  if (probe.error) {
    console.error('Preflight failed:', probe.error.message);
    console.error('→ Run supabase/migration_project_i18n_content.sql in Supabase SQL Editor first.');
    process.exit(2);
  }

  let q = supabase.from('projects').select('id,name,hero_tagline,description,amenities,faqs,hero_tagline_i18n,description_i18n,amenities_i18n,faqs_i18n').order('id');
  if (ONLY_ID) q = q.eq('id', ONLY_ID);
  const { data, error } = await q;
  if (error) { console.error(error); process.exit(1); }

  const projects = LIMIT > 0 ? data.slice(0, LIMIT) : data;
  console.log(`Processing ${projects.length} project(s) — DRY_RUN=${DRY_RUN} FORCE=${FORCE}`);
  console.log('');

  let processed = 0;
  let updated = 0;
  for (const p of projects) {
    processed++;
    console.log(`[${processed}/${projects.length}] ${p.id}  (${p.name})`);
    const did = await processProject(p);
    if (did) updated++;
  }

  console.log('');
  console.log(`Done. processed=${processed} updated=${updated} (DRY_RUN=${DRY_RUN})`);

  if (DUMP_DRY && dryDump.length) {
    writeFileSync(DUMP_DRY, JSON.stringify(dryDump, null, 2));
    console.log(`Dry-run output dumped to ${DUMP_DRY}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import { supabaseAdmin } from '@/lib/supabase/admin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gateinternational.co';

const STATIC_ROUTES = [
  '',
  '/projects',
  '/finder',
  '/services',
  '/citizenship',
  '/compare',
  '/calculator',
  '/why-us',
  '/about',
  '/contact',
  '/districts',
];

const buildAlternates = (path) => {
  const languages = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;
  return { languages };
};

export default async function sitemap() {
  const now = new Date();
  const entries = [];

  for (const path of STATIC_ROUTES) {
    for (const lang of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${lang}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: buildAlternates(path),
      });
    }
  }

  try {
    const admin = supabaseAdmin();
    const { data } = await admin.from('projects').select('id, updated_at');
    for (const row of data || []) {
      const path = `/project/${row.id}`;
      for (const lang of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${lang}${path}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch {}

  return entries;
}

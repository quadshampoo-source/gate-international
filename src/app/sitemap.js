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

// Project images aren't stored on the row directly — they live in the
// jsonb columns. Pull whatever's there, dedupe and cap at 6 (Google's
// soft limit per <image:image> entry to keep the sitemap lean).
function pickProjectImages(row) {
  const out = [];
  for (const key of ['exterior_images', 'exteriorImages', 'gallery']) {
    const arr = row[key];
    if (Array.isArray(arr)) for (const u of arr) if (u) out.push(u);
  }
  if (row.img) out.push(row.img);
  return [...new Set(out)].slice(0, 6);
}

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
    // Pull image columns too so the sitemap can advertise property
    // photos via the <image:image> extension — feeds Google Images
    // discoverability for the visual real-estate queries our buyers run.
    const { data } = await admin
      .from('projects')
      .select('id, updated_at, img, exterior_images, gallery');
    for (const row of data || []) {
      const path = `/project/${row.id}`;
      const images = pickProjectImages(row);
      for (const lang of LOCALES) {
        const entry = {
          url: `${SITE_URL}/${lang}${path}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: buildAlternates(path),
        };
        if (images.length) entry.images = images;
        entries.push(entry);
      }
    }
  } catch {}

  return entries;
}

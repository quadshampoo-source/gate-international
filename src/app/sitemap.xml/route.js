import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Custom sitemap handler instead of Next's MetadataRoute.Sitemap helper —
// the helper does not emit the <image:image> extension (no xmlns:image
// namespace, no per-url image children). Real-estate listings live or die
// by Google Images discovery, so we serve raw XML here with the image
// extension wired up properly.
//
// Output structure: 12 static routes + N projects, all multiplied by 6
// locales, every entry carrying the full hreflang block (6 + x-default).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gateinternational.co';

const STATIC_ROUTES = [
  { path: '',                   changefreq: 'weekly',  priority: 1.0 },
  { path: '/projects',          changefreq: 'monthly', priority: 0.8 },
  { path: '/finder',            changefreq: 'monthly', priority: 0.8 },
  { path: '/services',          changefreq: 'monthly', priority: 0.8 },
  { path: '/citizenship',       changefreq: 'monthly', priority: 0.8 },
  { path: '/compare',           changefreq: 'monthly', priority: 0.8 },
  { path: '/calculator',        changefreq: 'monthly', priority: 0.8 },
  { path: '/why-us',            changefreq: 'monthly', priority: 0.8 },
  { path: '/about',             changefreq: 'monthly', priority: 0.8 },
  { path: '/contact',           changefreq: 'monthly', priority: 0.8 },
  // /districts (the parent listing) intentionally omitted — no page.js
  // exists for it, so the route returned 404 in the previous sitemap.
  { path: '/districts/bodrum',  changefreq: 'monthly', priority: 0.8 },
  { path: '/districts/bursa',   changefreq: 'monthly', priority: 0.8 },
];

function pickProjectImages(row) {
  const out = [];
  for (const key of ['exterior_images', 'exteriorImages', 'gallery']) {
    const arr = row[key];
    if (Array.isArray(arr)) for (const u of arr) if (u) out.push(u);
  }
  if (row.img) out.push(row.img);
  return [...new Set(out)].slice(0, 6);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function alternatesBlock(path) {
  let out = '';
  for (const l of LOCALES) {
    out += `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${path}" />`;
  }
  out += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LOCALE}${path}" />`;
  return out;
}

function urlEntry({ loc, lastmod, changefreq, priority, alternates, images }) {
  let imgs = '';
  if (images && images.length) {
    for (const u of images) {
      imgs += `\n    <image:image><image:loc>${escapeXml(u)}</image:loc></image:image>`;
    }
  }
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${alternates}${imgs}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();
  const parts = [];
  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
    ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' +
    ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  );

  for (const route of STATIC_ROUTES) {
    const alts = alternatesBlock(route.path);
    for (const lang of LOCALES) {
      parts.push(urlEntry({
        loc: `${SITE_URL}/${lang}${route.path}`,
        lastmod: now,
        changefreq: route.changefreq,
        priority: route.priority,
        alternates: alts,
      }));
    }
  }

  try {
    const admin = supabaseAdmin();
    const { data } = await admin
      .from('projects')
      .select('id, updated_at, img, exterior_images, gallery');
    for (const row of data || []) {
      const path = `/project/${row.id}`;
      const images = pickProjectImages(row);
      const lastmod = row.updated_at ? new Date(row.updated_at).toISOString() : now;
      const alts = alternatesBlock(path);
      for (const lang of LOCALES) {
        parts.push(urlEntry({
          loc: `${SITE_URL}/${lang}${path}`,
          lastmod,
          changefreq: 'weekly',
          priority: 0.7,
          alternates: alts,
          images,
        }));
      }
    }
  } catch {}

  parts.push('</urlset>');

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

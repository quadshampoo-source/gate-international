import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

// All SEO helpers reach for the same site URL.
// Falls back to the production hostname when the env is missing in dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gateinternational.co';

// Open Graph locale map — Facebook / LinkedIn use IETF region-tagged
// codes, not bare ISO 639-1 ones. Keep this single source of truth so
// every page emits matching `og:locale` + `og:locale:alternate` values.
export const OG_LOCALE_MAP = {
  en: 'en_US',
  ar: 'ar_AR',
  zh: 'zh_CN',
  ru: 'ru_RU',
  fa: 'fa_IR',
  fr: 'fr_FR',
};

/**
 * Absolute URL for a given path on a given locale.
 * @param {string} path - Path WITHOUT the locale prefix, leading slash optional.
 * @param {string} lang - One of LOCALES.
 */
export function localeUrl(path = '', lang = DEFAULT_LOCALE) {
  const clean = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${SITE_URL}/${lang}${clean}`;
}

/**
 * Reciprocal hreflang alternates for a single path across every locale,
 * plus an x-default pointing at the default locale. Pass the result
 * straight into `metadata.alternates.languages`.
 *
 * @param {string} path - Path WITHOUT the locale prefix, leading slash optional.
 */
export function buildHreflangAlternates(path = '') {
  const clean = path.startsWith('/') ? path : path ? `/${path}` : '';
  const languages = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`;
  return languages;
}

/**
 * `og:locale:alternate` list for a given active locale — every other
 * locale in OG_LOCALE_MAP.
 */
export function buildAlternateLocales(activeLang) {
  return LOCALES
    .filter((l) => l !== activeLang)
    .map((l) => OG_LOCALE_MAP[l])
    .filter(Boolean);
}

/**
 * Pick the locale-specific display name for a project. Falls back to the
 * canonical English `name` when a translation is missing. The DB shape uses
 * `name_ar` / `name_zh` etc.; `data.js fromRow()` maps those to camelCase
 * `nameAr` / `nameZh`, so we accept both shapes.
 */
export function localizedProjectName(project, lang = DEFAULT_LOCALE) {
  if (!project) return '';
  const camel = { ar: 'nameAr', zh: 'nameZh', ru: 'nameRu', fa: 'nameFa', fr: 'nameFr' };
  const snake = { ar: 'name_ar', zh: 'name_zh', ru: 'name_ru', fa: 'name_fa', fr: 'name_fr' };
  return (
    (camel[lang] && project[camel[lang]])
      || (snake[lang] && project[snake[lang]])
      || project.name
      || ''
  );
}

/**
 * Build a complete metadata object for a content page (project, district,
 * etc.). Centralises canonical + hreflang + Open Graph + Twitter so callers
 * stay short and consistent. `path` is locale-free ("/project/foo").
 *
 * Returns a value suitable to `return` straight from `generateMetadata`.
 */
export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  image,
  imageAlt,
  type = 'website',
  siteName = 'Gate International',
}) {
  const canonical = localeUrl(path, lang);
  const og = {
    type,
    locale: OG_LOCALE_MAP[lang] || OG_LOCALE_MAP[DEFAULT_LOCALE],
    alternateLocale: buildAlternateLocales(lang),
    url: canonical,
    siteName,
    title,
    description,
  };
  if (image) {
    og.images = [
      { url: image, width: 1200, height: 630, alt: imageAlt || title },
    ];
  }
  const twitter = {
    card: 'summary_large_image',
    title,
    description,
  };
  if (image) twitter.images = [image];
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
    openGraph: og,
    twitter,
  };
}

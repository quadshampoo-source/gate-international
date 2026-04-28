import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import { localizedField } from '@/lib/i18n-content';

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
  titleAbsolute = false,
  description,
  image,
  imageAlt,
  type = 'website',
  siteName = 'Gate International',
}) {
  const canonical = localeUrl(path, lang);
  // titleAbsolute=true short-circuits the layout's `%s | Gate International`
  // template — used by the home page where the title already includes the
  // brand and we don't want it duplicated.
  const titleField = titleAbsolute ? { absolute: title } : title;
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
    title: titleField,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
    openGraph: og,
    twitter,
  };
}

// ──────────────────────────────────────────────────────────────────────
// JSON-LD schema builders
//
// Pure data — render via <JsonLd data={...} /> from
// `@/components/seo/json-ld`. All builders return objects; the component
// handles serialisation. Optional fields are omitted (rather than left
// empty) so Google doesn't flag missing/empty values.
// ──────────────────────────────────────────────────────────────────────

const ORG_DESCRIPTION =
  'Gate International — boutique real-estate advisory for premium residences across Istanbul, Bodrum and Bursa. Citizenship-eligible properties, in-house legal, native-speaker desks in 6 languages.';

/**
 * RealEstateAgent / Organization schema. Render once, in the root layout,
 * so every page carries it. Lang only affects `inLanguage` — the brand,
 * URL and contact data are locale-stable.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Gate International',
    alternateName: 'Gate International Properties',
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    image: `${SITE_URL}/apple-icon`,
    description: ORG_DESCRIPTION,
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Maslak 1453, Tower A',
        addressLocality: 'Sarıyer',
        addressRegion: 'Istanbul',
        addressCountry: 'TR',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'King Fahd Road, Al Olaya',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+90-535-520-6339',
        contactType: 'sales',
        areaServed: ['TR', 'AE', 'SA', 'CN', 'RU', 'IR', 'FR'],
        availableLanguage: ['English', 'Turkish', 'Arabic', 'Chinese', 'Russian', 'Persian', 'French'],
      },
    ],
    sameAs: [
      'https://instagram.com/gate.international',
      'https://wa.me/905355206339',
    ],
  };
}

/**
 * WebSite + SearchAction schema for the home page only. Tells search
 * engines the canonical site name and exposes a sitelinks search box
 * pointing at the projects list with district query param.
 */
export function websiteSchema(lang = DEFAULT_LOCALE) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gate International',
    url: SITE_URL,
    inLanguage: LOCALES,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${lang}/projects?district={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Residence schema for a single project page. Maps the DB project row
 * onto Schema.org's residential listing fields. Fields with no data are
 * omitted so Google's parser doesn't reject the block.
 */
export function residenceSchema(project, lang = DEFAULT_LOCALE) {
  if (!project) return null;
  const url = localeUrl(`/project/${project.id}`, lang);
  const images = [];
  if (Array.isArray(project.exteriorImages)) images.push(...project.exteriorImages);
  if (Array.isArray(project.exterior_images)) images.push(...project.exterior_images);
  if (Array.isArray(project.gallery)) images.push(...project.gallery);
  if (project.img) images.push(project.img);
  const dedupedImages = [...new Set(images.filter(Boolean))].slice(0, 6);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: localizedProjectName(project, lang),
    url,
  };
  if (dedupedImages.length) schema.image = dedupedImages;

  // Prefer per-locale tagline → per-locale description → legacy English.
  const tagline = localizedField(project, 'hero_tagline', lang);
  const longText = localizedField(project, 'description', lang);
  const description = (tagline || longText || '').toString().trim();
  if (description) schema.description = description.slice(0, 320);

  // Address — Bodrum/Bursa rows store the city in `district`; Istanbul
  // rows store the neighbourhood there.
  const isCityRow = ['Bodrum', 'Bursa'].includes(project.district);
  const sub = project.subDistrict || project.sub_district;
  const locality = isCityRow ? sub || project.district : project.district || sub;
  const region = isCityRow ? project.district : 'Istanbul';
  if (locality) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: region,
      addressCountry: 'TR',
    };
  }

  if (project.bedrooms) schema.numberOfRooms = Number(project.bedrooms) || project.bedrooms;
  if (project.bathrooms) schema.numberOfBathroomsTotal = Number(project.bathrooms) || project.bathrooms;
  if (project.area) {
    schema.floorSize = {
      '@type': 'QuantitativeValue',
      value: Number(project.area) || project.area,
      unitCode: 'MTK', // square metres
    };
  }

  const price = project.priceUsd ?? project.price_usd;
  if (price && Number(price) > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: Number(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    };
  }

  if (project.developer) {
    schema.brand = { '@type': 'Brand', name: project.developer };
  }

  return schema;
}

/**
 * FAQPage schema. Pass an array of `{question, answer}` (legacy `q`/`a`
 * keys also accepted to match dict shapes). Eligible for Google's
 * "People also ask" SERP feature when content is substantive (>~50 chars
 * per answer) and matches what's visible on the page.
 */
export function faqSchema(items = []) {
  if (!Array.isArray(items)) return null;
  const cleaned = items
    .map((it) => {
      const question = (it?.question || it?.q || '').trim();
      const answer = (it?.answer || it?.a || '').trim();
      if (!question || !answer) return null;
      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      };
    })
    .filter(Boolean);
  if (cleaned.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cleaned,
  };
}

/**
 * BreadcrumbList schema. Pass an ordered list of `{name, url}` items.
 * The last item's `url` is optional (Google treats omission as "current
 * page"); both shapes are accepted.
 */
export function breadcrumbSchema(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const node = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
      };
      if (item.url) node.item = item.url;
      return node;
    }),
  };
}

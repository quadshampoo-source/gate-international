import { notFound } from 'next/navigation';
import DetailClient from '@/components/detail-client';
import EditorialProjectDetail from '@/components/editorial/project-detail';
import AtomProjectDetail from '@/components/atom/project-detail';
import { LOCALES, getDict } from '@/lib/i18n';
import { PROJECTS } from '@/lib/projects';
import { getProject, getProjects } from '@/lib/data';
import { getActiveTheme } from '@/lib/theme';
import {
  buildPageMetadata,
  localizedProjectName,
  residenceSchema,
  breadcrumbSchema,
  faqSchema,
  localeUrl,
} from '@/lib/seo';
import JsonLd from '@/components/seo/json-ld';

export const revalidate = 60;

export function generateStaticParams() {
  const params = [];
  for (const lang of LOCALES) {
    for (const p of PROJECTS) {
      params.push({ lang, id: p.id });
    }
  }
  return params;
}

// Prefer hero_tagline (concise marketing line) → first line of description
// → location-derived fallback. Truncated to ~160 chars so Google snippets
// stay clean.
function deriveDescription(project) {
  const fromTagline = (project.heroTagline || project.hero_tagline || '').trim();
  if (fromTagline) return fromTagline.slice(0, 160);
  const fromDesc = (project.description || '').trim();
  if (fromDesc) {
    const first = fromDesc.split(/\n+/)[0].replace(/[#*_>`]/g, '').trim();
    if (first) return first.slice(0, 160);
  }
  const district = project.district || project.subDistrict || project.sub_district;
  const developer = project.developer ? ` by ${project.developer}` : '';
  if (district) return `${project.name}${developer} — premium residence in ${district}, Turkey.`;
  return `${project.name}${developer} — Gate International.`;
}

function pickHeroImage(project) {
  if (Array.isArray(project.exteriorImages) && project.exteriorImages[0]) return project.exteriorImages[0];
  if (Array.isArray(project.exterior_images) && project.exterior_images[0]) return project.exterior_images[0];
  if (Array.isArray(project.gallery) && project.gallery[0]) return project.gallery[0];
  return project.img || null;
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Not Found' };

  const localName = localizedProjectName(project, lang);
  const district = project.district || project.subDistrict || project.sub_district;
  const title = district ? `${localName} — ${district}` : localName;
  const description = deriveDescription(project);
  const image = pickHeroImage(project);

  return buildPageMetadata({
    lang,
    path: `/project/${id}`,
    title,
    description,
    image,
    imageAlt: localName,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { lang, id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  const [all, theme] = await Promise.all([getProjects(), getActiveTheme()]);

  // Structured data — Residence + BreadcrumbList + FAQPage (when the
  // project has its own FAQ block). Residence powers Google's listing
  // rich result; the breadcrumb populates the SERP path; FAQPage opens
  // up the "People also ask" expansion below the main result.
  const dict = getDict(lang);
  const residence = residenceSchema(project, lang);
  const localName = localizedProjectName(project, lang);
  const breadcrumb = breadcrumbSchema([
    { name: dict.brand, url: localeUrl('', lang) },
    { name: dict.nav?.projects || 'Residences', url: localeUrl('/projects', lang) },
    { name: localName },
  ]);
  const faq = faqSchema(project.faqs);

  const themed = (() => {
    if (theme === 'atom') return <AtomProjectDetail project={project} lang={lang} allProjects={all} />;
    if (theme === 'editorial') return <EditorialProjectDetail project={project} lang={lang} allProjects={all} />;
    return <DetailClient project={project} lang={lang} allProjects={all} />;
  })();

  return (
    <>
      {residence && <JsonLd data={residence} />}
      {breadcrumb && <JsonLd data={breadcrumb} />}
      {faq && <JsonLd data={faq} />}
      {themed}
    </>
  );
}

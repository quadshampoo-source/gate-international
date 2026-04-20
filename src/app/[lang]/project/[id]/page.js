import { notFound } from 'next/navigation';
import DetailClient from '@/components/detail-client';
import EditorialProjectDetail from '@/components/editorial/project-detail';
import { LOCALES } from '@/lib/i18n';
import { PROJECTS } from '@/lib/projects';
import { getProject, getProjects } from '@/lib/data';
import { getActiveTheme } from '@/lib/theme';

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

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return { title: `${project.name} — Gate International` };
}

export default async function ProjectDetailPage({ params }) {
  const { lang, id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  const [all, theme] = await Promise.all([getProjects(), getActiveTheme()]);
  if (theme === 'editorial') {
    return <EditorialProjectDetail project={project} lang={lang} allProjects={all} />;
  }
  return <DetailClient project={project} lang={lang} allProjects={all} />;
}

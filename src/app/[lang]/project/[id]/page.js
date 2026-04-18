import { notFound } from 'next/navigation';
import DetailClient from '@/components/detail-client';
import { LOCALES } from '@/lib/i18n';
import { PROJECTS } from '@/lib/projects';

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
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return {};
  return { title: `${project.name} — Gate International` };
}

export default async function ProjectDetailPage({ params }) {
  const { lang, id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) notFound();
  return <DetailClient project={project} lang={lang} />;
}

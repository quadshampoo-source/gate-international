import { Suspense } from 'react';
import ProjectsClient from '@/components/projects-client';
import EditorialProjects from '@/components/editorial/projects';
import { getProjects } from '@/lib/data';
import { getActiveTheme } from '@/lib/theme';

export const revalidate = 60;

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  const [projects, theme] = await Promise.all([getProjects(), getActiveTheme()]);
  if (theme === 'editorial') {
    return <EditorialProjects lang={lang} projects={projects} />;
  }
  return (
    <Suspense fallback={<div className="pt-[180px] container-x">Loading…</div>}>
      <ProjectsClient lang={lang} projects={projects} />
    </Suspense>
  );
}

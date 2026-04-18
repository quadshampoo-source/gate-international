import { Suspense } from 'react';
import ProjectsClient from '@/components/projects-client';
import { getProjects } from '@/lib/data';

export const revalidate = 60;

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  const projects = await getProjects();
  return (
    <Suspense fallback={<div className="pt-[180px] container-x">Loading…</div>}>
      <ProjectsClient lang={lang} projects={projects} />
    </Suspense>
  );
}

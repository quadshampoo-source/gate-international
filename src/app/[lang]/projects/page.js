import { Suspense } from 'react';
import ProjectsClient from '@/components/projects-client';
import EditorialProjects from '@/components/editorial/projects';
import AtomProjectsList from '@/components/atom/projects-list';
import { getProjects } from '@/lib/data';
import { getActiveTheme } from '@/lib/theme';
import { getSiteSettings } from '@/lib/site-settings';

export const revalidate = 60;

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  const [projects, theme] = await Promise.all([getProjects(), getActiveTheme()]);
  if (theme === 'atom') {
    return (
      <Suspense fallback={<div className="pt-[180px] px-6">Loading…</div>}>
        <AtomProjectsList lang={lang} projects={projects} />
      </Suspense>
    );
  }
  if (theme === 'editorial') {
    return (
      <Suspense fallback={<div className="pt-[180px] container-x">Loading…</div>}>
        <EditorialProjects lang={lang} projects={projects} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div className="pt-[180px] container-x">Loading…</div>}>
      <ProjectsClient lang={lang} projects={projects} />
    </Suspense>
  );
}

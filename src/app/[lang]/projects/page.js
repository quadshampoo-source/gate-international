import { Suspense } from 'react';
import ProjectsClient from '@/components/projects-client';

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  return (
    <Suspense fallback={<div className="pt-[180px] container-x">Loading…</div>}>
      <ProjectsClient lang={lang} />
    </Suspense>
  );
}

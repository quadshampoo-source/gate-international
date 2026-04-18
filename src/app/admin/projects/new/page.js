import AdminFrame from '../../_components/frame';
import ProjectForm from '../form';
import { currentUser } from '@/lib/supabase/server';
import { createProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage({ searchParams }) {
  const user = await currentUser();
  const sp = await searchParams;
  return (
    <AdminFrame active="projects" userEmail={user?.email}>
      <h1>New project</h1>
      {sp?.error && <div className="text-[#ef4444] text-sm mb-4">Error: {sp.error}</div>}
      <ProjectForm action={createProject} isNew />
    </AdminFrame>
  );
}

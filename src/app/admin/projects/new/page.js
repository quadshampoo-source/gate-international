import { redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import ProjectForm from '../form';
import { currentProfile } from '@/lib/supabase/server';
import { createProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin/projects');

  const sp = await searchParams;
  return (
    <AdminFrame active="projects" userEmail={ctx.profile.email} role="admin">
      <h1>New project</h1>
      {sp?.error && <div className="text-[#ef4444] text-sm mb-4">Error: {sp.error}</div>}
      <ProjectForm action={createProject} isNew />
    </AdminFrame>
  );
}

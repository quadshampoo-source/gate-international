import { notFound, redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import ProjectForm from '../form';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateProject, deleteProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role === 'pending') redirect('/admin/pending');

  // Editors may only open projects assigned to them.
  if (ctx.profile.role === 'editor' && !ctx.assignedProjectIds.includes(id)) {
    return (
      <AdminFrame active="projects" userEmail={ctx.profile.email} role="editor">
        <h1>Not authorised</h1>
        <p className="text-fg-muted text-sm">
          This project is not assigned to your account. Please request access from the
          Gate International team.
        </p>
      </AdminFrame>
    );
  }

  const client = supabaseAdmin();
  const { data } = await client.from('projects').select('*').eq('id', id).single();
  if (!data) notFound();

  return (
    <AdminFrame active="projects" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <h1>{data.name}</h1>
      {sp?.error && <div className="text-[#ef4444] text-sm mb-4">Error: {sp.error}</div>}
      <ProjectForm
        action={updateProject}
        project={data}
        deleteAction={ctx.profile.role === 'admin' ? deleteProject : null}
      />
    </AdminFrame>
  );
}

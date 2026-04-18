import { notFound } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import ProjectForm from '../form';
import { currentUser } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateProject, deleteProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await currentUser();
  const client = supabaseAdmin();
  const { data } = await client.from('projects').select('*').eq('id', id).single();
  if (!data) notFound();

  return (
    <AdminFrame active="projects" userEmail={user?.email}>
      <h1>{data.name}</h1>
      {sp?.error && <div className="text-[#ef4444] text-sm mb-4">Error: {sp.error}</div>}
      <ProjectForm action={updateProject} project={data} deleteAction={deleteProject} />
    </AdminFrame>
  );
}

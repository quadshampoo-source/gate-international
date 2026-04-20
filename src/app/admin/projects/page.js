import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import ProjectListClient from './_components/list-client';

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role === 'pending') redirect('/admin/pending');

  const admin = supabaseAdmin();
  let query = admin
    .from('projects')
    .select('id, name, district, developer, price_usd, status, category, sort_index')
    .order('sort_index', { ascending: true });

  // Editors only see their assigned projects.
  if (ctx.profile.role === 'editor') {
    if (ctx.assignedProjectIds.length === 0) {
      return (
        <AdminFrame active="projects" userEmail={ctx.profile.email} role={ctx.profile.role}>
          <h1>My Projects</h1>
          <div className="border border-line p-10 text-center text-fg-muted">
            No projects have been assigned to you yet. Please contact the Gate International team.
          </div>
        </AdminFrame>
      );
    }
    query = query.in('id', ctx.assignedProjectIds);
  }

  const { data } = await query;
  const rows = data || [];
  const isAdminRole = ctx.profile.role === 'admin';

  return (
    <AdminFrame active="projects" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">
          {isAdminRole ? 'Projects' : 'My Projects'} ({rows.length})
        </h1>
        {isAdminRole && (
          <Link href="/admin/projects/new" className="admin-btn">+ New project</Link>
        )}
      </div>
      {rows.length === 0 && isAdminRole ? (
        <div className="border border-line p-10 text-center text-fg-muted">
          No projects yet. Run the seed script or add one.
        </div>
      ) : (
        <ProjectListClient initialProjects={rows} canReorder={isAdminRole} />
      )}
    </AdminFrame>
  );
}

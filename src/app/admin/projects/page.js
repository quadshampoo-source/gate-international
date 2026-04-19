import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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
      <div className="border border-line overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>District</th>
              <th>Developer</th>
              <th>Price (USD)</th>
              <th>Status</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-fg-muted">{String(i + 1).padStart(2, '0')}</td>
                <td>
                  <Link href={`/admin/projects/${p.id}`} className="hover:text-gold">{p.name}</Link>
                </td>
                <td>{p.district}</td>
                <td className="text-fg-muted">{p.developer || '—'}</td>
                <td className="font-mono">{p.price_usd ? `$${Number(p.price_usd).toLocaleString()}` : '—'}</td>
                <td className="text-xs font-mono uppercase tracking-wider">{p.status || '—'}</td>
                <td className="text-xs text-fg-muted">{p.category || '—'}</td>
                <td className="text-right">
                  <Link href={`/admin/projects/${p.id}`} className="text-xs text-gold hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && isAdminRole && (
              <tr><td colSpan={8} className="text-center py-10 text-fg-muted">No projects yet. Run the seed script or add one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}

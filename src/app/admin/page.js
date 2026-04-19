import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from './_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role === 'pending') redirect('/admin/pending');

  const client = supabaseAdmin();
  const isAdminRole = ctx.profile.role === 'admin';

  let projectCount = 0;
  if (isAdminRole) {
    const { count } = await client.from('projects').select('*', { count: 'exact', head: true });
    projectCount = count ?? 0;
  } else {
    projectCount = ctx.assignedProjectIds.length;
  }

  let pendingCount = 0;
  if (isAdminRole) {
    const { count } = await client
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'pending');
    pendingCount = count ?? 0;
  }

  return (
    <AdminFrame active="dashboard" role={ctx.profile.role} userEmail={ctx.profile.email}>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card
          label={isAdminRole ? 'Total projects' : 'Your projects'}
          value={projectCount}
          href="/admin/projects"
        />
        <Card label="Role" value={ctx.profile.role.toUpperCase()} />
        {isAdminRole && (
          <Card
            label="Pending approvals"
            value={pendingCount}
            href="/admin/users"
            alert={pendingCount > 0}
          />
        )}
        {!isAdminRole && <Card label="Email" value={ctx.profile.email} />}
      </div>
      <p className="text-fg-muted text-sm max-w-[560px]">
        {isAdminRole
          ? 'Manage projects, approve new editors from the Users page, and control site-wide settings.'
          : 'You can edit projects assigned to you. Contact the Gate International team for additional access.'}
      </p>
    </AdminFrame>
  );
}

function Card({ label, value, href, alert }) {
  const body = (
    <div className={`bg-bg-raised border p-5 ${alert ? 'border-gold bg-gold/10' : 'border-line'}`}>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-2">{label}</div>
      <div className="font-serif text-[28px] tracking-tight break-words">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="block hover:border-gold/40">{body}</Link> : body;
}

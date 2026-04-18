import Link from 'next/link';
import AdminFrame from './_components/frame';
import { currentUser } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await currentUser();
  const client = supabaseAdmin();
  const { count } = await client.from('projects').select('*', { count: 'exact', head: true });

  return (
    <AdminFrame active="dashboard" userEmail={user?.email}>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card label="Total projects" value={count ?? 0} href="/admin/projects" />
        <Card label="Logged in as" value={user?.email} />
        <Card label="Environment" value={process.env.NODE_ENV} />
      </div>
      <p className="text-fg-muted text-sm max-w-[560px]">
        MVP scope: projects CRUD. Other modules (testimonials, blog, leads, media uploads) will follow in Phase 3.
      </p>
    </AdminFrame>
  );
}

function Card({ label, value, href }) {
  const body = (
    <div className="bg-bg-raised border border-line p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-2">{label}</div>
      <div className="font-serif text-[28px] tracking-tight break-words">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="block hover:border-gold/40">{body}</Link> : body;
}

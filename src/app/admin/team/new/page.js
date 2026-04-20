import { redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import TeamForm from '../form';
import { createMember } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewTeamMemberPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const err = sp?.error ? decodeURIComponent(sp.error) : null;

  return (
    <AdminFrame active="team" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <h1>New team member</h1>
      <TeamForm action={createMember} error={err} submitLabel="Create" />
    </AdminFrame>
  );
}

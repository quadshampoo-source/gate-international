import { redirect, notFound } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getTeamMember } from '@/lib/team';
import TeamForm from '../form';
import { updateMember, deleteMember } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditTeamMemberPage({ params, searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const { id } = await params;
  const sp = await searchParams;
  const err = sp?.error ? decodeURIComponent(sp.error) : null;
  const member = await getTeamMember(id);
  if (!member) notFound();

  return (
    <AdminFrame active="team" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Edit {member.name}</h1>
        <form action={deleteMember}>
          <input type="hidden" name="id" value={member.id} />
          <button type="submit" className="admin-btn secondary text-[#ef4444]">Delete</button>
        </form>
      </div>
      <TeamForm action={updateMember} member={member} error={err} submitLabel="Save changes" />
    </AdminFrame>
  );
}

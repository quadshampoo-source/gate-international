import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getAllTeamMembers } from '@/lib/team';
import { OFFICE_FLAGS, LANG_FLAGS } from '@/lib/team-constants';
import { deleteMember } from './actions';

export const dynamic = 'force-dynamic';

export default async function TeamAdminPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const members = await getAllTeamMembers();

  return (
    <AdminFrame active="team" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Team ({members.length})</h1>
        <Link href="/admin/team/new" className="admin-btn">+ New member</Link>
      </div>

      {sp?.saved === '1' && (
        <div className="mb-5 text-[13px] text-gold">✓ Saved.</div>
      )}
      {sp?.removed === '1' && (
        <div className="mb-5 text-[13px] text-fg-muted">Member removed.</div>
      )}
      {sp?.error && (
        <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>
      )}

      <div className="border border-line overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Office</th>
              <th>Languages</th>
              <th>WhatsApp</th>
              <th>Email</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id}>
                <td className="font-mono text-xs text-fg-muted">{String(i + 1).padStart(2, '0')}</td>
                <td>
                  <Link href={`/admin/team/${m.id}`} className="hover:text-gold">{m.name}</Link>
                </td>
                <td className="text-fg-muted">{OFFICE_FLAGS[m.office] || '🌍'} {m.office}</td>
                <td>{(m.languages || []).map((l) => LANG_FLAGS[l] || '🌐').join(' ')}</td>
                <td className="font-mono text-xs">{m.whatsapp_number || '—'}</td>
                <td className="text-fg-muted text-xs">{m.email || '—'}</td>
                <td>{m.active ? '✓' : '—'}</td>
                <td className="text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <Link href={`/admin/team/${m.id}`} className="text-xs text-gold hover:underline">Edit</Link>
                    <form action={deleteMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="text-xs text-fg-muted hover:text-[#ef4444]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-fg-muted">
                  No team members yet. Add one, or run <code>node scripts/seed-team.mjs</code> for placeholders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}

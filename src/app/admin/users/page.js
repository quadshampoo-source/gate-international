import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { approveUser, rejectUser, updateAssignments } from './actions';

export const dynamic = 'force-dynamic';

export default async function UsersPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const admin = supabaseAdmin();

  const [{ data: profiles }, { data: projects }, { data: assignments }] = await Promise.all([
    admin.from('profiles').select('*').order('created_at', { ascending: false }),
    admin.from('projects').select('id, name, district').order('sort_index'),
    admin.from('editor_projects').select('user_id, project_id'),
  ]);

  const assignmentMap = new Map();
  for (const a of assignments || []) {
    const set = assignmentMap.get(a.user_id) || new Set();
    set.add(a.project_id);
    assignmentMap.set(a.user_id, set);
  }

  const pending = (profiles || []).filter((p) => p.role === 'pending');
  const active = (profiles || []).filter((p) => p.role !== 'pending');

  return (
    <AdminFrame active="users" userEmail={ctx.profile.email} role="admin">
      <h1>Users</h1>

      {sp?.saved && <Banner color="green">Saved.</Banner>}
      {sp?.removed && <Banner color="green">User removed.</Banner>}
      {sp?.error && <Banner color="red">Error: {decodeURIComponent(sp.error)}</Banner>}

      {pending.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b]" />
            <h2 className="font-serif text-[22px]">Pending approval ({pending.length})</h2>
          </div>
          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-sm p-4 mb-4 text-[13px] text-[#f5d08a]">
            New signups start with <b>pending</b>. Review their details, set a role, and
            assign the projects they can manage.
          </div>
          <div className="space-y-4">
            {pending.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                projects={projects || []}
                assignedIds={[]}
                defaultOpen
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-serif text-[22px] mb-4">Active users ({active.length})</h2>
        {active.length === 0 ? (
          <p className="text-fg-muted text-sm">No active users yet.</p>
        ) : (
          <div className="space-y-4">
            {active.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                projects={projects || []}
                assignedIds={Array.from(assignmentMap.get(u.id) || [])}
              />
            ))}
          </div>
        )}
      </section>
    </AdminFrame>
  );
}

function Banner({ color, children }) {
  const map = {
    green: 'text-[#4ade80] border-[#4ade80]/40 bg-[#4ade80]/10',
    red: 'text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10',
  };
  return (
    <div className={`border rounded-sm p-3 mb-5 text-[13px] ${map[color]}`}>{children}</div>
  );
}

function UserRow({ user, projects, assignedIds, defaultOpen = false }) {
  const roleLabel = user.role === 'admin' ? 'ADMIN' : user.role === 'editor' ? 'EDITOR' : 'PENDING';
  const roleColour =
    user.role === 'admin' ? 'text-gold border-gold/50' :
    user.role === 'editor' ? 'text-[#4ade80] border-[#4ade80]/40' :
    'text-[#f59e0b] border-[#f59e0b]/40';

  return (
    <details open={defaultOpen} className="border border-line rounded-sm bg-bg-raised">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer">
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`font-mono text-[10px] tracking-[0.16em] uppercase px-2 py-1 border ${roleColour}`}>
            {roleLabel}
          </span>
          <div>
            <div className="font-serif text-[17px]">{user.full_name || '—'}</div>
            <div className="text-[12px] text-fg-muted">{user.email}</div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-fg-dim">
          {user.company || ''} {user.phone ? `· ${user.phone}` : ''}
        </div>
      </summary>

      <div className="px-5 pb-5 border-t border-line bg-bg">
        <form action={user.role === 'pending' ? approveUser : updateAssignments} className="mt-4">
          <input type="hidden" name="user_id" value={user.id} />

          {user.role === 'pending' && (
            <div className="admin-row">
              <label>Role</label>
              <select name="role" defaultValue="editor" className="admin-select max-w-[200px]">
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <div className="admin-row">
            <label>Projects</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 max-h-[300px] overflow-y-auto border border-line p-3 bg-bg-raised">
              {projects.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-[12px] py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="project_ids"
                    value={p.id}
                    defaultChecked={assignedIds.includes(p.id)}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="truncate">{p.name} <span className="text-fg-dim">· {p.district}</span></span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="admin-btn">
              {user.role === 'pending' ? 'Approve' : 'Save assignments'}
            </button>
            {user.role !== 'admin' && (
              <form action={rejectUser} className="inline">
                <input type="hidden" name="user_id" value={user.id} />
                <button type="submit" className="admin-btn danger">
                  {user.role === 'pending' ? 'Reject' : 'Delete user'}
                </button>
              </form>
            )}
          </div>
        </form>
      </div>
    </details>
  );
}

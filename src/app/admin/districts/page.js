import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { toggleDistrictVisibility } from './actions';

export const dynamic = 'force-dynamic';

export default async function DistrictsAdminPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const admin = supabaseAdmin();

  const [{ data: districts }, { data: projects }] = await Promise.all([
    admin.from('districts').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    admin.from('projects').select('district'),
  ]);

  const counts = new Map();
  for (const p of projects || []) {
    const key = (p.district || '').trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows = (districts || []).map((d) => ({ ...d, count: counts.get(d.name) || 0 }));

  return (
    <AdminFrame active="districts" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Districts ({rows.length})</h1>
      </div>

      {sp?.saved === '1' && (
        <div className="mb-5 text-[13px] text-gold">✓ Saved.</div>
      )}
      {sp?.error && (
        <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>
      )}

      {rows.length === 0 ? (
        <div className="border border-line p-10 text-center text-fg-muted">
          No districts yet. Run <code>node scripts/create-districts-table.mjs</code> to see the SQL to run in Supabase, then refresh.
        </div>
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>City</th>
                <th>Projects</th>
                <th>Visible</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs text-fg-muted">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    {d.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={d.image} alt="" className="w-14 h-14 object-cover border border-line" />
                    ) : (
                      <div className="w-14 h-14 border border-line bg-bg-raised" />
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/districts/${d.slug}`} className="hover:text-gold">{d.name}</Link>
                  </td>
                  <td className="font-mono text-xs text-fg-muted">{d.slug}</td>
                  <td className="text-fg-muted">{d.city}</td>
                  <td className="font-mono">{d.count}</td>
                  <td>
                    <form action={toggleDistrictVisibility}>
                      <input type="hidden" name="slug" value={d.slug} />
                      <input type="hidden" name="next" value={d.is_visible ? '0' : '1'} />
                      <button
                        type="submit"
                        className={`text-xs font-mono ${d.is_visible ? 'text-gold' : 'text-fg-muted'}`}
                      >
                        {d.is_visible ? '✓ visible' : '— hidden'}
                      </button>
                    </form>
                  </td>
                  <td className="font-mono text-xs">{d.sort_order}</td>
                  <td className="text-right">
                    <Link href={`/admin/districts/${d.slug}`} className="text-xs text-gold hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminFrame>
  );
}

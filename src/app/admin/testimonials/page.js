import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getAllTestimonials } from '@/lib/testimonials';
import { deleteTestimonial } from './actions';

export const dynamic = 'force-dynamic';

export default async function TestimonialsAdminPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const rows = await getAllTestimonials();

  return (
    <AdminFrame active="testimonials" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Testimonials ({rows.length})</h1>
        <Link href="/admin/testimonials/new" className="admin-btn">+ New testimonial</Link>
      </div>

      {sp?.saved === '1' && <div className="mb-5 text-[13px] text-gold">✓ Saved.</div>}
      {sp?.removed === '1' && <div className="mb-5 text-[13px] text-fg-muted">Testimonial removed.</div>}
      {sp?.error && <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>}

      <div className="border border-line overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Quote</th>
              <th>Lang</th>
              <th>Sort</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="font-mono text-xs text-fg-muted">{String(i + 1).padStart(2, '0')}</td>
                <td><Link href={`/admin/testimonials/${r.id}`} className="hover:text-gold">{r.name}</Link></td>
                <td className="text-fg-muted text-xs">{r.role || '—'}</td>
                <td className="text-fg-muted text-xs max-w-[320px] truncate">{r.quote}</td>
                <td className="font-mono text-xs uppercase">{r.lang || '—'}</td>
                <td className="font-mono text-xs">{r.sort_order}</td>
                <td>{r.active ? '✓' : '—'}</td>
                <td className="text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <Link href={`/admin/testimonials/${r.id}`} className="text-xs text-gold hover:underline">Edit</Link>
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="text-xs text-fg-muted hover:text-[#ef4444]">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-fg-muted">
                  No testimonials yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}

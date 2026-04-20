import { redirect, notFound } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getTestimonial } from '@/lib/testimonials';
import TestimonialForm from '../form';
import { updateTestimonial, deleteTestimonial } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({ params, searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const { id } = await params;
  const sp = await searchParams;
  const err = sp?.error ? decodeURIComponent(sp.error) : null;
  const row = await getTestimonial(id);
  if (!row) notFound();

  return (
    <AdminFrame active="testimonials" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Edit testimonial</h1>
        <form action={deleteTestimonial}>
          <input type="hidden" name="id" value={row.id} />
          <button type="submit" className="admin-btn secondary text-[#ef4444]">Delete</button>
        </form>
      </div>
      <TestimonialForm action={updateTestimonial} row={row} error={err} submitLabel="Save changes" />
    </AdminFrame>
  );
}

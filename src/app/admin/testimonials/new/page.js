import { redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import TestimonialForm from '../form';
import { createTestimonial } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewTestimonialPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');
  const sp = await searchParams;
  const err = sp?.error ? decodeURIComponent(sp.error) : null;
  return (
    <AdminFrame active="testimonials" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <h1>New testimonial</h1>
      <TestimonialForm action={createTestimonial} error={err} submitLabel="Create" />
    </AdminFrame>
  );
}

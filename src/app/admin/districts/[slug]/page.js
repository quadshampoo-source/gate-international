import { redirect, notFound } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import DistrictForm from '../form';
import { updateDistrict } from '../actions';

export const dynamic = 'force-dynamic';

export default async function DistrictEditPage({ params, searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const { slug } = await params;
  const sp = await searchParams;
  const admin = supabaseAdmin();
  const { data: district } = await admin.from('districts').select('*').eq('slug', slug).single();
  if (!district) notFound();

  return (
    <AdminFrame active="districts" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">{district.name}</h1>
      </div>
      {sp?.error && (
        <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>
      )}
      <DistrictForm action={updateDistrict} district={district} />
    </AdminFrame>
  );
}

import { redirect } from 'next/navigation';
import AdminFrame from '../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import PasswordForm from './password-form';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role === 'pending') redirect('/admin/pending');

  return (
    <AdminFrame active="account" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <h1>Account</h1>

      <section className="max-w-[560px] mb-10">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-2">
          Signed in as
        </div>
        <div className="font-serif text-[22px]">{ctx.profile.email}</div>
        <div className="font-mono text-[11px] text-fg-dim mt-2 uppercase tracking-[0.14em]">
          Role · {ctx.profile.role}
        </div>
      </section>

      <section className="max-w-[560px]">
        <h2 className="font-serif text-[22px] mb-5">Change password</h2>
        <PasswordForm />
      </section>
    </AdminFrame>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/supabase/server';
import { logout } from '../login/actions';

export const dynamic = 'force-dynamic';

export default async function PendingPage() {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'pending') redirect('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[520px] border border-line bg-bg-raised p-10 text-center">
        <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold mx-auto mb-6 text-2xl">⏳</div>
        <h1 className="font-serif text-[26px] mb-4">Awaiting approval</h1>
        <p className="text-fg-muted text-[14px] leading-relaxed mb-6">
          Your account <span className="text-fg">{ctx.profile.email}</span> is registered but
          not yet activated. An administrator is reviewing your request and will set your
          role (editor, partner) and assign the projects you can manage.
        </p>
        <p className="text-fg-dim text-[12px] mb-8">
          You will receive an email once access is granted. For urgent requests, reach us on
          WhatsApp at <span className="text-gold">+90 535 520 6339</span>.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="admin-btn secondary">Back to site</Link>
          <form action={logout}>
            <button className="admin-btn secondary" type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </div>
  );
}

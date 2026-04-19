import Link from 'next/link';
import { logout } from '../login/actions';

const NAV = [
  { k: 'dashboard', label: 'Dashboard', href: '/admin' },
  { k: 'projects', label: 'Projects', href: '/admin/projects' },
  { k: 'settings', label: 'Site Settings', href: '/admin/settings' },
];

export default function AdminFrame({ active, userEmail, children }) {
  return (
    <>
      <div className="admin-topbar">
        <div className="flex items-center gap-4">
          <div className="admin-brand">GATE <em>·</em> ADMIN</div>
          <Link href="/" className="text-xs text-fg-muted hover:text-gold">← back to site</Link>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-fg-muted">{userEmail}</span>
          <form action={logout}>
            <button className="admin-btn secondary" type="submit">Sign out</button>
          </form>
        </div>
      </div>
      <div className="admin-grid">
        <aside className="admin-side">
          {NAV.map((n) => (
            <Link key={n.k} href={n.href} className={active === n.k ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}

import Link from 'next/link';
import { logout } from '../login/actions';

const NAV_ADMIN = [
  { k: 'dashboard', label: 'Dashboard', href: '/admin' },
  { k: 'projects', label: 'Projects', href: '/admin/projects' },
  { k: 'districts', label: 'Districts', href: '/admin/districts' },
  { k: 'team', label: 'Team', href: '/admin/team' },
  { k: 'testimonials', label: 'Testimonials', href: '/admin/testimonials' },
  { k: 'users', label: 'Users', href: '/admin/users' },
  { k: 'settings', label: 'Site Settings', href: '/admin/settings' },
  { k: 'account', label: 'Account', href: '/admin/account' },
];

const NAV_EDITOR = [
  { k: 'dashboard', label: 'Dashboard', href: '/admin' },
  { k: 'projects', label: 'My Projects', href: '/admin/projects' },
  { k: 'account', label: 'Account', href: '/admin/account' },
];

export default function AdminFrame({ active, userEmail, role = 'editor', children }) {
  const nav = role === 'admin' ? NAV_ADMIN : NAV_EDITOR;
  return (
    <>
      <div className="admin-topbar">
        <div className="flex items-center gap-4">
          <div className="admin-brand">GATE <em>·</em> ADMIN</div>
          <Link href="/" className="text-xs text-fg-muted hover:text-gold">← back to site</Link>
          {role && role !== 'admin' && (
            <span className="text-[10px] font-mono tracking-[0.16em] text-gold uppercase border border-gold/40 px-2 py-0.5">
              {role}
            </span>
          )}
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
          {nav.map((n) => (
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

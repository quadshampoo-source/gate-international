// Thin wrapper for Atom inner pages. The outer chrome (nav + footer) now
// comes from `components/shells/atom-shell.js` via the global ThemeShell in
// [lang]/layout.js — this only provides top padding for nav clearance on
// pages whose content starts without a hero of its own.
export default function AtomShell({ children, containerless = false }) {
  return (
    <div className={containerless ? '' : 'pt-24 md:pt-32'}>
      {children}
    </div>
  );
}

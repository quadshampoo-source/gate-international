import AtomShell from './shells/atom-shell';
import EditorialShell from './shells/editorial-shell';
import ClassicShell from './shells/classic-shell';
import LegacyShell from './shells/legacy-shell';

// Single exclusive resolver — only one shell ever mounts per render. Unknown
// theme values fall back to Atom so the site never ends up header-less.
const SHELLS = {
  atom: AtomShell,
  editorial: EditorialShell,
  legacy: LegacyShell,
  classic: ClassicShell,
  cinematic: ClassicShell,
};

export default async function ThemeShell({ theme = 'atom', lang = 'en', children }) {
  const Shell = SHELLS[theme] ?? SHELLS.atom;
  // Cinematic shares the classic Header/Footer branch — pass the theme through
  // so the existing components can still read it.
  return <Shell lang={lang} theme={theme}>{children}</Shell>;
}

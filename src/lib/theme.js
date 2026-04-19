import { supabaseServer } from '@/lib/supabase/server';

export const THEMES = [
  { key: 'classic', label: 'Classic', description: 'Current editorial design — dark with gold hairlines.' },
  { key: 'cinematic', label: 'Cinematic', description: 'Liquid glass surfaces, animated gradient orbs, softer motion.' },
  { key: 'minimal', label: 'Minimal', description: 'Coming soon — reduced palette, print-inspired.' },
];

export const DEFAULT_THEME = 'classic';

// Read the active theme from DB. Falls back to DEFAULT_THEME on error.
export async function getActiveTheme() {
  try {
    const s = await supabaseServer();
    const { data, error } = await s
      .from('site_settings')
      .select('active_theme')
      .eq('id', 1)
      .single();
    if (error || !data) return DEFAULT_THEME;
    return data.active_theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

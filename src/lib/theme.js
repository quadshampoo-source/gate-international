import { supabaseServer } from '@/lib/supabase/server';

export const THEMES = [
  { key: 'classic', label: 'Classic', description: 'Dark, gold hairlines — the flagship portfolio aesthetic.' },
  { key: 'cinematic', label: 'Cinematic', description: 'Liquid glass surfaces, animated gradient orbs, softer motion.' },
  { key: 'editorial', label: 'Gate', description: 'The flagship Gate International theme — white ground, serif + mono, pill glass navigation.' },
  { key: 'legacy', label: 'Legacy Editorial', description: 'Cormorant Garamond + warm cream. Hero with search bar overlap, city ticker, editorial long-form.' },
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

import { cache } from 'react';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Read the singleton site_settings row (id = 1).
 * React.cache dedupes across a single render so every server component
 * that asks gets the same answer without a second DB hit.
 *
 * Returned shape:
 *   { activeTheme, logoUrl, logoAlt, updatedAt }
 * Any field may be null/undefined when the row/column is empty.
 */
export const getSiteSettings = cache(async () => {
  try {
    const s = await supabaseServer();
    const { data } = await s
      .from('site_settings')
      .select('active_theme, logo_url, logo_alt, updated_at')
      .eq('id', 1)
      .single();
    if (!data) return { activeTheme: null, logoUrl: null, logoAlt: null, updatedAt: null };
    return {
      activeTheme: data.active_theme || null,
      logoUrl: data.logo_url || null,
      logoAlt: data.logo_alt || null,
      updatedAt: data.updated_at || null,
    };
  } catch {
    return { activeTheme: null, logoUrl: null, logoAlt: null, updatedAt: null };
  }
});

/**
 * Convenience helper used by navbars — returns just the logo pair so
 * callers don't have to destructure.
 */
export async function getLogo() {
  const s = await getSiteSettings();
  return { logoUrl: s.logoUrl, logoAlt: s.logoAlt };
}

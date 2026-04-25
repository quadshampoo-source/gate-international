import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';

const DEFAULTS = {
  activeTheme: null,
  logoUrl: null,
  logoAlt: null,
  heroVersion: 'v1',
  heroImageUrl: null,
  heroImageMobileUrl: null,
  heroOverlayOpacity: 0.4,
  updatedAt: null,
};

/**
 * Read the singleton site_settings row (id = 1).
 *
 * Uses the service-role client so newly-added columns are always readable
 * regardless of column-level grants — Supabase's anon role doesn't
 * automatically inherit SELECT on columns added via later ALTER TABLE
 * migrations, which silently broke hero_* reads. The data here is
 * non-sensitive site config that's already exposed in rendered HTML, so
 * service-role for a server-only read is acceptable.
 *
 * React.cache dedupes across a single render.
 */
export const getSiteSettings = cache(async () => {
  try {
    const s = supabaseAdmin();
    const { data } = await s
      .from('site_settings')
      .select('active_theme, logo_url, logo_alt, hero_version, hero_image_url, hero_image_mobile_url, hero_overlay_opacity, updated_at')
      .eq('id', 1)
      .single();
    if (!data) return { ...DEFAULTS };
    return {
      activeTheme: data.active_theme || null,
      logoUrl: data.logo_url || null,
      logoAlt: data.logo_alt || null,
      heroVersion: data.hero_version === 'v2' ? 'v2' : 'v1',
      heroImageUrl: data.hero_image_url || null,
      heroImageMobileUrl: data.hero_image_mobile_url || null,
      heroOverlayOpacity:
        data.hero_overlay_opacity != null ? Number(data.hero_overlay_opacity) : 0.4,
      updatedAt: data.updated_at || null,
    };
  } catch {
    return { ...DEFAULTS };
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

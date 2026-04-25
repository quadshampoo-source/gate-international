-- Hero banner — feature-flagged image background for the atom home hero.
--
-- Adds 4 columns to the singleton site_settings row (id = 1):
--   hero_version          'v1' (legacy gradient) | 'v2' (image background)
--   hero_image_url        Desktop image URL — public Supabase Storage
--   hero_image_mobile_url Optional mobile-specific image; falls back to desktop
--   hero_overlay_opacity  Dark overlay alpha 0..1 — improves text legibility
--
-- Defaults keep the site on v1; the admin can flip to v2 once images are
-- uploaded. Beğenmezsek tek tıkla v1'e geri dönüş.

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_version TEXT DEFAULT 'v1'
    CHECK (hero_version IN ('v1', 'v2')),
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_mobile_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_overlay_opacity NUMERIC DEFAULT 0.4
    CHECK (hero_overlay_opacity >= 0 AND hero_overlay_opacity <= 1);

-- Storage bucket for hero images. Public so the public site can render them
-- without signed URLs. Idempotent — re-running is a no-op.
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-banner', 'hero-banner', true)
ON CONFLICT (id) DO NOTHING;

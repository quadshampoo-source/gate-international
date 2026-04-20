-- Split project galleries into exterior vs. interior. Run once in Supabase
-- → SQL Editor. Existing `gallery` column is kept for backwards compatibility;
-- the frontend falls back to it for exterior images when no separate list
-- has been set yet, so nothing breaks on unmigrated rows.

alter table public.projects
  add column if not exists exterior_images jsonb,
  add column if not exists interior_images jsonb;

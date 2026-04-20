-- Add gallery column to public.projects. Run once in Supabase → SQL Editor.
-- vimeo_id already exists (from original schema.sql).

alter table public.projects
  add column if not exists gallery jsonb;

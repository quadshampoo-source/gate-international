-- Add YouTube URL column to projects. Run once in Supabase → SQL Editor.

alter table public.projects
  add column if not exists youtube_url text;

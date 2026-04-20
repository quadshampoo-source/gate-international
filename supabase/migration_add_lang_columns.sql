-- Adds RU / FA / FR translation columns to public.projects.
-- Run once in Supabase → SQL Editor.

alter table public.projects
  add column if not exists name_ru text,
  add column if not exists name_fa text,
  add column if not exists name_fr text,
  add column if not exists district_ru text,
  add column if not exists district_fa text,
  add column if not exists district_fr text;

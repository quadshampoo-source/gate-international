-- Adds the reels jsonb column for the Project Reels (YouTube Shorts) feature.
-- Re-runnable. Other 96 projects keep `reels = null` until populated.

alter table public.projects
  add column if not exists reels jsonb;

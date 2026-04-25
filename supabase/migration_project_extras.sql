-- Adds 4 columns used by the Rixos Tersane sync (March 2026 price list).
-- All nullable so other 96 projects remain valid without backfill.
-- Re-runnable.

alter table public.projects
  add column if not exists tech_specs        jsonb,
  add column if not exists master_plan_url   text,
  add column if not exists price_note        text,
  add column if not exists price_last_updated date;

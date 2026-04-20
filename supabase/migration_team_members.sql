-- Team members table + public team-photos storage bucket.
-- Run once in Supabase → SQL Editor. Storage bucket is created programmatically
-- by scripts/seed-team.mjs (service-role).

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title_en text,
  title_ar text,
  title_zh text,
  title_ru text,
  title_fa text,
  title_fr text,
  photo_url text,
  whatsapp_number text,           -- E.164 without leading + (e.g., 905355206339)
  email text,
  languages text[] not null default '{}', -- e.g., ['tr','en','ar']
  office text not null,           -- istanbul | jeddah | china | russian-desk | persian-desk | french-desk | remote
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists team_members_office_idx on public.team_members(office);
create index if not exists team_members_sort_idx on public.team_members(sort_order);

alter table public.team_members enable row level security;

drop policy if exists "team public read" on public.team_members;
create policy "team public read" on public.team_members
  for select
  to anon, authenticated
  using (active = true);

-- Writes happen via service role (admin server actions).

drop trigger if exists team_members_touch_updated_at on public.team_members;
create trigger team_members_touch_updated_at
  before update on public.team_members
  for each row execute function public.touch_updated_at();

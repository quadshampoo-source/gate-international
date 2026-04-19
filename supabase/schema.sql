-- Gate International — initial schema
-- Run once in Supabase SQL editor (or via CLI).

create table if not exists public.projects (
  id text primary key,
  sort_index int not null default 0,
  name text not null,
  name_ar text,
  name_zh text,
  district text not null,
  district_ar text,
  district_zh text,
  sub_district text,
  developer text,
  architect text,
  price_usd bigint,
  bedrooms int,
  area int,
  typology text,
  market text,
  view text,
  delivery text,
  status text,
  category text,
  metro boolean default false,
  img text,
  vimeo_id text,
  total_units int,
  blocks int,
  land_area int,
  unit_types jsonb,
  payment_plan jsonb,
  price_table jsonb,
  distances jsonb,
  reasons jsonb,
  china_score int,
  arab_score int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists projects_district_idx on public.projects(district);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_category_idx on public.projects(category);
create index if not exists projects_sort_idx on public.projects(sort_index);
create index if not exists projects_sub_district_idx on public.projects(sub_district);

-- If the table existed before these columns were added, this no-ops; otherwise it catches older databases.
alter table public.projects add column if not exists sub_district text;
alter table public.projects add column if not exists architect text;

-- RLS: public can read; writes only for service role (used from server actions).
alter table public.projects enable row level security;

drop policy if exists "projects public read" on public.projects;
create policy "projects public read" on public.projects
  for select
  to anon, authenticated
  using (true);

-- No write policies needed: service-role bypasses RLS.
-- Authenticated users cannot write unless service role is used.

-- Updated-at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ==========================
-- Site settings (single row)
-- ==========================
create table if not exists public.site_settings (
  id int primary key default 1,
  active_theme text not null default 'classic',
  brand_tagline_override text,
  updated_at timestamptz default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id, active_theme)
  values (1, 'classic')
  on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

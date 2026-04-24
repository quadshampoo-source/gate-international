-- Districts table + seed. Run once in Supabase → SQL Editor.
-- Idempotent: safe to re-run. Does not override admin-managed is_visible flags.

create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_ar text,
  name_zh text,
  slug text not null unique,
  city text default 'Istanbul',
  image text,
  sort_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create index if not exists districts_sort_idx on public.districts(sort_order);
create index if not exists districts_city_idx on public.districts(city);

alter table public.districts enable row level security;

drop policy if exists "districts public read" on public.districts;
create policy "districts public read" on public.districts
  for select
  to anon, authenticated
  using (is_visible = true);

-- Writes via service role from admin server actions.

-- Seed from the canonical static list in src/lib/projects.js (DISTRICTS).
-- Order matches the static array so UI ordering is stable when DB is first populated.
insert into public.districts (name, slug, city, sort_order) values
  ('Maslak',    'maslak',    'Istanbul', 1),
  ('Beşiktaş',  'besiktas',  'Istanbul', 2),
  ('Levent',    'levent',    'Istanbul', 3),
  ('Beyoğlu',   'beyoglu',   'Istanbul', 4),
  ('Kağıthane', 'kagithane', 'Istanbul', 5),
  ('Şişli',     'sisli',     'Istanbul', 6),
  ('Ataşehir',  'atasehir',  'Istanbul', 7),
  ('Sariyer',   'sariyer',   'Istanbul', 8),
  ('Üsküdar',   'uskudar',   'Istanbul', 9),
  ('Göktürk',   'gokturk',   'Istanbul', 10),
  ('Güneşli',   'gunesli',   'Istanbul', 11),
  ('Çekmeköy',  'cekmekoy',  'Istanbul', 12),
  ('Bodrum',    'bodrum',    'Bodrum',   13),
  ('Bursa',     'bursa',     'Bursa',    14)
on conflict (name) do nothing;

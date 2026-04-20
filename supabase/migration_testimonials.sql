-- Testimonials table. Run once in Supabase → SQL Editor.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,                  -- e.g. "Private Investor · Riyadh"
  quote text not null,
  photo_url text,
  lang text,                  -- optional source language hint (e.g. 'ar') for RTL rendering
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists testimonials_sort_idx on public.testimonials(sort_order);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select
  to anon, authenticated
  using (active = true);

-- Writes via service role from admin server actions.

drop trigger if exists testimonials_touch_updated_at on public.testimonials;
create trigger testimonials_touch_updated_at
  before update on public.testimonials
  for each row execute function public.touch_updated_at();

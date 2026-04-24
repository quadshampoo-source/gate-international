-- Adds Bodrum and Bursa sub-districts to the districts table so the hero
-- search cascade and the admin form can offer neighborhood-level picks for
-- those cities. Existing 'Bodrum' and 'Bursa' rows are left in place.
-- Idempotent: safe to re-run.

insert into public.districts (name, slug, city, sort_order) values
  ('Yalıkavak',     'yalikavak',     'Bodrum', 20),
  ('Göltürkbükü',   'golturkbuku',   'Bodrum', 21),
  ('Gölköy',        'golkoy',        'Bodrum', 22),
  ('Turgutreis',    'turgutreis',    'Bodrum', 23),
  ('Torba',         'torba',         'Bodrum', 24),
  ('Güvercinlik',   'guvercinlik',   'Bodrum', 25),
  ('Adabükü',       'adabuku',       'Bodrum', 26),
  ('Yalı Koyu',     'yali-koyu',     'Bodrum', 27),
  ('Demirbuku',     'demirbuku',     'Bodrum', 28),
  ('Bodrum Merkez', 'bodrum-merkez', 'Bodrum', 29),
  ('Nilüfer',       'nilufer',       'Bursa',  40),
  ('Mudanya',       'mudanya',       'Bursa',  41),
  ('Osmangazi',     'osmangazi',     'Bursa',  42),
  ('Yıldırım',      'yildirim',      'Bursa',  43),
  ('Gemlik',        'gemlik',        'Bursa',  44)
on conflict (name) do nothing;

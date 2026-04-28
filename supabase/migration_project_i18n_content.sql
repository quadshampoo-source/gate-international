-- Project content localization — JSONB locale bundles.
--
-- Adds four jsonb columns that store the same content per locale:
--
--   description_i18n   { "en": "...", "ar": "...", "zh": "...", ... }
--   hero_tagline_i18n  { "en": "...", "ar": "...", ... }
--   amenities_i18n     { "en": [{icon,label,description}], "ar": [...], ... }
--   faqs_i18n          { "en": [{question,answer}], "ar": [...], ... }
--
-- Reads in the app fall back to the existing legacy column (`description`
-- / `hero_tagline` / `amenities` / `faqs`) when the i18n bundle is empty
-- or missing the active locale. So old data keeps rendering exactly as
-- before; new locales kick in when populated.
--
-- Re-runnable. Safe on every existing project row (defaults to '{}').

alter table public.projects
  add column if not exists description_i18n   jsonb default '{}'::jsonb,
  add column if not exists hero_tagline_i18n  jsonb default '{}'::jsonb,
  add column if not exists amenities_i18n     jsonb default '{}'::jsonb,
  add column if not exists faqs_i18n          jsonb default '{}'::jsonb;

-- Backfill the i18n bundles with the existing English content so any row
-- that already has a description / hero_tagline / amenities / faqs gets
-- a populated `en` key. Operators can then translate into ar/zh/ru/fa/fr
-- by editing the jsonb value.
update public.projects
   set description_i18n = jsonb_build_object('en', description)
 where description is not null
   and (description_i18n is null or description_i18n = '{}'::jsonb);

update public.projects
   set hero_tagline_i18n = jsonb_build_object('en', hero_tagline)
 where hero_tagline is not null
   and (hero_tagline_i18n is null or hero_tagline_i18n = '{}'::jsonb);

update public.projects
   set amenities_i18n = jsonb_build_object('en', amenities)
 where amenities is not null
   and jsonb_typeof(amenities) = 'array'
   and (amenities_i18n is null or amenities_i18n = '{}'::jsonb);

update public.projects
   set faqs_i18n = jsonb_build_object('en', faqs)
 where faqs is not null
   and jsonb_typeof(faqs) = 'array'
   and (faqs_i18n is null or faqs_i18n = '{}'::jsonb);

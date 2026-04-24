-- Project detail model extension — 7 new columns + structured distances + seed.
-- All additions nullable so the other 96 projects stay valid without any
-- backfill. Re-runnable.

alter table public.projects
  add column if not exists hero_tagline    text,
  add column if not exists description     text,
  add column if not exists amenities       jsonb,
  add column if not exists developer_info  jsonb,
  add column if not exists faqs            jsonb,
  add column if not exists investment      jsonb,
  add column if not exists brochure_url    text;

-- Seed Zorlu Center Residence with the sample payload.
update public.projects
set
  hero_tagline = 'Raffles-branded residences in Istanbul''s landmark mixed-use complex',
  description = $md$Set in the heart of Zincirlikuyu, Zorlu Center Residence is part of one of Istanbul's most iconic mixed-use developments. The complex combines branded residences, the Raffles Istanbul hotel, the Zorlu Performing Arts Center, and a premium shopping mall under one roof.

Designed by Emre Arolat Architecture and Tabanlıoğlu Architects, the four-block development rises 18-22 floors with panoramic views of the Bosphorus and the Istanbul skyline. Residents enjoy direct indoor access to Zorlu Center Mall, featuring flagship stores from brands like Apple, Zara Home, and Harvey Nichols.

With 584 units across four blocks on 102,000 m² of land, the project offers a range of 1+1 to 5.5+1 layouts, plus select villa options. All homes feature floor-to-ceiling windows, premium finishes, and access to world-class amenities including four outdoor pools, a covered pool, and a 1,600 m² fitness center.$md$,
  amenities = $json$[
    { "icon": "🏊", "label": "4 outdoor + 1 indoor pool", "description": "Year-round swimming" },
    { "icon": "🏋️", "label": "1,600 m² fitness center", "description": "Cardio, weights, personal training" },
    { "icon": "🛍", "label": "Integrated with Zorlu Center Mall", "description": "Direct indoor access" },
    { "icon": "🎭", "label": "Zorlu PSM on-site", "description": "Performing arts center" },
    { "icon": "🚇", "label": "Metro connected", "description": "Direct tunnel to Gayrettepe metro" },
    { "icon": "🏨", "label": "Raffles Hotel in complex", "description": "Hotel services available to residents" },
    { "icon": "🅿️", "label": "Valet parking" },
    { "icon": "🛡", "label": "24/7 security & concierge" },
    { "icon": "🌊", "label": "Bosphorus views", "description": "From floors 18-22" },
    { "icon": "🧖", "label": "Spa & wellness center" }
  ]$json$::jsonb,
  developer_info = $json${
    "name": "Zorlu Holding",
    "founded_year": 1953,
    "website_url": "https://www.zorlu.com.tr",
    "description": "Zorlu Holding is one of Turkey's largest conglomerates, operating in energy, textiles, real estate, and electronics (Vestel). Zorlu Property Development delivered Zorlu Center in 2013, one of Istanbul's most successful mixed-use projects.",
    "past_projects_count": 15
  }$json$::jsonb,
  faqs = $json$[
    {
      "question": "Can foreigners purchase units at Zorlu Center Residence?",
      "answer": "Yes. Foreign nationals from most countries can purchase property in Turkey. The transaction is completed at the Land Registry with proper documentation and legal support. Gate International provides end-to-end advisory for foreign buyers."
    },
    {
      "question": "Is this project eligible for Turkish Citizenship by Investment?",
      "answer": "Yes. Units priced at $400,000 USD or above qualify for the Turkish Citizenship by Investment program. Zorlu Center Residence units start from $1,300,000, well above the threshold."
    },
    {
      "question": "What are the monthly maintenance fees?",
      "answer": "Monthly maintenance (aidat) varies by unit size, typically ranging from $400 to $1,200 USD equivalent. This includes 24/7 security, concierge, common area maintenance, and amenity access."
    },
    {
      "question": "Is the project delivered and move-in ready?",
      "answer": "Yes. Zorlu Center Residence was delivered in 2013 and is fully operational. Units are available on the secondary market through private listings."
    },
    {
      "question": "What parking options are available?",
      "answer": "Each unit comes with at least one covered parking space. Additional spaces can be purchased or rented. Valet service is available."
    }
  ]$json$::jsonb,
  distances = $json${
    "metro_km": 0.1,
    "mall_km": 0,
    "school_km": 1.5,
    "airport_min": 35,
    "bosphorus_min": 5,
    "hospital_km": 2,
    "business_district_min": 5,
    "city_center_min": 10
  }$json$::jsonb,
  investment = $json${
    "rental_yield_pct": 5.5,
    "appreciation_pct_5yr": 45,
    "roi_notes": "Zorlu Center Residence has shown consistent appreciation since delivery in 2013. Rental demand is strong due to the mixed-use nature and expat-friendly amenities. Typical tenant profile: corporate executives, diplomats, long-term visitors.",
    "citizenship_eligible": true,
    "min_investment_for_citizenship": 400000
  }$json$::jsonb
where id = 'zorlu-center-residence';

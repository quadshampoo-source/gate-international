import { supabaseServer } from '@/lib/supabase/server';
import { PROJECTS as staticProjects, DISTRICTS as staticDistricts } from '@/lib/projects';

const staticDistrictRows = staticDistricts.map((name, i) => ({
  name,
  is_visible: true,
  sort_order: i,
}));

function fromRow(r) {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.name_ar,
    nameZh: r.name_zh,
    nameRu: r.name_ru,
    nameFa: r.name_fa,
    nameFr: r.name_fr,
    district: r.district,
    districtAr: r.district_ar,
    districtZh: r.district_zh,
    districtRu: r.district_ru,
    districtFa: r.district_fa,
    districtFr: r.district_fr,
    subDistrict: r.sub_district,
    developer: r.developer,
    architect: r.architect,
    priceUsd: r.price_usd,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    propertyType: r.property_type,
    deliveryMonth: r.delivery_month,
    deliveryYear: r.delivery_year,
    deliveryStatus: r.delivery_status,
    options: r.options,
    area: r.area,
    typology: r.typology,
    market: r.market,
    view: r.view,
    delivery: r.delivery,
    status: r.status,
    category: r.category,
    metro: r.metro,
    img: r.img || '',
    vimeoId: r.vimeo_id || '',
    youtubeUrl: r.youtube_url || '',
    gallery: r.gallery,
    exteriorImages: r.exterior_images,
    interiorImages: r.interior_images,
    totalUnits: r.total_units,
    blocks: r.blocks,
    landArea: r.land_area,
    unitTypes: r.unit_types,
    paymentPlan: r.payment_plan,
    priceTable: r.price_table,
    distances: r.distances,
    reasons: r.reasons,
    chinaScore: r.china_score,
    arabScore: r.arab_score,
    heroTagline: r.hero_tagline,
    description: r.description,
    amenities: r.amenities,
    developerInfo: r.developer_info,
    faqs: r.faqs,
    investment: r.investment,
    brochureUrl: r.brochure_url,
  };
}

// Fetch all projects from DB, fall back to static list if DB is empty or errors.
export async function getProjects() {
  try {
    const s = await supabaseServer();
    const { data, error } = await s
      .from('projects')
      .select('*')
      .order('sort_index', { ascending: true });
    if (error || !data || data.length === 0) return staticProjects;
    return data.map(fromRow);
  } catch {
    return staticProjects;
  }
}

export async function getDistricts() {
  try {
    const s = await supabaseServer();
    const { data, error } = await s
      .from('districts')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error || !data || data.length === 0) return staticDistrictRows;
    return data;
  } catch {
    return staticDistrictRows;
  }
}

export async function getProject(id) {
  try {
    const s = await supabaseServer();
    const { data } = await s.from('projects').select('*').eq('id', id).single();
    if (!data) return staticProjects.find((p) => p.id === id) || null;
    return fromRow(data);
  } catch {
    return staticProjects.find((p) => p.id === id) || null;
  }
}

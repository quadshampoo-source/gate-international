import { supabaseServer } from '@/lib/supabase/server';
import { PROJECTS as staticProjects } from '@/lib/projects';

function fromRow(r) {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.name_ar,
    nameZh: r.name_zh,
    district: r.district,
    districtAr: r.district_ar,
    districtZh: r.district_zh,
    developer: r.developer,
    priceUsd: r.price_usd,
    bedrooms: r.bedrooms,
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

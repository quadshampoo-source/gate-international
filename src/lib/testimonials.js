import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Returns [] if the testimonials table is missing (migration not yet run)
// so components can fall back to their own placeholder content.
export async function getTestimonials() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getAllTestimonials() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getTestimonial(id) {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

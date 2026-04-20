import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { OFFICE_GROUP_ORDER } from '@/lib/team-constants';

export * from '@/lib/team-constants';

// Safe fetch — returns [] if table is missing (migration not yet run).
export async function getTeam() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('team_members')
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

export async function getTeamGroupedByOffice() {
  const team = await getTeam();
  const groups = {};
  for (const office of OFFICE_GROUP_ORDER) groups[office] = [];
  for (const m of team) {
    if (!groups[m.office]) groups[m.office] = [];
    groups[m.office].push(m);
  }
  return groups;
}

// Returns every team row (incl. inactive) for the admin list.
export async function getAllTeamMembers() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('team_members')
      .select('*')
      .order('office', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getTeamMember(id) {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('team_members')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

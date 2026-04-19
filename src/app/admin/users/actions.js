'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email';

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') {
    throw new Error('forbidden');
  }
  return ctx;
}

async function baseUrl() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

async function fetchProjectsByIds(admin, ids) {
  if (!ids.length) return [];
  const { data } = await admin
    .from('projects')
    .select('id, name, district')
    .in('id', ids);
  return data || [];
}

export async function approveUser(formData) {
  await requireAdmin();
  const userId = String(formData.get('user_id') || '');
  const role = String(formData.get('role') || 'editor');
  const projectIds = formData.getAll('project_ids').map(String);

  if (!userId || !['editor', 'admin'].includes(role)) {
    redirect('/admin/users?error=invalid');
  }

  const admin = supabaseAdmin();

  // Update role
  const { error: roleErr } = await admin
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (roleErr) {
    redirect(`/admin/users?error=${encodeURIComponent(roleErr.message)}`);
  }

  // Reset assignments then reinsert
  await admin.from('editor_projects').delete().eq('user_id', userId);
  if (role === 'editor' && projectIds.length > 0) {
    const rows = projectIds.map((pid) => ({ user_id: userId, project_id: pid }));
    const { error } = await admin.from('editor_projects').insert(rows);
    if (error) {
      redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Notify the newly approved user.
  const { data: profile } = await admin
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single();
  if (profile?.email) {
    const assignedProjects = role === 'editor' ? await fetchProjectsByIds(admin, projectIds) : [];
    await sendApprovalEmail({
      to: profile.email,
      name: profile.full_name || '',
      role,
      projects: assignedProjects,
      loginUrl: `${await baseUrl()}/admin/login`,
    });
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  redirect('/admin/users?saved=1');
}

export async function rejectUser(formData) {
  await requireAdmin();
  const userId = String(formData.get('user_id') || '');
  if (!userId) redirect('/admin/users');

  const admin = supabaseAdmin();

  // Capture the email before we delete so we can send the rejection notice.
  const { data: profile } = await admin
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single();

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }

  if (profile?.email) {
    await sendRejectionEmail({ to: profile.email, name: profile.full_name || '' });
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?removed=1');
}

export async function updateAssignments(formData) {
  await requireAdmin();
  const userId = String(formData.get('user_id') || '');
  const projectIds = formData.getAll('project_ids').map(String);
  if (!userId) redirect('/admin/users');

  const admin = supabaseAdmin();
  await admin.from('editor_projects').delete().eq('user_id', userId);
  if (projectIds.length) {
    const rows = projectIds.map((pid) => ({ user_id: userId, project_id: pid }));
    const { error } = await admin.from('editor_projects').insert(rows);
    if (error) redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/admin/users');
  redirect('/admin/users?saved=1');
}

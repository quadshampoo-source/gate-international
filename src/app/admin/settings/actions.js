'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { THEMES } from '@/lib/theme';

export async function setActiveTheme(formData) {
  const theme = String(formData.get('theme') || '');
  const allowed = THEMES.map((t) => t.key);
  if (!allowed.includes(theme)) {
    redirect('/admin/settings?error=invalid');
  }
  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, active_theme: theme }, { onConflict: 'id' });
  if (error) {
    console.error('setActiveTheme', error);
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }
  // Flush the public site so the new theme renders immediately.
  revalidatePath('/', 'layout');
  revalidatePath('/[lang]', 'layout');
  redirect('/admin/settings?saved=1');
}

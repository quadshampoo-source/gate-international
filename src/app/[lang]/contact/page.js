import ContactClient from '@/components/contact-client';
import EditorialContact from '@/components/editorial/contact';
import AtomContact from '@/components/atom/contact';
import { getTeamGroupedByOffice } from '@/lib/team';
import { getActiveTheme } from '@/lib/theme';
import { getDict } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).contact;
  return buildPageMetadata({
    lang,
    path: '/contact',
    title: t.title,
    description: t.sub,
  });
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const [teamGroups, theme] = await Promise.all([
    getTeamGroupedByOffice(),
    getActiveTheme(),
  ]);
  if (theme === 'atom') {
    return <AtomContact lang={lang} team={teamGroups} />;
  }
  if (theme === 'editorial') {
    return <EditorialContact lang={lang} teamGroups={teamGroups} />;
  }
  return <ContactClient lang={lang} teamGroups={teamGroups} />;
}

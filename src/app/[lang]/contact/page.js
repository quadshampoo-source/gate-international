import ContactClient from '@/components/contact-client';
import { getTeamGroupedByOffice } from '@/lib/team';

export const revalidate = 60;

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const teamGroups = await getTeamGroupedByOffice();
  return <ContactClient lang={lang} teamGroups={teamGroups} />;
}

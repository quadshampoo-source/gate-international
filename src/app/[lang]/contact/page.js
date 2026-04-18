import ContactClient from '@/components/contact-client';

export default async function ContactPage({ params }) {
  const { lang } = await params;
  return <ContactClient lang={lang} />;
}

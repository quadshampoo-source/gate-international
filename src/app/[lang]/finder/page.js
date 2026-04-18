import FinderClient from '@/components/finder-client';

export default async function FinderPage({ params }) {
  const { lang } = await params;
  return <FinderClient lang={lang} />;
}

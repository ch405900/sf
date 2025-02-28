import { Main } from '@/components/main';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function IndexPage() {
  return (
    // <ExpandableWindow>
    // </ExpandableWindow>
    <Main ></Main>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
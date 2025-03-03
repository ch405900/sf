import { Main } from '@/components/main';
import { Navbar } from '@/components/navbar';
import { CardContainer } from '@/components/card-container';
import { SerialProvider } from '@/components/serial-context';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 flex-1">
        <SerialProvider>
          <CardContainer title="Serial Flow">
            <Main></Main>
          </CardContainer>
        </SerialProvider>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
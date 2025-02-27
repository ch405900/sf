import { Main } from "@/components/main";

import { appWithTranslation } from 'next-i18next'


function Home() {
  return (
    // <ExpandableWindow>
    // </ExpandableWindow>
    <Main ></Main>
  );
}

export default appWithTranslation(Home)
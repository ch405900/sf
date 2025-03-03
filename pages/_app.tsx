import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; // 处理图标尺寸刷新时候过大,随后加载完毕变小的问题
import { appWithTranslation } from "next-i18next";
import { ToastProvider } from "@heroui/react";


function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
      <NextThemesProvider>
        <Component {...pageProps} />
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

export default appWithTranslation(App);

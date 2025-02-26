import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import dayjs from 'dayjs';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'cookie', 'localStorage', 'querystring'],
      convertDetectedLanguage: (lng) => {
        const rawLang = lng.toLowerCase();
        if (rawLang.startsWith('zh') || rawLang.startsWith('cn')) {
          return 'zh';
        }
        return rawLang.split('-')[0];
      },
      caches: [],
    },
    ns: ['translation'],
    defaultNS: 'translation',
  });

i18n?.services?.formatter?.add('DD/MM/YY', (value, lng, options) => {
  return dayjs(value).format('DD/MM/YY')
});

i18n?.services?.formatter?.add('YYYY-MM-DD', (value, lng, options) => {
  return dayjs(value).format('YYYY-MM-DD')
});

// i18n.on('initialized', () => {
//   const detectedLang = i18n.resolvedLanguage || 'en';
//   if (detectedLang !== document.documentElement.lang) {
//     console.log(`强制同步语言: ${detectedLang}`);
//     document.documentElement.lang = detectedLang;
//   }
// });

// i18n.on('languageChanged', (lng) => {
//   console.log('[自定义日志] 语言切换至:', lng);
// });

export default i18n; 
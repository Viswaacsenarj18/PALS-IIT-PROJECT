import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from "./locales/en/translation.json";
import taTranslation from "./locales/ta/translation.json";
import knTranslation from "./locales/kn/translation.json";
import hiTranslation from "./locales/hi/translation.json"; // ✅ NEW

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: enTranslation },
      ta: { translation: taTranslation },
      kn: { translation: knTranslation },
      hi: { translation: hiTranslation }, // ✅ ADD THIS
    },

    lng: "en", // default language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { tr } from './locales/tr';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  debug: false,

  interpolation: {
    escapeValue: false,
  },

  keySeparator: '.',
  nsSeparator: false,
});

export default i18n;

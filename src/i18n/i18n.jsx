import { useState, useEffect, createContext, useContext } from 'react';
import nlTranslations from './locales/nl.json';
import enTranslations from './locales/en.json';

const translations = {
  nl: nlTranslations,
  en: enTranslations,
};

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or detect from browser
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
      return saved;
    }
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'nl';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace placeholders like {{year}} or {{link}}
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const languages = [
  { code: 'nl', name: 'Nederlands', flag: '/flags/nl.png', emoji: '🇳🇱' },
  { code: 'en', name: 'English', flag: '/flags/en.png', emoji: '🇬🇧' },
];

import { useState, useEffect, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

// Helper function to get language from URL
const getLanguageFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  if (langParam && translations[langParam]) {
    return langParam;
  }
  return null;
};

// Helper function to update URL with language parameter
const updateURLWithLanguage = (lang, navigate, pathname) => {
  const params = new URLSearchParams(window.location.search);
  params.set('lang', lang);
  navigate(`${pathname}?${params.toString()}`, { replace: true });
};

export const I18nProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState(() => {
    // Priority: URL parameter > localStorage > browser language > default (nl)
    const urlLang = getLanguageFromURL();
    if (urlLang) {
      return urlLang;
    }
    
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'nl';
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize URL parameter on mount if not present
  useEffect(() => {
    if (!isInitialized) {
      const urlLang = getLanguageFromURL();
      if (!urlLang) {
        updateURLWithLanguage(language, navigate, location.pathname);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, language, navigate, location.pathname]);

  // Preserve language parameter when pathname changes
  useEffect(() => {
    if (isInitialized) {
      const urlLang = getLanguageFromURL();
      if (!urlLang) {
        // If pathname changed and lang param is missing, add it
        updateURLWithLanguage(language, navigate, location.pathname);
      }
    }
  }, [location.pathname, isInitialized, language, navigate]);

  // Update language when URL parameter changes (from external navigation)
  useEffect(() => {
    if (isInitialized) {
      const urlLang = getLanguageFromURL();
      if (urlLang && urlLang !== language && translations[urlLang]) {
        setLanguage(urlLang);
      }
    }
  }, [location.search, isInitialized, language]);

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
      updateURLWithLanguage(lang, navigate, location.pathname);
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

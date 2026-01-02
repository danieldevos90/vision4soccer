import React from 'react';
import { useI18n, languages } from '../../../i18n/i18n';
import styles from './LanguageSwitcher.module.css';

/**
 * LanguageSwitcher Component
 * Displays language flags for switching languages
 */
export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useI18n();

  return (
    <div className={styles.languageSwitcher}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.flagButton} ${
            language === lang.code ? styles.active : ''
          }`}
          onClick={() => changeLanguage(lang.code)}
          aria-label={`Switch to ${lang.name}`}
          title={lang.name}
        >
          <img
            src={lang.flag}
            alt={lang.name}
            className={styles.flag}
            onError={(e) => {
              // Fallback to emoji flag if image doesn't load
              e.target.style.display = 'none';
              const emoji = document.createTextNode(lang.emoji || '🌐');
              e.target.parentElement.appendChild(emoji);
            }}
          />
        </button>
      ))}
    </div>
  );
};

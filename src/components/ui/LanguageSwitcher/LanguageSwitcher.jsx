import React from 'react';
import { useI18n, languages } from '../../../i18n/i18n';
import styles from './LanguageSwitcher.module.css';

/**
 * LanguageSwitcher Component
 * Toggle switch design for switching languages
 */
export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useI18n();
  const currentLangIndex = languages.findIndex(lang => lang.code === language);
  const activeIndex = currentLangIndex >= 0 ? currentLangIndex : 0;

  return (
    <div className={styles.languageSwitcher} role="group" aria-label="Language selector">
      <div className={styles.switchTrack}>
        <div 
          className={styles.switchIndicator}
          style={{ '--active-index': activeIndex }}
        />
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            className={`${styles.flagButton} ${
              language === lang.code ? styles.active : ''
            }`}
            onClick={() => changeLanguage(lang.code)}
            aria-label={`Switch to ${lang.name}`}
            aria-pressed={language === lang.code}
            title={lang.name}
            type="button"
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className={styles.flag}
              loading="lazy"
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
    </div>
  );
};

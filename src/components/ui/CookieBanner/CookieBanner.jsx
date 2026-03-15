import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/i18n';
import { getConsentPreferences, saveConsentPreferences, updateConsent, loadGA4 } from '../../../utils/analytics';
import styles from './CookieBanner.module.css';

/**
 * Cookie Consent Banner Component
 * GDPR-compliant cookie consent management
 */
export const CookieBanner = () => {
  const { t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = getConsentPreferences();
    if (savedConsent) {
      setPreferences(savedConsent);
      setShowBanner(false);
      // Load GA4 if consent was given
      if (savedConsent.analytics) {
        loadGA4();
      }
    } else {
      // Show banner if no consent has been given
      setShowBanner(true);
    }
  }, []);

  // Show preferences if user wants to change settings
  const handleShowPreferences = () => {
    setShowPreferences(true);
    setShowBanner(true);
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(newPreferences);
    // updateConsent handles saving preferences and updating GA4
    updateConsent(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
    // Load GA4 after consent
    loadGA4();
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      advertising: false,
    };
    setPreferences(newPreferences);
    // updateConsent handles saving preferences and updating GA4
    updateConsent(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    // updateConsent handles saving preferences and updating GA4
    updateConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
    // Load GA4 if analytics consent was given
    if (preferences.analytics) {
      loadGA4();
    }
  };

  const handleTogglePreference = (key) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Show preferences button if banner is not shown
  if (!showBanner && !showPreferences) {
    return (
      <div className={styles.preferencesButton}>
        <button
          onClick={handleShowPreferences}
          className={styles.preferencesToggle}
          aria-label={t('cookie.preferencesButton')}
        >
          {t('cookie.preferencesButton')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerHeader}>
            <h3 className={styles.bannerTitle}>{t('cookie.title')}</h3>
            <button
              onClick={() => {
                setShowBanner(false);
                setShowPreferences(false);
              }}
              className={styles.closeButton}
              aria-label={t('cookie.close')}
            >
              ×
            </button>
          </div>

          <p className={styles.bannerText}>{t('cookie.description')}</p>

          {showPreferences && (
            <div className={styles.preferences}>
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <label className={styles.preferenceLabel}>
                    {t('cookie.necessary.title')}
                  </label>
                  <p className={styles.preferenceDescription}>
                    {t('cookie.necessary.description')}
                  </p>
                </div>
                <div className={styles.preferenceToggle}>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    readOnly
                    className={styles.checkbox}
                  />
                </div>
              </div>

              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <label className={styles.preferenceLabel}>
                    {t('cookie.analytics.title')}
                  </label>
                  <p className={styles.preferenceDescription}>
                    {t('cookie.analytics.description')}
                  </p>
                </div>
                <div className={styles.preferenceToggle}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleTogglePreference('analytics')}
                    className={styles.checkbox}
                  />
                </div>
              </div>

              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <label className={styles.preferenceLabel}>
                    {t('cookie.advertising.title')}
                  </label>
                  <p className={styles.preferenceDescription}>
                    {t('cookie.advertising.description')}
                  </p>
                </div>
                <div className={styles.preferenceToggle}>
                  <input
                    type="checkbox"
                    checked={preferences.advertising}
                    onChange={() => handleTogglePreference('advertising')}
                    className={styles.checkbox}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.bannerActions}>
            {!showPreferences ? (
              <>
                <button
                  onClick={handleRejectAll}
                  className={styles.buttonSecondary}
                >
                  {t('cookie.rejectAll')}
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className={styles.buttonSecondary}
                >
                  {t('cookie.customize')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className={styles.buttonPrimary}
                >
                  {t('cookie.acceptAll')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSavePreferences}
                  className={styles.buttonPrimary}
                >
                  {t('cookie.savePreferences')}
                </button>
              </>
            )}
          </div>

          <div className={styles.bannerFooter}>
            <a
              href={t('cookie.privacyPolicyUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.privacyLink}
            >
              {t('cookie.privacyPolicy')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Google Analytics 4 (GA4) Integration with Consent Mode v2
 * GDPR-compliant implementation
 */

// Trim to avoid newlines/whitespace from env (e.g. from `echo "G-XXX" | vercel env add`)
const GA4_MEASUREMENT_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID || '').trim() || undefined;

// Consent state management
const CONSENT_STORAGE_KEY = 'ga4_consent';
const CONSENT_COOKIE_NAME = 'cookie_consent';

/**
 * Get consent preferences from localStorage
 */
export const getConsentPreferences = () => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading consent preferences:', error);
  }
  return null;
};

/**
 * Save consent preferences to localStorage and cookie
 */
export const saveConsentPreferences = (preferences) => {
  try {
    const preferencesJson = JSON.stringify(preferences);
    localStorage.setItem(CONSENT_STORAGE_KEY, preferencesJson);
    // Also set a cookie for server-side checking if needed (URL-encoded)
    const cookieValue = encodeURIComponent(preferencesJson);
    document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (error) {
    console.error('Error saving consent preferences:', error);
  }
};

/**
 * Initialize GA4 with Consent Mode v2
 * This must be called BEFORE the gtag script loads
 */
export const initializeGA4ConsentMode = (hasConsent = false) => {
  // Set default consent state (deny all by default - GDPR compliant)
  window.dataLayer = window.dataLayer || [];
  
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  
  // Initialize Consent Mode v2 with default denied state
  gtag('consent', 'default', {
    'analytics_storage': hasConsent ? 'granted' : 'denied',
    'ad_storage': hasConsent ? 'granted' : 'denied',
    'ad_user_data': hasConsent ? 'granted' : 'denied',
    'ad_personalization': hasConsent ? 'granted' : 'denied',
    'wait_for_update': 500,
  });

  return gtag;
};

/**
 * Update consent state
 */
export const updateConsent = (preferences) => {
  if (!window.gtag) {
    console.warn('gtag not initialized');
    return;
  }

  const hasAnalyticsConsent = preferences?.analytics ?? false;
  const hasAdsConsent = preferences?.advertising ?? false;

  window.gtag('consent', 'update', {
    'analytics_storage': hasAnalyticsConsent ? 'granted' : 'denied',
    'ad_storage': hasAdsConsent ? 'granted' : 'denied',
    'ad_user_data': hasAdsConsent ? 'granted' : 'denied',
    'ad_personalization': hasAdsConsent ? 'granted' : 'denied',
  });

  saveConsentPreferences(preferences);
};

/**
 * Load GA4 script (only if measurement ID is provided)
 */
export const loadGA4 = () => {
  if (!GA4_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID not configured. Set VITE_GA4_MEASUREMENT_ID environment variable.');
    return;
  }

  // Check if script already loaded
  if (document.querySelector(`script[src*="${GA4_MEASUREMENT_ID}"]`)) {
    return;
  }

  // Check consent before loading
  const consent = getConsentPreferences();
  const hasConsent = consent?.analytics ?? false;

  // Initialize consent mode first
  const gtag = initializeGA4ConsentMode(hasConsent);

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.onload = () => {
    // Configure GA4 with GDPR-compliant settings
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      // IP anonymization (GDPR requirement)
      anonymize_ip: true,
      // Cookie settings
      cookie_flags: 'SameSite=Lax;Secure',
      // Disable automatic page view if consent not given
      send_page_view: hasConsent,
    });
  };
  
  document.head.appendChild(script);
};

/**
 * Track page view
 */
export const trackPageView = (path, title) => {
  if (!window.gtag) return;
  
  const consent = getConsentPreferences();
  if (!consent?.analytics) {
    console.debug('Page view not tracked - no analytics consent');
    return;
  }

  window.gtag('config', GA4_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    anonymize_ip: true,
  });
};

/**
 * Track custom event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!window.gtag) return;
  
  const consent = getConsentPreferences();
  if (!consent?.analytics) {
    console.debug('Event not tracked - no analytics consent:', eventName);
    return;
  }

  window.gtag('event', eventName, {
    ...eventParams,
    anonymize_ip: true,
  });
};

/**
 * Common event tracking functions
 */
export const analytics = {
  // Page navigation
  pageView: (path, title) => trackPageView(path, title),
  
  // Button clicks
  buttonClick: (buttonName, location) => trackEvent('button_click', {
    button_name: buttonName,
    button_location: location,
  }),
  
  // Link clicks
  linkClick: (linkText, linkUrl) => trackEvent('link_click', {
    link_text: linkText,
    link_url: linkUrl,
  }),
  
  // Form interactions
  formStart: (formName) => trackEvent('form_start', { form_name: formName }),
  formSubmit: (formName, formId) => trackEvent('form_submit', { 
    form_name: formName,
    form_id: formId,
  }),
  
  // Contact interactions
  contactClick: (method) => trackEvent('contact_click', { contact_method: method }),
  emailClick: (email) => trackEvent('email_click', { email_address: email }),
  phoneClick: (phone) => trackEvent('phone_click', { phone_number: phone }),
  
  // Social media
  socialClick: (platform, url) => trackEvent('social_click', {
    social_platform: platform,
    social_url: url,
  }),
  
  // Language switching
  languageSwitch: (fromLang, toLang) => trackEvent('language_switch', {
    from_language: fromLang,
    to_language: toLang,
  }),
  
  // Article interactions
  articleView: (articleId, articleTitle) => trackEvent('article_view', {
    article_id: articleId,
    article_title: articleTitle,
  }),
  
  // Custom events
  custom: (eventName, params) => trackEvent(eventName, params),
};

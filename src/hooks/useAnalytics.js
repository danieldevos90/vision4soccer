import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

/**
 * useAnalytics Hook
 * Provides analytics tracking functions for components
 */
export const useAnalytics = () => {
  const location = useLocation();

  const trackButtonClick = useCallback((buttonName, locationName) => {
    analytics.buttonClick(buttonName, locationName || location.pathname);
  }, [location.pathname]);

  const trackLinkClick = useCallback((linkText, linkUrl) => {
    analytics.linkClick(linkText, linkUrl);
  }, []);

  const trackContact = useCallback((method, value) => {
    if (method === 'email') {
      analytics.emailClick(value);
    } else if (method === 'phone') {
      analytics.phoneClick(value);
    } else {
      analytics.contactClick(method);
    }
  }, []);

  const trackSocial = useCallback((platform, url) => {
    analytics.socialClick(platform, url);
  }, []);

  const trackFormStart = useCallback((formName) => {
    analytics.formStart(formName);
  }, []);

  const trackFormSubmit = useCallback((formName, formId) => {
    analytics.formSubmit(formName, formId);
  }, []);

  const trackArticleView = useCallback((articleId, articleTitle) => {
    analytics.articleView(articleId, articleTitle);
  }, []);

  const trackCustom = useCallback((eventName, params) => {
    analytics.custom(eventName, params);
  }, []);

  return {
    trackButtonClick,
    trackLinkClick,
    trackContact,
    trackSocial,
    trackFormStart,
    trackFormSubmit,
    trackArticleView,
    trackCustom,
  };
};

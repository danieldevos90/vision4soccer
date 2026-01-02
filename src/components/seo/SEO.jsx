import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/i18n';

/**
 * SEO Component
 * Handles dynamic meta tags, Open Graph, Twitter Cards, canonical URLs, and hreflang tags
 */
export const SEO = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  article = null, // For article schema (publishedTime, author, etc.)
  noindex = false,
  canonical,
}) => {
  const location = useLocation();
  const { language } = useI18n();
  
  // Generate alternate language URLs for hreflang
  const getAlternateUrls = (baseUrl, currentUrl) => {
    const path = location.pathname;
    const alternates = [];
    
    // Map current path to alternate language paths
    if (path === '/' || path === '') {
      alternates.push({ lang: 'nl', url: `${baseUrl}/` });
      alternates.push({ lang: 'en', url: `${baseUrl}/` });
    } else if (path.startsWith('/profiel/') || path.startsWith('/profile/')) {
      alternates.push({ lang: 'nl', url: `${baseUrl}/profiel/` });
      alternates.push({ lang: 'en', url: `${baseUrl}/profile/` });
    } else if (path.startsWith('/jeugd/') || path.startsWith('/youth/')) {
      alternates.push({ lang: 'nl', url: `${baseUrl}/jeugd/` });
      alternates.push({ lang: 'en', url: `${baseUrl}/youth/` });
    } else if (path.startsWith('/contact/')) {
      alternates.push({ lang: 'nl', url: `${baseUrl}/contact/` });
      alternates.push({ lang: 'en', url: `${baseUrl}/contact/` });
    } else if (path.startsWith('/articles/')) {
      // For articles, we'd need to get the alternate slug from the article data
      alternates.push({ lang: language, url: currentUrl });
    } else {
      alternates.push({ lang: language, url: currentUrl });
    }
    
    return alternates;
  };

  useEffect(() => {
    // Get base URL (should be your production domain)
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://vision4soccer.nl';
    
    const currentUrl = canonical || `${baseUrl}${location.pathname}`;
    const ogImage = image || `${baseUrl}/logosoccervision.svg`;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      if (!content) return;
      
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update title
    if (title) {
      document.title = title;
    }

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:locale', language === 'nl' ? 'nl_NL' : 'en_US', 'property');
    updateMetaTag('og:site_name', 'Vision4Soccer', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Article-specific Open Graph tags
    if (article) {
      if (article.publishedTime) {
        updateMetaTag('article:published_time', article.publishedTime, 'property');
      }
      if (article.modifiedTime) {
        updateMetaTag('article:modified_time', article.modifiedTime, 'property');
      }
      if (article.author) {
        updateMetaTag('article:author', article.author, 'property');
      }
      if (article.section) {
        updateMetaTag('article:section', article.section, 'property');
      }
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach((tag, index) => {
          updateMetaTag(`article:tag:${index}`, tag, 'property');
        });
      }
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add hreflang tags
    const alternates = getAlternateUrls(baseUrl, currentUrl);
    alternates.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', url);
      document.head.appendChild(link);
    });

    // Add x-default hreflang (points to default language)
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', `${baseUrl}/`);
    document.head.appendChild(xDefaultLink);

    // Update HTML lang attribute
    document.documentElement.lang = language === 'nl' ? 'nl-NL' : 'en-US';

    // Cleanup function
    return () => {
      // Note: We're not removing meta tags on unmount as they should persist
      // until the next SEO component mounts and updates them
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, keywords, image, type, article, noindex, canonical, language, location.pathname]);

  return null;
};

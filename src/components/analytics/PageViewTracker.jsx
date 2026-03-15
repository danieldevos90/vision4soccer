import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

/**
 * PageViewTracker Component
 * Tracks page views in GA4 when routes change
 */
export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const path = location.pathname + location.search;
    const title = document.title || 'Vision4Soccer';
    
    trackPageView(path, title);
  }, [location.pathname, location.search]);

  return null;
};

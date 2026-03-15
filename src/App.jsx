import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n/i18n';
import { Home } from './components/pages/Home/Home';
import { Profile } from './components/pages/Profile/Profile';
import { Youth } from './components/pages/Youth/Youth';
import { Contact } from './components/pages/Contact/Contact';
import { Articles } from './components/pages/Articles/Articles';
import { CookieBanner } from './components/ui/CookieBanner';
import { PageViewTracker } from './components/analytics';
import { initializeGA4ConsentMode } from './utils/analytics';
import './design-system/global.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Component to handle AOS refresh on route changes
 */
function AOSHandler() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  return null;
}

/**
 * Main App Component
 * Vision4Soccer website - Component-based refactor with i18n and routing
 */
function App() {
  // Initialize GA4 Consent Mode (before any tracking)
  useEffect(() => {
    // Initialize consent mode with default denied state (GDPR compliant)
    initializeGA4ConsentMode(false);
  }, []);

  return (
    <BrowserRouter>
      <I18nProvider>
        <AOSHandler />
        <PageViewTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiel" element={<Profile />} />
          <Route path="/profiel/" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/jeugd" element={<Youth />} />
          <Route path="/jeugd/" element={<Youth />} />
          <Route path="/youth" element={<Youth />} />
          <Route path="/youth/" element={<Youth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/" element={<Articles />} />
        </Routes>
        <CookieBanner />
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;

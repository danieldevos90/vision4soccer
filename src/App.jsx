import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/i18n';
import { Home } from './components/pages/Home/Home';
import { Profile } from './components/pages/Profile/Profile';
import { Youth } from './components/pages/Youth/Youth';
import { Contact } from './components/pages/Contact/Contact';
import { Articles } from './components/pages/Articles/Articles';
import './design-system/global.css';

/**
 * Main App Component
 * Vision4Soccer website - Component-based refactor with i18n and routing
 */
function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiel/" element={<Profile />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/jeugd/" element={<Youth />} />
          <Route path="/youth/" element={<Youth />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/articles/" element={<Articles />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;

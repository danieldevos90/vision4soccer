import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../../i18n/i18n';
import { LanguageSwitcher } from '../../ui/LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

/**
 * Header Component
 * Main navigation header with logo and menu
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useI18n();
  const location = useLocation();

  // Handle body scroll lock and escape key
  useEffect(() => {
    if (isMenuOpen) {
      // Lock body scroll when menu is open
      document.body.style.overflow = 'hidden';
      
      // Close menu on escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Use language-aware routes: Dutch uses /profiel/ and /jeugd/, English uses /profile/ and /youth/
  const getRoute = (key) => {
    const routes = {
      home: '/',
      profiel: language === 'nl' ? '/profiel/' : '/profile/',
      jeugd: language === 'nl' ? '/jeugd/' : '/youth/',
      contact: '/contact/',
    };
    return routes[key];
  };

  // Check if a route is active
  const isActive = (href) => {
    const pathname = location.pathname;
    
    // For home route, exact match
    if (href === '/') {
      return pathname === '/';
    }
    
    // Handle language variations for profile and youth routes
    const profileRoutes = ['/profiel/', '/profile/'];
    const youthRoutes = ['/jeugd/', '/youth/'];
    
    if (profileRoutes.includes(href)) {
      return profileRoutes.includes(pathname);
    }
    
    if (youthRoutes.includes(href)) {
      return youthRoutes.includes(pathname);
    }
    
    // For other routes, exact match
    return pathname === href;
  };

  const menuItems = [
    { label: t('nav.home'), href: getRoute('home') },
    { label: t('nav.profiel'), href: getRoute('profiel') },
    { label: t('nav.jeugd'), href: getRoute('jeugd') },
    { label: t('nav.contact'), href: getRoute('contact') },
  ];

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.menuContainer}>
        <div className={styles.rowMenu}>
          <div className={styles.rowMenuInner}>
            {/* Logo */}
            <div className={styles.logoContainer}>
              <Link to="/" className={styles.logo}>
                <img
                  src="/logosoccervision.svg"
                  alt="Vision4Soccer"
                  className={styles.logoImage}
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className={styles.mobileMenuButton}>
              <button
                className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <span className={styles.menuIcon}></span>
              </button>
            </div>

            {/* Navigation */}
            <nav 
              className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}
              aria-hidden={!isMenuOpen}
            >
              <ul className={styles.menu}>
                {menuItems.map((item) => (
                  <li key={item.href} className={styles.menuItem}>
                    <Link 
                      to={item.href} 
                      className={`${styles.menuLink} ${isActive(item.href) ? styles.active : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className={styles.menuItem}>
                  <LanguageSwitcher />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

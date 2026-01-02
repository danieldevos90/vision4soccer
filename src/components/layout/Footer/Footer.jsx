import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import { useI18n } from '../../../i18n/i18n';
import styles from './Footer.module.css';

/**
 * Footer Component
 * Site footer with sitemap, address, and contact info
 */
export const Footer = () => {
  const { t, language } = useI18n();
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          {/* Sitemap */}
          <div className={styles.footerColumn}>
            <Heading level={5} variant="light" className={styles.footerHeading}>
              {t('footer.sitemap')}
            </Heading>
            <nav>
              <ul className={styles.footerMenu}>
                <li>
                  <Link to={getRoute('home')} className={styles.footerLink}>
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link to={getRoute('profiel')} className={styles.footerLink}>
                    {t('nav.profiel')}
                  </Link>
                </li>
                <li>
                  <Link to={getRoute('jeugd')} className={styles.footerLink}>
                    {t('nav.jeugd')}
                  </Link>
                </li>
                <li>
                  <Link to={getRoute('contact')} className={styles.footerLink}>
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Address */}
          <div className={styles.footerColumn}>
            <Heading level={5} variant="light" className={styles.footerHeading}>
              {t('footer.address')}
            </Heading>
            <Text variant="light" className={styles.footerText}>
              {t('contact.address.line1')}
            </Text>
            <Text variant="light" className={styles.footerText}>
              {t('contact.address.line2')}
            </Text>
            <Text variant="light" className={styles.footerText}>
              {t('contact.address.line3')}
            </Text>
          </div>

          {/* Contact */}
          <div className={styles.footerColumn}>
            <Heading level={5} variant="light" className={styles.footerHeading}>
              {t('footer.contact')}
            </Heading>
            <Button
              href={getRoute('contact')}
              variant="primary"
              size="sm"
              className={styles.contactButton}
            >
              {t('footer.contactButton')}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <Text variant="light" size="sm" className={styles.copyright}>
            © {currentYear} Vision4Soccer –{' '}
            <a href="https://blablabuild.com" className={styles.footerLink}>
              {t('footer.controversee')}
            </a>{' '}
            Website
          </Text>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/vision4soccer/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

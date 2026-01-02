import React from 'react';
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import { ContentSection } from '../ContentSection/ContentSection';
import { Hero } from '../Hero/Hero';
import { useI18n } from '../../../i18n/i18n';
import { SEO, OrganizationSchema, BreadcrumbSchema } from '../../seo';
import { getContactSEO, getOrganizationSchema } from '../../../utils/seoConfig';
import styles from './Contact.module.css';

/**
 * Contact Page Component
 * Displays contact information and form
 */
export const Contact = () => {
  const { t, language } = useI18n();
  const seoData = getContactSEO(language);
  const organizationSchema = getOrganizationSchema();
  const baseUrl = 'https://vision4soccer.nl';
  
  const breadcrumbItems = [
    { name: t('nav.home'), url: `${baseUrl}/` },
    { name: t('contact.title'), url: seoData.canonical },
  ];

  return (
    <div className="app">
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
      />
      <OrganizationSchema {...organizationSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <main>
        <Hero
          title={t('contact.title')}
          backgroundImage="/subpage_images/contact-bg.jpg"
          backgroundPosition="center center"
        />

        <ContentSection
          heading={t('contact.heading')}
          text={t('contact.text')}
          backgroundColor="#FFFFFF"
        />

        <section className={styles.contactInfo} data-aos="fade-up">
          <Container>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem} data-aos="fade-up" data-aos-delay="100">
                <Heading level={3}>{t('contact.address.title')}</Heading>
                <Text>{t('contact.address.line1')}</Text>
                <Text>{t('contact.address.line2')}</Text>
                <Text>{t('contact.address.line3')}</Text>
                <div className={styles.emailSection}>
                  <Text>
                    <a href={`mailto:${t('contact.email.address')}`} className={styles.link}>
                      {t('contact.email.address')}
                    </a>
                  </Text>
                </div>
              </div>
            </div>
            
            {(() => {
              const people = t('contact.people');
              return Array.isArray(people) && people.length > 0 ? (
                <div className={styles.peopleSection} data-aos="fade-up" data-aos-delay="200">
                  <Heading level={2} className={styles.peopleHeading}>
                    {t('contact.heading')}
                  </Heading>
                  <div className={styles.peopleGrid}>
                    {people.map((person, index) => (
                      <div key={index} className={styles.personCard} data-aos="zoom-in" data-aos-delay={300 + (index * 100)}>
                        <Heading level={3} className={styles.personName}>
                          {person.name}
                        </Heading>
                        {person.phone && (
                          <Text className={styles.personContact}>
                            <a href={`tel:${person.phone.replace(/\s/g, '')}`} className={styles.link}>
                              {person.phone}
                            </a>
                          </Text>
                        )}
                        {person.email && (
                          <Text className={styles.personContact}>
                            <a href={`mailto:${person.email}`} className={styles.link}>
                              {person.email}
                            </a>
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

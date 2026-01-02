import React, { useState } from 'react';
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import { ContentSection } from '../ContentSection/ContentSection';
import { PersonProfile } from './PersonProfile';
import { Hero } from '../Hero/Hero';
import { useI18n } from '../../../i18n/i18n';
import { SEO, OrganizationSchema, BreadcrumbSchema } from '../../seo';
import { getProfileSEO, getOrganizationSchema } from '../../../utils/seoConfig';
import styles from './Profile.module.css';

/**
 * Profile Page Component
 * Displays profile information about Vision4Soccer with tabbed content
 */
export const Profile = () => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState('vision4soccer');
  const seoData = getProfileSEO(language);
  const organizationSchema = getOrganizationSchema();
  const baseUrl = 'https://vision4soccer.nl';
  
  const breadcrumbItems = [
    { name: language === 'nl' ? 'Home' : 'Home', url: `${baseUrl}/` },
    { name: language === 'nl' ? 'Profiel' : 'Profile', url: seoData.canonical },
  ];

  const tabs = [
    { id: 'vision4soccer', label: t('profile.tabs.vision4soccer') },
    { id: 'visie', label: t('profile.tabs.visie') },
  ];

  const getTabContent = () => {
    try {
      if (activeTab === 'vision4soccer') {
        const heading = t('profile.vision4soccer.heading');
        const text = t('profile.vision4soccer.text');
        const sections = t('profile.vision4soccer.sections');
        return {
          heading,
          text,
          sections: Array.isArray(sections) ? sections : [],
        };
      } else if (activeTab === 'visie') {
        const heading = t('profile.visie.heading');
        const text = t('profile.visie.text');
        const sections = t('profile.visie.sections');
        return {
          heading,
          text,
          sections: Array.isArray(sections) ? sections : [],
        };
      }
    } catch (e) {
      console.error('Error loading tab content:', e);
    }
    return null;
  };

  const tabContent = getTabContent();

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
          title={t('profile.title')}
          subtitle={t('profile.subtitle')}
          backgroundImage="/subpage_images/profile-bg.jpg"
          backgroundPosition="center center"
        />

        <section className={styles.tabsSection}>
          <Container>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {tabContent && (
          <>
            {tabContent.heading && (
              <ContentSection
                heading={tabContent.heading}
                text={tabContent.text}
                backgroundColor="#FFFFFF"
              />
            )}
            {Array.isArray(tabContent.sections) && tabContent.sections.map((section, index) => (
              <ContentSection
                key={index}
                heading={section.heading}
                text={section.text}
                backgroundColor={index % 2 === 0 ? '#F5F5F5' : '#FFFFFF'}
              />
            ))}
          </>
        )}

        {/* Person Profiles Section */}
        {activeTab === 'vision4soccer' && (() => {
          const people = t('profile.vision4soccer.people');
          return Array.isArray(people) && people.length > 0 ? (
            <section className={styles.peopleSection}>
              <Container>
                <div className={styles.profilesGrid}>
                  {people.map((person, index) => (
                    <PersonProfile
                      key={index}
                      name={person.name}
                      bio={person.bio}
                      career={person.career}
                      image={person.image}
                    />
                  ))}
                </div>
              </Container>
            </section>
          ) : null;
        })()}
      </main>
      <Footer />
    </div>
  );
};

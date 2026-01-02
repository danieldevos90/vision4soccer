import React, { useState, useEffect } from 'react';
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
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const seoData = getProfileSEO(language);
  const organizationSchema = getOrganizationSchema();
  const baseUrl = 'https://vision4soccer.nl';
  
  const breadcrumbItems = [
    { name: t('nav.home'), url: `${baseUrl}/` },
    { name: t('profile.title'), url: seoData.canonical },
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
  const people = activeTab === 'vision4soccer' ? (t('profile.vision4soccer.people') || []) : [];
  const peopleArray = Array.isArray(people) ? people : [];

  // Auto-advance carousel
  useEffect(() => {
    if (peopleArray.length <= 3 || isPaused || activeTab !== 'vision4soccer') return;
    
    const interval = setInterval(() => {
      setCurrentProfileIndex((prev) => {
        const next = prev + 3;
        return next >= peopleArray.length ? 0 : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [peopleArray.length, isPaused, activeTab]);

  // Reset carousel when tab changes
  useEffect(() => {
    setCurrentProfileIndex(0);
    setIsPaused(false);
  }, [activeTab]);

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => {
      const next = prev + 3;
      return next >= peopleArray.length ? 0 : next;
    });
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const prevProfile = () => {
    setCurrentProfileIndex((prev) => {
      const prevIndex = prev - 3;
      return prevIndex < 0 ? Math.max(0, peopleArray.length - 3) : prevIndex;
    });
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const goToProfile = (index) => {
    setCurrentProfileIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  // Get visible profiles (3 at a time)
  const getVisibleProfiles = () => {
    if (peopleArray.length <= 3) {
      return peopleArray.map((person, index) => ({ ...person, originalIndex: index }));
    }
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentProfileIndex + i) % peopleArray.length;
      visible.push({ ...peopleArray[index], originalIndex: index });
    }
    return visible;
  };

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

        <section className={styles.tabsSection} data-aos="fade-up">
          <Container>
            <div className={styles.tabs}>
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  data-aos="fade-up"
                  data-aos-delay={100 + (index * 100)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {tabContent && (
          <section className={styles.contentSection} data-aos="fade-up">
            <Container>
              <div className={styles.contentGrid}>
                {tabContent.heading && (
                  <div className={styles.contentBlock} data-aos="fade-up" data-aos-delay="100">
                    <Heading level={3} className={styles.contentHeading}>
                      {tabContent.heading}
                    </Heading>
                    {tabContent.text && (
                      <Text className={styles.contentText}>
                        {tabContent.text}
                      </Text>
                    )}
                  </div>
                )}
                {Array.isArray(tabContent.sections) && tabContent.sections.map((section, index) => (
                  <div key={index} className={styles.contentBlock} data-aos="fade-up" data-aos-delay={200 + (index * 100)}>
                    {section.heading && (
                      <Heading level={3} className={styles.contentHeading}>
                        {section.heading}
                      </Heading>
                    )}
                    {section.text && (
                      <Text className={styles.contentText}>
                        {section.text}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Person Profiles Carousel Section */}
        {activeTab === 'vision4soccer' && peopleArray.length > 0 && (
          <section className={styles.peopleSection} data-aos="fade-up">
            <Container>
              <div className={styles.carouselWrapper}>
                {peopleArray.length > 3 && (
                  <button
                    className={styles.carouselButton}
                    onClick={prevProfile}
                    aria-label="Previous profiles"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}
                <div className={styles.carousel}>
                  {getVisibleProfiles().map((person, index) => (
                    <div
                      key={person.originalIndex}
                      className={styles.carouselItem}
                      data-aos="zoom-in"
                      data-aos-delay={100 + (index * 100)}
                    >
                      <PersonProfile
                        name={person.name}
                        bio={person.bio}
                        career={person.career}
                        image={person.image}
                      />
                    </div>
                  ))}
                </div>
                {peopleArray.length > 3 && (
                  <button
                    className={styles.carouselButton}
                    onClick={nextProfile}
                    aria-label="Next profiles"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
              {peopleArray.length > 3 && (
                <div className={styles.carouselDots} data-aos="fade-up" data-aos-delay="400">
                  {Array.from({ length: Math.ceil(peopleArray.length / 3) }).map((_, groupIndex) => {
                    const startIndex = groupIndex * 3;
                    const isActive = currentProfileIndex >= startIndex && currentProfileIndex < startIndex + 3;
                    return (
                      <button
                        key={groupIndex}
                        className={`${styles.dot} ${isActive ? styles.active : ''}`}
                        onClick={() => goToProfile(startIndex)}
                        aria-label={`Go to profiles ${startIndex + 1}-${Math.min(startIndex + 3, peopleArray.length)}`}
                      />
                    );
                  })}
                </div>
              )}
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

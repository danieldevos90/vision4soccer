import React from 'react';
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { ContentSection } from '../ContentSection/ContentSection';
import { Hero } from '../Hero/Hero';
import { useI18n } from '../../../i18n/i18n';
import { SEO, OrganizationSchema, BreadcrumbSchema } from '../../seo';
import { getYouthSEO, getOrganizationSchema } from '../../../utils/seoConfig';
import styles from './Youth.module.css';

/**
 * Youth Page Component
 * Displays information about youth programs
 */
export const Youth = () => {
  const { t, language } = useI18n();
  const seoData = getYouthSEO(language);
  const organizationSchema = getOrganizationSchema();
  const baseUrl = 'https://vision4soccer.nl';
  
  const breadcrumbItems = [
    { name: language === 'nl' ? 'Home' : 'Home', url: `${baseUrl}/` },
    { name: language === 'nl' ? 'Jeugd' : 'Youth', url: seoData.canonical },
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
          title={t('youth.title')}
          backgroundImage="/subpage_images/youth-bg.jpg"
          backgroundPosition="center center"
        />

        <ContentSection
          heading={t('youth.heading')}
          text={t('youth.text')}
          backgroundColor="#FFFFFF"
        />

        {Array.isArray(t('youth.sections')) && t('youth.sections').map((section, index) => (
          <ContentSection
            key={index}
            heading={section.heading}
            text={section.text}
            backgroundColor={index % 2 === 0 ? '#F5F5F5' : '#FFFFFF'}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

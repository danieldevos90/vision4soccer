import React from 'react';
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { HeroSlider } from '../HeroSlider/HeroSlider';
import { ContentSection } from '../ContentSection/ContentSection';
import { Testimonials } from '../Testimonials/Testimonials';
import { InstagramFeed } from '../InstagramFeed/InstagramFeed';
import { useI18n } from '../../../i18n/i18n';
import { SEO, OrganizationSchema, WebsiteSchema } from '../../seo';
import { getHomepageSEO, getOrganizationSchema } from '../../../utils/seoConfig';

/**
 * Home Page Component
 * Main landing page with hero, content, testimonials, and Instagram feed
 */
export const Home = () => {
  const { t, language } = useI18n();
  const profileRoute = language === 'nl' ? '/profiel/' : '/profile/';
  const seoData = getHomepageSEO(language);
  const organizationSchema = getOrganizationSchema();

  return (
    <div className="app">
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      <OrganizationSchema {...organizationSchema} />
      <WebsiteSchema
        name={organizationSchema.name}
        url={organizationSchema.url}
        description={organizationSchema.description}
      />
      <main>
        <div style={{ position: 'relative' }}>
          <Header />
          <HeroSlider />
        </div>
        <ContentSection
          heading={t('content.heading')}
          text={t('content.text')}
          buttonText={t('content.button')}
          buttonHref={profileRoute}
          backgroundColor="#FFFFFF"
        />
        <Testimonials />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
};

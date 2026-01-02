import React from 'react';
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { useArticles } from '../../../hooks/useArticles';
import { useI18n } from '../../../i18n/i18n';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import { SEO, OrganizationSchema, BreadcrumbSchema } from '../../seo';
import { getHomepageSEO, getOrganizationSchema } from '../../../utils/seoConfig';
import styles from './Articles.module.css';

/**
 * Articles Component
 * Displays a list of articles from the database
 */
export const Articles = () => {
  const { language, t } = useI18n();
  const { articles, loading, error } = useArticles({
    language,
    published: true,
    limit: 20,
  });
  
  const baseUrl = 'https://vision4soccer.nl';
  const seoData = {
    title: language === 'nl' ? 'Artikelen – Vision4Soccer' : 'Articles – Vision4Soccer',
    description: language === 'nl'
      ? 'Bekijk alle artikelen en nieuws van Vision4Soccer over voetbalbegeleiding, spelersbegeleiding en de voetbalwereld.'
      : 'View all articles and news from Vision4Soccer about football guidance, player guidance and the football world.',
    keywords: language === 'nl'
      ? 'Vision4Soccer artikelen, voetbalnieuws, spelersbegeleiding nieuws'
      : 'Vision4Soccer articles, football news, player guidance news',
    canonical: `${baseUrl}/articles/`,
  };
  const organizationSchema = getOrganizationSchema();
  
  const breadcrumbItems = [
    { name: t('nav.home'), url: `${baseUrl}/` },
    { name: t('articles.title'), url: seoData.canonical },
  ];

  if (loading) {
    return (
      <div className="app">
        <Header />
        <section className={styles.section}>
          <Container>
            <div className={styles.loading}>{t('articles.loading')}</div>
          </Container>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <section className={styles.section}>
          <Container>
            <div className={styles.error}>{t('articles.error')}: {error}</div>
          </Container>
        </section>
        <Footer />
      </div>
    );
  }

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
      <section className={styles.section}>
        <Container>
          <Heading level={1} className={styles.title} data-aos="fade-up">
            {t('articles.title')}
          </Heading>
        
        {articles.length === 0 ? (
          <Text className={styles.empty} data-aos="fade-up" data-aos-delay="100">
            {t('articles.empty')}
          </Text>
        ) : (
          <div className={styles.grid}>
            {articles.map((article, index) => (
              <article key={article.id} className={styles.card} data-aos="fade-up" data-aos-delay={100 + (index * 50)}>
                {article.featured_image_url && (
                  <div className={styles.imageContainer}>
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className={styles.image}
                    />
                  </div>
                )}
                <div className={styles.content}>
                  <Heading level={3} className={styles.cardTitle}>
                    {article.title}
                  </Heading>
                  {article.excerpt && (
                    <Text className={styles.excerpt}>
                      {article.excerpt}
                    </Text>
                  )}
                  {article.author && (
                    <Text className={styles.author}>
                      {t('articles.authorPrefix')} {article.author}
                    </Text>
                  )}
                  {article.published_at && (
                    <Text className={styles.date}>
                      {new Date(article.published_at).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  )}
                  <a
                    href={`/articles/${article.slug}`}
                    className={styles.link}
                  >
                    {t('articles.readMore')}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
      <Footer />
    </div>
  );
};

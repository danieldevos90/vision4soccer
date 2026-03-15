import React, { useEffect } from 'react';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { useI18n } from '../../../i18n/i18n';
import { useInstagram } from '../../../hooks/useInstagram';
import { insta } from '../../../data/insta';
import styles from './InstagramFeed.module.css';

/**
 * InstagramFeed Component
 * Instagram feed grid display with dynamic fetching from Behold.so
 */
export const InstagramFeed = ({ posts: propPosts = [] }) => {
  const { t } = useI18n();
  
  // Fetch Instagram posts dynamically from Behold.so
  // If propPosts are provided, use those instead (for backwards compatibility)
  const { posts: fetchedPosts, loading, error } = useInstagram({ 
    limit: 9,
    enabled: propPosts.length === 0 // Only fetch if no posts provided
  });

  // Use provided posts, fetched posts, or fallback to static data
  let postsToUse = [];
  let dataSource = '';
  
  if (propPosts.length > 0) {
    // Use provided posts (for backwards compatibility)
    postsToUse = propPosts.slice(0, 9);
    dataSource = 'props';
    console.log('[InstagramFeed] Using posts from props:', postsToUse.length);
  } else if (fetchedPosts.length > 0) {
    // Use dynamically fetched posts
    postsToUse = fetchedPosts.slice(0, 9);
    dataSource = 'api';
    console.log('[InstagramFeed] Using posts from API:', postsToUse.length);
  } else if (!loading) {
    // Fallback to static data if fetch fails or no data available
    console.warn('[InstagramFeed] FALLBACK: Using static data from insta.js');
    console.warn('[InstagramFeed] Fetch state:', { loading, error, fetchedPostsCount: fetchedPosts.length });
    dataSource = 'static';
    postsToUse = insta.posts.slice(0, 9).map((post) => {
      let imageUrl = post.mediaUrl;
      if (post.sizes) {
        imageUrl = post.sizes.medium?.mediaUrl || 
                   post.sizes.large?.mediaUrl || 
                   post.sizes.small?.mediaUrl || 
                   post.mediaUrl;
      }
      
      if (post.mediaType === 'CAROUSEL_ALBUM' && post.children && post.children.length > 0) {
        const firstChild = post.children[0];
        if (firstChild.sizes) {
          imageUrl = firstChild.sizes.medium?.mediaUrl || 
                     firstChild.sizes.large?.mediaUrl || 
                     firstChild.sizes.small?.mediaUrl || 
                     firstChild.mediaUrl;
        } else {
          imageUrl = firstChild.mediaUrl;
        }
      }

      return {
        id: post.id,
        image: imageUrl,
        alt: post.caption || `Instagram post ${post.id}`,
        url: post.permalink,
      };
    });
    console.log(`[InstagramFeed] Static fallback: Using ${postsToUse.length} posts from insta.js`);
  }

  // Log data source changes
  useEffect(() => {
    if (postsToUse.length > 0 && dataSource) {
      console.log(`[InstagramFeed] ✅ Displaying ${postsToUse.length} posts from: ${dataSource}`, {
        loading,
        error,
        fetchedPostsCount: fetchedPosts.length,
        propPostsCount: propPosts.length,
      });
    }
  }, [postsToUse.length, dataSource, loading, error, fetchedPosts.length, propPosts.length]);

  return (
    <section className={styles.section} data-aos="fade-up">
      <Container>
        <div className={styles.content}>
          <div className={styles.header} data-aos="fade-up" data-aos-delay="100">
            <Heading level={3} className={styles.title}>
              {t('instagram.title')}
            </Heading>
            <Heading level={3} className={styles.subtitle}>
              {t('instagram.subtitle')}
            </Heading>
          </div>

          <div className={styles.feed}>
            {loading && postsToUse.length === 0 ? (
              <div className={styles.loading}>Loading Instagram feed...</div>
            ) : error && postsToUse.length === 0 ? (
              <div className={styles.error}>Unable to load Instagram feed</div>
            ) : (
              postsToUse.map((post, index) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.post}
                  data-aos="zoom-in"
                  data-aos-delay={200 + (index * 50)}
                >
                  <img
                    src={post.image}
                    alt={post.alt}
                    className={styles.postImage}
                    loading="lazy"
                  />
                </a>
              ))
            )}
          </div>

          <div className={styles.footer} data-aos="fade-up" data-aos-delay="600">
            <a
              href="https://www.instagram.com/vision4soccer/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followButton}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 448 512"
                fill="currentColor"
                className={styles.instagramIcon}
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
              <span>{t('instagram.follow')}</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

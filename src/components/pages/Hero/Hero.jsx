import React from 'react';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import styles from './Hero.module.css';

/**
 * Hero Component for Subpages
 * Full-width hero section with background image
 */
export const Hero = ({ 
  title, 
  subtitle, 
  backgroundImage,
  backgroundPosition = 'center center'
}) => {
  return (
    <section 
      className={styles.hero}
      style={{
        backgroundImage: backgroundImage ? `url("${backgroundImage}")` : undefined,
        backgroundPosition,
      }}
      data-aos="fade-in"
    >
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          {title && (
            <Heading level={1} className={styles.title} variant="light" data-aos="fade-up">
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text variant="light" className={styles.subtitle} data-aos="fade-up" data-aos-delay="200">
              {subtitle}
            </Text>
          )}
        </div>
      </Container>
    </section>
  );
};

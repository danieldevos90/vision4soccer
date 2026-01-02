import React from 'react';
import { Container } from '../../layout/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import { Button } from '../../ui/Button/Button';
import styles from './ContentSection.module.css';

/**
 * ContentSection Component
 * Standard content section with heading, text, and optional button
 */
export const ContentSection = ({
  heading,
  subheading,
  text,
  buttonText,
  buttonHref,
  backgroundColor,
  textColor = 'dark',
  className = '',
}) => {
  return (
    <section
      className={`${styles.section} ${className}`}
      style={{ backgroundColor }}
      data-aos="fade-up"
    >
      <Container>
        <div className={styles.content}>
          {heading && (
            <Heading level={3} variant={textColor} className={styles.heading} data-aos="fade-up" data-aos-delay="100">
              {heading}
            </Heading>
          )}
          {subheading && (
            <Heading level={3} variant={textColor} className={styles.subheading} data-aos="fade-up" data-aos-delay="200">
              {subheading}
            </Heading>
          )}
          {text && (
            <Text variant={textColor === 'light' ? 'light' : 'body'} className={styles.text} data-aos="fade-up" data-aos-delay="300">
              {text}
            </Text>
          )}
          {buttonText && buttonHref && (
            <div className={styles.buttonContainer} data-aos="fade-up" data-aos-delay="400">
              <Button href={buttonHref} variant="primary">
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

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
    >
      <Container>
        <div className={styles.content}>
          {heading && (
            <Heading level={3} variant={textColor} className={styles.heading}>
              {heading}
            </Heading>
          )}
          {subheading && (
            <Heading level={3} variant={textColor} className={styles.subheading}>
              {subheading}
            </Heading>
          )}
          {text && (
            <Text variant={textColor === 'light' ? 'light' : 'body'} className={styles.text}>
              {text}
            </Text>
          )}
          {buttonText && buttonHref && (
            <div className={styles.buttonContainer}>
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

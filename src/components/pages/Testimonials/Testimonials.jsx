import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/i18n';
import styles from './Testimonials.module.css';

/**
 * Testimonials Component
 * Carousel of testimonial quotes
 */
export const Testimonials = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useI18n();

  // Get testimonials from translations or use provided ones
  const defaultTestimonials = t('testimonials.items') || [];
  const testimonialsToUse =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    if (testimonialsToUse.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsToUse.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonialsToUse.length]);

  if (testimonialsToUse.length === 0) return null;

  return (
    <section className={styles.section} data-aos="fade-in">
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <div className={styles.carousel}>
          {testimonialsToUse.map((testimonial, index) => (
            <div
              key={index}
              className={`${styles.testimonial} ${
                index === currentIndex ? styles.active : ''
              }`}
            >
              <blockquote className={styles.quote} data-aos="zoom-in" data-aos-delay="200">
                <p className={styles.quoteText}>{testimonial.quote}</p>
                <footer className={styles.author}>
                  <cite>{testimonial.author}</cite>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
        <div className={styles.dots} data-aos="fade-up" data-aos-delay="400">
          {testimonialsToUse.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

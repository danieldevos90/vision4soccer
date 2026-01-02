import React, { useState, useEffect } from 'react';
import { Heading } from '../../ui/Heading/Heading';
import { useI18n } from '../../../i18n/i18n';
import styles from './HeroSlider.module.css';

/**
 * HeroSlider Component
 * Full-screen image slider with hero text
 */
export const HeroSlider = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { t } = useI18n();

  // Slide configuration:
  // - position: Controls where the image is positioned. Use 'center 30%' to keep faces visible
  //   (adjust percentage: lower = higher on screen, higher = lower on screen)
  // - fit: 'cover' fills container (may crop), 'contain' shows full image (may have gaps)
  const defaultSlides = [
    {
      image: '/homepage_images/MatsWieffer.jpg',
      copyright: 'ProShots/ZumaPress',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/LuukdeJong.jpg',
      copyright: 'ProShots/ZumaPress',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/ThijsDallinga.png',
      copyright: 'ProShots/ZumaPress',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/KjellScherpen.jpg',
      copyright: 'ProShots/Pressmphoto',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/TygoLand.jpg',
      copyright: 'ProShots/ZumaPress',
      position: 'center 40%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/MartijnKaars.jpg',
      copyright: 'NlBeeld/ActionPress',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/TomvandeLooi.jpg',
      copyright: 'ProShots/ZumaPress',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/ThijmenBlokzijl.JPG',
      copyright: 'ProShots/NielsBoersema',
      position: 'center 40%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/RobinPropper.jpg',
      copyright: 'ProShots/RobinJonker',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/ThomvanBergen.jpg',
      copyright: 'ProShots/JulesIperen',
      position: 'center 30%',
      fit: 'cover',
    },
    {
      image: '/homepage_images/FrederikJensen.jpg',
      copyright: 'ProShots/ZumaPress',
      position: 'center 30%',
      fit: 'cover',
    },
  ];

  const slidesToUse = slides.length > 0 ? slides : defaultSlides;

  // Preload all images
  useEffect(() => {
    const imagePromises = slidesToUse.map((slide) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = slide.image;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch((error) => {
        console.warn('Some images failed to load:', error);
        setImagesLoaded(true); // Still show slider even if some images fail
      });
  }, [slidesToUse]);

  useEffect(() => {
    if (slidesToUse.length === 0 || isPaused || !imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slidesToUse.length, isPaused, imagesLoaded]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToUse.length) % slidesToUse.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div className={styles.heroSlider}>
      {slidesToUse.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            index === currentSlide ? styles.active : ''
          }`}
          style={{
            backgroundImage: `url("${slide.image}")`,
            backgroundPosition: slide.position || 'center 30%',
            backgroundSize: slide.fit === 'contain' ? 'contain' : slide.fit === 'cover-top' ? 'cover' : 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.contentInner}>
              <Heading level={1} variant="light" className={styles.title}>
                {t('hero.title')}
              </Heading>
              <p className={styles.subtitle}>
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
          {slide.copyright && (
            <div className={styles.copyright}>{slide.copyright}</div>
          )}
        </div>
      ))}
      
      <div className={styles.scrollDown} data-aos="fade-in" data-aos-delay="1000">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};

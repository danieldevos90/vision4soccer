import React from 'react';
import styles from './Section.module.css';

/**
 * Section Component
 * Page section wrapper with background and padding options
 */
export const Section = ({
  children,
  backgroundImage,
  overlay = false,
  overlayOpacity = 0.15,
  backgroundColor,
  paddingTop = 'normal',
  paddingBottom = 'normal',
  className = '',
  ...props
}) => {
  const classes = [
    styles.section,
    styles[`paddingTop${paddingTop.charAt(0).toUpperCase() + paddingTop.slice(1)}`],
    styles[`paddingBottom${paddingBottom.charAt(0).toUpperCase() + paddingBottom.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    ...(backgroundColor && {
      backgroundColor,
    }),
  };

  return (
    <section className={classes} style={style} {...props}>
      {backgroundImage && (
        <div className={styles.backgroundWrapper}>
          <div
            className={styles.backgroundInner}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {overlay && (
            <div
              className={styles.overlay}
              style={{ opacity: overlayOpacity }}
            />
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
};

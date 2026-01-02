import React from 'react';
import styles from './Container.module.css';

/**
 * Container Component
 * Wrapper component with max-width and padding
 */
export const Container = ({
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = [
    styles.container,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

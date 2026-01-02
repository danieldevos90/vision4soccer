import React from 'react';
import styles from './Text.module.css';

/**
 * Text Component
 * Reusable text component with consistent typography
 */
export const Text = ({
  children,
  variant = 'body',
  size = 'base',
  className = '',
  as: Component = 'p',
  ...props
}) => {
  // Map size prop to CSS class name
  const sizeClass = size === '2xl' ? styles.size2xl : styles[size];
  
  const classes = [
    styles.text,
    styles[variant],
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

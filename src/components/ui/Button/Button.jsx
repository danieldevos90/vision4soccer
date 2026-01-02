import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Button Component
 * Reusable button component matching the original design
 */
export const Button = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  iconLeft = false,
  iconRight = false,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    iconLeft && styles.iconLeft,
    iconRight && styles.iconRight,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Check if href is an internal link (starts with / and doesn't start with http)
  const isInternalLink = href && href.startsWith('/') && !href.startsWith('//');

  if (isInternalLink) {
    return (
      <Link to={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  const Component = href ? 'a' : 'button';

  return (
    <Component className={buttonClasses} href={href} {...props}>
      {children}
    </Component>
  );
};

import React from 'react';
import styles from './Heading.module.css';

/**
 * Heading Component
 * Reusable heading component with consistent typography
 */
export const Heading = ({
  level = 1,
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const Tag = `h${level}`;
  const classes = [
    styles.heading,
    styles[`h${level}`],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

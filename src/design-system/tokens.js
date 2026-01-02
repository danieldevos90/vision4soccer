/**
 * Design System Tokens
 * Extracted from the original Vision4Soccer website
 */

export const colors = {
  // Primary colors
  primary: '#33A27B', // Footer green
  accent: '#210407', // Button color
  
  // Text colors
  text: {
    dark: '#303133',
    light: '#FFFFFF',
    muted: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Background colors
  bg: {
    dark: '#000000',
    light: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.3)',
    overlayLight: 'rgba(0, 0, 0, 0.15)',
    overlayDark: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Style colors (from WordPress theme)
  style: {
    wayh: '#000000', // Dark overlay
    xsdn: '#FFFFFF', // Light background
    nhtu: '#000000', // Dark background
    lxmt: '#FFFFFF', // Light background
    accent: '#210407', // Accent color
  },
};

export const typography = {
  fonts: {
    primary: 'Poppins, sans-serif',
    // serif: 'Lora, serif',
    serif: 'Poppins, sans-serif',
    display: 'Poppins, sans-serif',
    // body: 'Lora, serif',
    body: 'Poppins, sans-serif',
    // lora: 'Lora, serif',
    lora: 'Poppins, sans-serif',
    poppins: 'Poppins, sans-serif',
  },
  
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '16px',
    lg: '20px',
    xl: '22px',
    '2xl': '27px',
    '3xl': '36px',
    '4xl': '42px',
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '36px',
  '2xl': '48px',
  '3xl': '72px',
  '4xl': '96px',
};

export const layout = {
  maxWidth: '1296px',
  containerPadding: '24px',
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '960px',
    xl: '1280px',
  },
};

export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 100,
  overlay: 200,
  modal: 300,
  tooltip: 400,
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

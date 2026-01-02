# Vision4Soccer Design System

This document outlines the design system used in the Vision4Soccer website refactor.

## Colors

### Primary Colors
- **Primary Green**: `#33A27B` - Used for footer and primary accents
- **Accent Dark**: `#210407` - Used for buttons and dark accents

### Text Colors
- **Dark Text**: `#303133` - Primary text color
- **Light Text**: `#FFFFFF` - Text on dark backgrounds
- **Muted Text**: `rgba(255, 255, 255, 0.9)` - Subtle text

### Background Colors
- **Dark**: `#000000`
- **Light**: `#FFFFFF`
- **Overlay Light**: `rgba(0, 0, 0, 0.15)`
- **Overlay Dark**: `rgba(0, 0, 0, 0.5)`

## Typography

### Font Families
- **Primary**: Poppins (Headings, UI)
- **Serif**: Droid Serif (Body text alternatives)
- **Display**: Playfair Display (Decorative headings)
- **Body**: Roboto (Main body text)
- **Condensed**: Roboto Condensed
- **Quicksand**: Quicksand
- **Lora**: Lora

### Font Sizes
- **XS**: 11px
- **SM**: 13px
- **Base**: 16px
- **LG**: 20px
- **XL**: 22px
- **2XL**: 27px
- **3XL**: 36px
- **4XL**: 42px

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

## Spacing

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 36px
- **2XL**: 48px
- **3XL**: 72px
- **4XL**: 96px

## Layout

- **Max Width**: 1296px
- **Container Padding**: 24px

### Breakpoints
- **SM**: 640px
- **MD**: 768px
- **LG**: 960px
- **XL**: 1280px

## Components

### UI Components
- **Button**: Reusable button with variants (primary, secondary, outline)
- **Heading**: Typography component (h1-h6)
- **Text**: Text component with variants

### Layout Components
- **Container**: Max-width container wrapper
- **Section**: Page section with background options
- **Header**: Site header with navigation
- **Footer**: Site footer with links and info

### Page Components
- **HeroSlider**: Full-screen image slider
- **ContentSection**: Standard content section
- **Testimonials**: Testimonial carousel
- **InstagramFeed**: Instagram feed grid

## Usage

All design tokens are available in `src/design-system/tokens.js` and can be imported:

```javascript
import { colors, typography, spacing, layout } from './design-system/tokens';
```

CSS variables are also available globally via `src/design-system/global.css`.

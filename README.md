# Vision4Soccer - Component-Based Refactor

A modern, component-based refactor of the Vision4Soccer website with a comprehensive design system.

## Project Structure

```
vision4soccer/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Heading/
│   │   │   └── Text/
│   │   ├── layout/          # Layout components
│   │   │   ├── Container/
│   │   │   ├── Section/
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   └── pages/           # Page-specific components
│   │       ├── HeroSlider/
│   │       ├── ContentSection/
│   │       ├── Testimonials/
│   │       └── InstagramFeed/
│   ├── design-system/       # Design system tokens and styles
│   │   ├── tokens.js
│   │   └── global.css
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## Features

- ✅ Component-based architecture
- ✅ Comprehensive design system
- ✅ Responsive design
- ✅ Modern React with Vite
- ✅ CSS Modules for scoped styling
- ✅ Preserved original design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design system documentation.

## Components

### UI Components

- **Button**: Reusable button component with variants
- **Heading**: Typography component for headings (h1-h6)
- **Text**: Text component with size and variant options

### Layout Components

- **Container**: Max-width container wrapper
- **Section**: Page section with background and padding options
- **Header**: Site header with navigation menu
- **Footer**: Site footer with links and contact info

### Page Components

- **HeroSlider**: Full-screen image slider with hero text
- **ContentSection**: Standard content section with heading, text, and button
- **Testimonials**: Testimonial carousel with auto-rotation
- **InstagramFeed**: Instagram feed grid display

## Styling

The project uses CSS Modules for component-scoped styling. Global styles and design tokens are defined in `src/design-system/global.css` and `src/design-system/tokens.js`.

## Assets

Images and static assets are stored in the `public/` directory. Image paths reference the original WordPress structure for compatibility with existing assets.

## License

ISC

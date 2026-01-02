# Component Usage Guide

This guide shows how to use the components in the Vision4Soccer refactor.

## UI Components

### Button

```jsx
import { Button } from './components/ui/Button/Button';

// Primary button
<Button href="/contact/">Contact ons</Button>

// Secondary button
<Button variant="secondary">Learn More</Button>

// With icon
<Button iconLeft>Click Me</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Heading

```jsx
import { Heading } from './components/ui/Heading/Heading';

// Different heading levels
<Heading level={1}>Main Title</Heading>
<Heading level={2}>Subtitle</Heading>
<Heading level={3}>Section Title</Heading>

// Variants
<Heading level={1} variant="light">Light Text</Heading>
<Heading level={1} variant="dark">Dark Text</Heading>
```

### Text

```jsx
import { Text } from './components/ui/Text/Text';

// Basic text
<Text>Regular paragraph text</Text>

// Variants
<Text variant="lead">Lead paragraph</Text>
<Text variant="light">Light text</Text>
<Text variant="muted">Muted text</Text>

// Sizes
<Text size="sm">Small text</Text>
<Text size="lg">Large text</Text>
```

## Layout Components

### Container

```jsx
import { Container } from './components/layout/Container/Container';

<Container>
  <p>Content with max-width</p>
</Container>

<Container fullWidth>
  <p>Full-width content</p>
</Container>
```

### Section

```jsx
import { Section } from './components/layout/Section/Section';

// Basic section
<Section paddingTop="large" paddingBottom="large">
  <h2>Content</h2>
</Section>

// With background image
<Section
  backgroundImage="/path/to/image.jpg"
  overlay={true}
  overlayOpacity={0.15}
  paddingTop="quad"
  paddingBottom="quad"
>
  <h2>Hero Content</h2>
</Section>

// With background color
<Section backgroundColor="#33A27B">
  <h2>Colored Section</h2>
</Section>
```

### Header

```jsx
import { Header } from './components/layout/Header/Header';

<Header />
```

### Footer

```jsx
import { Footer } from './components/layout/Footer/Footer';

<Footer />
```

## Page Components

### HeroSlider

```jsx
import { HeroSlider } from './components/pages/HeroSlider/HeroSlider';

const slides = [
  {
    image: '/path/to/image1.jpg',
    title: 'Vision4Soccer',
    subtitle: 'Topsportbegeleiding met visie',
    copyright: 'ProShots/ZumaPress',
    position: 'center center',
  },
  // ... more slides
];

<HeroSlider slides={slides} />
```

### ContentSection

```jsx
import { ContentSection } from './components/pages/ContentSection/ContentSection';

<ContentSection
  heading="Opgericht door en voor voetballers."
  text="Sinds 1999 zijn wij actief..."
  buttonText="Lees meer.."
  buttonHref="/profiel/"
  backgroundColor="#FFFFFF"
  textColor="dark"
/>
```

### Testimonials

```jsx
import { Testimonials } from './components/pages/Testimonials/Testimonials';

const testimonials = [
  {
    quote: 'Great service!',
    author: 'John Doe - Company',
  },
  // ... more testimonials
];

<Testimonials testimonials={testimonials} />
```

### InstagramFeed

```jsx
import { InstagramFeed } from './components/pages/InstagramFeed/InstagramFeed';

const posts = [
  {
    id: 1,
    image: '/path/to/image.jpg',
    alt: 'Instagram post',
    url: 'https://instagram.com/p/...',
  },
  // ... more posts
];

<InstagramFeed posts={posts} />
```

## Complete Example

```jsx
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { HeroSlider } from './components/pages/HeroSlider/HeroSlider';
import { ContentSection } from './components/pages/ContentSection/ContentSection';
import { Testimonials } from './components/pages/Testimonials/Testimonials';
import { InstagramFeed } from './components/pages/InstagramFeed/InstagramFeed';

function App() {
  return (
    <div>
      <Header />
      <main>
        <HeroSlider />
        <ContentSection
          heading="Welcome"
          text="Content here..."
          buttonText="Learn More"
          buttonHref="/about/"
        />
        <Testimonials />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
}
```

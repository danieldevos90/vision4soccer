# SEO Implementation Guide

This document outlines the comprehensive SEO, GEO (international), schema markup, and sitemap implementation for the Vision4Soccer website.

## Overview

The website now includes:
- ✅ Dynamic meta tags (title, description, keywords)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Hreflang tags for international SEO (Dutch/English)
- ✅ JSON-LD structured data (Organization, Website, Article, Person, Breadcrumb schemas)
- ✅ XML Sitemap
- ✅ robots.txt
- ✅ Proper language attributes

## Components

### 1. SEO Component (`src/components/seo/SEO.jsx`)

The main SEO component that dynamically updates meta tags based on the current page and language.

**Features:**
- Dynamic title, description, and keywords
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URLs
- Hreflang tags for language alternatives
- Robots meta tags
- HTML lang attribute updates

**Usage:**
```jsx
import { SEO } from '../../seo';

<SEO
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
  canonical="https://vision4soccer.nl/page/"
  image="https://vision4soccer.nl/image.jpg" // Optional
  type="website" // or "article"
  article={{ publishedTime: "2024-01-01", author: "Author Name" }} // Optional for articles
/>
```

### 2. Structured Data Components (`src/components/seo/StructuredData.jsx`)

JSON-LD structured data for better search engine understanding.

**Available Schemas:**
- `OrganizationSchema` - Company information
- `WebsiteSchema` - Website metadata
- `ArticleSchema` - Article/blog post metadata
- `PersonSchema` - Team member information
- `BreadcrumbSchema` - Navigation breadcrumbs

**Usage:**
```jsx
import { OrganizationSchema, WebsiteSchema } from '../../seo';

<OrganizationSchema
  name="Vision4Soccer"
  url="https://vision4soccer.nl"
  logo="https://vision4soccer.nl/logosoccervision.svg"
  description="..."
  contactPoint={{ email: "info@vision4soccer.nl" }}
  address={{ streetAddress: "...", addressLocality: "Hoofddorp", ... }}
/>

<WebsiteSchema
  name="Vision4Soccer"
  url="https://vision4soccer.nl"
  description="..."
/>
```

### 3. SEO Configuration (`src/utils/seoConfig.js`)

Centralized SEO configuration for different pages with multilingual support.

**Functions:**
- `getHomepageSEO(language)` - Homepage SEO data
- `getProfileSEO(language)` - Profile page SEO data
- `getYouthSEO(language)` - Youth page SEO data
- `getContactSEO(language)` - Contact page SEO data
- `getArticleSEO(article, language)` - Article page SEO data
- `getOrganizationSchema()` - Organization structured data

## Implementation Details

### Pages with SEO

All major pages now include SEO components:

1. **Homepage** (`src/components/pages/Home/Home.jsx`)
   - Organization schema
   - Website schema
   - Dynamic meta tags

2. **Profile** (`src/components/pages/Profile/Profile.jsx`)
   - Organization schema
   - Breadcrumb schema
   - Language-specific canonical URLs (/profiel/ or /profile/)

3. **Youth** (`src/components/pages/Youth/Youth.jsx`)
   - Organization schema
   - Breadcrumb schema
   - Language-specific canonical URLs (/jeugd/ or /youth/)

4. **Contact** (`src/components/pages/Contact/Contact.jsx`)
   - Organization schema
   - Breadcrumb schema
   - Contact information in structured data

5. **Articles** (`src/components/pages/Articles/Articles.jsx`)
   - Organization schema
   - Breadcrumb schema
   - Article list page metadata

### International SEO (GEO)

**Hreflang Implementation:**
- Each page includes hreflang tags for both Dutch (nl) and English (en)
- Language-specific routes:
  - `/` - Homepage (both languages)
  - `/profiel/` (nl) ↔ `/profile/` (en)
  - `/jeugd/` (nl) ↔ `/youth/` (en)
  - `/contact/` - Contact (both languages)
- x-default hreflang points to homepage
- HTML lang attribute updates based on current language

### Sitemap

**XML Sitemap** (`api/sitemap.xml.js`)
- Dynamically generated at `/sitemap.xml`
- Includes all main pages with priorities and change frequencies
- Includes hreflang annotations in sitemap
- Configured in `vercel.json` to route to API endpoint

**Routes included:**
- `/` (priority: 1.0, weekly)
- `/profiel/` and `/profile/` (priority: 0.9, monthly)
- `/jeugd/` and `/youth/` (priority: 0.8, monthly)
- `/contact/` (priority: 0.7, monthly)

**Future enhancement:** Add articles dynamically from database

### Robots.txt

Located at `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://vision4soccer.nl/sitemap.xml
Disallow: /api/
```

### Meta Tags in index.html

The base `index.html` includes default meta tags that are enhanced dynamically by the SEO component:
- Basic meta tags (description, keywords, author, robots)
- Open Graph tags
- Twitter Card tags
- Theme color
- Favicon

## Testing SEO

### Validate Meta Tags
1. View page source and check `<head>` section
2. Use browser DevTools → Elements → `<head>`
3. Test with social media debuggers:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

### Validate Structured Data
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/
3. View page source and look for `<script type="application/ld+json">` tags

### Validate Sitemap
1. Visit `https://your-domain.com/sitemap.xml`
2. Submit to Google Search Console
3. Validate XML structure

### Validate Hreflang
1. View page source and check for `<link rel="alternate" hreflang="...">` tags
2. Use hreflang validator tools
3. Test language switching

## Google Search Console Setup

1. **Verify ownership** of your domain
2. **Submit sitemap**: Add `https://vision4soccer.nl/sitemap.xml`
3. **Monitor:**
   - Coverage issues
   - Indexing status
   - International targeting (set default country if needed)

## Best Practices

1. **Keep meta descriptions under 160 characters**
2. **Use descriptive, keyword-rich titles**
3. **Update sitemap** when adding new pages
4. **Test structured data** after changes
5. **Monitor Search Console** for issues
6. **Ensure all images have alt text** (separate task)
7. **Use HTTPS** (already configured on Vercel)
8. **Monitor page load speed** (important for SEO)

## Environment Variables

The sitemap uses environment variables for the base URL:
- `NEXT_PUBLIC_SITE_URL` (recommended)
- `VERCEL_URL` (fallback)
- Defaults to `https://vision4soccer.nl`

Set in Vercel dashboard or `.env.local` for local development.

## Future Enhancements

1. **Article pages:** Add SEO components to individual article pages when route is created
2. **Dynamic sitemap:** Include articles from database in sitemap
3. **Image optimization:** Add structured data for images
4. **Local business schema:** If applicable for local SEO
5. **FAQ schema:** If FAQ section is added
6. **Review schema:** For testimonials

## Files Modified/Created

### New Files:
- `src/components/seo/SEO.jsx`
- `src/components/seo/StructuredData.jsx`
- `src/components/seo/index.js`
- `src/utils/seoConfig.js`
- `public/robots.txt`
- `api/sitemap.xml.js`
- `SEO_IMPLEMENTATION.md` (this file)

### Modified Files:
- `index.html` - Enhanced meta tags
- `vercel.json` - Added sitemap route and headers
- `src/components/pages/Home/Home.jsx` - Added SEO components
- `src/components/pages/Profile/Profile.jsx` - Added SEO components
- `src/components/pages/Youth/Youth.jsx` - Added SEO components
- `src/components/pages/Contact/Contact.jsx` - Added SEO components
- `src/components/pages/Articles/Articles.jsx` - Added SEO components

## Notes

- The SEO component uses `useEffect` to update the DOM directly (no external dependencies needed)
- Structured data is added as JSON-LD scripts in the document head
- All SEO components are language-aware and update based on the current language setting
- The implementation follows Google's best practices for international SEO

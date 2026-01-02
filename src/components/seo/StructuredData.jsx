import { useEffect } from 'react';

/**
 * StructuredData Component
 * Adds JSON-LD structured data for SEO
 */

// Organization Schema
export const OrganizationSchema = ({ 
  name = 'Vision4Soccer',
  url = 'https://vision4soccer.nl',
  logo = 'https://vision4soccer.nl/logosoccervision.svg',
  description,
  contactPoint,
  address,
  sameAs = [] // Social media profiles
}) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url,
      logo,
      ...(description && { description }),
      ...(contactPoint && {
        contactPoint: {
          '@type': 'ContactPoint',
          ...contactPoint,
        },
      }),
      ...(address && {
        address: {
          '@type': 'PostalAddress',
          ...address,
        },
      }),
      ...(sameAs.length > 0 && { sameAs }),
    };

    addStructuredData(schema, 'organization-schema');

    return () => {
      removeStructuredData('organization-schema');
    };
  }, [name, url, logo, description, contactPoint, address, sameAs]);

  return null;
};

// Website Schema
export const WebsiteSchema = ({
  name = 'Vision4Soccer',
  url = 'https://vision4soccer.nl',
  description,
  potentialAction,
}) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      url,
      ...(description && { description }),
      ...(potentialAction && {
        potentialAction: {
          '@type': 'SearchAction',
          target: potentialAction.target || `${url}/search?q={search_term_string}`,
          'query-input': potentialAction.queryInput || 'required name=search_term_string',
        },
      }),
    };

    addStructuredData(schema, 'website-schema');

    return () => {
      removeStructuredData('website-schema');
    };
  }, [name, url, description, potentialAction]);

  return null;
};

// Article Schema
export const ArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
}) => {
  useEffect(() => {
    if (!headline) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      ...(description && { description }),
      ...(image && { image }),
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      ...(author && {
        author: {
          '@type': typeof author === 'string' ? 'Person' : author['@type'] || 'Person',
          ...(typeof author === 'string' ? { name: author } : author),
        },
      }),
      ...(publisher && {
        publisher: {
          '@type': 'Organization',
          name: publisher.name || 'Vision4Soccer',
          logo: {
            '@type': 'ImageObject',
            url: publisher.logo || 'https://vision4soccer.nl/logosoccervision.svg',
          },
        },
      }),
    };

    addStructuredData(schema, 'article-schema');

    return () => {
      removeStructuredData('article-schema');
    };
  }, [headline, description, image, datePublished, dateModified, author, publisher]);

  return null;
};

// Person Schema (for team members)
export const PersonSchema = ({
  name,
  jobTitle,
  description,
  image,
  email,
  telephone,
  sameAs = [],
}) => {
  useEffect(() => {
    if (!name) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      ...(jobTitle && { jobTitle }),
      ...(description && { description }),
      ...(image && { image }),
      ...(email && { email }),
      ...(telephone && { telephone }),
      ...(sameAs.length > 0 && { sameAs }),
      worksFor: {
        '@type': 'Organization',
        name: 'Vision4Soccer',
      },
    };

    addStructuredData(schema, 'person-schema');

    return () => {
      removeStructuredData('person-schema');
    };
  }, [name, jobTitle, description, image, email, telephone, sameAs]);

  return null;
};

// Breadcrumb Schema
export const BreadcrumbSchema = ({ items }) => {
  useEffect(() => {
    if (!items || items.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    addStructuredData(schema, 'breadcrumb-schema');

    return () => {
      removeStructuredData('breadcrumb-schema');
    };
  }, [items]);

  return null;
};

// Helper functions
function addStructuredData(schema, id) {
  // Remove existing schema with same id
  removeStructuredData(id);

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeStructuredData(id) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
}

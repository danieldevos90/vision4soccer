/**
 * Sitemap XML Generator
 * Generates sitemap.xml dynamically with all pages
 */
import { sql } from '@vercel/postgres';

// Routes configuration
const routes = [
  // Home pages (both languages use same URL structure but different content)
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/profiel/', priority: '0.9', changefreq: 'monthly' },
  { path: '/profile/', priority: '0.9', changefreq: 'monthly' },
  { path: '/jeugd/', priority: '0.8', changefreq: 'monthly' },
  { path: '/youth/', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact/', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/', priority: '0.8', changefreq: 'weekly' },
];

// Use production domain - can be configured via environment variable
const getBaseUrl = (req) => {
  // Check if request has a host header (production domain)
  if (req && req.headers && req.headers.host) {
    const host = req.headers.host;
    // If it's the production domain, use it
    if (host.includes('vision4soccer.nl')) {
      return `https://${host}`;
    }
  }
  
  // Fall back to environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  
  // Default to production domain
  return 'https://www.vision4soccer.nl';
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl = getBaseUrl(req);
  const currentDate = new Date().toISOString();

  // Generate XML sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Add static routes
  routes.forEach(route => {
    xml += `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>`;
    
    // Add hreflang alternatives for language-specific routes
    if (route.path === '/profiel/' || route.path === '/profile/') {
      xml += `
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}/profiel/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/profile/" />`;
    } else if (route.path === '/jeugd/' || route.path === '/youth/') {
      xml += `
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}/jeugd/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/youth/" />`;
    } else if (route.path === '/' || route.path === '/contact/' || route.path === '/articles/') {
      xml += `
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}${route.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${route.path}" />`;
    }
    
    xml += `
  </url>`;
  });

  // Add published articles from database
  try {
    const articlesResult = await sql.query(
      'SELECT slug, language, updated_at, published_at FROM articles WHERE published = true ORDER BY published_at DESC'
    );
    
    if (articlesResult.rows && articlesResult.rows.length > 0) {
      articlesResult.rows.forEach(article => {
        const lastmod = article.updated_at || article.published_at || currentDate;
        xml += `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="${article.language || 'nl'}" href="${baseUrl}/articles/${article.slug}" />
  </url>`;
      });
    }
  } catch (error) {
    // If database is not available or query fails, continue without articles
    // This allows the sitemap to work even if the database is not set up yet
    console.error('Error fetching articles for sitemap:', error.message);
  }

  xml += `
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}

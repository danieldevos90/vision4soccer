# SEO Testing Guide

This guide helps you test and validate the SEO implementation for the Vision4Soccer website.

## Quick Testing Checklist

- [ ] Meta tags are present and correct
- [ ] Open Graph tags work for social sharing
- [ ] Sitemap is accessible and valid
- [ ] robots.txt is accessible
- [ ] Structured data validates
- [ ] Hreflang tags are correct
- [ ] Canonical URLs are set
- [ ] Language switching works correctly

## 1. Manual Testing

### View Page Source

1. Open any page on your website
2. Right-click → "View Page Source" (or Cmd+Option+U / Ctrl+U)
3. Check for:
   - `<title>` tag with correct title
   - `<meta name="description">` with description
   - `<meta property="og:*">` tags for Open Graph
   - `<meta name="twitter:*">` tags for Twitter Cards
   - `<link rel="canonical">` with correct URL
   - `<link rel="alternate" hreflang="...">` tags
   - `<script type="application/ld+json">` for structured data

### Test Sitemap

1. Visit: `https://your-domain.com/sitemap.xml`
2. Should see valid XML with all pages
3. Check that articles are included (if database is set up)
4. Validate XML structure

### Test robots.txt

1. Visit: `https://your-domain.com/robots.txt`
2. Should see:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://vision4soccer.nl/sitemap.xml
   Disallow: /api/
   ```

## 2. Online Validation Tools

### Meta Tags & Open Graph

**Facebook Sharing Debugger:**
- URL: https://developers.facebook.com/tools/debug/
- Enter your page URL
- Click "Debug" to see how Facebook sees your page
- Use "Scrape Again" to refresh cache

**Twitter Card Validator:**
- URL: https://cards-dev.twitter.com/validator
- Enter your page URL
- See preview of how tweet will look

**LinkedIn Post Inspector:**
- URL: https://www.linkedin.com/post-inspector/
- Enter your page URL
- Preview LinkedIn sharing

**OpenGraph.xyz (Multi-platform):**
- URL: https://www.opengraph.xyz/
- Test multiple platforms at once

### Structured Data Validation

**Google Rich Results Test:**
- URL: https://search.google.com/test/rich-results
- Enter your page URL or paste HTML
- Shows which structured data Google recognizes
- Check for errors and warnings

**Schema.org Validator:**
- URL: https://validator.schema.org/
- Enter your page URL
- Validates JSON-LD structured data

### Sitemap Validation

**XML Sitemap Validator:**
- URL: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Enter your sitemap URL: `https://your-domain.com/sitemap.xml`
- Checks for XML syntax errors

**Google Search Console:**
- Submit sitemap URL
- Monitor indexing status
- Check for errors

### Hreflang Validation

**hreflang Tags Testing Tool:**
- URL: https://technicalseo.com/tools/hreflang/
- Enter your page URL
- Validates hreflang implementation

**Google Search Console:**
- International targeting section
- Shows hreflang issues

## 3. Browser Extensions

### Recommended Extensions

**SEO META in 1 CLICK:**
- Chrome: https://chrome.google.com/webstore
- Shows meta tags, Open Graph, structured data

**META SEO Inspector:**
- Chrome: https://chrome.google.com/webstore
- Displays all SEO-relevant tags

**Structured Data Markup Helper:**
- Chrome: https://chrome.google.com/webstore
- Highlights structured data on page

## 4. Command Line Testing

### Test Sitemap (curl)

```bash
# Check sitemap is accessible
curl -I https://your-domain.com/sitemap.xml

# View sitemap content
curl https://your-domain.com/sitemap.xml

# Validate XML
curl https://your-domain.com/sitemap.xml | xmllint --format -
```

### Test robots.txt

```bash
curl https://your-domain.com/robots.txt
```

### Check Meta Tags

```bash
# Extract title
curl -s https://your-domain.com | grep -o '<title>.*</title>'

# Extract description
curl -s https://your-domain.com | grep -o '<meta name="description"[^>]*>'
```

## 5. Testing Different Pages

Test each page type:

- [ ] Homepage (`/`)
- [ ] Profile NL (`/profiel/`)
- [ ] Profile EN (`/profile/`)
- [ ] Youth NL (`/jeugd/`)
- [ ] Youth EN (`/youth/`)
- [ ] Contact (`/contact/`)
- [ ] Articles List (`/articles/`)
- [ ] Individual Article (if routes exist)

For each page, verify:
1. Title is unique and descriptive
2. Description is unique and under 160 characters
3. Canonical URL is correct
4. Hreflang tags include both languages where applicable
5. Structured data is present
6. Open Graph tags are correct
7. Images have absolute URLs (for OG tags)

## 6. Language Switching Test

1. Visit a page (e.g., `/profile/`)
2. Check hreflang tags include both:
   - `<link rel="alternate" hreflang="nl" href="...">`
   - `<link rel="alternate" hreflang="en" href="...">`
3. Switch language in the UI
4. Verify URL changes correctly
5. Verify meta tags update for new language
6. Verify hreflang tags are correct for current page

## 7. Mobile Testing

1. Use Chrome DevTools device emulator
2. Test meta tags on mobile viewport
3. Check Open Graph images display correctly
4. Verify structured data is still present

## 8. Performance Testing

SEO and performance are related:

1. **PageSpeed Insights:**
   - URL: https://pagespeed.web.dev/
   - Enter your page URL
   - Check Core Web Vitals

2. **GTmetrix:**
   - URL: https://gtmetrix.com/
   - Analyze page speed
   - Check for render-blocking resources

## 9. Google Search Console Setup

### Initial Setup

1. Go to: https://search.google.com/search-console
2. Add property (your domain)
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://your-domain.com/sitemap.xml`
5. Wait for Google to crawl (can take days)

### Monitor

- **Coverage:** Check indexing status
- **Sitemaps:** Verify sitemap is processed
- **International Targeting:** Check hreflang implementation
- **Performance:** Monitor search performance
- **Enhancements:** Check structured data recognition

## 10. Common Issues & Fixes

### Issue: Meta tags not updating

**Fix:** Clear browser cache, hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Issue: Open Graph tags not showing in debugger

**Fix:** 
1. Use "Scrape Again" in Facebook Debugger
2. Check images use absolute URLs
3. Verify tags are in `<head>` section

### Issue: Structured data errors

**Fix:**
1. Validate with Schema.org validator
2. Check JSON-LD syntax
3. Ensure required fields are present

### Issue: Hreflang validation errors

**Fix:**
1. Ensure all language versions have hreflang tags
2. Include x-default
3. Use correct language codes (nl, en)

### Issue: Sitemap not accessible

**Fix:**
1. Check `vercel.json` routing
2. Verify API endpoint is deployed
3. Check CORS headers if needed

## 11. Automated Testing (Optional)

### Create Test Script

You can create a Node.js script to automate some tests:

```javascript
// test-seo.js
const fetch = require('node-fetch');

const pages = [
  'https://your-domain.com/',
  'https://your-domain.com/profile/',
  // ... more pages
];

async function testPage(url) {
  const response = await fetch(url);
  const html = await response.text();
  
  // Check for title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  console.log(`${url}: Title = ${titleMatch ? titleMatch[1] : 'MISSING'}`);
  
  // Check for description
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  console.log(`${url}: Description = ${descMatch ? descMatch[1].substring(0, 50) + '...' : 'MISSING'}`);
  
  // Check for canonical
  const canonMatch = html.match(/<link rel="canonical" href="(.*?)"/);
  console.log(`${url}: Canonical = ${canonMatch ? canonMatch[1] : 'MISSING'}`);
}

pages.forEach(testPage);
```

Run with: `node test-seo.js`

## 12. Regular Maintenance

### Weekly
- Check Google Search Console for errors
- Monitor indexing status

### Monthly
- Review search performance
- Check for new validation errors
- Update sitemap if new pages added

### Quarterly
- Review and update meta descriptions
- Check structured data accuracy
- Update sitemap priorities if needed
- Review competitor SEO strategies

## Getting Help

If you encounter issues:

1. Check browser console for JavaScript errors
2. Validate HTML structure
3. Test in incognito/private mode
4. Check network tab for failed requests
5. Review server logs for errors

## Notes

- Meta tags are updated client-side (React), so view source shows initial HTML
- Use browser DevTools Elements tab to see current DOM state
- Search engines cache pages - changes may take time to reflect
- Test in production environment for accurate results

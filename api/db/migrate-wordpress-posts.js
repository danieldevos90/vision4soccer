import { sql } from '@vercel/postgres';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Migration script to convert WordPress posts from dbs7612387.sql to articles table
 * 
 * This script:
 * 1. Parses the WordPress SQL dump
 * 2. Extracts posts where post_type = 'post'
 * 3. Converts them to the articles table format
 * 4. Inserts them into the articles table
 * 
 * Usage: Run this as a Vercel serverless function or locally with Node.js
 */

// Parse WordPress SQL INSERT statements
function parseWordPressPosts(sqlContent) {
  const posts = [];
  const insertRegex = /INSERT INTO `wp_posts`[^;]+;/g;
  const matches = sqlContent.match(insertRegex) || [];

  for (const match of matches) {
    // Extract VALUES part
    const valuesMatch = match.match(/VALUES\s+(.+);/s);
    if (!valuesMatch) continue;

    const valuesString = valuesMatch[1];
    // Split by ),( to get individual rows
    const rows = valuesString.split(/\),\s*\(/).map(row => {
      // Remove leading/trailing parentheses
      return row.replace(/^\(/, '').replace(/\)$/, '');
    });

    for (const row of rows) {
      try {
        // Parse the row - WordPress uses single quotes and escapes
        const values = parseSQLRow(row);
        
        if (values.length >= 22 && values[20] === 'post') {
          // Only process posts (not pages, attachments, etc.)
          const post = {
            id: parseInt(values[0]) || null,
            post_author: parseInt(values[1]) || 0,
            post_date: values[2] || null,
            post_date_gmt: values[3] || null,
            post_content: values[4] || '',
            post_title: values[5] || '',
            post_excerpt: values[6] || '',
            post_status: values[7] || 'draft',
            post_name: values[11] || '',
            post_modified: values[14] || null,
            post_modified_gmt: values[15] || null,
            post_type: values[20] || 'post',
          };

          // Only include published posts
          if (post.post_status === 'publish') {
            posts.push(post);
          }
        }
      } catch (error) {
        console.error('Error parsing row:', error);
        continue;
      }
    }
  }

  return posts;
}

// Parse SQL row values (handles escaped quotes, NULL, etc.)
function parseSQLRow(row) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = null;
  let i = 0;

  while (i < row.length) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (!inQuotes) {
      if (char === "'" || char === '"') {
        inQuotes = true;
        quoteChar = char;
        current = '';
      } else if (char === ',') {
        values.push(parseValue(current.trim()));
        current = '';
      } else if (char === 'N' && row.substring(i, i + 4) === 'NULL') {
        values.push(null);
        i += 3; // Skip rest of NULL
        current = '';
      } else if (char !== ' ' || current.length > 0) {
        current += char;
      }
    } else {
      if (char === quoteChar && nextChar !== quoteChar) {
        // End of quoted string
        values.push(current);
        current = '';
        inQuotes = false;
        quoteChar = null;
        // Skip the closing quote
      } else if (char === quoteChar && nextChar === quoteChar) {
        // Escaped quote
        current += char;
        i++; // Skip next quote
      } else {
        current += char;
      }
    }
    i++;
  }

  if (current.trim()) {
    values.push(parseValue(current.trim()));
  }

  return values;
}

function parseValue(value) {
  if (value === 'NULL' || value === '') {
    return null;
  }
  // Remove surrounding quotes if present
  if ((value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1).replace(/''/g, "'").replace(/""/g, '"');
  }
  return value;
}

// Get author name from user ID (if wp_users table exists in SQL)
function getAuthorName(userId, sqlContent) {
  // Try to find user in SQL content
  const userRegex = new RegExp(`INSERT INTO \`wp_users\`[^;]*\\([^)]*\\).*?VALUES[^;]*\\([^)]*${userId}[^)]*\\)[^;]*;`, 's');
  const match = sqlContent.match(userRegex);
  if (match) {
    // Extract display_name or user_nicename from the match
    // This is a simplified version - you may need to adjust based on actual structure
    const nameMatch = match[0].match(/display_name['"]?\s*,\s*['"]?([^'",]+)/);
    if (nameMatch) return nameMatch[1];
  }
  return null;
}

// Convert WordPress post to article format
function convertToArticle(wpPost, authorName = null) {
  // Clean HTML from content and excerpt
  const cleanContent = wpPost.post_content
    .replace(/<!--.*?-->/gs, '') // Remove HTML comments
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove styles
    .trim();

  const cleanExcerpt = wpPost.post_excerpt
    .replace(/<!--.*?-->/gs, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  // Extract featured image from content (look for img tags)
  const imgMatch = wpPost.post_content.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  const featuredImageUrl = imgMatch ? imgMatch[1] : null;

  // Determine language (you may need to adjust this logic)
  // For now, default to 'nl' - you can add logic to detect language
  const language = 'nl';

  // Convert date
  const publishedAt = wpPost.post_date && wpPost.post_date !== '0000-00-00 00:00:00'
    ? new Date(wpPost.post_date).toISOString()
    : null;

  return {
    title: wpPost.post_title || 'Untitled',
    slug: wpPost.post_name || `post-${wpPost.id}`,
    content: cleanContent,
    excerpt: cleanExcerpt || cleanContent.substring(0, 200) + '...',
    author: authorName || 'Admin',
    featured_image_url: featuredImageUrl,
    language: language,
    published: true,
    published_at: publishedAt,
  };
}

// Main migration function
export default async function migrateWordPressPosts() {
  try {
    console.log('Starting WordPress posts migration...');

    // Read the SQL file
    const sqlFilePath = join(__dirname, '../../dbs7612387.sql');
    console.log(`Reading SQL file from: ${sqlFilePath}`);
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log(`SQL file read, size: ${sqlContent.length} characters`);

    // Parse WordPress posts
    console.log('Parsing WordPress posts...');
    const wpPosts = parseWordPressPosts(sqlContent);
    console.log(`Found ${wpPosts.length} published posts`);

    if (wpPosts.length === 0) {
      console.log('No posts found to migrate');
      return { success: true, migrated: 0 };
    }

    // Get author names (simplified - you may need to enhance this)
    const authors = new Map();
    // Try to extract user data from SQL
    const userMatches = sqlContent.match(/INSERT INTO `wp_users`[^;]+;/g) || [];
    for (const match of userMatches) {
      // Extract user ID and display name (simplified)
      const idMatch = match.match(/\((\d+),/);
      const nameMatch = match.match(/display_name['"]?\s*,\s*['"]?([^'",]+)/);
      if (idMatch && nameMatch) {
        authors.set(parseInt(idMatch[1]), nameMatch[1]);
      }
    }

    // Convert and insert articles
    console.log('Converting and inserting articles...');
    let migrated = 0;
    let errors = 0;

    for (const wpPost of wpPosts) {
      try {
        const authorName = authors.get(wpPost.post_author) || null;
        const article = convertToArticle(wpPost, authorName);

        // Check if article with this slug already exists
        const existing = await sql.query(
          'SELECT id FROM articles WHERE slug = $1',
          [article.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`Skipping duplicate slug: ${article.slug}`);
          continue;
        }

        // Insert article
        await sql.query(
          `INSERT INTO articles (title, slug, content, excerpt, author, featured_image_url, language, published, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            article.title,
            article.slug,
            article.content,
            article.excerpt,
            article.author,
            article.featured_image_url,
            article.language,
            article.published,
            article.published_at,
          ]
        );

        migrated++;
        if (migrated % 10 === 0) {
          console.log(`Migrated ${migrated} articles...`);
        }
      } catch (error) {
        errors++;
        console.error(`Error migrating post ID ${wpPost.id}:`, error.message);
      }
    }

    console.log(`Migration complete! Migrated: ${migrated}, Errors: ${errors}`);
    return { success: true, migrated, errors };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
}

// If running as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateWordPressPosts()
    .then(result => {
      console.log('Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

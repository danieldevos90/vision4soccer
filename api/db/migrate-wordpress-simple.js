import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simplified migration script for WordPress posts
 * 
 * This script reads the SQL dump and extracts post data,
 * then inserts it into the articles table.
 * 
 * Run this as: node api/db/migrate-wordpress-simple.js
 * Or call via API: POST /api/migrate
 */

function extractPostsFromSQL(sqlContent) {
  const posts = [];
  
  // Find all INSERT INTO wp_posts statements
  const insertPattern = /INSERT INTO `wp_posts`[^;]+;/gs;
  const matches = sqlContent.match(insertPattern) || [];
  
  console.log(`Found ${matches.length} INSERT statements for wp_posts`);
  
  for (const insertStatement of matches) {
    // Extract the VALUES part
    const valuesMatch = insertStatement.match(/VALUES\s+(.+?);/s);
    if (!valuesMatch) continue;
    
    const valuesPart = valuesMatch[1];
    
    // Split rows - WordPress dumps use ),( to separate rows
    // But we need to be careful with nested parentheses in content
    const rows = [];
    let currentRow = '';
    let depth = 0;
    let inString = false;
    let stringChar = null;
    
    for (let i = 0; i < valuesPart.length; i++) {
      const char = valuesPart[i];
      const nextChar = valuesPart[i + 1];
      
      if (!inString) {
        if (char === '(') {
          depth++;
          if (depth === 1) {
            currentRow = '';
            continue;
          }
        } else if (char === ')') {
          depth--;
          if (depth === 0) {
            rows.push(currentRow);
            currentRow = '';
            // Skip comma and space if present
            if (nextChar === ',') i++;
            if (valuesPart[i + 1] === ' ') i++;
            continue;
          }
        } else if (char === "'" || char === '"') {
          inString = true;
          stringChar = char;
        }
      } else {
        if (char === stringChar) {
          if (nextChar === stringChar) {
            // Escaped quote
            currentRow += char + nextChar;
            i++; // Skip next char
            continue;
          } else {
            // End of string
            inString = false;
            stringChar = null;
          }
        }
      }
      
      if (depth > 0) {
        currentRow += char;
      }
    }
    
    // Parse each row
    for (const row of rows) {
      try {
        const post = parsePostRow(row);
        if (post && post.post_type === 'post' && post.post_status === 'publish') {
          posts.push(post);
        }
      } catch (error) {
        // Skip malformed rows
        continue;
      }
    }
  }
  
  return posts;
}

function parsePostRow(row) {
  // Split by comma, but respect quoted strings
  const values = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = null;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (!inQuotes) {
      if (char === "'" || char === '"') {
        inQuotes = true;
        quoteChar = char;
        current = '';
      } else if (char === ',') {
        values.push(parseSQLValue(current.trim()));
        current = '';
      } else {
        current += char;
      }
    } else {
      if (char === quoteChar) {
        if (nextChar === quoteChar) {
          // Escaped quote
          current += char;
          i++; // Skip next
        } else {
          // End of string
          inQuotes = false;
          quoteChar = null;
          values.push(parseSQLValue(current));
          current = '';
          // Skip the quote
        }
      } else {
        current += char;
      }
    }
  }
  
  if (current.trim() || values.length === 0) {
    values.push(parseSQLValue(current.trim()));
  }
  
  // WordPress wp_posts structure:
  // ID, post_author, post_date, post_date_gmt, post_content, post_title, 
  // post_excerpt, post_status, comment_status, ping_status, post_password,
  // post_name, to_ping, pinged, post_modified, post_modified_gmt,
  // post_content_filtered, post_parent, guid, menu_order, post_type,
  // post_mime_type, comment_count
  
  if (values.length < 21) {
    return null;
  }
  
  return {
    id: parseInt(values[0]) || 0,
    post_author: parseInt(values[1]) || 0,
    post_date: values[2] || null,
    post_date_gmt: values[3] || null,
    post_content: values[4] || '',
    post_title: values[5] || '',
    post_excerpt: values[6] || '',
    post_status: values[7] || 'draft',
    post_name: values[11] || '',
    post_modified: values[14] || null,
    post_type: values[20] || 'post',
  };
}

function parseSQLValue(value) {
  if (!value || value === 'NULL' || value === '') {
    return null;
  }
  // Remove surrounding quotes
  if ((value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1).replace(/''/g, "'").replace(/""/g, '"');
  }
  return value;
}

function extractFeaturedImage(content) {
  // Look for img tags
  const imgMatch = content.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  if (imgMatch) {
    return imgMatch[1];
  }
  // Look for wp-image class
  const wpImageMatch = content.match(/wp-image-\d+/);
  if (wpImageMatch) {
    // Could extract from attachment, but for now return null
    return null;
  }
  return null;
}

function cleanHTML(text) {
  if (!text) return '';
  return text
    .replace(/<!--.*?-->/gs, '') // Remove comments
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove styles
    .trim();
}

function convertToArticle(wpPost) {
  const content = cleanHTML(wpPost.post_content);
  const excerpt = cleanHTML(wpPost.post_excerpt) || content.substring(0, 200).replace(/<[^>]+>/g, '') + '...';
  const featuredImage = extractFeaturedImage(wpPost.post_content);
  
  // Determine language - you can enhance this logic
  // For now, check if title/content suggests English
  const isEnglish = /[a-zA-Z]/.test(wpPost.post_title) && 
                    !/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(wpPost.post_title.toLowerCase());
  const language = isEnglish ? 'en' : 'nl';
  
  const publishedAt = wpPost.post_date && 
                      wpPost.post_date !== '0000-00-00 00:00:00' &&
                      wpPost.post_date !== "0000-00-00 00:00:00"
    ? new Date(wpPost.post_date).toISOString()
    : new Date().toISOString();
  
  // Generate slug if missing
  let slug = wpPost.post_name;
  if (!slug || slug === '') {
    slug = wpPost.post_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) {
      slug = `post-${wpPost.id}`;
    }
  }
  
  return {
    title: wpPost.post_title || 'Untitled',
    slug: slug,
    content: content,
    excerpt: excerpt,
    author: 'Vision4Soccer', // Default author
    featured_image_url: featuredImage,
    language: language,
    published: true,
    published_at: publishedAt,
  };
}

export default async function migrate() {
  try {
    console.log('Starting WordPress migration...');
    
    // Read SQL file
    const sqlFilePath = join(__dirname, '../../dbs7612387.sql');
    console.log(`Reading ${sqlFilePath}...`);
    
    const sqlContent = readFileSync(sqlFilePath, 'utf-8');
    console.log(`File read: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Extract posts
    console.log('Extracting posts from SQL...');
    const wpPosts = extractPostsFromSQL(sqlContent);
    console.log(`Found ${wpPosts.length} published posts`);
    
    if (wpPosts.length === 0) {
      return { success: true, migrated: 0, message: 'No posts found' };
    }
    
    // Convert and insert
    console.log('Converting and inserting articles...');
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const wpPost of wpPosts) {
      try {
        const article = convertToArticle(wpPost);
        
        // Check for existing slug
        const existing = await sql.query(
          'SELECT id FROM articles WHERE slug = $1',
          [article.slug]
        );
        
        if (existing.rows.length > 0) {
          skipped++;
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
          console.log(`Progress: ${migrated} migrated, ${skipped} skipped, ${errors} errors`);
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          console.error(`Error migrating post ${wpPost.id}:`, error.message);
        }
      }
    }
    
    console.log(`Migration complete!`);
    console.log(`  Migrated: ${migrated}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Errors: ${errors}`);
    
    return {
      success: true,
      migrated,
      skipped,
      errors,
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(result => {
      if (result.success) {
        console.log('✅ Migration successful!');
        process.exit(0);
      } else {
        console.error('❌ Migration failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

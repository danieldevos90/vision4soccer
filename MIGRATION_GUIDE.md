# WordPress to Articles Migration Guide

This guide explains how to migrate WordPress posts from `dbs7612387.sql` to the Vercel Postgres articles table.

## Prerequisites

1. Vercel Postgres database set up and connected
2. Articles table created (run `api/db/schema.sql`)
3. The `dbs7612387.sql` file in the project root

## Migration Methods

### Method 1: Via API Endpoint (Recommended for Vercel)

1. Deploy your project to Vercel
2. Make a POST request to trigger the migration:

```bash
curl -X POST https://your-project.vercel.app/api/migrate
```

Or use your browser/Postman to POST to `/api/migrate`

**Note:** In production, you should add authentication to protect this endpoint!

### Method 2: Local Migration Script

If you want to run the migration locally:

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```env
POSTGRES_URL=your_postgres_connection_string
```

3. Run the migration:
```bash
node api/db/migrate-wordpress-simple.js
```

### Method 3: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Pull environment variables:
```bash
vercel env pull
```

4. Run the migration script:
```bash
node api/db/migrate-wordpress-simple.js
```

## What Gets Migrated

The migration script will:

1. **Extract WordPress Posts**: Reads all posts from `wp_posts` table where:
   - `post_type = 'post'` (excludes pages, attachments, etc.)
   - `post_status = 'publish'` (only published posts)

2. **Convert Data**:
   - `post_title` → `title`
   - `post_name` → `slug` (or generates one from title)
   - `post_content` → `content` (cleaned of scripts/styles)
   - `post_excerpt` → `excerpt` (or generates from content)
   - `post_date` → `published_at`
   - Extracts featured image from content
   - Detects language (nl/en) based on content

3. **Insert into Articles Table**: 
   - Skips duplicates (based on slug)
   - Sets `published = true`
   - Sets default author as "Vision4Soccer"

## Migration Output

The migration will show:
- Total posts found
- Number successfully migrated
- Number skipped (duplicates)
- Number of errors

Example output:
```
Starting WordPress migration...
Reading dbs7612387.sql...
File read: 2.45 MB
Extracting posts from SQL...
Found 25 published posts
Converting and inserting articles...
Progress: 10 migrated, 0 skipped, 0 errors
Progress: 20 migrated, 0 skipped, 0 errors
Migration complete!
  Migrated: 25
  Skipped: 0
  Errors: 0
```

## Troubleshooting

### "File not found" error

Make sure `dbs7612387.sql` is in the project root directory.

### "Connection refused" or database errors

1. Check your `POSTGRES_URL` environment variable
2. Ensure your Vercel Postgres database is not paused
3. Verify the articles table exists (run `api/db/schema.sql`)

### Memory errors with large SQL files

The script processes the file in chunks. If you encounter memory issues:
- The script will still work but may be slower
- Consider running on Vercel where you have more resources
- Or split the SQL file into smaller chunks

### Duplicate slug errors

The migration automatically skips articles with duplicate slugs. If you want to update existing articles instead, modify the migration script to use `INSERT ... ON CONFLICT UPDATE`.

### Language detection issues

The script uses simple heuristics to detect language. You may need to:
- Manually update language after migration
- Enhance the detection logic in `convertToArticle()`
- Add a language field to WordPress and map it

## Post-Migration

After migration:

1. **Verify articles**: Check your articles via the API:
```bash
GET /api/articles
```

2. **Update author names**: If you have author information, you can update it:
```sql
UPDATE articles SET author = 'Author Name' WHERE slug = 'article-slug';
```

3. **Fix language**: Review and update language if needed:
```sql
UPDATE articles SET language = 'en' WHERE title LIKE '%English%';
```

4. **Add featured images**: If images weren't extracted, you can add them manually or enhance the extraction logic.

## Security Note

⚠️ **Important**: The `/api/migrate` endpoint should be protected in production! Add authentication before deploying:

```javascript
// In api/migrate/index.js
const MIGRATION_TOKEN = process.env.MIGRATION_TOKEN;

if (req.headers.authorization !== `Bearer ${MIGRATION_TOKEN}`) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

Then set `MIGRATION_TOKEN` in your Vercel environment variables.

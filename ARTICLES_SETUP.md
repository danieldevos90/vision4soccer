# Articles Setup with Vercel Postgres

This guide explains how to set up and use Vercel Postgres for managing articles on the Vision4Soccer website.

## Prerequisites

1. A Vercel account (free tier is sufficient)
2. Your project deployed on Vercel (or ready to deploy)

## Step 1: Create Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to the **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose the **Hobby** (free) plan
6. Select a region close to your users
7. Click **Create**

Vercel will automatically add the database connection environment variables to your project.

## Step 2: Run Database Schema

1. In your Vercel dashboard, go to your Postgres database
2. Click on the **Data** tab or use the SQL Editor
3. Copy and paste the contents of `api/db/schema.sql`
4. Execute the SQL to create the `articles` table

Alternatively, you can use the Vercel CLI:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull

# Connect to your database (if you have psql installed)
psql $POSTGRES_URL < api/db/schema.sql
```

## Step 3: Environment Variables

Vercel automatically adds these environment variables when you create a Postgres database:

- `POSTGRES_URL` - Connection string with connection pooling
- `POSTGRES_PRISMA_URL` - Prisma-compatible connection string
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)
- `POSTGRES_USER` - Database user
- `POSTGRES_HOST` - Database host
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DATABASE` - Database name

These are automatically available in your Vercel deployment. For local development, create a `.env.local` file (see `.env.example`).

## Step 4: Install Dependencies

```bash
npm install
```

This will install `@vercel/postgres` which is already added to `package.json`.

## Step 5: Test the API

Once deployed, you can test the API endpoints:

### Get all articles
```bash
GET https://your-project.vercel.app/api/articles
```

### Get articles by language
```bash
GET https://your-project.vercel.app/api/articles?language=nl&published=true
```

### Create an article
```bash
POST https://your-project.vercel.app/api/articles
Content-Type: application/json

{
  "title": "My First Article",
  "slug": "my-first-article",
  "content": "This is the full article content...",
  "excerpt": "A brief summary",
  "author": "John Doe",
  "language": "nl",
  "published": true
}
```

### Get article by ID
```bash
GET https://your-project.vercel.app/api/articles/1
```

### Get article by slug
```bash
GET https://your-project.vercel.app/api/articles/slug/my-first-article?language=nl
```

## Step 6: Use Articles in Your React Components

### Basic Usage

```jsx
import { useArticles } from '../hooks/useArticles';
import { useI18n } from '../i18n/i18n';

function MyComponent() {
  const { language } = useI18n();
  const { articles, loading, error } = useArticles({
    language,
    published: true,
    limit: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

### Add Articles Route

Add the Articles component to your router in `src/App.jsx`:

```jsx
import { Articles } from './components/pages/Articles/Articles';

// In your Routes:
<Route path="/articles/" element={<Articles />} />
```

## API Endpoints

### GET `/api/articles`
Get all articles with optional filters.

**Query Parameters:**
- `language` (string): Filter by language (nl/en)
- `published` (boolean): Filter by published status
- `limit` (number): Number of articles to return (default: 10)
- `offset` (number): Offset for pagination (default: 0)

### POST `/api/articles`
Create a new article.

**Body:**
```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "content": "Full article content",
  "excerpt": "Brief summary",
  "author": "Author Name",
  "featured_image_url": "https://example.com/image.jpg",
  "language": "nl",
  "published": true
}
```

### GET `/api/articles/[id]`
Get a single article by ID.

### PUT `/api/articles/[id]`
Update an article. Include only the fields you want to update.

### DELETE `/api/articles/[id]`
Delete an article.

### GET `/api/articles/slug/[slug]`
Get an article by slug.

**Query Parameters:**
- `language` (string): Optional language filter

## Free Tier Limits

Vercel Postgres Hobby (Free) tier includes:
- **60 hours** of compute time per month
- **0.25 GB** of storage
- **256 MB** of RAM

This should be sufficient for:
- Small to medium blog/article sites
- Up to ~1000 articles (depending on content size)
- Low to moderate traffic

## Troubleshooting

### API routes not working locally

Make sure you're using Vercel CLI for local development:

```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless functions.

### Database connection errors

1. Verify environment variables are set in Vercel dashboard
2. Check that your database is not paused (free tier databases pause after inactivity)
3. Ensure your IP is not blocked (unlikely on free tier)

### CORS issues

If you're calling the API from a different domain, you may need to add CORS headers to your API routes.

## Next Steps

- Add article detail pages
- Implement article search
- Add article categories/tags
- Create an admin interface for managing articles
- Add image upload functionality

import { sql } from '@vercel/postgres';

// GET /api/articles - Get all articles (with optional filters)
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const language = url.searchParams.get('language') || 'nl';
      const published = url.searchParams.get('published');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = 'SELECT * FROM articles WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (language) {
        query += ` AND language = $${paramIndex}`;
        params.push(language);
        paramIndex++;
      }

      if (published !== null) {
        query += ` AND published = $${paramIndex}`;
        params.push(published === 'true');
        paramIndex++;
      }

      query += ` ORDER BY published_at DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await sql.query(query, params);

      res.status(200).json({
        articles: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        author,
        featured_image_url,
        language = 'nl',
        published = false,
      } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({
          error: 'Title, slug, and content are required',
        });
      }

      const publishedAt = published ? new Date().toISOString() : null;

      const result = await sql.query(
        `INSERT INTO articles (title, slug, content, excerpt, author, featured_image_url, language, published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [title, slug, content, excerpt || null, author || null, featured_image_url || null, language, published, publishedAt]
      );

      res.status(201).json({ article: result.rows[0] });
    } catch (error) {
      console.error('Error creating article:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'An article with this slug already exists',
        });
      }

      res.status(500).json({ error: 'Failed to create article' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

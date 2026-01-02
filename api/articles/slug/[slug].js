import { sql } from '@vercel/postgres';

// GET /api/articles/slug/[slug] - Get an article by slug
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { slug } = req.query;
      const url = new URL(req.url, `http://${req.headers.host}`);
      const language = url.searchParams.get('language');

      let query = 'SELECT * FROM articles WHERE slug = $1';
      const params = [slug];

      if (language) {
        query += ' AND language = $2';
        params.push(language);
      }

      const result = await sql.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.status(200).json({ article: result.rows[0] });
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

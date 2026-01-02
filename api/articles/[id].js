import { sql } from '@vercel/postgres';

// GET /api/articles/[id] - Get a single article by ID
// PUT /api/articles/[id] - Update an article
// DELETE /api/articles/[id] - Delete an article
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await sql.query(
        'SELECT * FROM articles WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.status(200).json({ article: result.rows[0] });
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        author,
        featured_image_url,
        language,
        published,
      } = req.body;

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        values.push(title);
        paramIndex++;
      }
      if (slug !== undefined) {
        updates.push(`slug = $${paramIndex}`);
        values.push(slug);
        paramIndex++;
      }
      if (content !== undefined) {
        updates.push(`content = $${paramIndex}`);
        values.push(content);
        paramIndex++;
      }
      if (excerpt !== undefined) {
        updates.push(`excerpt = $${paramIndex}`);
        values.push(excerpt);
        paramIndex++;
      }
      if (author !== undefined) {
        updates.push(`author = $${paramIndex}`);
        values.push(author);
        paramIndex++;
      }
      if (featured_image_url !== undefined) {
        updates.push(`featured_image_url = $${paramIndex}`);
        values.push(featured_image_url);
        paramIndex++;
      }
      if (language !== undefined) {
        updates.push(`language = $${paramIndex}`);
        values.push(language);
        paramIndex++;
      }
      if (published !== undefined) {
        updates.push(`published = $${paramIndex}`);
        values.push(published);
        paramIndex++;
        if (published && !req.body.published_at) {
          updates.push(`published_at = $${paramIndex}`);
          values.push(new Date().toISOString());
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);
      const query = `UPDATE articles SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

      const result = await sql.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.status(200).json({ article: result.rows[0] });
    } catch (error) {
      console.error('Error updating article:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'An article with this slug already exists',
        });
      }

      res.status(500).json({ error: 'Failed to update article' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await sql.query(
        'DELETE FROM articles WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

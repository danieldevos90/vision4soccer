import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching articles from the API
 * @param {Object} options - Query options
 * @param {string} options.language - Filter by language (nl/en)
 * @param {boolean} options.published - Filter by published status
 * @param {number} options.limit - Number of articles to fetch
 * @param {number} options.offset - Offset for pagination
 */
export function useArticles(options = {}) {
  const {
    language,
    published = true,
    limit = 10,
    offset = 0,
  } = options;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (language) params.append('language', language);
        if (published !== null) params.append('published', published);
        params.append('limit', limit);
        params.append('offset', offset);

        const response = await fetch(`/api/articles?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [language, published, limit, offset]);

  return { articles, loading, error };
}

/**
 * Custom hook for fetching a single article by ID
 */
export function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/articles/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          }
          throw new Error('Failed to fetch article');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
}

/**
 * Custom hook for fetching an article by slug
 */
export function useArticleBySlug(slug, language) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (language) params.append('language', language);

        const response = await fetch(`/api/articles/slug/${slug}?${params.toString()}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          }
          throw new Error('Failed to fetch article');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, language]);

  return { article, loading, error };
}

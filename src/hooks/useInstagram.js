import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching Instagram feed from Behold.so
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of posts to fetch (default: 9)
 * @param {boolean} options.enabled - Whether to fetch (default: true)
 */
export function useInstagram(options = {}) {
  const {
    limit = 9,
    enabled = true,
  } = options;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchInstagram = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`[useInstagram] Fetching Instagram feed (limit: ${limit})`);

        const response = await fetch(`/api/instagram?limit=${limit}`);
        
        if (!response.ok) {
          console.error(`[useInstagram] API error: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch Instagram feed: ${response.status}`);
        }

        const data = await response.json();
        const postsCount = data.posts?.length || 0;
        console.log(`[useInstagram] Successfully fetched ${postsCount} posts`, {
          cached: data.cached,
          stale: data.stale,
          error: data.error,
        });
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        console.error('[useInstagram] Error fetching Instagram feed:', err.message);
        console.error('[useInstagram] Will fallback to static data');
        // Fallback to empty array on error
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagram();
  }, [limit, enabled]);

  return { posts, loading, error };
}

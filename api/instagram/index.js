// GET /api/instagram - Fetch Instagram feed from Behold.so
// This endpoint fetches the latest Instagram posts from Behold.so JSON feed
// and caches the response for better performance
//
// To find your Behold feed ID:
// 1. Log into your Behold.so account
// 2. Go to your feed settings
// 3. The feed ID is in the JSON feed URL: https://feeds.behold.so/{feedId}.json
// 4. Or set BEHOLD_FEED_ID environment variable

// Behold.so feed ID - can be set via environment variable or hardcoded
const BEHOLD_FEED_ID = process.env.BEHOLD_FEED_ID || '18GsX8PAdHDN3Fcqdwjj';
// Behold feeds work with or without .json extension
const BEHOLD_FEED_URL = `https://feeds.behold.so/${BEHOLD_FEED_ID}`;

// Cache settings
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let cachedData = null;
let cacheTimestamp = null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit || '9', 10);
    
    // Log initial request
    console.log(`[Instagram API] Request received - feedId: ${BEHOLD_FEED_ID}, limit: ${limit}`);

    // Check cache first
    const now = Date.now();
    if (cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      const limitedPosts = cachedData.posts.slice(0, limit);
      const cacheAge = Math.round((now - cacheTimestamp) / 1000 / 60); // minutes
      console.log(`[Instagram API] Using cached data (age: ${cacheAge} minutes, posts: ${limitedPosts.length})`);
      return res.status(200).json({
        posts: limitedPosts,
        cached: true,
        timestamp: cacheTimestamp,
      });
    }

    // Fetch from Behold.so
    console.log(`[Instagram API] Fetching from Behold.so feed: ${BEHOLD_FEED_URL}`);
    const response = await fetch(BEHOLD_FEED_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Vision4Soccer/1.0)',
      },
    });

    console.log(`[Instagram API] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Instagram API] Behold API error: ${response.status} ${response.statusText}`);
      console.error(`[Instagram API] Error response (first 500 chars): ${errorText.substring(0, 500)}`);
      
      // Only throw feed ID error if we're certain it's a feed ID issue
      if (response.status === 404 && errorText.includes('Incorrect feed id')) {
        throw new Error(`Invalid Behold feed ID: ${BEHOLD_FEED_ID}. Please check your Behold dashboard for the correct feed ID.`);
      }
      
      // For other errors, provide more context
      throw new Error(`Behold API returned ${response.status}: ${errorText.substring(0, 200)}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      console.error(`[Instagram API] Failed to parse JSON response:`, jsonError);
      console.error(`[Instagram API] Response text:`, text.substring(0, 200));
      throw new Error(`Invalid JSON response from Behold: ${text.substring(0, 100)}`);
    }
    
    // Check if response indicates an error
    if (!data || data.error || (typeof data === 'string' && data.includes('Incorrect feed id'))) {
      console.error(`[Instagram API] Behold returned error:`, data);
      throw new Error(`Invalid Behold feed ID: ${BEHOLD_FEED_ID}. Please check your Behold dashboard for the correct feed ID.`);
    }
    
    // Validate data structure
    if (!Array.isArray(data.posts)) {
      console.error(`[Instagram API] Invalid data structure - posts is not an array:`, typeof data.posts);
      throw new Error(`Invalid data structure from Behold: posts is not an array`);
    }
    
    console.log(`[Instagram API] Successfully fetched ${data.posts?.length || 0} posts from Behold.so`);

    // Transform the data to match your component's expected format
    const transformedPosts = (data.posts || []).map((post) => {
      // Get image URL - prefer medium size, fallback to large or small
      let imageUrl = post.mediaUrl;
      if (post.sizes) {
        imageUrl = post.sizes.medium?.mediaUrl || 
                   post.sizes.large?.mediaUrl || 
                   post.sizes.small?.mediaUrl || 
                   post.mediaUrl;
      }
      
      // Handle carousel albums - use first child image if available
      if (post.mediaType === 'CAROUSEL_ALBUM' && post.children && post.children.length > 0) {
        const firstChild = post.children[0];
        if (firstChild.sizes) {
          imageUrl = firstChild.sizes.medium?.mediaUrl || 
                     firstChild.sizes.large?.mediaUrl || 
                     firstChild.sizes.small?.mediaUrl || 
                     firstChild.mediaUrl;
        } else {
          imageUrl = firstChild.mediaUrl;
        }
      }

      return {
        id: post.id,
        image: imageUrl,
        alt: post.caption || `Instagram post ${post.id}`,
        url: post.permalink,
        timestamp: post.timestamp,
        mediaType: post.mediaType,
      };
    });

    // Update cache
    cachedData = {
      posts: transformedPosts,
      username: data.username,
      profilePictureUrl: data.profilePictureUrl,
      followersCount: data.followersCount,
    };
    cacheTimestamp = now;

    // Limit posts
    const limitedPosts = transformedPosts.slice(0, limit);
    console.log(`[Instagram API] Returning ${limitedPosts.length} posts (limit: ${limit})`);

    // Set cache headers for client-side caching
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).json({
      posts: limitedPosts,
      cached: false,
      timestamp: cacheTimestamp,
    });
  } catch (error) {
    console.error('[Instagram API] Error fetching Instagram feed:', error.message);
    console.error('[Instagram API] Error stack:', error.stack);
    console.error('[Instagram API] Error details:', {
      feedId: BEHOLD_FEED_ID,
      feedUrl: BEHOLD_FEED_URL,
      hasCache: !!cachedData,
      cacheAge: cachedData && cacheTimestamp ? Math.round((Date.now() - cacheTimestamp) / 1000 / 60) : null,
      errorType: error.constructor.name,
    });
    
    // If we have cached data, return it even if expired
    if (cachedData) {
      const limitedPosts = cachedData.posts.slice(0, parseInt(req.query.limit || '9', 10));
      const cacheAge = Math.round((Date.now() - cacheTimestamp) / 1000 / 60); // minutes
      console.log(`[Instagram API] FALLBACK: Using stale cache (age: ${cacheAge} minutes, posts: ${limitedPosts.length})`);
      return res.status(200).json({
        posts: limitedPosts,
        cached: true,
        stale: true,
        error: error.message,
      });
    }

    console.error('[Instagram API] FALLBACK: No cache available, returning error');
    return res.status(500).json({ 
      error: 'Failed to fetch Instagram feed',
      message: error.message,
    });
  }
}

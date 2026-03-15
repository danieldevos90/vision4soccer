# Instagram Feed Setup with Behold.so

This project uses [Behold.so](https://behold.so) to fetch Instagram posts dynamically. The feed now updates automatically based on your Behold subscription plan.

## How It Works

1. **Dynamic Fetching**: The Instagram feed now fetches posts from Behold.so's JSON feed API instead of using static data
2. **Automatic Updates**: Behold.so updates your feed automatically based on your subscription:
   - **Free Plan**: Updates once per day
   - **Starter Plan ($10/month)**: Updates once per hour
   - **Pro Plan ($30/month)**: Updates every 5 minutes
   - **Scale/Enterprise**: Updates every 5 minutes or every minute

3. **Caching**: Our API endpoint caches the feed for 1 hour to reduce API calls while still showing fresh content

## Setup Instructions

### 1. Find Your Behold Feed ID

1. Log into your [Behold.so account](https://behold.so)
2. Navigate to your feed settings
3. Look for the JSON feed URL, which will be in the format:
   ```
   https://feeds.behold.so/{feedId}.json
   ```
4. Copy the `feedId` from the URL

### 2. Configure the Feed ID

You can set the feed ID in two ways:

**Option A: Environment Variable (Recommended)**
```bash
# In your .env file or Vercel environment variables
BEHOLD_FEED_ID=your-feed-id-here
```

**Option B: Update the API file directly**
Edit `api/instagram/index.js` and update the `BEHOLD_FEED_ID` constant:
```javascript
const BEHOLD_FEED_ID = 'your-feed-id-here';
```

### 3. Verify the Feed ID

The feed ID can be found in your existing Instagram image URLs. Looking at your current data, the pattern suggests it might be `18GsX8PAdHDN3Fcqdwjj`, but you should verify this in your Behold dashboard.

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```
   
   **Important**: This project uses `vercel dev` to run API routes locally. If you prefer to use Vite directly (without API routes), you can use:
   ```bash
   npm run dev:vite
   ```
   But note that API routes won't work with `dev:vite` - they only work with `vercel dev` or when deployed to Vercel.

2. Visit the page with the Instagram feed component

3. Check the browser console and network tab to see if the feed is loading correctly

4. The feed should now show the latest posts from your Instagram account

## Troubleshooting

### Feed Not Updating

- **Check your Behold subscription plan**: Free plans update once per day. If you need more frequent updates, consider upgrading.
- **Verify the feed ID**: Make sure the feed ID in the API matches your Behold dashboard
- **Check API endpoint**: Visit `/api/instagram` directly to see if it returns data
- **Check browser console**: Look for any error messages

### API Routes Not Working in Development

If you see errors like `Unexpected token '/', "// GET /ap"... is not valid JSON`, it means the API routes aren't being handled correctly.

**Solution**: Use `vercel dev` instead of `vite` for development:
```bash
npm run dev
```

This will start Vercel's development server which properly handles serverless functions. The `dev` script has been updated to use `vercel dev` by default.

If you need to use Vite directly (without API routes), use:
```bash
npm run dev:vite
```

### Missing Latest Posts

- Behold.so updates based on your subscription plan. If you're on the free plan, new posts may take up to 24 hours to appear
- The API caches responses for 1 hour, but will fetch fresh data when the cache expires
- If you need immediate updates, consider upgrading your Behold subscription

## API Endpoint

The feed is available at: `/api/instagram`

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 9)

**Example:**
```
GET /api/instagram?limit=12
```

## Files Modified

- `src/hooks/useInstagram.js` - Custom hook for fetching Instagram data
- `api/instagram/index.js` - API endpoint that fetches from Behold.so
- `src/components/pages/InstagramFeed/InstagramFeed.jsx` - Updated to use dynamic data
- `src/components/pages/InstagramFeed/InstagramFeed.module.css` - Added loading/error styles

## Fallback Behavior

If the API fails to fetch data, the component will:
1. First try to use any posts passed as props
2. Then try to use dynamically fetched posts
3. Finally fall back to the static data in `src/data/insta.js`

This ensures the feed always displays something, even if the API is temporarily unavailable.

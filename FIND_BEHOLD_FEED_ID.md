# How to Find Your Behold Feed ID

The feed ID you're using (`18167207944383565`) is incorrect. Here's how to find the correct one:

## Method 1: From Behold Dashboard (Recommended)

1. **Log into your Behold account**: https://behold.so
2. **Navigate to your feed settings**
3. **Look for the JSON feed URL** - it will be in one of these formats:
   - `https://feeds.behold.so/{feedId}.json`
   - Or in the feed settings, look for "JSON Feed" or "API" section
4. **Copy the feed ID** from the URL

## Method 2: Check Your Behold Account

1. Go to https://behold.so and log in
2. Click on your feed/widget
3. Look for "JSON Feed" or "API" option
4. The feed ID will be in the URL provided

## Method 3: Test Different IDs

The feed ID format is typically a short alphanumeric string (not the long numeric ID you provided).

Common patterns:
- Short alphanumeric: `abc123xyz`
- Mixed case: `AbC123XyZ`

## Current Issue

The API is returning: `"Incorrect feed id"`

This means the feed ID `18167207944383565` is not valid for Behold's JSON feed API.

## Next Steps

1. Find your correct feed ID using Method 1 above
2. Update the feed ID in one of these ways:

**Option A: Environment Variable (Recommended)**
```bash
# In Vercel dashboard, add environment variable:
BEHOLD_FEED_ID=your-correct-feed-id
```

**Option B: Update the code**
Edit `api/instagram/index.js` and change:
```javascript
const BEHOLD_FEED_ID = process.env.BEHOLD_FEED_ID || 'your-correct-feed-id';
```

3. Redeploy to Vercel:
```bash
vercel --prod
```

## Note

The feed ID in image URLs (like `18GsX8PAdHDN3Fcqdwjj`) is different from the JSON feed ID. You need the JSON feed ID specifically.

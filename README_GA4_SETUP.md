# GA4, Cookie Consent & GDPR Implementation

This document outlines the GA4 (Google Analytics 4) implementation with GDPR-compliant cookie consent management.

## Features

✅ **GA4 with Consent Mode v2** - GDPR-compliant tracking  
✅ **Cookie Consent Banner** - Bilingual (Dutch/English)  
✅ **GDPR Compliance** - IP anonymization, consent before tracking  
✅ **Event Tracking** - Comprehensive event tracking utilities  
✅ **Privacy-First** - No tracking without explicit consent  

## Setup Instructions

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to **Admin** → **Data Streams**
4. Select your web stream
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Create a `.env` file in the root of your project (if it doesn't exist):

```bash
# Google Analytics 4 Measurement ID
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

**For Vercel deployment:**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `VITE_GA4_MEASUREMENT_ID` with your Measurement ID
4. Set it for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

### 3. Privacy Policy (Required)

You need to create a privacy policy page. Update the privacy policy URL in the translations:

- **Dutch**: `src/i18n/locales/nl.json` → `cookie.privacyPolicyUrl`
- **English**: `src/i18n/locales/en.json` → `cookie.privacyPolicyUrl`

Currently set to `/privacy` - create this route or update to your actual privacy policy URL.

## How It Works

### Consent Mode v2

The implementation uses Google's Consent Mode v2, which ensures:
- **Default Deny**: All tracking is disabled by default (GDPR compliant)
- **Consent Required**: Tracking only starts after user consent
- **Granular Control**: Users can accept/reject analytics and advertising cookies separately

### Cookie Banner

The cookie banner appears on first visit and allows users to:
- Accept all cookies
- Reject all cookies
- Customize cookie preferences
- View privacy policy

Consent preferences are stored in localStorage and cookies, and persist across sessions.

### Analytics Tracking

Once consent is given, the following events are automatically tracked:

- **Page Views** - Automatic tracking on route changes
- **Button Clicks** - Via `useAnalytics` hook
- **Link Clicks** - Via `useAnalytics` hook
- **Contact Interactions** - Email/phone clicks
- **Social Media Clicks** - Instagram, etc.
- **Form Interactions** - Form starts and submissions
- **Article Views** - When viewing articles
- **Custom Events** - Via `useAnalytics` hook

## Usage Examples

### Track Button Click

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackButtonClick } = useAnalytics();

  return (
    <button onClick={() => trackButtonClick('Read More', 'homepage')}>
      Read More
    </button>
  );
}
```

### Track Link Click

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackLinkClick } = useAnalytics();

  return (
    <a 
      href="/about"
      onClick={() => trackLinkClick('About Us', '/about')}
    >
      About Us
    </a>
  );
}
```

### Track Contact Interaction

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

function ContactComponent() {
  const { trackContact } = useAnalytics();

  return (
    <a 
      href="mailto:info@example.com"
      onClick={() => trackContact('email', 'info@example.com')}
    >
      Email Us
    </a>
  );
}
```

### Track Custom Event

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackCustom } = useAnalytics();

  const handleSpecialAction = () => {
    trackCustom('special_action', {
      action_type: 'download',
      file_name: 'brochure.pdf',
    });
  };

  return <button onClick={handleSpecialAction}>Download</button>;
}
```

## GDPR Compliance

This implementation follows GDPR best practices:

1. **Consent Before Tracking** - No tracking until user explicitly consents
2. **IP Anonymization** - All IP addresses are anonymized
3. **Clear Information** - Cookie banner explains what cookies are used for
4. **Granular Control** - Users can choose which cookies to accept
5. **Withdrawable Consent** - Users can change preferences at any time
6. **Privacy Policy Link** - Clear link to privacy policy

## Testing

### Local Development

1. Make sure `.env` file contains `VITE_GA4_MEASUREMENT_ID`
2. Start dev server: `npm run dev`
3. Open browser and check:
   - Cookie banner appears on first visit
   - GA4 script only loads after consent
   - Events are tracked in GA4 Real-Time reports

### Verify Consent Mode

1. Open browser DevTools → Network tab
2. Filter for `google-analytics.com` or `googletagmanager.com`
3. Before consent: No requests should be made
4. After consent: Requests should include consent parameters

### Check Events in GA4

1. Go to GA4 → Reports → Real-time
2. Perform actions on your site (clicks, page views)
3. Events should appear within seconds in Real-time report

## Files Created/Modified

### New Files:
- `src/utils/analytics.js` - GA4 utility functions
- `src/components/ui/CookieBanner/CookieBanner.jsx` - Cookie consent banner
- `src/components/ui/CookieBanner/CookieBanner.module.css` - Banner styles
- `src/components/ui/CookieBanner/index.js` - Banner export
- `src/components/analytics/PageViewTracker.jsx` - Page view tracking
- `src/components/analytics/index.js` - Analytics exports
- `src/hooks/useAnalytics.js` - Analytics tracking hook

### Modified Files:
- `src/App.jsx` - Added CookieBanner and PageViewTracker
- `src/i18n/locales/nl.json` - Added cookie consent translations
- `src/i18n/locales/en.json` - Added cookie consent translations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | Yes |

## Privacy Policy Requirement

⚠️ **Important**: You must create a privacy policy page that explains:
- What cookies are used
- Why they are used
- How users can manage their preferences
- Contact information for privacy inquiries

Update the privacy policy URL in the translation files if your privacy policy is at a different URL.

## Support

For issues or questions:
- GA4 Documentation: https://developers.google.com/analytics/devguides/collection/ga4
- Consent Mode v2: https://support.google.com/analytics/answer/9976101

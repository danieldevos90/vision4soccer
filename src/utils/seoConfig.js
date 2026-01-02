/**
 * SEO Configuration
 * Centralized SEO metadata for different pages
 */

const baseUrl = 'https://vision4soccer.nl';

export const getHomepageSEO = (language) => {
  const isNL = language === 'nl';
  
  return {
    title: isNL 
      ? 'Vision4Soccer – Topsportbegeleiding met een visie'
      : 'Vision4Soccer – Elite sports guidance with vision',
    description: isNL
      ? 'Vision4Soccer - Topsportbegeleiding met visie. Sinds 1999 actief in de nationale en internationale voetbalmarkt. Begeleiding door ex-profvoetballers Edwin Olde Riekerink en de VVCS.'
      : 'Vision4Soccer - Elite sports guidance with vision. Since 1999, active in the national and international football market. Guidance by former professional footballers Edwin Olde Riekerink and VVCS.',
    keywords: isNL
      ? 'voetbalbegeleiding, spelersbegeleider, voetbalagent, VVCS, Vision4Soccer, Edwin Olde Riekerink, topsportbegeleiding, profvoetbal'
      : 'football guidance, player guidance, football agent, VVCS, Vision4Soccer, Edwin Olde Riekerink, elite sports guidance, professional football',
  };
};

export const getProfileSEO = (language) => {
  const isNL = language === 'nl';
  
  return {
    title: isNL
      ? 'Profiel – Vision4Soccer'
      : 'Profile – Vision4Soccer',
    description: isNL
      ? 'Vision4Soccer is opgericht door en voor voetballers. Sinds 1999 actief in de nationale en internationale markt. Vertrouwen, kennis en ervaring vormen de basis voor technische, mentale, fysieke en zakelijke ondersteuning van onze spelers.'
      : 'Vision4Soccer was founded by and for footballers. Since 1999, active in the national and international market. Trust, knowledge and experience form the basis for technical, mental, physical and business support of our players.',
    keywords: isNL
      ? 'Vision4Soccer profiel, spelersbegeleiding, voetbalbegeleiding, VVCS partner, Edwin Olde Riekerink, Arnold Oosterveer'
      : 'Vision4Soccer profile, player guidance, football guidance, VVCS partner, Edwin Olde Riekerink, Arnold Oosterveer',
    canonical: isNL ? `${baseUrl}/profiel/` : `${baseUrl}/profile/`,
  };
};

export const getYouthSEO = (language) => {
  const isNL = language === 'nl';
  
  return {
    title: isNL
      ? 'Jeugd – Vision4Soccer'
      : 'Youth – Vision4Soccer',
    description: isNL
      ? 'Ben je ouder dan 14 jaar en 6 maanden? Sta je aan het begin van een veelbelovende carrière? Vision4Soccer biedt gratis advies en begeleiding voor jonge voetballers en hun ouders.'
      : 'Are you older than 14 years and 6 months? Are you at the beginning of a promising career? Vision4Soccer offers free advice and guidance for young footballers and their parents.',
    keywords: isNL
      ? 'jeugdvoetbal, jonge voetballers, jeugdbegeleiding, voetbaltalent, jeugdspelersbegeleiding'
      : 'youth football, young footballers, youth guidance, football talent, youth player guidance',
    canonical: isNL ? `${baseUrl}/jeugd/` : `${baseUrl}/youth/`,
  };
};

export const getContactSEO = (language) => {
  const isNL = language === 'nl';
  
  return {
    title: isNL
      ? 'Contact – Vision4Soccer'
      : 'Contact – Vision4Soccer',
    description: isNL
      ? 'Neem contact op met Vision4Soccer. Ons kantoor bevindt zich in Hoofddorp, Nederland. We helpen je graag verder met vragen over spelersbegeleiding.'
      : 'Contact Vision4Soccer. Our office is located in Hoofddorp, Netherlands. We are happy to help you with questions about player guidance.',
    keywords: isNL
      ? 'Vision4Soccer contact, spelersbegeleider contact, voetbalagent contact, Hoofddorp'
      : 'Vision4Soccer contact, player guidance contact, football agent contact, Hoofddorp',
    canonical: `${baseUrl}/contact/`,
  };
};

export const getArticleSEO = (article, language) => {
  const isNL = language === 'nl';
  const baseUrl = 'https://vision4soccer.nl';
  
  return {
    title: `${article.title} – Vision4Soccer`,
    description: article.excerpt || article.content?.substring(0, 160) || getHomepageSEO(language).description,
    keywords: article.tags?.join(', ') || getHomepageSEO(language).keywords,
    canonical: `${baseUrl}/articles/${article.slug}`,
    type: 'article',
    article: {
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || article.published_at,
      author: article.author || 'Vision4Soccer',
      section: 'News',
      tags: article.tags || [],
    },
    image: article.featured_image_url || `${baseUrl}/logosoccervision.svg`,
  };
};

export const getOrganizationSchema = () => ({
  name: 'Vision4Soccer',
  url: baseUrl,
  logo: `${baseUrl}/logosoccervision.svg`,
  description: 'Vision4Soccer - Elite sports guidance with vision. Since 1999, active in the national and international football market.',
  contactPoint: {
    email: 'info@vision4soccer.nl',
    contactType: 'Customer Service',
  },
  address: {
    streetAddress: 'Scorpius 161',
    addressLocality: 'Hoofddorp',
    postalCode: '2132 LR',
    addressCountry: 'NL',
  },
  sameAs: [
    // Add social media profiles when available
    // 'https://www.facebook.com/vision4soccer',
    // 'https://www.instagram.com/vision4soccer',
    // 'https://twitter.com/vision4soccer',
  ],
});

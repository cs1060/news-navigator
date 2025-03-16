const axios = require('axios');
const User = require('../models/User');

// Mock data for global news activity (to be used when API calls are limited)
const mockGlobalNewsActivity = {
  us: { activityLevel: 'high', articles: 24, summary: 'Political tensions rise as new economic policies are announced' },
  gb: { activityLevel: 'medium', articles: 15, summary: 'Brexit aftermath continues to impact trade relations' },
  ca: { activityLevel: 'low', articles: 8, summary: 'New environmental protection laws proposed' },
  au: { activityLevel: 'medium', articles: 12, summary: 'Wildfires in eastern regions prompt emergency response' },
  in: { activityLevel: 'high', articles: 22, summary: 'Tech industry growth accelerates with new international partnerships' },
  fr: { activityLevel: 'medium', articles: 14, summary: 'Labor strikes affect transportation across major cities' },
  de: { activityLevel: 'medium', articles: 16, summary: 'Economic outlook improves as manufacturing sector rebounds' },
  jp: { activityLevel: 'low', articles: 9, summary: 'Central bank announces new monetary policy measures' },
  br: { activityLevel: 'high', articles: 20, summary: 'Amazon deforestation concerns prompt international response' },
  za: { activityLevel: 'low', articles: 7, summary: 'Elections scheduled as political campaigns intensify' },
  ru: { activityLevel: 'high', articles: 25, summary: 'Diplomatic tensions escalate with neighboring countries' },
  cn: { activityLevel: 'high', articles: 27, summary: 'Economic growth surpasses expectations amid trade discussions' },
  mx: { activityLevel: 'medium', articles: 13, summary: 'Border issues and trade negotiations continue' },
  it: { activityLevel: 'low', articles: 10, summary: 'Tourism recovery efforts show positive results' },
  es: { activityLevel: 'low', articles: 9, summary: 'Renewable energy initiatives gain momentum' },
  kr: { activityLevel: 'medium', articles: 15, summary: 'Tech innovation drives economic growth' },
  sg: { activityLevel: 'low', articles: 6, summary: 'Financial hub status strengthens with new policies' },
  ae: { activityLevel: 'medium', articles: 11, summary: 'Energy sector diversification continues' },
  ar: { activityLevel: 'medium', articles: 12, summary: 'Economic reforms aim to address inflation concerns' },
  ng: { activityLevel: 'high', articles: 18, summary: 'Oil production issues impact national economy' }
};

// Get global news activity for world map
exports.getGlobalNewsActivity = async (req, res) => {
  try {
    const { useRealData } = req.query;
    
    // For demo purposes, use mock data by default to avoid API rate limits
    if (useRealData !== 'true') {
      return res.json(mockGlobalNewsActivity);
    }
    
    // If real data is requested, fetch from API
    const countries = ['us', 'gb', 'ca', 'au', 'in', 'fr', 'de', 'jp', 'br', 'za', 'ru', 'cn', 'mx', 'it', 'es', 'kr', 'sg', 'ae', 'ar', 'ng'];
    const globalActivity = {};
    
    // Fetch news counts for each country
    for (const country of countries) {
      try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
          params: {
            country,
            apiKey: process.env.NEWS_API_KEY,
            pageSize: 1
          }
        });
        
        const totalResults = response.data.totalResults;
        let activityLevel = 'low';
        
        // Determine activity level based on article count
        if (totalResults > 20) {
          activityLevel = 'high';
        } else if (totalResults > 10) {
          activityLevel = 'medium';
        }
        
        // Get a few articles to generate a summary
        const articlesResponse = await axios.get(`https://newsapi.org/v2/top-headlines`, {
          params: {
            country,
            apiKey: process.env.NEWS_API_KEY,
            pageSize: 3
          }
        });
        
        // Generate a summary based on top headlines
        const articles = articlesResponse.data.articles;
        const summary = generateNewsSummary(articles);
        
        globalActivity[country] = {
          activityLevel,
          articles: totalResults,
          summary
        };
      } catch (err) {
        console.error(`Error fetching data for ${country}:`, err.message);
        // Use mock data as fallback for this country
        globalActivity[country] = mockGlobalNewsActivity[country];
      }
    }
    
    res.json(globalActivity);
  } catch (err) {
    console.error('Error fetching global news activity:', err.message);
    res.status(500).send('Server error');
  }
};

// Get news articles based on user interests
exports.getNewsByInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const interests = user.interests.join(' OR ');
    
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: interests,
        apiKey: process.env.NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20
      }
    });
    
    // Add bias analysis to each article (simplified for MVP)
    const articles = response.data.articles.map(article => {
      // Simple bias analysis based on source and keywords (to be enhanced with NLP)
      const biasRating = calculateBiasRating(article);
      
      return {
        ...article,
        biasRating,
        biasDescription: getBiasDescription(biasRating),
        category: determineCategory(article)
      };
    });
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get top headlines
exports.getTopHeadlines = async (req, res) => {
  try {
    const { country = 'us', category } = req.query;
    
    const params = {
      country,
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 20
    };
    
    if (category) {
      params.category = category;
    }
    
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, { params });
    
    // Add bias analysis to each article
    const articles = response.data.articles.map(article => {
      const biasRating = calculateBiasRating(article);
      
      return {
        ...article,
        biasRating,
        biasDescription: getBiasDescription(biasRating),
        category: category || determineCategory(article)
      };
    });
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get news by search term
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q,
        apiKey: process.env.NEWS_API_KEY,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 20
      }
    });
    
    // Add bias analysis to each article
    const articles = response.data.articles.map(article => {
      const biasRating = calculateBiasRating(article);
      
      return {
        ...article,
        biasRating,
        biasDescription: getBiasDescription(biasRating),
        category: determineCategory(article)
      };
    });
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get news for world map (by country)
exports.getNewsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const { category } = req.query;
    
    const params = {
      country,
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 10
    };
    
    if (category && category !== 'all') {
      params.category = category;
    }
    
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, { params });
    
    // Get activity level from mock data or calculate it
    const activityLevel = mockGlobalNewsActivity[country]?.activityLevel || 
      (response.data.totalResults > 20 ? 'high' : 
       response.data.totalResults > 10 ? 'medium' : 'low');
    
    // Add bias analysis and geolocation to each article
    const articles = response.data.articles.map(article => {
      const biasRating = calculateBiasRating(article);
      
      return {
        ...article,
        biasRating,
        biasDescription: getBiasDescription(biasRating),
        category: category || determineCategory(article),
        country
      };
    });
    
    // Generate a summary of key events
    const summary = mockGlobalNewsActivity[country]?.summary || 
                   generateNewsSummary(response.data.articles);
    
    res.json({
      articles,
      metadata: {
        country,
        activityLevel,
        totalResults: response.data.totalResults,
        summary
      }
    });
  } catch (err) {
    console.error(err.message);
    // If API fails, return mock data
    if (mockGlobalNewsActivity[country]) {
      const mockArticles = generateMockArticles(country, 10);
      res.json({
        articles: mockArticles,
        metadata: {
          country,
          activityLevel: mockGlobalNewsActivity[country].activityLevel,
          totalResults: mockGlobalNewsActivity[country].articles,
          summary: mockGlobalNewsActivity[country].summary,
          isMockData: true
        }
      });
    } else {
      res.status(500).send('Server error');
    }
  }
};

// Helper functions for bias analysis and categorization
function calculateBiasRating(article) {
  // Simplified bias rating algorithm (to be enhanced with NLP)
  // Range: -10 (far left) to 10 (far right), 0 is neutral
  let biasRating = 0;
  
  // Source-based bias estimation
  const sourceName = article.source.name.toLowerCase();
  
  // This is a simplified version - in a real app, this would be more sophisticated
  const sourceMapping = {
    'fox news': 7,
    'breitbart': 9,
    'cnn': -5,
    'msnbc': -7,
    'bbc': 0,
    'reuters': 0,
    'associated press': 0,
    'the new york times': -3,
    'the washington post': -3,
    'the wall street journal': 3
  };
  
  if (sourceMapping[sourceName]) {
    biasRating = sourceMapping[sourceName];
  }
  
  // Content-based bias estimation (simplified)
  const contentKeywords = {
    liberal: ['progressive', 'liberal', 'democrat', 'left-wing'],
    conservative: ['conservative', 'republican', 'right-wing', 'trump']
  };
  
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';
  const fullText = title + ' ' + description + ' ' + content;
  
  let liberalCount = 0;
  let conservativeCount = 0;
  
  contentKeywords.liberal.forEach(keyword => {
    if (fullText.includes(keyword)) liberalCount++;
  });
  
  contentKeywords.conservative.forEach(keyword => {
    if (fullText.includes(keyword)) conservativeCount++;
  });
  
  // Adjust bias rating based on keyword counts
  biasRating += (conservativeCount - liberalCount);
  
  // Ensure rating stays within bounds
  return Math.max(-10, Math.min(10, biasRating));
}

function getBiasDescription(biasRating) {
  if (biasRating >= 7) return 'Strong right-wing bias';
  if (biasRating >= 4) return 'Moderate right-wing bias';
  if (biasRating >= 1) return 'Slight right-wing bias';
  if (biasRating <= -7) return 'Strong left-wing bias';
  if (biasRating <= -4) return 'Moderate left-wing bias';
  if (biasRating <= -1) return 'Slight left-wing bias';
  return 'Minimal bias detected';
}

function determineCategory(article) {
  // Simplified category determination based on keywords
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  
  const categoryKeywords = {
    politics: ['politics', 'government', 'election', 'president', 'congress', 'senate', 'democrat', 'republican'],
    technology: ['tech', 'technology', 'apple', 'google', 'microsoft', 'ai', 'artificial intelligence', 'software', 'app'],
    business: ['business', 'economy', 'stock', 'market', 'finance', 'company', 'ceo', 'startup'],
    health: ['health', 'covid', 'virus', 'medical', 'doctor', 'hospital', 'disease', 'treatment'],
    science: ['science', 'research', 'study', 'discovery', 'space', 'nasa', 'climate'],
    sports: ['sport', 'football', 'basketball', 'baseball', 'soccer', 'nfl', 'nba', 'mlb'],
    entertainment: ['entertainment', 'movie', 'film', 'tv', 'television', 'celebrity', 'music', 'actor'],
    world: ['world', 'international', 'global', 'foreign', 'country', 'nation', 'europe', 'asia']
  };
  
  const text = title + ' ' + description;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Default category
  return 'world';
}

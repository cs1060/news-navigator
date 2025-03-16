/**
 * Mock Data Service for News Navigator
 * 
 * This service provides mock data for the application when the backend is not available
 * or during development and testing.
 */

// Mock global news activity data
export const getMockGlobalNewsActivity = () => {
  return {
    us: { activity: 'high', count: 45 },
    gb: { activity: 'high', count: 38 },
    ca: { activity: 'medium', count: 22 },
    au: { activity: 'medium', count: 18 },
    in: { activity: 'high', count: 42 },
    fr: { activity: 'medium', count: 25 },
    de: { activity: 'medium', count: 27 },
    jp: { activity: 'medium', count: 24 },
    br: { activity: 'high', count: 32 },
    za: { activity: 'low', count: 12 },
    ru: { activity: 'high', count: 40 },
    cn: { activity: 'high', count: 44 },
    mx: { activity: 'medium', count: 20 },
    it: { activity: 'medium', count: 23 },
    es: { activity: 'medium', count: 21 },
    kr: { activity: 'medium', count: 19 },
    sg: { activity: 'low', count: 10 },
    ae: { activity: 'low', count: 8 },
    ar: { activity: 'medium', count: 17 },
    ng: { activity: 'low', count: 9 }
  };
};

// Mock news articles by country
export const getMockNewsByCountry = (country, category = 'all') => {
  const allArticles = {
    us: generateArticlesForCountry('United States', 8),
    gb: generateArticlesForCountry('United Kingdom', 7),
    ca: generateArticlesForCountry('Canada', 6),
    au: generateArticlesForCountry('Australia', 6),
    in: generateArticlesForCountry('India', 8),
    fr: generateArticlesForCountry('France', 6),
    de: generateArticlesForCountry('Germany', 6),
    jp: generateArticlesForCountry('Japan', 6),
    br: generateArticlesForCountry('Brazil', 7),
    za: generateArticlesForCountry('South Africa', 5),
    ru: generateArticlesForCountry('Russia', 8),
    cn: generateArticlesForCountry('China', 8),
    mx: generateArticlesForCountry('Mexico', 6),
    it: generateArticlesForCountry('Italy', 6),
    es: generateArticlesForCountry('Spain', 6),
    kr: generateArticlesForCountry('South Korea', 6),
    sg: generateArticlesForCountry('Singapore', 5),
    ae: generateArticlesForCountry('United Arab Emirates', 5),
    ar: generateArticlesForCountry('Argentina', 6),
    ng: generateArticlesForCountry('Nigeria', 5)
  };

  const countryArticles = allArticles[country] || [];
  
  // Filter by category if specified
  const filteredArticles = category === 'all' 
    ? countryArticles 
    : countryArticles.filter(article => article.category.toLowerCase() === category.toLowerCase());

  // Generate metadata
  const activityLevel = getCountryActivityLevel(country);
  const summary = generateCountrySummary(country, activityLevel);

  return {
    articles: filteredArticles,
    metadata: {
      country_code: country,
      country_name: getCountryName(country),
      activity_level: activityLevel,
      summary: summary,
      total_articles: filteredArticles.length
    }
  };
};

// Mock saved articles
export const getMockSavedArticles = () => {
  const savedArticles = [];
  
  // Generate 15 saved articles from various countries
  const countries = ['us', 'gb', 'ca', 'in', 'de'];
  countries.forEach(country => {
    const countryArticles = generateArticlesForCountry(getCountryName(country), 3);
    savedArticles.push(...countryArticles);
  });
  
  return savedArticles;
};

// Helper function to generate articles for a country
function generateArticlesForCountry(countryName, count) {
  const articles = [];
  const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology', 'politics', 'world'];
  const sources = [
    { name: 'The Daily News', bias: -2 },
    { name: 'Global Times', bias: 0 },
    { name: 'The Morning Herald', bias: 3 },
    { name: 'Tech Insider', bias: -1 },
    { name: 'Business Daily', bias: 2 },
    { name: 'Science Today', bias: -1 },
    { name: 'Sports Network', bias: 0 },
    { name: 'Health Journal', bias: 1 },
    { name: 'World Report', bias: -3 },
    { name: 'Political Review', bias: 4 }
  ];
  
  const headlines = {
    business: [
      `${countryName}'s Economy Shows Strong Growth in Q1`,
      `Major Merger Announced Between ${countryName}'s Top Corporations`,
      `Stock Market in ${countryName} Reaches All-Time High`,
      `${countryName} Introduces New Trade Policies`,
      `Inflation Concerns Rise in ${countryName}'s Financial Sector`
    ],
    entertainment: [
      `Film Festival in ${countryName} Attracts Global Stars`,
      `${countryName}'s Music Industry Celebrates Record Year`,
      `Popular TV Series Films New Season in ${countryName}`,
      `Celebrity Couple Makes Headlines in ${countryName}`,
      `${countryName}'s Entertainment Industry Embraces AI Technology`
    ],
    general: [
      `${countryName} Celebrates National Holiday with Festivities`,
      `New Public Transportation System Launched in ${countryName}`,
      `${countryName} Announces Major Infrastructure Project`,
      `Survey Shows Changing Social Trends in ${countryName}`,
      `${countryName} Implements New Education Reforms`
    ],
    health: [
      `${countryName} Reports Breakthrough in Medical Research`,
      `Healthcare System in ${countryName} Undergoes Major Changes`,
      `New Wellness Trend Sweeps Across ${countryName}`,
      `${countryName} Addresses Mental Health Crisis with New Programs`,
      `Pandemic Response Improves in ${countryName} with New Measures`
    ],
    science: [
      `Scientists in ${countryName} Make Groundbreaking Discovery`,
      `${countryName} Launches Space Exploration Mission`,
      `Climate Research Center Opens in ${countryName}`,
      `${countryName} Invests in Renewable Energy Research`,
      `Tech Innovation Hub Expands in ${countryName}`
    ],
    sports: [
      `${countryName} Hosts International Sports Tournament`,
      `National Team of ${countryName} Advances to Finals`,
      `New Sports Complex Inaugurated in ${countryName}`,
      `${countryName}'s Athlete Breaks World Record`,
      `Sports Federation in ${countryName} Announces New Regulations`
    ],
    technology: [
      `Tech Startup from ${countryName} Secures Major Funding`,
      `${countryName} Leads in Artificial Intelligence Development`,
      `New Tech Regulations Implemented in ${countryName}`,
      `${countryName} Expands 5G Network Nationwide`,
      `Cybersecurity Concerns Rise in ${countryName}'s Tech Sector`
    ],
    politics: [
      `Elections in ${countryName} Show Surprising Results`,
      `${countryName}'s Government Announces Policy Reforms`,
      `Political Tensions Rise in ${countryName} Over New Legislation`,
      `${countryName} Strengthens Diplomatic Relations with Neighbors`,
      `Protests in ${countryName} Call for Political Change`
    ],
    world: [
      `${countryName} Signs International Agreement on Climate Change`,
      `${countryName} Increases Foreign Aid to Developing Nations`,
      `Global Summit Hosted in ${countryName} Addresses World Issues`,
      `${countryName} Takes Stand on International Human Rights`,
      `${countryName} Participates in Multinational Peacekeeping Efforts`
    ]
  };
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const headlinesForCategory = headlines[category];
    const title = headlinesForCategory[Math.floor(Math.random() * headlinesForCategory.length)];
    
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 14)); // Random date within last 2 weeks
    
    articles.push({
      id: `${countryName.toLowerCase().replace(/\s+/g, '-')}-${i}-${Date.now()}`,
      title: title,
      description: generateDescription(title, countryName),
      content: generateContent(title, countryName, category),
      url: `https://example.com/news/${countryName.toLowerCase().replace(/\s+/g, '-')}/${i}`,
      url_to_image: getRandomImage(category),
      published_at: publishedDate.toISOString(),
      source_name: source.name,
      author: generateAuthorName(),
      category: category,
      country: countryName,
      bias_rating: source.bias,
      is_saved: Math.random() > 0.8 // 20% chance of being saved
    });
  }
  
  return articles;
}

// Helper function to generate a description
function generateDescription(title, countryName) {
  const descriptions = [
    `Latest developments regarding ${title.toLowerCase()} have captured attention across ${countryName} and beyond.`,
    `Experts weigh in on the implications of ${title.toLowerCase()} for the future of ${countryName}.`,
    `${title} - a story that continues to develop as new information emerges from ${countryName}.`,
    `Analysis and reactions to ${title.toLowerCase()} from key figures in ${countryName}.`,
    `Breaking news: ${title} has significant implications for citizens of ${countryName}.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Helper function to generate content
function generateContent(title, countryName, category) {
  return `${title}\n\nIn a recent development in ${countryName}, significant changes have been observed in the ${category} sector. Experts from various fields have shared their insights on this matter, highlighting both challenges and opportunities ahead.\n\nLocal authorities in ${countryName} have responded to these developments with new initiatives aimed at addressing key concerns. Meanwhile, citizens have expressed mixed reactions, with some welcoming the changes while others remain skeptical.\n\nAnalysts predict that these developments will continue to shape the landscape of ${category} in ${countryName} for years to come, potentially influencing regional trends as well.`;
}

// Helper function to generate an author name
function generateAuthorName() {
  const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Raj', 'Priya', 'Wei', 'Mei', 'Carlos', 'Isabella', 'Ahmed', 'Fatima', 'Hiroshi', 'Yuki'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Patel', 'Kim', 'Wang', 'Li', 'Nguyen', 'Singh', 'Suzuki', 'Müller', 'Rossi', 'Silva'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Helper function to get a random image URL based on category
function getRandomImage(category) {
  const imagesByCategory = {
    business: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    entertainment: [
      'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    general: [
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    health: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    science: [
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    sports: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    technology: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    politics: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    world: [
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589262804704-c5aa9e6def89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561489401-fc2876ced162?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ]
  };
  
  const images = imagesByCategory[category] || imagesByCategory.general;
  return images[Math.floor(Math.random() * images.length)];
}

// Helper function to get country name from country code
function getCountryName(countryCode) {
  const countryNames = {
    us: 'United States',
    gb: 'United Kingdom',
    ca: 'Canada',
    au: 'Australia',
    in: 'India',
    fr: 'France',
    de: 'Germany',
    jp: 'Japan',
    br: 'Brazil',
    za: 'South Africa',
    ru: 'Russia',
    cn: 'China',
    mx: 'Mexico',
    it: 'Italy',
    es: 'Spain',
    kr: 'South Korea',
    sg: 'Singapore',
    ae: 'United Arab Emirates',
    ar: 'Argentina',
    ng: 'Nigeria'
  };
  
  return countryNames[countryCode] || 'Unknown Country';
}

// Helper function to get activity level for a country
function getCountryActivityLevel(countryCode) {
  const activityLevels = {
    us: 'high',
    gb: 'high',
    ca: 'medium',
    au: 'medium',
    in: 'high',
    fr: 'medium',
    de: 'medium',
    jp: 'medium',
    br: 'high',
    za: 'low',
    ru: 'high',
    cn: 'high',
    mx: 'medium',
    it: 'medium',
    es: 'medium',
    kr: 'medium',
    sg: 'low',
    ae: 'low',
    ar: 'medium',
    ng: 'low'
  };
  
  return activityLevels[countryCode] || 'low';
}

// Helper function to generate a country summary
function generateCountrySummary(countryCode, activityLevel) {
  const countryName = getCountryName(countryCode);
  
  const summaries = {
    high: [
      `${countryName} is experiencing a surge in news activity with multiple major stories developing simultaneously. Key topics include political developments, economic changes, and international relations.`,
      `High news volume in ${countryName} reflects significant developments across multiple sectors. Major stories include government announcements, economic shifts, and social movements.`,
      `${countryName} remains at the center of global attention with numerous high-profile stories. Current focus areas include policy changes, economic indicators, and international engagements.`
    ],
    medium: [
      `${countryName} shows moderate news activity with several notable stories developing. Current focus areas include regional politics, economic trends, and cultural events.`,
      `News from ${countryName} continues at a steady pace with developments in government affairs, business sectors, and social issues receiving coverage.`,
      `${countryName} maintains consistent presence in news cycles with ongoing coverage of political developments, economic indicators, and cultural highlights.`
    ],
    low: [
      `${countryName} is experiencing relatively quiet news cycles with few major developments. Current coverage focuses on routine government activities and local events.`,
      `News activity in ${countryName} remains subdued with limited major developments. Coverage primarily centers on day-to-day governance and regional matters.`,
      `${countryName} shows minimal news activity at present, with most coverage focused on routine matters and occasional updates on ongoing situations.`
    ]
  };
  
  return summaries[activityLevel][Math.floor(Math.random() * summaries[activityLevel].length)];
}

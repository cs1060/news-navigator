import random
from datetime import datetime, timedelta

# Country coordinates for map placement
COUNTRY_COORDINATES = {
    'us': [37.0902, -95.7129],  # United States
    'gb': [55.3781, -3.4360],   # United Kingdom
    'ca': [56.1304, -106.3468], # Canada
    'au': [-25.2744, 133.7751], # Australia
    'de': [51.1657, 10.4515],   # Germany
    'fr': [46.2276, 2.2137],    # France
    'jp': [36.2048, 138.2529],  # Japan
    'cn': [35.8617, 104.1954],  # China
    'in': [20.5937, 78.9629],   # India
    'br': [-14.2350, -51.9253], # Brazil
    'za': [-30.5595, 22.9375],  # South Africa
    'ru': [61.5240, 105.3188],  # Russia
    'mx': [23.6345, -102.5528], # Mexico
    'it': [41.8719, 12.5674],   # Italy
    'es': [40.4637, -3.7492],   # Spain
    'kr': [35.9078, 127.7669],  # South Korea
    'sa': [23.8859, 45.0792],   # Saudi Arabia
    'ng': [9.0820, 8.6753],     # Nigeria
    'eg': [26.8206, 30.8025],   # Egypt
    'ar': [-38.4161, -63.6167]  # Argentina
}

# News categories
CATEGORIES = [
    'politics', 'business', 'technology', 'science', 
    'health', 'entertainment', 'sports', 'environment'
]

# Bias ratings from -10 (extremely left) to 10 (extremely right)
NEWS_SOURCES = {
    'Global News Network': {'bias': -2, 'reliability': 8},
    'World Daily': {'bias': 3, 'reliability': 7},
    'Tech Insider': {'bias': -1, 'reliability': 9},
    'Business Today': {'bias': 2, 'reliability': 8},
    'Science Weekly': {'bias': 0, 'reliability': 9},
    'Health Report': {'bias': -1, 'reliability': 8},
    'Entertainment Now': {'bias': 1, 'reliability': 6},
    'Sports Chronicle': {'bias': 0, 'reliability': 7},
    'Environmental Watch': {'bias': -3, 'reliability': 8},
    'Political Observer': {'bias': 4, 'reliability': 6},
    'Conservative Daily': {'bias': 7, 'reliability': 5},
    'Progressive Voice': {'bias': -7, 'reliability': 5},
    'Neutral Tribune': {'bias': 0, 'reliability': 9},
    'Financial Times': {'bias': 1, 'reliability': 8},
    'Medical Journal': {'bias': -1, 'reliability': 9}
}

# Generate mock news articles
def generate_mock_articles(count=200):
    articles = []
    
    # News headlines and content by category
    headlines = {
        'politics': [
            'New Trade Agreement Signed Between Major Powers',
            'Presidential Election Results Announced',
            'Parliament Passes Controversial New Law',
            'Diplomatic Crisis Emerges Between Neighboring Nations',
            'Government Announces Major Policy Shift',
            'Opposition Leader Calls for Reforms',
            'Political Scandal Rocks Administration',
            'Peace Talks Resume After Months of Tension',
            'Cabinet Reshuffle Announced',
            'Protests Erupt Over New Legislation'
        ],
        'business': [
            'Global Markets React to Economic Data',
            'Major Merger Creates Industry Giant',
            'Tech Company Announces Record Profits',
            'Stock Market Hits All-Time High',
            'Oil Prices Surge Amid Supply Concerns',
            'Retail Chain Announces Expansion',
            'Banking Sector Faces New Regulations',
            'Startup Secures Massive Investment',
            'Trade Tensions Impact Global Supply Chains',
            'Consumer Spending Shows Strong Growth'
        ],
        'technology': [
            'Revolutionary AI System Unveiled',
            'Tech Giant Launches New Smartphone',
            'Breakthrough in Quantum Computing Announced',
            'Social Media Platform Introduces New Features',
            'Cybersecurity Threats on the Rise',
            'Electric Vehicle Maker Expands Production',
            'New Renewable Energy Technology Developed',
            'Space Exploration Company Achieves Milestone',
            'Robotics Innovation Changes Manufacturing',
            'Virtual Reality Adoption Accelerates'
        ],
        'science': [
            'Scientists Discover New Species',
            'Breakthrough in Cancer Research',
            'Space Telescope Reveals Distant Galaxies',
            'Climate Study Presents Alarming Findings',
            'Genetic Research Opens New Possibilities',
            'Archaeological Discovery Rewrites History',
            'Particle Physics Experiment Yields Results',
            'Marine Biologists Track Ocean Changes',
            'Research Team Develops New Materials',
            'Astronomical Event Observed for First Time'
        ],
        'health': [
            'New Treatment Shows Promise for Chronic Disease',
            'Global Health Organization Issues Guidelines',
            'Mental Health Awareness Campaign Launched',
            'Vaccine Development Progresses Rapidly',
            'Study Links Lifestyle Factors to Longevity',
            'Healthcare System Reforms Implemented',
            'Nutrition Research Challenges Previous Advice',
            'Pandemic Response Measures Updated',
            'Medical Technology Improves Patient Outcomes',
            'Public Health Initiative Targets Prevention'
        ],
        'entertainment': [
            'Blockbuster Movie Breaks Box Office Records',
            'Music Festival Announces Stellar Lineup',
            'Celebrity Couple Announces Engagement',
            'Streaming Service Releases Anticipated Series',
            'Award Show Celebrates Creative Excellence',
            'Best-Selling Author Releases New Novel',
            'Video Game Launch Exceeds Expectations',
            'Art Exhibition Draws International Attention',
            'Theater Production Receives Critical Acclaim',
            'Reality Show Controversy Sparks Debate'
        ],
        'sports': [
            'Team Wins Championship in Dramatic Final',
            'Athlete Breaks World Record',
            'Major Tournament Announces Schedule',
            'Coach Signs Contract Extension',
            'Player Transfer Shakes Up League',
            'Olympic Committee Finalizes Plans',
            'Sports League Expands to New Markets',
            'Underdog Team Creates Major Upset',
            'Injury Concerns for Star Player',
            'New Stadium Construction Announced'
        ],
        'environment': [
            'Climate Summit Reaches Historic Agreement',
            'Renewable Energy Surpasses Fossil Fuels',
            'Conservation Efforts Save Endangered Species',
            'Study Shows Accelerating Ice Melt',
            'Sustainable City Initiative Launches',
            'Ocean Cleanup Project Shows Results',
            'Forest Protection Measures Expanded',
            'Air Quality Improvements Measured',
            'Biodiversity Crisis Requires Urgent Action',
            'Green Technology Investment Increases'
        ]
    }
    
    # Content templates to generate more detailed article content
    content_templates = [
        "Recent developments in {location} have led to significant changes in {category}. Experts suggest this could have far-reaching implications for the region and beyond.",
        "Officials in {location} announced today new measures related to {category}, which analysts believe will shape policy for years to come.",
        "A groundbreaking {category} initiative in {location} has attracted international attention, with stakeholders from various sectors weighing in on its potential impact.",
        "The latest {category} developments in {location} represent a shift from previous approaches, according to specialists familiar with the situation.",
        "Concerns are growing in {location} regarding recent {category} trends, with community leaders calling for more comprehensive solutions.",
        "Positive outcomes have been reported from {location}'s approach to {category}, potentially offering a model for other regions facing similar challenges.",
        "Controversy surrounds the {category} situation in {location}, with opposing viewpoints on how best to address the complex issues involved.",
        "Innovative approaches to {category} are emerging from {location}, challenging conventional wisdom and opening new possibilities.",
        "The {category} landscape in {location} continues to evolve rapidly, with stakeholders adapting to changing circumstances and new information.",
        "Long-term {category} strategies in {location} are being reevaluated in light of recent events and emerging data."
    ]
    
    # Country names for better readability
    country_names = {
        'us': 'the United States', 'gb': 'the United Kingdom', 'ca': 'Canada', 
        'au': 'Australia', 'de': 'Germany', 'fr': 'France', 'jp': 'Japan', 
        'cn': 'China', 'in': 'India', 'br': 'Brazil', 'za': 'South Africa', 
        'ru': 'Russia', 'mx': 'Mexico', 'it': 'Italy', 'es': 'Spain', 
        'kr': 'South Korea', 'sa': 'Saudi Arabia', 'ng': 'Nigeria', 
        'eg': 'Egypt', 'ar': 'Argentina'
    }
    
    # Generate articles
    for i in range(1, count + 1):
        # Randomly select attributes
        category = random.choice(CATEGORIES)
        country_code = random.choice(list(COUNTRY_COORDINATES.keys()))
        country_name = country_names[country_code]
        source_name = random.choice(list(NEWS_SOURCES.keys()))
        source_info = NEWS_SOURCES[source_name]
        
        # Random date within the last 30 days
        days_ago = random.randint(0, 30)
        published_date = datetime.now() - timedelta(days=days_ago, 
                                                   hours=random.randint(0, 23), 
                                                   minutes=random.randint(0, 59))
        
        # Select headline and generate content
        headline = random.choice(headlines[category])
        content_template = random.choice(content_templates)
        content = content_template.format(location=country_name, category=category)
        
        # Add more detailed content
        additional_content = f"This development comes at a time when {category} issues are particularly relevant in {country_name}. "
        additional_content += f"According to {source_name}, the implications could affect various sectors including "
        additional_content += f"{'economics, policy, and international relations' if category in ['politics', 'business'] else 'public perception, community engagement, and future innovations' if category in ['technology', 'science'] else 'public welfare, social dynamics, and cultural trends'}. "
        additional_content += f"Experts from {random.choice(['Harvard University', 'Oxford University', 'Tokyo Institute of Technology', 'Max Planck Institute', 'Stanford Research Center'])} "
        additional_content += f"have {'expressed concern' if random.random() > 0.5 else 'shown optimism'} regarding these developments."
        
        content += " " + additional_content
        
        # Generate a description (shorter version of content)
        description = content.split('.')[0] + '.'
        
        # Determine sentiment and bias
        sentiments = ['negative', 'neutral', 'positive']
        sentiment_weights = [0.25, 0.5, 0.25]  # More neutral content
        sentiment = random.choices(sentiments, weights=sentiment_weights)[0]
        
        # Bias is influenced by the source's bias but with some variation
        bias_rating = source_info['bias'] + random.uniform(-1, 1)
        bias_rating = round(max(-10, min(10, bias_rating)))
        
        # Create article object
        article = {
            'id': str(i),
            'title': headline,
            'description': description,
            'content': content,
            'url': f"https://example.com/news/{i}",
            'url_to_image': f"https://source.unsplash.com/random/800x600/?{category}",
            'published_at': published_date.isoformat(),
            'source_name': source_name,
            'author': f"{'John Smith' if random.random() > 0.5 else 'Jane Doe'} and team",
            'category': category,
            'country': country_code,
            'sentiment': sentiment,
            'bias_rating': bias_rating,
            'reliability_rating': source_info['reliability']
        }
        
        articles.append(article)
    
    return articles

# Generate all articles once
ALL_ARTICLES = generate_mock_articles(200)

# Calculate global news activity based on article distribution
def get_global_news_activity(category='all'):
    """
    Return global news activity data for the map
    Activity levels: low (1-5 articles), medium (6-15 articles), high (16+ articles)
    """
    # Filter by category if needed
    filtered_articles = ALL_ARTICLES
    if category != 'all':
        filtered_articles = [a for a in ALL_ARTICLES if a['category'] == category]
    
    # Count articles by country
    country_counts = {}
    for article in filtered_articles:
        country = article['country']
        if country in country_counts:
            country_counts[country] += 1
        else:
            country_counts[country] = 1
    
    # Determine activity level for each country
    activity_data = {}
    for country, count in country_counts.items():
        if count >= 16:
            activity = 'high'
        elif count >= 6:
            activity = 'medium'
        else:
            activity = 'low'
        
        activity_data[country] = {
            'activity': activity,
            'count': count
        }
    
    return activity_data

def get_news_by_country(country, category='all'):
    """Return news articles for a specific country"""
    filtered_articles = [a for a in ALL_ARTICLES if a['country'] == country]
    
    if category != 'all':
        filtered_articles = [a for a in filtered_articles if a['category'] == category]
    
    # Sort by date (newest first)
    filtered_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    return filtered_articles

def get_news_articles(category='all', page=1, limit=10):
    """Return paginated news articles for the news feed"""
    filtered_articles = ALL_ARTICLES
    
    if category != 'all':
        filtered_articles = [a for a in filtered_articles if a['category'] == category]
    
    # Sort by date (newest first)
    filtered_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    # Paginate results
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    return {
        'articles': filtered_articles[start_idx:end_idx],
        'total': len(filtered_articles),
        'page': page,
        'limit': limit,
        'total_pages': (len(filtered_articles) + limit - 1) // limit
    }

def search_news(query, category='all', date_from=None, date_to=None, page=1, limit=10):
    """Search for news articles"""
    filtered_articles = ALL_ARTICLES
    
    # Filter by query (search in title and content)
    if query:
        query = query.lower()
        filtered_articles = [
            a for a in filtered_articles 
            if query in a['title'].lower() or query in a['content'].lower()
        ]
    
    # Filter by category
    if category != 'all':
        filtered_articles = [a for a in filtered_articles if a['category'] == category]
    
    # Filter by date range
    if date_from:
        try:
            date_from = datetime.fromisoformat(date_from)
            filtered_articles = [
                a for a in filtered_articles 
                if datetime.fromisoformat(a['published_at']) >= date_from
            ]
        except ValueError:
            pass
    
    if date_to:
        try:
            date_to = datetime.fromisoformat(date_to)
            filtered_articles = [
                a for a in filtered_articles 
                if datetime.fromisoformat(a['published_at']) <= date_to
            ]
        except ValueError:
            pass
    
    # Sort by date (newest first)
    filtered_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    # Paginate results
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    return {
        'articles': filtered_articles[start_idx:end_idx],
        'total': len(filtered_articles),
        'page': page,
        'limit': limit,
        'total_pages': (len(filtered_articles) + limit - 1) // limit
    }

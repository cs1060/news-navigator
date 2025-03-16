import random
import datetime
import json
from pathlib import Path

# Constants for generating mock data
COUNTRIES = [
    {'code': 'US', 'name': 'United States', 'lat': 37.0902, 'lng': -95.7129},
    {'code': 'GB', 'name': 'United Kingdom', 'lat': 55.3781, 'lng': -3.4360},
    {'code': 'FR', 'name': 'France', 'lat': 46.2276, 'lng': 2.2137},
    {'code': 'DE', 'name': 'Germany', 'lat': 51.1657, 'lng': 10.4515},
    {'code': 'JP', 'name': 'Japan', 'lat': 36.2048, 'lng': 138.2529},
    {'code': 'CN', 'name': 'China', 'lat': 35.8617, 'lng': 104.1954},
    {'code': 'IN', 'name': 'India', 'lat': 20.5937, 'lng': 78.9629},
    {'code': 'BR', 'name': 'Brazil', 'lat': -14.2350, 'lng': -51.9253},
    {'code': 'RU', 'name': 'Russia', 'lat': 61.5240, 'lng': 105.3188},
    {'code': 'AU', 'name': 'Australia', 'lat': -25.2744, 'lng': 133.7751},
    {'code': 'CA', 'name': 'Canada', 'lat': 56.1304, 'lng': -106.3468},
    {'code': 'IT', 'name': 'Italy', 'lat': 41.8719, 'lng': 12.5674},
    {'code': 'ES', 'name': 'Spain', 'lat': 40.4637, 'lng': -3.7492},
    {'code': 'MX', 'name': 'Mexico', 'lat': 23.6345, 'lng': -102.5528},
    {'code': 'ZA', 'name': 'South Africa', 'lat': -30.5595, 'lng': 22.9375},
    {'code': 'KR', 'name': 'South Korea', 'lat': 35.9078, 'lng': 127.7669},
    {'code': 'ID', 'name': 'Indonesia', 'lat': -0.7893, 'lng': 113.9213},
    {'code': 'TR', 'name': 'Turkey', 'lat': 38.9637, 'lng': 35.2433},
    {'code': 'SA', 'name': 'Saudi Arabia', 'lat': 23.8859, 'lng': 45.0792},
    {'code': 'AR', 'name': 'Argentina', 'lat': -38.4161, 'lng': -63.6167}
]

CATEGORIES = ['politics', 'business', 'technology', 'health', 'science', 'sports', 'entertainment']

NEWS_SOURCES = [
    {'id': 'src-1', 'name': 'Global News Network', 'reliability': 9, 'bias': -1},
    {'id': 'src-2', 'name': 'World Daily', 'reliability': 7, 'bias': 0},
    {'id': 'src-3', 'name': 'The Morning Chronicle', 'reliability': 8, 'bias': 1},
    {'id': 'src-4', 'name': 'International Herald', 'reliability': 9, 'bias': 0},
    {'id': 'src-5', 'name': 'The Daily Perspective', 'reliability': 6, 'bias': 3},
    {'id': 'src-6', 'name': 'Progressive Voice', 'reliability': 5, 'bias': -4},
    {'id': 'src-7', 'name': 'Conservative Tribune', 'reliability': 5, 'bias': 4},
    {'id': 'src-8', 'name': 'Tech Insider', 'reliability': 8, 'bias': -1},
    {'id': 'src-9', 'name': 'Health & Science Today', 'reliability': 9, 'bias': 0},
    {'id': 'src-10', 'name': 'Sports Chronicle', 'reliability': 8, 'bias': 0}
]

def generate_mock_articles(count=200):
    """Generate mock news articles"""
    articles = []
    
    # Get current date for reference
    now = datetime.datetime.now()
    
    for i in range(1, count + 1):
        # Randomly select attributes
        category = random.choice(CATEGORIES)
        country = random.choice(COUNTRIES)
        source = random.choice(NEWS_SOURCES)
        
        # Generate random date within the last 7 days
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        published_at = (now - datetime.timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)).isoformat()
        
        # Generate title based on category
        title = get_random_title(category, country['name'])
        
        # Generate content
        paragraphs = random.randint(3, 7)
        content = generate_article_content(category, country['name'], paragraphs)
        
        # Generate description (first paragraph of content)
        description = content.split('\n\n')[0]
        
        # Generate bias rating (-5 to 5, where negative is left-leaning, positive is right-leaning)
        # Base it on the source's bias but add some randomness
        bias_rating = max(-5, min(5, source['bias'] + random.randint(-1, 1)))
        
        # Generate sentiment (0 to 10, where 0 is very negative, 10 is very positive)
        sentiment = random.randint(0, 10)
        
        # Generate importance (0 to 10, where 0 is not important, 10 is very important)
        importance = random.randint(1, 10)
        
        article = {
            'id': f'article-{i}',
            'title': title,
            'description': description,
            'content': content,
            'category': category,
            'country_code': country['code'],
            'country_name': country['name'],
            'source_id': source['id'],
            'source_name': source['name'],
            'source_reliability': source['reliability'],
            'bias_rating': bias_rating,
            'sentiment': sentiment,
            'importance': importance,
            'published_at': published_at,
            'url': f'https://example.com/news/{i}',
            'image_url': f'https://picsum.photos/seed/{i}/800/450'
        }
        
        articles.append(article)
    
    return articles

def get_countries_data():
    """Get countries data with news activity levels for the world map"""
    articles = generate_mock_articles()
    
    # Count articles per country
    country_counts = {}
    for country in COUNTRIES:
        country_code = country['code']
        country_counts[country_code] = len([a for a in articles if a['country_code'] == country_code])
    
    # Determine activity level
    max_count = max(country_counts.values()) if country_counts else 0
    
    countries_data = []
    for country in COUNTRIES:
        code = country['code']
        count = country_counts.get(code, 0)
        
        # Determine activity level (low, medium, high)
        if count < max_count * 0.3:
            activity_level = 'low'
        elif count < max_count * 0.7:
            activity_level = 'medium'
        else:
            activity_level = 'high'
        
        # Get top articles for this country
        top_articles = [a for a in articles if a['country_code'] == code]
        top_articles.sort(key=lambda x: x['importance'], reverse=True)
        top_articles = top_articles[:3]  # Get top 3 articles
        
        countries_data.append({
            'code': code,
            'name': country['name'],
            'lat': country['lat'],
            'lng': country['lng'],
            'article_count': count,
            'activity_level': activity_level,
            'top_articles': top_articles
        })
    
    return countries_data

def get_news_by_country(country_code, category='all'):
    """Get news articles for a specific country"""
    articles = generate_mock_articles()
    
    # Filter by country
    country_articles = [a for a in articles if a['country_code'] == country_code]
    
    # Filter by category if specified
    if category != 'all':
        country_articles = [a for a in country_articles if a['category'] == category]
    
    # Sort by importance and date
    country_articles.sort(key=lambda x: (x['importance'], x['published_at']), reverse=True)
    
    # Get country info
    country_info = next((c for c in COUNTRIES if c['code'] == country_code), None)
    
    if not country_info:
        return {'error': 'Country not found'}
    
    # Get summary of key events
    summary = generate_country_summary(country_code, country_articles)
    
    return {
        'country_code': country_code,
        'country_name': country_info['name'],
        'article_count': len(country_articles),
        'summary': summary,
        'articles': country_articles
    }

def get_news_by_category(category):
    """Get news articles for a specific category"""
    articles = generate_mock_articles()
    
    # Filter by category
    category_articles = [a for a in articles if a['category'] == category]
    
    # Sort by importance and date
    category_articles.sort(key=lambda x: (x['importance'], x['published_at']), reverse=True)
    
    return {
        'category': category,
        'article_count': len(category_articles),
        'articles': category_articles
    }

def get_trending_topics():
    """Get trending topics based on article frequency"""
    articles = generate_mock_articles()
    
    # Extract keywords from titles
    keywords = {}
    for article in articles:
        title_words = article['title'].lower().split()
        for word in title_words:
            # Skip common words
            if len(word) < 4 or word in ['the', 'and', 'for', 'that', 'with', 'from']:
                continue
            
            if word in keywords:
                keywords[word] += 1
            else:
                keywords[word] = 1
    
    # Sort keywords by frequency
    sorted_keywords = sorted(keywords.items(), key=lambda x: x[1], reverse=True)
    
    # Get top 10 trending topics
    trending = []
    for keyword, count in sorted_keywords[:10]:
        # Find related articles
        related_articles = []
        for article in articles:
            if keyword.lower() in article['title'].lower() or keyword.lower() in article['content'].lower():
                related_articles.append(article)
        
        # Sort by importance
        related_articles.sort(key=lambda x: x['importance'], reverse=True)
        
        trending.append({
            'keyword': keyword.capitalize(),
            'count': count,
            'related_articles': related_articles[:3]  # Top 3 related articles
        })
    
    return trending

def generate_country_summary(country_code, articles):
    """Generate a summary of key events for a country"""
    if not articles:
        return "No significant news events reported recently."
    
    # Get country name
    country_name = next((c['name'] for c in COUNTRIES if c['code'] == country_code), "the country")
    
    # Get top 3 articles by importance
    top_articles = sorted(articles, key=lambda x: x['importance'], reverse=True)[:3]
    
    # Generate summary
    summary = f"Recent key events in {country_name}:\n\n"
    
    for i, article in enumerate(top_articles):
        summary += f"{i+1}. {article['title']}\n"
    
    return summary

def get_random_title(category, country_name):
    """Get a random title based on category"""
    prefixes = {
        'politics': ['Breaking:', 'Analysis:', 'Opinion:', 'Exclusive:', 'Report:'],
        'business': ['Market Alert:', 'Economic Update:', 'Industry Focus:', 'Company News:', 'Financial Report:'],
        'technology': ['Tech Update:', 'Innovation:', 'Digital Trends:', 'New Release:', 'Tech Review:'],
        'health': ['Health Alert:', 'Medical Study:', 'Wellness Update:', 'Healthcare News:', 'Research Findings:'],
        'science': ['Scientific Discovery:', 'Research Breakthrough:', 'Study Reveals:', 'Scientists Find:', 'New Research:'],
        'sports': ['Game Recap:', 'Player Spotlight:', 'Tournament Update:', 'Team News:', 'Sports Analysis:'],
        'entertainment': ['Celebrity News:', 'Movie Review:', 'Music Update:', 'TV Highlights:', 'Entertainment Weekly:']
    }
    
    templates = {
        'politics': [
            "{country}'s Government Announces New Policy on {issue}",
            "Election Results in {country} Show Surprising Shift",
            "Political Tensions Rise in {country} Over {issue}",
            "Leaders from {country} and {other_country} Meet to Discuss {issue}",
            "{country} Passes New Legislation on {issue}"
        ],
        'business': [
            "{country}'s Economy Shows Signs of {direction}",
            "Major Company in {country} Announces {event}",
            "Trade Deal Between {country} and {other_country} Affects Markets",
            "{country}'s Currency Experiences Significant {direction}",
            "New Business Regulations in {country} Impact {industry}"
        ],
        'technology': [
            "Tech Giant Launches New Product in {country}",
            "{country} Leads Innovation in {tech_field}",
            "New Technology Addresses {issue} in {country}",
            "Startup from {country} Disrupts {industry} with New App",
            "{country} Invests in {tech_field} Research"
        ],
        'health': [
            "Health Officials in {country} Report on {health_issue}",
            "New Medical Treatment Approved in {country}",
            "{country} Faces Challenges with {health_issue}",
            "Study in {country} Reveals New Findings About {health_issue}",
            "Health Initiative in {country} Aims to Reduce {health_issue}"
        ],
        'science': [
            "Scientists in {country} Discover {discovery}",
            "Research Team from {country} Makes Breakthrough in {field}",
            "{country}'s Space Program Announces {mission}",
            "Environmental Study in {country} Reveals {finding}",
            "New Species Discovered in {country}'s {location}"
        ],
        'sports': [
            "{country}'s Team Wins Championship in Dramatic {event}",
            "Athlete from {country} Breaks Record in {sport}",
            "{country} to Host Major {sport} Tournament",
            "Controversy in {country}'s {sport} League Over {issue}",
            "Rising Star from {country} Makes Debut in {sport}"
        ],
        'entertainment': [
            "Film Festival in {country} Showcases Local Talent",
            "Celebrity from {country} Announces New {project}",
            "Award-Winning Show from {country} Gains International Attention",
            "Music Artist from {country} Tops Charts with New Release",
            "Cultural Event in {country} Celebrates Traditional Arts"
        ]
    }
    
    # Variables to fill in templates
    variables = {
        'country': country_name,
        'other_country': random.choice([c['name'] for c in COUNTRIES if c['name'] != country_name]),
        'issue': random.choice(['Immigration', 'Climate Change', 'Healthcare', 'Education', 'Security', 'Taxation', 'Privacy']),
        'direction': random.choice(['Growth', 'Decline', 'Stability', 'Volatility', 'Recovery']),
        'event': random.choice(['Merger', 'Acquisition', 'Expansion', 'Layoffs', 'Restructuring', 'New Product Line']),
        'industry': random.choice(['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Energy', 'Agriculture']),
        'tech_field': random.choice(['Artificial Intelligence', 'Blockchain', 'Renewable Energy', 'Biotechnology', 'Robotics', 'Virtual Reality']),
        'health_issue': random.choice(['Pandemic Response', 'Mental Health', 'Chronic Disease', 'Healthcare Access', 'Vaccination', 'Nutrition']),
        'discovery': random.choice(['New Particle', 'Ancient Ruins', 'Medical Breakthrough', 'Rare Mineral', 'Astronomical Phenomenon']),
        'field': random.choice(['Medicine', 'Physics', 'Biology', 'Chemistry', 'Astronomy', 'Geology']),
        'mission': random.choice(['Satellite Launch', 'Exploration Mission', 'Research Initiative', 'International Collaboration', 'New Observatory']),
        'finding': random.choice(['Climate Patterns', 'Pollution Levels', 'Biodiversity Loss', 'Conservation Success', 'Ecosystem Changes']),
        'location': random.choice(['Forests', 'Mountains', 'Coastal Regions', 'Protected Areas', 'Marine Habitats']),
        'sport': random.choice(['Soccer', 'Basketball', 'Tennis', 'Cricket', 'Rugby', 'Athletics', 'Swimming']),
        'event': random.choice(['Final', 'Comeback', 'Overtime', 'Penalty Shootout', 'Last-Minute Goal']),
        'project': random.choice(['Movie', 'Album', 'Book', 'Tour', 'Charity Initiative', 'TV Show'])
    }
    
    # Select a random prefix and template
    prefix = random.choice(prefixes.get(category, ['']))
    template = random.choice(templates.get(category, templates['politics']))
    
    # Fill in the template with variables
    for key, value in variables.items():
        template = template.replace('{' + key + '}', value)
    
    # Combine prefix and template
    if prefix:
        title = f"{prefix} {template}"
    else:
        title = template
    
    return title

def generate_article_content(category, country_name, paragraphs=5):
    """Generate article content based on category and country"""
    content = ""
    
    # First paragraph - introduction
    intros = [
        f"Recent developments in {country_name} have brought attention to important issues in {category}.",
        f"A significant event in {country_name} has sparked discussions about the future of {category}.",
        f"Experts in {country_name} are closely monitoring the situation related to {category}.",
        f"The latest news from {country_name} highlights the evolving landscape of {category}.",
        f"Observers in {country_name} note that recent trends in {category} indicate important shifts."
    ]
    content += random.choice(intros) + " "
    
    # Add some category-specific content
    category_content = {
        'politics': [
            "Political analysts are examining the implications for both domestic and international relations.",
            "The policy changes reflect shifting priorities within the current administration.",
            "Opposition leaders have expressed concerns about the long-term consequences of these decisions.",
            "Diplomatic sources suggest that negotiations are ongoing behind the scenes.",
            "Public opinion polls indicate mixed reactions to the recent political developments."
        ],
        'business': [
            "Market experts predict this could have significant implications for the broader economy.",
            "Investors are closely watching how these developments affect quarterly earnings reports.",
            "Industry analysts note that similar trends have been observed in neighboring markets.",
            "Economic indicators suggest that these changes may be part of a larger global pattern.",
            "Financial advisors recommend caution as markets adjust to the new information."
        ],
        'technology': [
            "The technological innovation represents a significant advance in the field.",
            "Early adopters report positive experiences with the new systems.",
            "Industry standards may need to evolve to accommodate these new developments.",
            "Privacy advocates have raised questions about potential implications.",
            "The technology builds upon previous research while adding novel approaches to solving key challenges."
        ],
        'health': [
            "Medical professionals emphasize the importance of following official guidelines.",
            "Research indicates that these findings could lead to improved treatment options.",
            "Public health officials are monitoring the situation and updating recommendations accordingly.",
            "The health implications extend beyond immediate concerns to long-term wellness strategies.",
            "Preventive measures remain essential according to healthcare experts."
        ],
        'science': [
            "The scientific community has responded with both excitement and calls for further research.",
            "This discovery builds upon decades of previous work in the field.",
            "Peer review processes will help validate these initial findings.",
            "Funding for related research has increased in response to these developments.",
            "The implications extend beyond this specific field to broader scientific understanding."
        ],
        'sports': [
            "Fans celebrated the achievement which comes after years of dedicated training.",
            "Coaches attribute the success to strategic changes implemented during the off-season.",
            "The performance sets a new benchmark for competitors in the sport.",
            "Team dynamics played a crucial role in the outcome of the event.",
            "Sports analysts are already discussing how this will affect rankings and future competitions."
        ],
        'entertainment': [
            "Critics have praised the creative direction and innovative approach.",
            "Audiences have responded enthusiastically to the new release.",
            "The cultural significance extends beyond entertainment value to social commentary.",
            "Industry insiders note that this represents a new trend in the entertainment landscape.",
            "The success challenges conventional wisdom about audience preferences."
        ]
    }
    
    # Add category-specific content
    for _ in range(paragraphs - 2):  # -2 for intro and conclusion
        paragraph = ""
        sentences = random.randint(3, 6)
        
        for _ in range(sentences):
            sentence = random.choice(category_content.get(category, category_content['politics']))
            paragraph += sentence + " "
        
        content += "\n\n" + paragraph.strip()
    
    # Last paragraph - conclusion
    conclusions = [
        f"As the situation continues to develop in {country_name}, further updates are expected in the coming days.",
        f"Observers will be watching closely to see how these events in {country_name} unfold over time.",
        f"The implications for {country_name} and the broader region remain to be fully understood.",
        f"Experts suggest that these developments may signal important shifts in {country_name}'s approach to {category}.",
        f"The coming weeks will be crucial in determining the long-term impact on {country_name} and beyond."
    ]
    content += "\n\n" + random.choice(conclusions)
    
    return content

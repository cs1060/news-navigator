import random
import datetime
import uuid
from datetime import timedelta

# Constants for mock data generation
CATEGORIES = ['politics', 'business', 'technology', 'science', 'health', 'entertainment', 'sports', 'environment']
SOURCES = {
    'The Daily Chronicle': {'reliability': 8, 'bias': -2},
    'Global News Network': {'reliability': 9, 'bias': 0},
    'The Morning Herald': {'reliability': 7, 'bias': 3},
    'Tech Insider': {'reliability': 8, 'bias': -1},
    'Business Today': {'reliability': 8, 'bias': 2},
    'Science Weekly': {'reliability': 9, 'bias': 0},
    'Health & Wellness': {'reliability': 7, 'bias': -2},
    'Entertainment Now': {'reliability': 6, 'bias': 1},
    'Sports Central': {'reliability': 8, 'bias': 0},
    'Environmental Watch': {'reliability': 7, 'bias': -3}
}

# Major story themes for evolution tracking
STORY_THEMES = [
    {
        'id': 'climate-summit-2025',
        'title': 'Global Climate Summit 2025',
        'category': 'environment',
        'evolution': [
            {'date': '2025-01-15', 'title': 'World Leaders Announce Global Climate Summit for March', 'importance': 7},
            {'date': '2025-02-10', 'title': 'Climate Activists Push for Stricter Emission Goals at Upcoming Summit', 'importance': 6},
            {'date': '2025-03-01', 'title': 'Preparations Underway for Global Climate Summit', 'importance': 8},
            {'date': '2025-03-05', 'title': 'Climate Summit Begins with Ambitious Opening Speeches', 'importance': 9},
            {'date': '2025-03-07', 'title': 'Major Carbon Reduction Agreement Reached at Climate Summit', 'importance': 10},
            {'date': '2025-03-08', 'title': 'Developing Nations Express Concerns Over Climate Agreement Funding', 'importance': 8},
            {'date': '2025-03-10', 'title': 'Climate Summit Concludes with Historic Global Agreement', 'importance': 10},
            {'date': '2025-03-20', 'title': 'Implementation Challenges Emerge for Climate Summit Agreements', 'importance': 7},
            {'date': '2025-04-15', 'title': 'First Countries Begin Legislating Climate Summit Commitments', 'importance': 8}
        ]
    },
    {
        'id': 'tech-innovation-2025',
        'title': 'Breakthrough in Quantum Computing',
        'category': 'technology',
        'evolution': [
            {'date': '2025-01-05', 'title': 'Research Team Announces Quantum Computing Breakthrough', 'importance': 8},
            {'date': '2025-01-10', 'title': 'Tech Industry Reacts to Quantum Computing Advancement', 'importance': 7},
            {'date': '2025-01-20', 'title': 'Practical Applications of New Quantum Technology Explored', 'importance': 6},
            {'date': '2025-02-03', 'title': 'First Commercial Quantum Computer Using New Technology Unveiled', 'importance': 9},
            {'date': '2025-02-15', 'title': 'Security Experts Warn of Quantum Computing Risks to Encryption', 'importance': 8},
            {'date': '2025-03-01', 'title': 'Government Funding Announced for Quantum Computing Research', 'importance': 7},
            {'date': '2025-03-20', 'title': 'Financial Sector Begins Adopting Quantum-Resistant Security', 'importance': 8}
        ]
    },
    {
        'id': 'election-2025',
        'title': 'National Election 2025',
        'category': 'politics',
        'evolution': [
            {'date': '2025-01-10', 'title': 'Presidential Election Campaign Season Officially Begins', 'importance': 8},
            {'date': '2025-02-01', 'title': 'First Presidential Debate Highlights Economic Policies', 'importance': 9},
            {'date': '2025-02-15', 'title': 'Polling Shows Tight Race in Key Swing States', 'importance': 7},
            {'date': '2025-03-01', 'title': 'Foreign Policy Becomes Central Issue in Presidential Race', 'importance': 8},
            {'date': '2025-03-15', 'title': 'Second Presidential Debate Focuses on Healthcare Reform', 'importance': 9},
            {'date': '2025-04-01', 'title': 'Campaign Financing Controversy Erupts in Presidential Race', 'importance': 8},
            {'date': '2025-04-15', 'title': 'Final Presidential Debate Sees Sharp Exchanges on Climate Policy', 'importance': 9}
        ]
    },
    {
        'id': 'health-breakthrough-2025',
        'title': 'Medical Breakthrough in Alzheimer\'s Treatment',
        'category': 'health',
        'evolution': [
            {'date': '2025-01-20', 'title': 'Research Team Announces Promising Alzheimer\'s Treatment Results', 'importance': 8},
            {'date': '2025-02-05', 'title': 'Clinical Trials Begin for New Alzheimer\'s Medication', 'importance': 7},
            {'date': '2025-02-25', 'title': 'Early Trial Results Show Significant Cognitive Improvements', 'importance': 9},
            {'date': '2025-03-10', 'title': 'Medical Community Responds to Alzheimer\'s Treatment Breakthrough', 'importance': 8},
            {'date': '2025-03-25', 'title': 'Regulatory Fast-Track Approval Sought for Alzheimer\'s Treatment', 'importance': 7},
            {'date': '2025-04-10', 'title': 'Patient Advocacy Groups Celebrate Alzheimer\'s Research Progress', 'importance': 6}
        ]
    }
]

# Trending topics with momentum scores
TRENDING_TOPICS = [
    {'name': 'Climate Action', 'momentum': 85, 'category': 'environment', 'related_stories': ['climate-summit-2025']},
    {'name': 'Quantum Computing', 'momentum': 78, 'category': 'technology', 'related_stories': ['tech-innovation-2025']},
    {'name': 'Election 2025', 'momentum': 92, 'category': 'politics', 'related_stories': ['election-2025']},
    {'name': 'Alzheimer\'s Research', 'momentum': 65, 'category': 'health', 'related_stories': ['health-breakthrough-2025']},
    {'name': 'Artificial Intelligence', 'momentum': 88, 'category': 'technology', 'related_stories': []},
    {'name': 'Renewable Energy', 'momentum': 75, 'category': 'environment', 'related_stories': ['climate-summit-2025']},
    {'name': 'Global Trade', 'momentum': 70, 'category': 'business', 'related_stories': []},
    {'name': 'Space Exploration', 'momentum': 68, 'category': 'science', 'related_stories': []}
]

# Cache for generated articles
_articles_cache = None

def generate_mock_articles(count=200):
    """Generate mock news articles with temporal patterns."""
    global _articles_cache
    
    if _articles_cache is not None:
        return _articles_cache
    
    articles = []
    
    # Set date range for articles (past 3 months to 1 month in future)
    end_date = datetime.datetime.now() + timedelta(days=30)
    start_date = end_date - timedelta(days=120)
    date_range = (end_date - start_date).days
    
    # Generate random articles
    for _ in range(count):
        # Basic article properties
        article_id = str(uuid.uuid4())
        category = random.choice(CATEGORIES)
        source_name = random.choice(list(SOURCES.keys()))
        source_info = SOURCES[source_name]
        
        # Add some randomness to the bias rating but keep it aligned with source bias
        bias_rating = source_info['bias'] + random.uniform(-1.5, 1.5)
        bias_rating = max(-10, min(10, bias_rating))  # Keep within -10 to 10 scale
        
        # Generate publish date with more articles closer to current date
        days_ago = int(random.betavariate(2, 5) * date_range)
        published_at = end_date - timedelta(days=days_ago)
        
        # Generate title and content
        title = f"{get_random_title_prefix(category)} {get_random_title_subject(category)}"
        content = generate_article_content(category, bias_rating)
        
        # Create article object
        article = {
            'id': article_id,
            'title': title,
            'description': content[:150] + '...',
            'content': content,
            'category': category,
            'source_name': source_name,
            'source_reliability': source_info['reliability'],
            'url_to_image': f"https://source.unsplash.com/random/800x600?{category}",
            'published_at': published_at.isoformat(),
            'bias_rating': round(bias_rating, 1),
            'sentiment': random.choice(['positive', 'neutral', 'negative']),
            'reading_time': random.randint(3, 12),
            'related_topics': get_related_topics(category),
            'story_id': get_random_story_id(category)
        }
        
        articles.append(article)
    
    # Add story evolution articles
    for story in STORY_THEMES:
        for event in story['evolution']:
            # Convert string date to datetime
            event_date = datetime.datetime.fromisoformat(event['date'])
            
            # Create article for this story event
            article = {
                'id': str(uuid.uuid4()),
                'title': event['title'],
                'description': generate_article_content(story['category'], random.uniform(-2, 2))[:150] + '...',
                'content': generate_article_content(story['category'], random.uniform(-2, 2)),
                'category': story['category'],
                'source_name': random.choice(list(SOURCES.keys())),
                'source_reliability': random.randint(7, 9),
                'url_to_image': f"https://source.unsplash.com/random/800x600?{story['category']}",
                'published_at': event_date.isoformat(),
                'bias_rating': random.uniform(-3, 3),
                'sentiment': random.choice(['positive', 'neutral', 'negative']),
                'reading_time': random.randint(3, 12),
                'related_topics': [topic['name'] for topic in TRENDING_TOPICS if story['id'] in topic['related_stories']],
                'story_id': story['id'],
                'importance': event['importance']
            }
            
            articles.append(article)
    
    # Sort articles by date
    articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    # Cache the generated articles
    _articles_cache = articles
    
    return articles

def get_timeline_news(category='all', start_date=None, end_date=None):
    """Get news articles for timeline visualization."""
    articles = generate_mock_articles()
    
    # Filter by category if specified
    if category != 'all':
        articles = [a for a in articles if a['category'] == category]
    
    # Filter by date range if specified
    if start_date:
        start = datetime.datetime.fromisoformat(start_date)
        articles = [a for a in articles if datetime.datetime.fromisoformat(a['published_at']) >= start]
    
    if end_date:
        end = datetime.datetime.fromisoformat(end_date)
        articles = [a for a in articles if datetime.datetime.fromisoformat(a['published_at']) <= end]
    
    # Group articles by date
    timeline_data = {}
    for article in articles:
        date = article['published_at'].split('T')[0]  # Extract just the date part
        
        if date not in timeline_data:
            timeline_data[date] = {
                'date': date,
                'articles': [],
                'importance': 0
            }
        
        timeline_data[date]['articles'].append(article)
        
        # Add to the day's importance score
        importance = article.get('importance', 5)  # Default importance if not specified
        timeline_data[date]['importance'] += importance
    
    # Convert to list and sort by date
    timeline = list(timeline_data.values())
    timeline.sort(key=lambda x: x['date'])
    
    return timeline

def get_trending_topics():
    """Get trending topics with related articles."""
    articles = generate_mock_articles()
    
    trending = []
    for topic in TRENDING_TOPICS:
        # Find related articles
        related_articles = []
        
        # Direct matches in related_topics
        for article in articles:
            if topic['name'] in article.get('related_topics', []):
                related_articles.append(article)
        
        # Add articles from related stories
        for story_id in topic['related_stories']:
            story_articles = [a for a in articles if a.get('story_id') == story_id]
            for article in story_articles:
                if article not in related_articles:
                    related_articles.append(article)
        
        # Sort by date and limit to 5 most recent
        related_articles.sort(key=lambda x: x['published_at'], reverse=True)
        related_articles = related_articles[:5]
        
        # Add to trending list
        trending.append({
            'name': topic['name'],
            'momentum': topic['momentum'],
            'category': topic['category'],
            'articles': related_articles
        })
    
    # Sort by momentum
    trending.sort(key=lambda x: x['momentum'], reverse=True)
    
    return trending

def get_news_by_topic(topic):
    """Get news articles for a specific topic."""
    articles = generate_mock_articles()
    
    # Find the trending topic
    found_topic = None
    for t in TRENDING_TOPICS:
        if t['name'].lower() == topic.lower():
            found_topic = t
            break
    
    if not found_topic:
        return {'topic': topic, 'articles': []}
    
    # Find related articles
    related_articles = []
    
    # Direct matches in related_topics
    for article in articles:
        if found_topic['name'] in article.get('related_topics', []):
            related_articles.append(article)
    
    # Add articles from related stories
    for story_id in found_topic['related_stories']:
        story_articles = [a for a in articles if a.get('story_id') == story_id]
        for article in story_articles:
            if article not in related_articles:
                related_articles.append(article)
    
    # Sort by date
    related_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    return {
        'topic': found_topic['name'],
        'momentum': found_topic['momentum'],
        'category': found_topic['category'],
        'articles': related_articles
    }

def get_news_by_date_range(start_date, end_date, category='all'):
    """Get news articles for a specific date range."""
    articles = generate_mock_articles()
    
    # Filter by category if specified
    if category != 'all':
        articles = [a for a in articles if a['category'] == category]
    
    # Filter by date range
    filtered_articles = []
    for article in articles:
        article_date = datetime.datetime.fromisoformat(article['published_at'])
        
        if start_date:
            start = datetime.datetime.fromisoformat(start_date)
            if article_date < start:
                continue
        
        if end_date:
            end = datetime.datetime.fromisoformat(end_date)
            if article_date > end:
                continue
        
        filtered_articles.append(article)
    
    # Sort by date
    filtered_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    return {
        'start_date': start_date,
        'end_date': end_date,
        'category': category,
        'articles': filtered_articles
    }

def search_news(query, category='all', start_date=None, end_date=None, page=1, limit=10):
    """Search for news articles."""
    articles = generate_mock_articles()
    
    # Filter by category if specified
    if category != 'all':
        articles = [a for a in articles if a['category'] == category]
    
    # Filter by date range if specified
    if start_date:
        start = datetime.datetime.fromisoformat(start_date)
        articles = [a for a in articles if datetime.datetime.fromisoformat(a['published_at']) >= start]
    
    if end_date:
        end = datetime.datetime.fromisoformat(end_date)
        articles = [a for a in articles if datetime.datetime.fromisoformat(a['published_at']) <= end]
    
    # Filter by query
    if query:
        query = query.lower()
        filtered_articles = []
        for article in articles:
            if (query in article['title'].lower() or 
                query in article['description'].lower() or 
                query in article['content'].lower() or
                query in article['category'].lower() or
                query in article['source_name'].lower()):
                filtered_articles.append(article)
        articles = filtered_articles
    
    # Calculate pagination
    total = len(articles)
    total_pages = (total + limit - 1) // limit
    page = min(max(1, page), total_pages) if total_pages > 0 else 1
    start_idx = (page - 1) * limit
    end_idx = min(start_idx + limit, total)
    
    return {
        'query': query,
        'category': category,
        'start_date': start_date,
        'end_date': end_date,
        'page': page,
        'limit': limit,
        'total': total,
        'total_pages': total_pages,
        'articles': articles[start_idx:end_idx]
    }

def get_story_evolution(story_id):
    """Get the evolution of a story over time."""
    articles = generate_mock_articles()
    
    # Find the story theme
    story_theme = None
    for story in STORY_THEMES:
        if story['id'] == story_id:
            story_theme = story
            break
    
    if not story_theme:
        return {'story_id': story_id, 'title': 'Unknown Story', 'events': []}
    
    # Get all articles related to this story
    story_articles = [a for a in articles if a.get('story_id') == story_id]
    
    # Sort by date
    story_articles.sort(key=lambda x: x['published_at'])
    
    # Format as timeline events
    events = []
    for article in story_articles:
        events.append({
            'date': article['published_at'],
            'title': article['title'],
            'description': article['description'],
            'importance': article.get('importance', 5),
            'article_id': article['id']
        })
    
    return {
        'story_id': story_id,
        'title': story_theme['title'],
        'category': story_theme['category'],
        'events': events
    }

def get_article_by_id(article_id):
    """Get a specific article by its ID."""
    articles = generate_mock_articles()
    
    # Find the article with the matching ID
    for article in articles:
        if article['id'] == article_id:
            return article
    
    return {'error': 'Article not found'}

# Helper functions for generating mock content
def get_random_title_prefix(category):
    """Get a random title prefix based on category."""
    prefixes = {
        'politics': ['Breaking:', 'Analysis:', 'Opinion:', 'Exclusive:', 'Report:'],
        'business': ['Market Alert:', 'Economic Update:', 'Industry Focus:', 'Company News:', 'Financial Report:'],
        'technology': ['Tech Update:', 'Innovation:', 'Digital Trends:', 'New Release:', 'Tech Review:'],
        'science': ['Scientific Discovery:', 'Research Breakthrough:', 'Study Finds:', 'Scientists Develop:', 'New Evidence:'],
        'health': ['Health Alert:', 'Medical Breakthrough:', 'Wellness Update:', 'Study Reveals:', 'Health Advisory:'],
        'entertainment': ['Trending Now:', 'Celebrity News:', 'Review:', 'Exclusive Interview:', 'Behind the Scenes:'],
        'sports': ['Game Recap:', 'Player Spotlight:', 'League Update:', 'Tournament Coverage:', 'Team News:'],
        'environment': ['Climate Report:', 'Environmental Alert:', 'Conservation News:', 'Sustainability Update:', 'Green Initiative:']
    }
    
    return random.choice(prefixes.get(category, ['News:']))

def get_random_title_subject(category):
    """Get a random title subject based on category."""
    subjects = {
        'politics': [
            'New Policy Aims to Address Economic Inequality',
            'Lawmakers Debate Controversial Bill',
            'International Relations Strained After Summit',
            'Election Polls Show Shifting Voter Preferences',
            'Government Announces Major Infrastructure Plan'
        ],
        'business': [
            'Tech Giant Reports Record Quarterly Earnings',
            'Startup Secures $50M in Series B Funding',
            'Market Volatility Continues Amid Economic Uncertainty',
            'Retail Sales Surge Beyond Analyst Expectations',
            'Major Merger Creates Industry Powerhouse'
        ],
        'technology': [
            'Revolutionary AI System Mimics Human Creativity',
            'New Smartphone Features Breakthrough Battery Technology',
            'Cybersecurity Threats Evolve as Remote Work Continues',
            'Quantum Computing Milestone Achieved by Research Team',
            'Tech Companies Collaborate on Industry Standards'
        ],
        'science': [
            'Astronomers Discover Earth-like Exoplanet in Habitable Zone',
            'Gene Editing Technique Shows Promise for Treating Genetic Disorders',
            'Fossil Discovery Rewrites Evolutionary Timeline',
            'Particle Accelerator Experiment Yields Unexpected Results',
            'Climate Models Predict Shifting Weather Patterns'
        ],
        'health': [
            'New Treatment Shows Promise for Chronic Condition',
            'Study Links Lifestyle Factors to Longevity',
            'Mental Health Awareness Campaign Launches Nationwide',
            'Researchers Identify Key Factors in Disease Progression',
            'Nutrition Study Challenges Conventional Dietary Advice'
        ],
        'entertainment': [
            'Award-Winning Film Director Announces New Project',
            'Streaming Platform Releases Highly Anticipated Series',
            'Music Festival Lineup Features Diverse Artists',
            'Celebrity Couple Makes Red Carpet Debut',
            'Box Office Hit Breaks Opening Weekend Records'
        ],
        'sports': [
            'Underdog Team Clinches Championship in Overtime Thriller',
            'Star Athlete Signs Record-Breaking Contract',
            'Olympic Hopefuls Prepare for Qualifying Events',
            'Coach Announces Retirement After Legendary Career',
            'New Stadium Deal Approved After Years of Negotiation'
        ],
        'environment': [
            'Renewable Energy Project Sets New Capacity Record',
            'Study Shows Accelerating Ice Melt in Polar Regions',
            'Conservation Efforts Save Endangered Species from Extinction',
            'Sustainable Practices Gain Traction in Corporate Sector',
            'Climate Agreement Faces Implementation Challenges'
        ]
    }
    
    return random.choice(subjects.get(category, ['Breaking News Story']))

def generate_article_content(category, bias_rating):
    """Generate mock article content."""
    # Base paragraphs by category
    base_content = {
        'politics': [
            "Political analysts are closely monitoring developments as they unfold. The implications for policy direction remain significant.",
            "Lawmakers from both sides of the aisle have expressed varying opinions on the matter, highlighting the partisan divide.",
            "Public opinion polls indicate mixed reactions, with demographic differences playing a key role in response patterns."
        ],
        'business': [
            "Market observers note that this development could have far-reaching implications for the industry sector.",
            "Financial analysts have revised their projections based on these recent developments.",
            "Investors are weighing potential opportunities against market uncertainties in response to the news."
        ],
        'technology': [
            "This technological advancement represents a significant step forward in the field.",
            "Industry experts highlight both the potential benefits and challenges associated with this innovation.",
            "The development timeline suggests commercial applications could be available within the next few years."
        ],
        'science': [
            "The research findings have been peer-reviewed and published in a leading scientific journal.",
            "This discovery builds upon previous work in the field while opening new avenues for exploration.",
            "The scientific community has responded with both excitement and calls for further investigation."
        ],
        'health': [
            "Medical professionals emphasize that these findings should be interpreted within the broader context of health research.",
            "The implications for patient care and treatment protocols are being carefully evaluated.",
            "Public health officials are considering how these developments might influence guidelines and recommendations."
        ],
        'entertainment': [
            "Critics and fans alike have shared their reactions across social media platforms.",
            "Industry insiders suggest this could influence trends within the entertainment sector.",
            "The cultural impact of this development extends beyond immediate audience reception."
        ],
        'sports': [
            "Sports analysts are debating the strategic implications for upcoming competitions.",
            "Team management has issued statements addressing fan concerns and future plans.",
            "The competitive landscape may shift significantly as a result of these developments."
        ],
        'environment': [
            "Environmental scientists point to the data as further evidence of ongoing ecological changes.",
            "Sustainability experts emphasize the need for coordinated response across sectors.",
            "Long-term projections suggest varying scenarios depending on intervention measures."
        ]
    }
    
    # Get base paragraphs for the category
    paragraphs = base_content.get(category, ["The story continues to develop as more information becomes available."])
    
    # Add bias-influenced language based on bias rating
    if bias_rating < -5:  # Strong left bias
        paragraphs.append("Progressive voices emphasize the importance of this development for social equity and collective welfare.")
        paragraphs.append("Critics argue that opposition to these measures reflects entrenched interests rather than substantive concerns.")
    elif bias_rating < -2:  # Moderate left bias
        paragraphs.append("The development has been generally well-received by those concerned with inclusive policies.")
        paragraphs.append("Some experts suggest this represents a positive step toward addressing systemic challenges.")
    elif bias_rating > 5:  # Strong right bias
        paragraphs.append("Traditional values advocates welcome this development as a return to fundamental principles.")
        paragraphs.append("Critics of the opposition suggest their concerns reflect ideological rather than practical considerations.")
    elif bias_rating > 2:  # Moderate right bias
        paragraphs.append("The business community has generally responded positively to these developments.")
        paragraphs.append("Some analysts suggest this represents a practical approach to addressing current challenges.")
    else:  # Relatively neutral
        paragraphs.append("Various stakeholders have expressed different perspectives on the implications of this development.")
        paragraphs.append("Analysis continues as experts evaluate potential outcomes across multiple dimensions.")
    
    # Shuffle paragraphs and join with newlines
    random.shuffle(paragraphs)
    return "\n\n".join(paragraphs)

def get_related_topics(category):
    """Get related trending topics for a category."""
    related = [topic['name'] for topic in TRENDING_TOPICS if topic['category'] == category]
    # Select 0-2 related topics
    count = min(len(related), random.randint(0, 2))
    return random.sample(related, count) if count > 0 else []

def get_random_story_id(category):
    """Get a random story ID for a category, or None."""
    # 30% chance of being part of a major story
    if random.random() > 0.3:
        return None
    
    # Find stories matching the category
    matching_stories = [story['id'] for story in STORY_THEMES if story['category'] == category]
    
    if matching_stories:
        return random.choice(matching_stories)
    
    return None

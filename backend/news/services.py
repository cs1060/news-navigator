import requests
import logging
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from django.conf import settings
from django.core.cache import cache
from django.db.models import Count, Q
from .models import Article, UserPreference, UserInteraction, BiasSource

logger = logging.getLogger(__name__)

class MediastackService:
    """Service for interacting with the Mediastack API to fetch news articles"""
    
    def __init__(self):
        self.api_key = settings.MEDIASTACK_API_KEY
        self.base_url = settings.MEDIASTACK_BASE_URL
    
    def fetch_articles(self, keywords=None, categories=None, countries=None, 
                      sources=None, limit=25, offset=0) -> Tuple[List[Dict], int]:
        """
        Fetch articles from Mediastack API based on parameters
        
        Args:
            keywords: List of keywords to search for
            categories: List of categories to filter by
            countries: List of country codes to filter by
            sources: List of news sources to filter by
            limit: Number of results to return
            offset: Offset for pagination
            
        Returns:
            Tuple of (list of article dictionaries, total count)
        """
        # Check if we should use fake data for testing
        if getattr(settings, 'USE_FAKE_NEWS_DATA', False):
            return self._generate_fake_articles(
                keywords=keywords,
                categories=categories,
                countries=countries,
                sources=sources,
                limit=limit,
                offset=offset
            )
        
        # Build the API request
        params = {
            'access_key': self.api_key,
            'limit': limit,
            'offset': offset,
            'sort': 'published_desc',
        }
        
        # Add optional parameters if provided
        if keywords:
            params['keywords'] = ','.join(keywords)
        
        if categories:
            params['categories'] = ','.join(categories)
        
        if countries:
            params['countries'] = ','.join(countries)
        
        if sources:
            params['sources'] = ','.join(sources)
        
        # Create cache key based on parameters
        cache_key = f"mediastack_articles_{json.dumps(params, sort_keys=True)}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            logger.info(f"Returning cached articles for {cache_key}")
            return cached_result
        
        try:
            # Make the API request
            logger.info(f"Fetching articles from Mediastack API with params: {params}")
            response = requests.get(f"{self.base_url}/news", params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('error'):
                logger.error(f"Mediastack API error: {data['error']}")
                return [], 0
            
            articles = data.get('data', [])
            total = data.get('pagination', {}).get('total', len(articles))
            
            # Cache the results for 15 minutes
            cache.set(cache_key, (articles, total), 60 * 15)
            
            return articles, total
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching articles from Mediastack: {str(e)}")
            return [], 0
    
    def _generate_fake_articles(self, keywords=None, categories=None, countries=None, 
                               sources=None, limit=25, offset=0) -> Tuple[List[Dict], int]:
        """
        Generate fake articles for testing when no API key is available
        
        This method creates realistic-looking fake news articles that match the
        structure of the Mediastack API response.
        """
        logger.info("Generating fake articles for testing")
        
        # Define sample data for generating fake articles
        sample_sources = [
            {"name": "CNN", "bias": 0.4, "reliability": 0.8},
            {"name": "Fox News", "bias": 0.7, "reliability": 0.6},
            {"name": "BBC", "bias": -0.1, "reliability": 0.9},
            {"name": "The Guardian", "bias": -0.5, "reliability": 0.85},
            {"name": "Reuters", "bias": 0.0, "reliability": 0.95},
            {"name": "MSNBC", "bias": -0.7, "reliability": 0.7},
            {"name": "Breitbart", "bias": 0.9, "reliability": 0.4},
            {"name": "The New York Times", "bias": -0.4, "reliability": 0.85},
            {"name": "The Washington Post", "bias": -0.3, "reliability": 0.8},
            {"name": "The Wall Street Journal", "bias": 0.3, "reliability": 0.85},
        ]
        
        sample_categories = [
            "general", "business", "entertainment", "health", 
            "science", "sports", "technology"
        ]
        
        sample_countries = [
            "us", "gb", "ca", "au", "de", "fr", "jp", "cn", "in", "ru"
        ]
        
        # Filter sources if specified
        if sources:
            filtered_sources = [s for s in sample_sources if s["name"] in sources]
            if filtered_sources:
                sample_sources = filtered_sources
        
        # Filter categories if specified
        if categories:
            filtered_categories = [c for c in sample_categories if c in categories]
            if filtered_categories:
                sample_categories = filtered_categories
        
        # Filter countries if specified
        if countries:
            filtered_countries = [c for c in sample_countries if c in countries]
            if filtered_countries:
                sample_countries = filtered_countries
        
        # Generate article templates based on keywords
        article_templates = []
        
        # Default templates if no keywords provided
        default_templates = [
            {"title": "Global markets react to economic data", "category": "business"},
            {"title": "Scientists discover new species in remote region", "category": "science"},
            {"title": "Tech giant unveils latest smartphone", "category": "technology"},
            {"title": "Major sporting event draws record audience", "category": "sports"},
            {"title": "New study reveals health benefits of diet change", "category": "health"},
            {"title": "Award-winning film premieres at festival", "category": "entertainment"},
            {"title": "Political tensions rise in trade negotiations", "category": "general"},
            {"title": "Climate change impacts observed in new study", "category": "science"},
            {"title": "Stock market reaches all-time high", "category": "business"},
            {"title": "Breakthrough medical treatment shows promise", "category": "health"},
        ]
        
        # Generate keyword-specific templates if keywords provided
        if keywords:
            for keyword in keywords:
                article_templates.extend([
                    {"title": f"New developments in {keyword} research", "category": "science"},
                    {"title": f"{keyword} becomes major focus in policy debate", "category": "general"},
                    {"title": f"Industry leaders discuss future of {keyword}", "category": "business"},
                    {"title": f"How {keyword} is changing everyday life", "category": "technology"},
                    {"title": f"The impact of {keyword} on global markets", "category": "business"},
                ])
        else:
            article_templates = default_templates
        
        # Generate fake articles
        articles = []
        total_articles = 100  # Simulate having 100 total articles
        
        # Generate more articles than needed to allow for randomization
        for i in range(min(total_articles, limit * 3)):
            # Select random template and customize it
            template = random.choice(article_templates)
            title = template["title"]
            
            # Add some randomization to titles
            if random.random() > 0.7:
                title = title.replace("New", "Revolutionary")
            if random.random() > 0.8:
                title = title.replace("major", "unprecedented")
            
            # Select category (prefer template category but allow for randomness)
            if random.random() > 0.3 and "category" in template:
                category = template["category"]
            else:
                category = random.choice(sample_categories)
            
            # Select source and get bias data
            source_data = random.choice(sample_sources)
            source = source_data["name"]
            bias = source_data["bias"]
            reliability = source_data["reliability"]
            
            # Select country
            country = random.choice(sample_countries)
            
            # Generate random published date within last 7 days
            days_ago = random.randint(0, 7)
            hours_ago = random.randint(0, 23)
            published_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
            
            # Create article object
            article = {
                "title": title,
                "description": f"This is a sample description for the article about {title.lower()}.",
                "content": f"This is sample content for the article. It would contain more details about {title.lower()}.",
                "url": f"https://example.com/news/{i}",
                "image": f"https://picsum.photos/id/{random.randint(1, 1000)}/800/600",
                "published_at": published_at.strftime("%Y-%m-%dT%H:%M:%S%z"),
                "source": source,
                "category": category,
                "country": country,
                "language": "en",
                "bias_score": bias,
                "reliability_score": reliability
            }
            
            articles.append(article)
        
        # Shuffle and slice based on offset and limit
        random.shuffle(articles)
        paginated_articles = articles[offset:offset + limit]
        
        return paginated_articles, total_articles

class UserPreferenceService:
    """Service for managing user preferences and generating personalized news recommendations"""
    
    def __init__(self):
        self.mediastack_service = MediastackService()
    
    def get_user_preference(self, user):
        """Get or create user preference for a user"""
        preference, created = UserPreference.objects.get_or_create(user=user)
        return preference
    
    def update_user_preference(self, user, data):
        """Update user preference with new data"""
        preference = self.get_user_preference(user)
        
        # Update fields if provided in data
        if 'interests' in data:
            preference.interests = data['interests']
        
        if 'preferred_categories' in data:
            preference.preferred_categories = data['preferred_categories']
        
        if 'preferred_sources' in data:
            preference.preferred_sources = data['preferred_sources']
        
        if 'excluded_sources' in data:
            preference.excluded_sources = data['excluded_sources']
        
        if 'preferred_countries' in data:
            preference.preferred_countries = data['preferred_countries']
        
        preference.save()
        return preference
    
    def record_user_interaction(self, user, article_id, interaction_type):
        """Record a user interaction with an article"""
        try:
            article = Article.objects.get(id=article_id)
            
            # Create the interaction
            interaction = UserInteraction.objects.create(
                user=user,
                article=article,
                interaction_type=interaction_type
            )
            
            # Update reading history for 'view' interactions
            if interaction_type == 'view':
                preference = self.get_user_preference(user)
                
                # Add article ID to reading history if not already there
                if article_id not in preference.reading_history:
                    # Keep only the most recent 100 articles
                    reading_history = preference.reading_history
                    reading_history.append(article_id)
                    if len(reading_history) > 100:
                        reading_history = reading_history[-100:]
                    
                    preference.reading_history = reading_history
                    preference.save()
            
            return interaction
            
        except Article.DoesNotExist:
            logger.error(f"Article with ID {article_id} not found")
            return None
    
    def _get_combined_keywords(self, user):
        """
        Combine explicit user interests with implicit interests derived from behavior
        
        This method analyzes user interactions to identify topics they engage with
        and combines them with their explicitly stated interests.
        """
        preference = self.get_user_preference(user)
        
        # Start with explicit interests
        combined_keywords = list(preference.interests)
        
        # Get articles the user has interacted with
        interacted_articles = Article.objects.filter(
            interactions__user=user
        ).distinct()
        
        # Extract keywords from article titles and categories
        from collections import Counter
        
        # Count categories from interacted articles
        category_counter = Counter()
        for article in interacted_articles:
            if article.category:
                category_counter[article.category] += 1
        
        # Add top categories as keywords
        for category, count in category_counter.most_common(3):
            if category and category not in combined_keywords:
                combined_keywords.append(category)
        
        # Add sources the user frequently reads
        source_counter = Counter()
        for article in interacted_articles:
            source_counter[article.source] += 1
        
        # Add top sources as keywords
        for source, count in source_counter.most_common(2):
            if source and source not in combined_keywords:
                combined_keywords.append(source)
        
        return combined_keywords
    
    def get_personalized_articles(self, user, limit=25, offset=0) -> Tuple[List[Dict], int]:
        """
        Get personalized articles for a user based on their preferences and behavior
        
        Args:
            user: User to get personalized articles for
            limit: Number of articles to return
            offset: Offset for pagination
            
        Returns:
            Tuple of (list of article dictionaries, total count)
        """
        preference = self.get_user_preference(user)
        
        # Combine explicit and implicit interests
        keywords = self._get_combined_keywords(user)
        
        # Get user preferences
        categories = preference.preferred_categories if preference.preferred_categories else None
        countries = preference.preferred_countries if preference.preferred_countries else None
        sources = preference.preferred_sources if preference.preferred_sources else None
        
        # Fetch articles based on preferences
        articles, total = self.mediastack_service.fetch_articles(
            keywords=keywords,
            categories=categories,
            countries=countries,
            sources=sources,
            limit=limit,
            offset=offset
        )
        
        # Filter out excluded sources
        if preference.excluded_sources:
            articles = [a for a in articles if a.get('source') not in preference.excluded_sources]
        
        # Filter out articles in reading history
        if preference.reading_history:
            # Convert reading history to set for faster lookups
            reading_history_set = set(preference.reading_history)
            articles = [a for a in articles if str(a.get('id')) not in reading_history_set]
        
        return articles, min(total, len(articles))
    
    def get_bias_data_for_source(self, source_name) -> Optional[Dict]:
        """Get bias and reliability data for a news source"""
        try:
            bias_source = BiasSource.objects.get(name=source_name)
            return {
                'bias_score': bias_source.bias_score,
                'reliability_score': bias_source.reliability_score,
                'description': bias_source.description
            }
        except BiasSource.DoesNotExist:
            return None

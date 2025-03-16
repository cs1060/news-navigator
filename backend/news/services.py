import requests
from datetime import datetime, timedelta
from django.conf import settings
from django.db.models import Count, Q
from typing import Dict, List, Optional, Tuple, Any
import logging
import json

logger = logging.getLogger(__name__)

class MediastackService:
    def __init__(self):
        self.api_key = settings.MEDIASTACK_API_KEY
        self.base_url = settings.MEDIASTACK_BASE_URL

    def get_articles(
        self,
        keywords: Optional[str] = None,
        categories: Optional[List[str]] = None,
        countries: Optional[List[str]] = None,
        limit: int = 25,
        offset: int = 0
    ) -> Dict:
        """
        Fetch articles from Mediastack API
        
        Args:
            keywords: Search query string
            categories: List of news categories (e.g., business, sports)
            countries: List of country codes (e.g., us, gb)
            limit: Number of results per request (default: 25, max: 100)
            offset: Number of results to skip (for pagination)
            
        Returns:
            Dict containing API response with articles and metadata
        """
        params = {
            'access_key': self.api_key,
            'limit': min(limit, 100),  # Mediastack limit is 100
            'offset': offset,
            'sort': 'published_desc'
        }

        if keywords:
            params['keywords'] = keywords
        
        if categories:
            params['categories'] = ','.join(categories)
            
        if countries:
            params['countries'] = ','.join(countries)

        try:
            response = requests.get(f"{self.base_url}/news", params=params)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Raw Mediastack API response data: {data}")
            return data
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch articles: {str(e)}")
            raise Exception(f"Failed to fetch articles: {str(e)}")
        except Exception as e:
            logger.error(f"Failed to fetch articles: {str(e)}")
            raise Exception(f"Failed to fetch articles: {str(e)}")

    def format_article_data(self, article_data: Dict) -> Dict:
        """
        Format article data to match our Article model structure
        """
        try:
            # Log raw article data for debugging
            logger.info(f"Formatting article data: {article_data}")
            
            # Extract country from API response
            country = article_data.get('country', '')
            
            formatted_data = {
                'title': article_data.get('title'),
                'description': article_data.get('description'),
                'url': article_data.get('url'),
                'image': article_data.get('image'),
                'published_at': datetime.strptime(
                    article_data.get('published_at'), 
                    '%Y-%m-%dT%H:%M:%S%z'
                ) if article_data.get('published_at') else None,
                'source': article_data.get('source'),
                'category': article_data.get('category'),
                'country': country.upper() if country else None
            }
            
            logger.info(f"Formatted article data: {formatted_data}")
            return formatted_data
        except Exception as e:
            logger.error(f"Error formatting article data: {str(e)}")
            logger.error(f"Raw article data: {article_data}")
            raise

class UserPreferenceService:
    """Service for managing user preferences and generating personalized recommendations"""
    
    def __init__(self):
        self.mediastack_service = MediastackService()
    
    def get_personalized_articles(self, user, limit=25, offset=0) -> Tuple[List[Dict], int]:
        """Get personalized news articles based on user preferences and behavior"""
        from .models import UserPreference, UserInteraction, Article
        
        try:
            # Get user preferences
            user_pref, created = UserPreference.objects.get_or_create(user=user)
            
            # Combine explicit preferences with behavior-based interests
            keywords = self._get_combined_keywords(user)
            categories = user_pref.preferred_categories if user_pref.preferred_categories else None
            countries = user_pref.preferred_countries if user_pref.preferred_countries else None
            
            logger.info(f"Fetching personalized articles for user {user.username}")
            logger.info(f"Keywords: {keywords}, Categories: {categories}, Countries: {countries}")
            
            # Fetch articles from Mediastack API
            response_data = self.mediastack_service.get_articles(
                keywords=','.join(keywords) if keywords else None,
                categories=categories,
                countries=countries,
                limit=limit,
                offset=offset
            )
            
            # Format and filter articles
            articles = []
            for article_data in response_data.get('data', []):
                formatted_article = self.mediastack_service.format_article_data(article_data)
                
                # Skip articles from excluded sources
                if user_pref.excluded_sources and formatted_article['source'] in user_pref.excluded_sources:
                    continue
                    
                articles.append(formatted_article)
            
            # Record this interaction for future recommendations
            self._record_batch_view_interaction(user, articles)
            
            return articles, response_data.get('pagination', {}).get('total', 0)
            
        except Exception as e:
            logger.error(f"Error getting personalized articles: {str(e)}")
            raise
    
    def _get_combined_keywords(self, user) -> List[str]:
        """Combine explicit interests with behavior-based interests"""
        from .models import UserPreference, UserInteraction
        
        keywords = []
        
        try:
            # Get explicit interests
            user_pref = UserPreference.objects.get(user=user)
            if user_pref.interests:
                keywords.extend(user_pref.interests)
            
            # Get behavior-based interests (from articles user has interacted with)
            one_week_ago = datetime.now() - timedelta(days=7)
            recent_interactions = UserInteraction.objects.filter(
                user=user,
                timestamp__gte=one_week_ago,
                interaction_type__in=['click', 'save', 'like']
            ).select_related('article')
            
            # Extract keywords from article titles and categories
            for interaction in recent_interactions:
                article = interaction.article
                if article.category and article.category not in keywords:
                    keywords.append(article.category)
                
                # Extract potential keywords from title
                title_words = article.title.lower().split()
                for word in title_words:
                    if len(word) > 5 and word not in keywords:  # Only consider significant words
                        keywords.append(word)
            
            # Limit to top 10 keywords to avoid over-filtering
            return keywords[:10]
            
        except UserPreference.DoesNotExist:
            return []
        except Exception as e:
            logger.error(f"Error getting combined keywords: {str(e)}")
            return []
    
    def update_user_preferences(self, user, preferences_data) -> Dict:
        """Update user preferences with new data"""
        from .models import UserPreference
        
        try:
            user_pref, created = UserPreference.objects.get_or_create(user=user)
            
            # Update fields if provided
            if 'interests' in preferences_data:
                user_pref.interests = preferences_data['interests']
            if 'preferred_categories' in preferences_data:
                user_pref.preferred_categories = preferences_data['preferred_categories']
            if 'preferred_sources' in preferences_data:
                user_pref.preferred_sources = preferences_data['preferred_sources']
            if 'excluded_sources' in preferences_data:
                user_pref.excluded_sources = preferences_data['excluded_sources']
            if 'preferred_countries' in preferences_data:
                user_pref.preferred_countries = preferences_data['preferred_countries']
            
            user_pref.save()
            
            return {
                'id': user_pref.id,
                'interests': user_pref.interests,
                'preferred_categories': user_pref.preferred_categories,
                'preferred_sources': user_pref.preferred_sources,
                'excluded_sources': user_pref.excluded_sources,
                'preferred_countries': user_pref.preferred_countries,
                'updated_at': user_pref.updated_at
            }
            
        except Exception as e:
            logger.error(f"Error updating user preferences: {str(e)}")
            raise
    
    def record_user_interaction(self, user, article_id, interaction_type) -> Dict:
        """Record a user interaction with an article"""
        from .models import UserInteraction, Article
        
        try:
            article = Article.objects.get(id=article_id)
            
            interaction = UserInteraction.objects.create(
                user=user,
                article=article,
                interaction_type=interaction_type
            )
            
            # Update reading history if it's a view/click interaction
            if interaction_type in ['view', 'click']:
                user_pref, created = UserPreference.objects.get_or_create(user=user)
                if article_id not in user_pref.reading_history:
                    reading_history = user_pref.reading_history
                    reading_history.append(article_id)
                    # Keep only the most recent 100 articles
                    user_pref.reading_history = reading_history[-100:]
                    user_pref.save()
            
            return {
                'id': interaction.id,
                'user_id': user.id,
                'article_id': article.id,
                'interaction_type': interaction.interaction_type,
                'timestamp': interaction.timestamp
            }
            
        except Article.DoesNotExist:
            logger.error(f"Article with ID {article_id} not found")
            raise
        except Exception as e:
            logger.error(f"Error recording user interaction: {str(e)}")
            raise
    
    def _record_batch_view_interaction(self, user, articles):
        """Record view interactions for a batch of articles"""
        from .models import UserInteraction, Article
        
        try:
            # Create or get Article objects for each article
            for article_data in articles:
                article, created = Article.objects.get_or_create(
                    url=article_data['url'],
                    defaults={
                        'title': article_data['title'],
                        'description': article_data.get('description', ''),
                        'image': article_data.get('image', ''),
                        'published_at': article_data.get('published_at', datetime.now()),
                        'source': article_data.get('source', ''),
                        'category': article_data.get('category', '')
                    }
                )
                
                # Record view interaction
                UserInteraction.objects.create(
                    user=user,
                    article=article,
                    interaction_type='view'
                )
                
        except Exception as e:
            logger.error(f"Error recording batch view interactions: {str(e)}")
            # Don't raise exception here to avoid breaking the main flow

import requests
from datetime import datetime, timedelta
from django.conf import settings
from django.db.models import Count, Q, F, Value
from django.db.models.functions import Coalesce
from typing import Dict, List, Optional, Union, Any
import logging
import random
from .models import Article, UserPreference, UserInteraction, BiasSource

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
            
            # Add bias and reliability information if available
            source_name = article_data.get('source')
            if source_name:
                try:
                    bias_source = BiasSource.objects.filter(source_name__iexact=source_name).first()
                    if bias_source:
                        formatted_data['bias_score'] = self._bias_rating_to_score(bias_source.bias_rating)
                        formatted_data['reliability_score'] = bias_source.reliability_score
                except Exception as e:
                    logger.error(f"Error fetching bias data for {source_name}: {str(e)}")
            
            logger.info(f"Formatted article data: {formatted_data}")
            return formatted_data
        except Exception as e:
            logger.error(f"Error formatting article data: {str(e)}")
            logger.error(f"Raw article data: {article_data}")
            raise
            
    def _bias_rating_to_score(self, bias_rating: Optional[str]) -> Optional[float]:
        """Convert bias rating string to numerical score between -1 and 1"""
        if not bias_rating:
            return None
            
        bias_scores = {
            'far_left': -1.0,
            'left': -0.6,
            'center_left': -0.3,
            'center': 0.0,
            'center_right': 0.3,
            'right': 0.6,
            'far_right': 1.0
        }
        
        return bias_scores.get(bias_rating)


class UserPreferenceService:
    def __init__(self):
        self.mediastack_service = MediastackService()
    
    def get_or_create_preference(self, user=None, session_id=None) -> UserPreference:
        """Get or create a user preference object"""
        if not user and not session_id:
            raise ValueError("Either user or session_id must be provided")
        
        if user:
            preference, created = UserPreference.objects.get_or_create(user=user)
        else:
            preference, created = UserPreference.objects.get_or_create(session_id=session_id)
        
        if created:
            logger.info(f"Created new preference for {'user ' + user.username if user else 'session ' + session_id}")
        
        return preference
    
    def update_preference(self, preference_id: int, data: Dict) -> UserPreference:
        """Update user preferences"""
        try:
            preference = UserPreference.objects.get(id=preference_id)
            
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
        except UserPreference.DoesNotExist:
            logger.error(f"User preference with id {preference_id} not found")
            raise
        except Exception as e:
            logger.error(f"Error updating user preference: {str(e)}")
            raise
    
    def record_interaction(self, article_id: int, interaction_type: str, user=None, session_id=None) -> UserInteraction:
        """Record a user interaction with an article"""
        if not user and not session_id:
            raise ValueError("Either user or session_id must be provided")
        
        try:
            article = Article.objects.get(id=article_id)
            
            interaction = UserInteraction(
                article=article,
                interaction_type=interaction_type
            )
            
            if user:
                interaction.user = user
            else:
                interaction.session_id = session_id
            
            interaction.save()
            return interaction
        except Article.DoesNotExist:
            logger.error(f"Article with id {article_id} not found")
            raise
        except Exception as e:
            logger.error(f"Error recording user interaction: {str(e)}")
            raise
    
    def get_personalized_articles(self, user=None, session_id=None, limit=25, offset=0) -> Dict:
        """Get personalized articles based on user preferences and interactions"""
        if not user and not session_id:
            raise ValueError("Either user or session_id must be provided")
        
        try:
            # Get user preferences
            preference = self.get_or_create_preference(user=user, session_id=session_id)
            
            # Build query parameters based on user preferences
            keywords = None
            if preference.interests:
                # Join interests with OR for broader results
                keywords = ' OR '.join(preference.interests)
            
            categories = preference.preferred_categories if preference.preferred_categories else None
            countries = preference.preferred_countries if preference.preferred_countries else None
            
            # Fetch articles from Mediastack API
            response_data = self.mediastack_service.get_articles(
                keywords=keywords,
                categories=categories,
                countries=countries,
                limit=limit,
                offset=offset
            )
            
            # Format and filter articles
            articles = []
            for article_data in response_data.get('data', []):
                # Skip excluded sources
                if article_data.get('source') in preference.excluded_sources:
                    continue
                    
                formatted_article = self.mediastack_service.format_article_data(article_data)
                articles.append(formatted_article)
            
            # Sort articles based on user interactions if available
            if user or session_id:
                articles = self._personalize_article_order(articles, user=user, session_id=session_id)
            
            result = {
                'articles': articles,
                'pagination': {
                    'offset': offset,
                    'limit': limit,
                    'total': len(articles)
                }
            }
            
            return result
        except Exception as e:
            logger.error(f"Error getting personalized articles: {str(e)}")
            raise
    
    def _personalize_article_order(self, articles: List[Dict], user=None, session_id=None) -> List[Dict]:
        """Personalize the order of articles based on user interactions"""
        if not articles:
            return articles
            
        try:
            # Get user interactions
            if user:
                interactions = UserInteraction.objects.filter(user=user)
            else:
                interactions = UserInteraction.objects.filter(session_id=session_id)
            
            if not interactions.exists():
                return articles
                
            # Calculate user preferences based on interactions
            liked_categories = self._get_preferred_categories(interactions)
            liked_sources = self._get_preferred_sources(interactions)
            
            # Score articles based on user preferences
            scored_articles = []
            for article in articles:
                score = 0
                
                # Boost score for preferred categories
                if article.get('category') in liked_categories:
                    score += 2
                    
                # Boost score for preferred sources
                if article.get('source') in liked_sources:
                    score += 1
                    
                scored_articles.append((score, article))
            
            # Sort by score (descending) and then by published_at (descending)
            scored_articles.sort(key=lambda x: (x[0], x[1].get('published_at')), reverse=True)
            
            # Return just the articles without scores
            return [article for _, article in scored_articles]
        except Exception as e:
            logger.error(f"Error personalizing article order: {str(e)}")
            return articles
    
    def _get_preferred_categories(self, interactions) -> List[str]:
        """Get preferred categories based on user interactions"""
        # Count interactions by category
        category_counts = {}
        for interaction in interactions:
            category = interaction.article.category
            if category:
                category_counts[category] = category_counts.get(category, 0) + 1
        
        # Get top categories (more than 1 interaction)
        return [category for category, count in category_counts.items() if count > 1]
    
    def _get_preferred_sources(self, interactions) -> List[str]:
        """Get preferred sources based on user interactions"""
        # Count interactions by source
        source_counts = {}
        for interaction in interactions:
            source = interaction.article.source
            if source:
                source_counts[source] = source_counts.get(source, 0) + 1
        
        # Get top sources (more than 1 interaction)
        return [source for source, count in source_counts.items() if count > 1]

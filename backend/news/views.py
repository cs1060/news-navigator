from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.conf import settings
from django.http import Http404
import logging
import uuid
from .services import MediastackService, UserPreferenceService
from .serializers import ArticleSerializer, UserPreferenceSerializer, UserInteractionSerializer, BiasSourceSerializer
from .models import Article, UserPreference, UserInteraction, BiasSource
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

# Helper functions
def get_session_id(request):
    """Get or create a session ID for anonymous users"""
    session_id = request.session.get('session_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        request.session['session_id'] = session_id
    return session_id

class ArticlesView(APIView):
    mediastack_service = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not settings.MEDIASTACK_API_KEY:
            logger.error("Mediastack API key not found in settings")
            raise Exception("Mediastack API key not configured")
        if self.mediastack_service is None:
            self.__class__.mediastack_service = MediastackService()

    def get(self, request):
        """
        Get news articles from Mediastack API
        Query parameters:
        - keywords: Search query string
        - categories: Comma-separated list of categories
        - countries: Comma-separated list of country codes
        - limit: Number of results (default: 25)
        - offset: Offset for pagination
        """
        try:
            logger.info(f"Received request: {request.path} {request.GET}")
            
            # Extract query parameters
            keywords = request.query_params.get('keywords')
            categories = request.query_params.get('categories', '').split(',') if request.query_params.get('categories') else None
            countries = request.query_params.get('countries', '').split(',') if request.query_params.get('countries') else None
            
            try:
                limit = int(request.query_params.get('limit', 25))
                offset = int(request.query_params.get('offset', 0))
            except ValueError:
                logger.error("Invalid limit or offset parameter")
                return Response(
                    {'error': 'Invalid limit or offset parameter'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )

            # Generate cache key based on query parameters
            cache_key = f"articles_{keywords}_{categories}_{countries}_{limit}_{offset}"
            cached_response = cache.get(cache_key)

            if cached_response:
                logger.info("Returning cached response")
                return Response(cached_response, content_type='application/json')

            try:
                # Fetch articles from Mediastack
                logger.info("Fetching articles from Mediastack")
                response_data = self.mediastack_service.get_articles(
                    keywords=keywords,
                    categories=categories,
                    countries=countries,
                    limit=limit,
                    offset=offset
                )
                
                # Log raw response for debugging
                logger.info(f"Raw Mediastack response: {response_data}")

                logger.info(f"Received {len(response_data.get('data', []))} articles from Mediastack")

                # Format articles
                articles = []
                for article_data in response_data.get('data', []):
                    formatted_article = self.mediastack_service.format_article_data(article_data)
                    serializer = ArticleSerializer(data=formatted_article)
                    if serializer.is_valid():
                        articles.append(serializer.validated_data)
                    else:
                        logger.warning(f"Invalid article data: {serializer.errors}")
                        logger.warning(f"Raw article data: {article_data}")

                result = {
                    'articles': articles,
                    'pagination': {
                        'offset': offset,
                        'limit': limit,
                        'total': response_data.get('pagination', {}).get('total', 0)
                    }
                }

                # Cache the response for 5 minutes
                cache.set(cache_key, result, timeout=300)
                logger.info("Response cached successfully")

                return Response(result, content_type='application/json')

            except Exception as e:
                logger.error(f"Error fetching articles from Mediastack: {str(e)}")
                return Response(
                    {'error': f"Failed to fetch articles from Mediastack: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content_type='application/json'
                )

        except Exception as e:
            logger.error(f"Unexpected error in ArticlesView: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )


class UserPreferenceView(APIView):
    """API endpoint for managing user preferences"""
    preference_service = UserPreferenceService()
    
    def get(self, request):
        """Get user preferences"""
        try:
            # For now, use session-based preferences for simplicity
            session_id = get_session_id(request)
            
            # Get or create user preferences
            preference = self.preference_service.get_or_create_preference(session_id=session_id)
            serializer = UserPreferenceSerializer(preference)
            
            return Response(serializer.data, content_type='application/json')
        except Exception as e:
            logger.error(f"Error getting user preferences: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )
    
    def post(self, request):
        """Update user preferences"""
        try:
            # For now, use session-based preferences for simplicity
            session_id = get_session_id(request)
            
            # Get or create user preferences
            preference = self.preference_service.get_or_create_preference(session_id=session_id)
            
            # Update preferences with request data
            updated_preference = self.preference_service.update_preference(
                preference.id,
                request.data
            )
            
            serializer = UserPreferenceSerializer(updated_preference)
            return Response(serializer.data, content_type='application/json')
        except Exception as e:
            logger.error(f"Error updating user preferences: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )


class PersonalizedNewsView(APIView):
    """API endpoint for personalized news feed"""
    preference_service = UserPreferenceService()
    
    def get(self, request):
        """Get personalized news feed"""
        try:
            # For now, use session-based preferences for simplicity
            session_id = get_session_id(request)
            
            # Extract query parameters
            try:
                limit = int(request.query_params.get('limit', 25))
                offset = int(request.query_params.get('offset', 0))
            except ValueError:
                logger.error("Invalid limit or offset parameter")
                return Response(
                    {'error': 'Invalid limit or offset parameter'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )
            
            # Generate cache key based on session and parameters
            cache_key = f"personalized_{session_id}_{limit}_{offset}"
            cached_response = cache.get(cache_key)
            
            if cached_response:
                logger.info("Returning cached personalized response")
                return Response(cached_response, content_type='application/json')
            
            # Get personalized articles
            result = self.preference_service.get_personalized_articles(
                session_id=session_id,
                limit=limit,
                offset=offset
            )
            
            # Cache the response for 5 minutes
            cache.set(cache_key, result, timeout=300)
            
            return Response(result, content_type='application/json')
        except Exception as e:
            logger.error(f"Error getting personalized news: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )


class UserInteractionView(APIView):
    """API endpoint for recording user interactions with articles"""
    preference_service = UserPreferenceService()
    
    def post(self, request):
        """Record a user interaction with an article"""
        try:
            # For now, use session-based interactions for simplicity
            session_id = get_session_id(request)
            
            # Validate required fields
            article_id = request.data.get('article_id')
            interaction_type = request.data.get('interaction_type')
            
            if not article_id or not interaction_type:
                return Response(
                    {'error': 'article_id and interaction_type are required'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )
            
            # Validate interaction type
            valid_types = [choice[0] for choice in UserInteraction.INTERACTION_TYPES]
            if interaction_type not in valid_types:
                return Response(
                    {'error': f'Invalid interaction_type. Must be one of: {valid_types}'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )
            
            # Record interaction
            interaction = self.preference_service.record_interaction(
                article_id=article_id,
                interaction_type=interaction_type,
                session_id=session_id
            )
            
            serializer = UserInteractionSerializer(interaction)
            return Response(serializer.data, status=status.HTTP_201_CREATED, content_type='application/json')
        except Article.DoesNotExist:
            return Response(
                {'error': f"Article with id {request.data.get('article_id')} not found"},
                status=status.HTTP_404_NOT_FOUND,
                content_type='application/json'
            )
        except Exception as e:
            logger.error(f"Error recording user interaction: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )


class BiasSourceView(APIView):
    """API endpoint for bias source information"""
    
    def get(self, request, source_name=None):
        """Get bias information for news sources"""
        try:
            if source_name:
                # Get bias information for a specific source
                bias_source = get_object_or_404(BiasSource, source_name__iexact=source_name)
                serializer = BiasSourceSerializer(bias_source)
                return Response(serializer.data, content_type='application/json')
            else:
                # Get all bias sources
                bias_sources = BiasSource.objects.all()
                serializer = BiasSourceSerializer(bias_sources, many=True)
                return Response(serializer.data, content_type='application/json')
        except Http404:
            return Response(
                {'error': f"Bias information for source '{source_name}' not found"},
                status=status.HTTP_404_NOT_FOUND,
                content_type='application/json'
            )
        except Exception as e:
            logger.error(f"Error getting bias source information: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )

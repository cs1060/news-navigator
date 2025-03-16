from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.conf import settings
import logging
from .services import UserPreferenceService
from .serializers import UserPreferenceSerializer, UserInteractionSerializer
from .models import UserPreference, UserInteraction

logger = logging.getLogger(__name__)

class UserPreferenceView(APIView):
    """
    API endpoint for managing user preferences
    """
    permission_classes = [IsAuthenticated]
    preference_service = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.preference_service is None:
            self.__class__.preference_service = UserPreferenceService()
    
    def get(self, request):
        """Get the current user's preferences"""
        try:
            user_pref, created = UserPreference.objects.get_or_create(user=request.user)
            serializer = UserPreferenceSerializer(user_pref)
            return Response(serializer.data, content_type='application/json')
        except Exception as e:
            logger.error(f"Error getting user preferences: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )
    
    def put(self, request):
        """Update the current user's preferences"""
        try:
            updated_preferences = self.preference_service.update_user_preferences(
                user=request.user,
                preferences_data=request.data
            )
            return Response(updated_preferences, content_type='application/json')
        except Exception as e:
            logger.error(f"Error updating user preferences: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )

class PersonalizedArticlesView(APIView):
    """
    API endpoint for personalized news articles
    """
    permission_classes = [IsAuthenticated]
    preference_service = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.preference_service is None:
            self.__class__.preference_service = UserPreferenceService()
    
    def get(self, request):
        """
        Get personalized news articles based on user preferences and behavior
        Query parameters:
        - limit: Number of results (default: 25)
        - offset: Offset for pagination
        """
        try:
            logger.info(f"Received request for personalized articles: {request.path} {request.GET}")
            
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
            
            # Generate cache key based on user and pagination
            cache_key = f"personalized_articles_{request.user.id}_{limit}_{offset}"
            cached_response = cache.get(cache_key)
            
            if cached_response:
                logger.info("Returning cached personalized articles")
                return Response(cached_response, content_type='application/json')
            
            # Get personalized articles
            articles, total = self.preference_service.get_personalized_articles(
                user=request.user,
                limit=limit,
                offset=offset
            )
            
            result = {
                'articles': articles,
                'pagination': {
                    'offset': offset,
                    'limit': limit,
                    'total': total
                }
            }
            
            # Cache the response for 5 minutes
            cache.set(cache_key, result, timeout=300)
            logger.info("Personalized articles cached successfully")
            
            return Response(result, content_type='application/json')
            
        except Exception as e:
            logger.error(f"Error getting personalized articles: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )

class UserInteractionView(APIView):
    """
    API endpoint for recording user interactions with articles
    """
    permission_classes = [IsAuthenticated]
    preference_service = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.preference_service is None:
            self.__class__.preference_service = UserPreferenceService()
    
    def post(self, request):
        """Record a user interaction with an article"""
        try:
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
                    {'error': f'interaction_type must be one of {valid_types}'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )
            
            # Record the interaction
            interaction_data = self.preference_service.record_user_interaction(
                user=request.user,
                article_id=article_id,
                interaction_type=interaction_type
            )
            
            # Clear personalized articles cache for this user
            cache_keys = cache.keys(f"personalized_articles_{request.user.id}_*")
            for key in cache_keys:
                cache.delete(key)
            
            return Response(interaction_data, content_type='application/json')
            
        except Exception as e:
            logger.error(f"Error recording user interaction: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
            )

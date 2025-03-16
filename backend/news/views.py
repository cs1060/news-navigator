from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import LimitOffsetPagination
from django.db import transaction
from django.shortcuts import get_object_or_404
import logging

from .models import Article, UserPreference, UserInteraction, BiasSource
from .serializers import (
    ArticleSerializer, UserPreferenceSerializer, 
    UserInteractionSerializer, BiasSourceSerializer
)
from .services import MediastackService, UserPreferenceService

logger = logging.getLogger(__name__)

class ArticlesView(APIView):
    """API view for fetching news articles"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Extract query parameters
        keywords = request.query_params.get('keywords', '')
        keywords = keywords.split(',') if keywords else None
        
        categories = request.query_params.get('categories', '')
        categories = categories.split(',') if categories else None
        
        countries = request.query_params.get('countries', '')
        countries = countries.split(',') if countries else None
        
        sources = request.query_params.get('sources', '')
        sources = sources.split(',') if sources else None
        
        # Get pagination parameters
        limit = int(request.query_params.get('limit', 25))
        offset = int(request.query_params.get('offset', 0))
        
        # Initialize service and fetch articles
        service = MediastackService()
        articles, total = service.fetch_articles(
            keywords=keywords,
            categories=categories,
            countries=countries,
            sources=sources,
            limit=limit,
            offset=offset
        )
        
        # Save articles to database for future reference
        saved_articles = []
        for article_data in articles:
            # Check if we need to add bias data
            source_name = article_data.get('source')
            
            # Try to find bias data for this source
            try:
                bias_source = BiasSource.objects.get(name=source_name)
                article_data['bias_score'] = bias_source.bias_score
                article_data['reliability_score'] = bias_source.reliability_score
            except BiasSource.DoesNotExist:
                # Use default or estimated values
                article_data['bias_score'] = article_data.get('bias_score', 0)
                article_data['reliability_score'] = article_data.get('reliability_score', 0.5)
            
            # Create or update article in database
            try:
                # Check if article already exists (by URL)
                article, created = Article.objects.update_or_create(
                    url=article_data.get('url'),
                    defaults={
                        'title': article_data.get('title', ''),
                        'description': article_data.get('description', ''),
                        'content': article_data.get('content', ''),
                        'image': article_data.get('image', ''),
                        'published_at': article_data.get('published_at'),
                        'source': article_data.get('source', ''),
                        'category': article_data.get('category', ''),
                        'country': article_data.get('country', ''),
                        'language': article_data.get('language', ''),
                        'bias_score': article_data.get('bias_score'),
                        'reliability_score': article_data.get('reliability_score')
                    }
                )
                saved_articles.append(article)
            except Exception as e:
                logger.error(f"Error saving article: {str(e)}")
        
        # Serialize the saved articles
        serializer = ArticleSerializer(saved_articles, many=True)
        
        return Response({
            'results': serializer.data,
            'count': total
        })

class UserPreferenceView(APIView):
    """API view for managing user preferences"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Initialize service
        service = UserPreferenceService()
        
        # Get user preference
        preference = service.get_user_preference(request.user)
        
        # Serialize and return
        serializer = UserPreferenceSerializer(preference)
        return Response(serializer.data)
    
    def put(self, request):
        # Initialize service
        service = UserPreferenceService()
        
        # Update user preference
        preference = service.update_user_preference(request.user, request.data)
        
        # Serialize and return
        serializer = UserPreferenceSerializer(preference)
        return Response(serializer.data)

class PersonalizedArticlesView(APIView):
    """API view for fetching personalized articles based on user preferences"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get pagination parameters
        limit = int(request.query_params.get('limit', 25))
        offset = int(request.query_params.get('offset', 0))
        
        # Initialize service
        service = UserPreferenceService()
        
        # Get personalized articles
        articles, total = service.get_personalized_articles(
            user=request.user,
            limit=limit,
            offset=offset
        )
        
        # Save articles to database for future reference
        saved_articles = []
        for article_data in articles:
            # Check if we need to add bias data
            source_name = article_data.get('source')
            
            # Try to find bias data for this source
            try:
                bias_source = BiasSource.objects.get(name=source_name)
                article_data['bias_score'] = bias_source.bias_score
                article_data['reliability_score'] = bias_source.reliability_score
            except BiasSource.DoesNotExist:
                # Use default or estimated values
                article_data['bias_score'] = article_data.get('bias_score', 0)
                article_data['reliability_score'] = article_data.get('reliability_score', 0.5)
            
            # Create or update article in database
            try:
                # Check if article already exists (by URL)
                article, created = Article.objects.update_or_create(
                    url=article_data.get('url'),
                    defaults={
                        'title': article_data.get('title', ''),
                        'description': article_data.get('description', ''),
                        'content': article_data.get('content', ''),
                        'image': article_data.get('image', ''),
                        'published_at': article_data.get('published_at'),
                        'source': article_data.get('source', ''),
                        'category': article_data.get('category', ''),
                        'country': article_data.get('country', ''),
                        'language': article_data.get('language', ''),
                        'bias_score': article_data.get('bias_score'),
                        'reliability_score': article_data.get('reliability_score')
                    }
                )
                saved_articles.append(article)
            except Exception as e:
                logger.error(f"Error saving article: {str(e)}")
        
        # Serialize the saved articles
        serializer = ArticleSerializer(saved_articles, many=True)
        
        return Response({
            'results': serializer.data,
            'count': total
        })

class UserInteractionView(APIView):
    """API view for recording user interactions with articles"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Validate request data
        serializer = UserInteractionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Initialize service
        service = UserPreferenceService()
        
        # Record interaction
        article_id = serializer.validated_data['article'].id
        interaction_type = serializer.validated_data['interaction_type']
        
        interaction = service.record_user_interaction(
            user=request.user,
            article_id=article_id,
            interaction_type=interaction_type
        )
        
        if not interaction:
            return Response(
                {"error": "Failed to record interaction"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return the created interaction
        result_serializer = UserInteractionSerializer(interaction)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

class BiasSourceView(APIView):
    """API view for retrieving bias information about news sources"""
    permission_classes = [AllowAny]
    
    def get(self, request, source_name=None):
        if source_name:
            # Get bias data for a specific source
            bias_source = get_object_or_404(BiasSource, name=source_name)
            serializer = BiasSourceSerializer(bias_source)
            return Response(serializer.data)
        else:
            # Get all bias sources
            bias_sources = BiasSource.objects.all()
            serializer = BiasSourceSerializer(bias_sources, many=True)
            return Response(serializer.data)

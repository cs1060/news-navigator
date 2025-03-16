from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .services import MediastackService
from .serializers import ArticleSerializer
from typing import Optional, List

# Create your views here.

class ArticlesView(APIView):
    mediastack_service = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
            # Extract query parameters
            keywords = request.query_params.get('keywords')
            categories = request.query_params.get('categories', '').split(',') if request.query_params.get('categories') else None
            countries = request.query_params.get('countries', '').split(',') if request.query_params.get('countries') else None
            
            try:
                limit = int(request.query_params.get('limit', 25))
                offset = int(request.query_params.get('offset', 0))
            except ValueError:
                return Response(
                    {'error': 'Invalid limit or offset parameter'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate cache key based on query parameters
            cache_key = f"articles_{keywords}_{categories}_{countries}_{limit}_{offset}"
            cached_response = cache.get(cache_key)

            if cached_response:
                return Response(cached_response)

            try:
                # Fetch articles from Mediastack
                response_data = self.mediastack_service.get_articles(
                    keywords=keywords,
                    categories=categories,
                    countries=countries,
                    limit=limit,
                    offset=offset
                )

                # Format articles
                articles = []
                for article_data in response_data.get('data', []):
                    formatted_article = self.mediastack_service.format_article_data(article_data)
                    serializer = ArticleSerializer(data=formatted_article)
                    if serializer.is_valid():
                        articles.append(serializer.data)

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

                return Response(result)

            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

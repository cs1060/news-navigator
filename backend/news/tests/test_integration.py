import pytest
from django.test import override_settings
from news.services import MediastackService
from news.views import ArticlesView
from rest_framework.test import APIClient
from rest_framework import status
import os

@pytest.mark.integration
class TestMediastackIntegration:
    def test_mediastack_api_call(self):
        """Test that we can successfully call the Mediastack API and get articles"""
        service = MediastackService()
        response = service.get_articles(limit=1)
        
        # Verify response structure
        assert isinstance(response, dict)
        assert 'data' in response
        assert 'pagination' in response
        
        # Verify we got at least one article
        articles = response['data']
        assert len(articles) > 0
        
        # Verify article structure
        article = articles[0]
        assert 'title' in article
        assert 'description' in article
        assert 'url' in article
        assert 'published_at' in article
        assert 'source' in article
        
    def test_api_endpoint_with_real_service(self):
        """Test the /articles endpoint with the real Mediastack service"""
        client = APIClient()
        response = client.get('/api/articles/', {
            'limit': '1'
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert 'articles' in response.data
        assert 'pagination' in response.data
        
        # Verify we got exactly one article as requested
        articles = response.data['articles']
        assert len(articles) == 1
        
        # Verify article structure matches our serializer
        article = articles[0]
        assert 'title' in article
        assert 'description' in article
        assert 'url' in article
        assert 'published_at' in article
        assert 'source' in article

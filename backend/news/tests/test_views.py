import pytest
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APIClient, APIRequestFactory
from rest_framework import status
from news.services import MediastackService
from news.views import ArticlesView

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def mock_article_data():
    return {
        'title': 'Test Article',
        'description': 'Test Description',
        'url': 'https://example.com/article',
        'image': 'https://example.com/image.jpg',
        'published_at': '2025-03-15T22:00:00+00:00',
        'source': 'Test Source',
        'category': 'technology'
    }

@pytest.fixture
def mock_api_response(mock_article_data):
    return {
        'data': [mock_article_data],
        'pagination': {
            'limit': 25,
            'offset': 0,
            'count': 1,
            'total': 100
        }
    }

@pytest.mark.django_db
class TestArticlesView:
    def test_articles_endpoint_exists(self, api_client):
        url = reverse('articles')
        response = api_client.get(url)
        assert response.status_code != status.HTTP_404_NOT_FOUND

    @patch('news.services.MediastackService')
    def test_get_articles_success(self, mock_service_class, api_client, mock_api_response):
        # Setup mock service
        mock_service = mock_service_class.return_value
        mock_service.get_articles.return_value = mock_api_response
        mock_service.format_article_data.return_value = mock_api_response['data'][0]
        
        # Test API call
        url = reverse('articles')
        response = api_client.get(url, {
            'keywords': 'test',
            'categories': 'technology',
            'countries': 'us',
            'limit': '25',
            'offset': '0'
        })

        # Verify response
        assert response.status_code == status.HTTP_200_OK
        assert 'articles' in response.data
        assert 'pagination' in response.data
        
        # Verify article data
        article = response.data['articles'][0]
        assert article['title'] == mock_api_response['data'][0]['title']
        assert article['url'] == mock_api_response['data'][0]['url']

        # Verify pagination
        pagination = response.data['pagination']
        assert pagination['limit'] == 25
        assert pagination['offset'] == 0
        assert pagination['total'] == 100

    @patch('news.services.MediastackService')
    def test_get_articles_invalid_params(self, mock_service_class, api_client):
        url = reverse('articles')
        response = api_client.get(url, {'limit': 'invalid'})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    @patch('news.services.MediastackService')
    def test_get_articles_service_error(self, mock_service_class, api_client):
        # Setup mock to raise exception
        mock_service = mock_service_class.return_value
        mock_service.get_articles.side_effect = Exception('API Error')
        
        url = reverse('articles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert 'error' in response.data

    @patch('news.services.MediastackService')
    def test_articles_cache(self, mock_service_class, api_client, mock_api_response):
        # Setup mock service
        mock_service = mock_service_class.return_value
        mock_service.get_articles.return_value = mock_api_response
        mock_service.format_article_data.return_value = mock_api_response['data'][0]
        
        # First request with cache disabled for testing
        url = reverse('articles')
        with patch('django.core.cache.cache.get', return_value=None):  # Force cache miss
            response1 = api_client.get(url)
            assert response1.status_code == status.HTTP_200_OK
            
            # Second request should hit the cache
            response2 = api_client.get(url)
            assert response2.status_code == status.HTTP_200_OK
            
            # Verify that the service was only called once
            assert mock_service.get_articles.call_count == 1

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
from django.conf import settings
from news.services import MediastackService

@pytest.fixture
def mediastack_service():
    return MediastackService()

@pytest.fixture
def mock_article_data():
    return {
        'title': 'Test Article',
        'description': 'Test Description',
        'url': 'https://example.com/article',
        'image': 'https://example.com/image.jpg',
        'published_at': '2025-03-15T22:00:00+00:00',
        'source': 'Test Source',
        'category': 'technology',
        'country': 'us',
        'bias_score': 0.0,
        'reliability_score': 0.8
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

class TestMediastackService:
    def test_init(self, mediastack_service):
        assert mediastack_service.api_key == settings.MEDIASTACK_API_KEY
        assert mediastack_service.base_url == settings.MEDIASTACK_BASE_URL

    @patch('news.services.requests.get')
    def test_get_articles_success(self, mock_get, mediastack_service, mock_api_response):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.json.return_value = mock_api_response
        mock_get.return_value = mock_response

        # Test with various parameters
        response = mediastack_service.get_articles(
            keywords='test',
            categories=['technology'],
            countries=['us'],
            limit=25,
            offset=0
        )

        # Verify the request
        mock_get.assert_called_once()
        call_args = mock_get.call_args[1]['params']
        assert call_args['access_key'] == settings.MEDIASTACK_API_KEY
        assert call_args['keywords'] == 'test'
        assert call_args['categories'] == 'technology'
        assert call_args['countries'] == 'us'
        assert call_args['limit'] == 25
        assert call_args['offset'] == 0

        # Verify response
        assert response == mock_api_response

    @patch('news.services.requests.get')
    def test_get_articles_error(self, mock_get, mediastack_service):
        # Setup mock error response
        mock_get.side_effect = Exception('API Error')

        # Test error handling
        with pytest.raises(Exception) as exc_info:
            mediastack_service.get_articles()
        
        assert str(exc_info.value) == 'Failed to fetch articles: API Error'

    def test_format_article_data(self, mediastack_service, mock_article_data):
        formatted = mediastack_service.format_article_data(mock_article_data)
        
        assert formatted['title'] == mock_article_data['title']
        assert formatted['description'] == mock_article_data['description']
        assert formatted['url'] == mock_article_data['url']
        assert formatted['image'] == mock_article_data['image']
        assert formatted['source'] == mock_article_data['source']
        assert formatted['category'] == mock_article_data['category']
        assert isinstance(formatted['published_at'], datetime)

    def test_format_article_data_missing_fields(self, mediastack_service):
        incomplete_data = {'title': 'Test', 'url': 'https://example.com'}
        formatted = mediastack_service.format_article_data(incomplete_data)
        
        assert formatted['title'] == 'Test'
        assert formatted['url'] == 'https://example.com'
        assert formatted['description'] is None
        assert formatted['image'] is None
        assert formatted['published_at'] is None
        assert formatted['source'] is None
        assert formatted['category'] is None

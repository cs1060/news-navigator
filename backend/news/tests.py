from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
import json
import pytest
from datetime import datetime, timedelta
from .models import Article, UserPreference, UserInteraction, BiasSource
from .services import MediastackService, UserPreferenceService

# Model Tests
class ArticleModelTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            title="Test Article",
            description="This is a test article",
            url="https://example.com/test",
            image="https://example.com/test.jpg",
            published_at=datetime.now(),
            source="Test Source",
            category="general",
            country="US",
            bias_score=0.0,
            reliability_score=0.8
        )
    
    def test_article_creation(self):
        self.assertEqual(self.article.title, "Test Article")
        self.assertEqual(self.article.source, "Test Source")
        self.assertEqual(self.article.category, "general")
        self.assertEqual(self.article.country, "US")
        self.assertEqual(self.article.bias_score, 0.0)
        self.assertEqual(self.article.reliability_score, 0.8)

class UserPreferenceModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.preference = UserPreference.objects.create(
            user=self.user,
            interests=["politics", "technology"],
            preferred_categories=["general", "business"],
            preferred_sources=["BBC", "Reuters"],
            excluded_sources=["Breitbart"],
            preferred_countries=["US", "GB"]
        )
    
    def test_preference_creation(self):
        self.assertEqual(self.preference.user, self.user)
        self.assertEqual(self.preference.interests, ["politics", "technology"])
        self.assertEqual(self.preference.preferred_categories, ["general", "business"])
        self.assertEqual(self.preference.preferred_sources, ["BBC", "Reuters"])
        self.assertEqual(self.preference.excluded_sources, ["Breitbart"])
        self.assertEqual(self.preference.preferred_countries, ["US", "GB"])

class UserInteractionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.article = Article.objects.create(
            title="Test Article",
            description="This is a test article",
            url="https://example.com/test",
            published_at=datetime.now(),
            source="Test Source"
        )
        self.interaction = UserInteraction.objects.create(
            user=self.user,
            article=self.article,
            interaction_type="like"
        )
    
    def test_interaction_creation(self):
        self.assertEqual(self.interaction.user, self.user)
        self.assertEqual(self.interaction.article, self.article)
        self.assertEqual(self.interaction.interaction_type, "like")

class BiasSourceModelTest(TestCase):
    def setUp(self):
        self.bias_source = BiasSource.objects.create(
            source_name="Test Source",
            bias_rating="center",
            reliability_score=0.8,
            description="A test news source"
        )
    
    def test_bias_source_creation(self):
        self.assertEqual(self.bias_source.source_name, "Test Source")
        self.assertEqual(self.bias_source.bias_rating, "center")
        self.assertEqual(self.bias_source.reliability_score, 0.8)
        self.assertEqual(self.bias_source.description, "A test news source")

# Service Tests
class MediastackServiceTest(TestCase):
    @patch('news.services.requests.get')
    def test_get_articles(self, mock_get):
        # Mock response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'data': [
                {
                    'title': 'Test Article',
                    'description': 'This is a test article',
                    'url': 'https://example.com/test',
                    'image': 'https://example.com/test.jpg',
                    'published_at': '2023-01-01T12:00:00Z',
                    'source': 'Test Source',
                    'category': 'general',
                    'country': 'us'
                }
            ],
            'pagination': {
                'limit': 25,
                'offset': 0,
                'count': 1,
                'total': 1
            }
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        # Test service
        service = MediastackService()
        result = service.get_articles(
            keywords="test",
            categories=["general"],
            countries=["us"],
            limit=25,
            offset=0
        )
        
        # Assertions
        self.assertEqual(len(result['data']), 1)
        self.assertEqual(result['data'][0]['title'], 'Test Article')
        self.assertEqual(result['data'][0]['source'], 'Test Source')
        
        # Verify API call parameters
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        self.assertIn('keywords=test', kwargs['params'].values())
        self.assertIn('categories=general', kwargs['params'].values())
        self.assertIn('countries=us', kwargs['params'].values())

class UserPreferenceServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.session_id = "test-session-id"
        self.article = Article.objects.create(
            title="Test Article",
            description="This is a test article",
            url="https://example.com/test",
            published_at=datetime.now(),
            source="Test Source",
            category="general"
        )
    
    def test_get_or_create_preference(self):
        service = UserPreferenceService()
        
        # Test with user
        preference = service.get_or_create_preference(user=self.user)
        self.assertEqual(preference.user, self.user)
        
        # Test with session_id
        preference = service.get_or_create_preference(session_id=self.session_id)
        self.assertEqual(preference.session_id, self.session_id)
    
    def test_update_preference(self):
        service = UserPreferenceService()
        preference = service.get_or_create_preference(user=self.user)
        
        # Update preference
        updated_preference = service.update_preference(
            preference.id,
            {
                'interests': ['politics', 'technology'],
                'preferred_categories': ['general', 'business']
            }
        )
        
        self.assertEqual(updated_preference.interests, ['politics', 'technology'])
        self.assertEqual(updated_preference.preferred_categories, ['general', 'business'])
    
    def test_record_interaction(self):
        service = UserPreferenceService()
        
        # Record interaction
        interaction = service.record_interaction(
            article_id=self.article.id,
            interaction_type="like",
            user=self.user
        )
        
        self.assertEqual(interaction.user, self.user)
        self.assertEqual(interaction.article, self.article)
        self.assertEqual(interaction.interaction_type, "like")

# API Tests
class ArticlesViewTest(TestCase):
    @patch('news.views.MediastackService')
    def test_get_articles(self, mock_service_class):
        # Mock service response
        mock_service = MagicMock()
        mock_service_class.return_value = mock_service
        mock_service.get_articles.return_value = {
            'data': [
                {
                    'title': 'Test Article',
                    'description': 'This is a test article',
                    'url': 'https://example.com/test',
                    'image': 'https://example.com/test.jpg',
                    'published_at': '2023-01-01T12:00:00Z',
                    'source': 'Test Source',
                    'category': 'general',
                    'country': 'us'
                }
            ],
            'pagination': {
                'limit': 25,
                'offset': 0,
                'count': 1,
                'total': 1
            }
        }
        mock_service.format_article_data.return_value = {
            'title': 'Test Article',
            'description': 'This is a test article',
            'url': 'https://example.com/test',
            'image': 'https://example.com/test.jpg',
            'published_at': datetime.now(),
            'source': 'Test Source',
            'category': 'general',
            'country': 'US'
        }
        
        # Test API endpoint
        client = APIClient()
        response = client.get(reverse('articles'), {'keywords': 'test', 'categories': 'general', 'countries': 'us'})
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['articles']), 1)
        self.assertEqual(response.data['articles'][0]['title'], 'Test Article')
        self.assertEqual(response.data['articles'][0]['source'], 'Test Source')

class UserPreferenceViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.preference = UserPreference.objects.create(
            user=self.user,
            interests=["politics", "technology"],
            preferred_categories=["general", "business"]
        )
    
    def test_get_preferences(self):
        # Set session cookie
        session = self.client.session
        session['session_id'] = 'test-session-id'
        session.save()
        
        response = self.client.get(reverse('preferences'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('interests', response.data)
        self.assertIn('preferred_categories', response.data)
    
    def test_update_preferences(self):
        # Set session cookie
        session = self.client.session
        session['session_id'] = 'test-session-id'
        session.save()
        
        data = {
            'interests': ['sports', 'entertainment'],
            'preferred_categories': ['sports', 'entertainment']
        }
        
        response = self.client.post(
            reverse('preferences'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['interests'], ['sports', 'entertainment'])
        self.assertEqual(response.data['preferred_categories'], ['sports', 'entertainment'])

class PersonalizedNewsViewTest(TestCase):
    @patch('news.views.UserPreferenceService')
    def test_get_personalized_news(self, mock_service_class):
        # Mock service response
        mock_service = MagicMock()
        mock_service_class.return_value = mock_service
        mock_service.get_or_create_preference.return_value = MagicMock()
        mock_service.get_personalized_articles.return_value = {
            'articles': [
                {
                    'title': 'Test Article',
                    'description': 'This is a test article',
                    'url': 'https://example.com/test',
                    'image': 'https://example.com/test.jpg',
                    'published_at': datetime.now(),
                    'source': 'Test Source',
                    'category': 'general',
                    'country': 'US'
                }
            ],
            'pagination': {
                'offset': 0,
                'limit': 25,
                'total': 1
            }
        }
        
        # Set up client
        client = APIClient()
        session = client.session
        session['session_id'] = 'test-session-id'
        session.save()
        
        # Test API endpoint
        response = client.get(reverse('personalized'))
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['articles']), 1)
        self.assertEqual(response.data['articles'][0]['title'], 'Test Article')
        self.assertEqual(response.data['articles'][0]['source'], 'Test Source')

class UserInteractionViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.article = Article.objects.create(
            title="Test Article",
            description="This is a test article",
            url="https://example.com/test",
            published_at=datetime.now(),
            source="Test Source",
            category="general"
        )
    
    def test_record_interaction(self):
        # Set session cookie
        session = self.client.session
        session['session_id'] = 'test-session-id'
        session.save()
        
        data = {
            'article_id': self.article.id,
            'interaction_type': 'like'
        }
        
        response = self.client.post(
            reverse('interaction'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['article'], self.article.id)
        self.assertEqual(response.data['interaction_type'], 'like')
        self.assertEqual(response.data['session_id'], 'test-session-id')

class BiasSourceViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.bias_source = BiasSource.objects.create(
            source_name="Test Source",
            bias_rating="center",
            reliability_score=0.8,
            description="A test news source"
        )
    
    def test_get_all_bias_sources(self):
        response = self.client.get(reverse('bias-sources'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['source_name'], 'Test Source')
        self.assertEqual(response.data[0]['bias_rating'], 'center')
    
    def test_get_specific_bias_source(self):
        response = self.client.get(reverse('bias-source-detail', kwargs={'source_name': 'Test Source'}))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['source_name'], 'Test Source')
        self.assertEqual(response.data['bias_rating'], 'center')
        self.assertEqual(response.data['reliability_score'], 0.8)

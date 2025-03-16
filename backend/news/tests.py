from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import json

from .models import Article, UserPreference, UserInteraction, BiasSource
from .services import MediastackService, UserPreferenceService

class MediastackServiceTests(TestCase):
    """Tests for the MediastackService"""
    
    def setUp(self):
        self.service = MediastackService()
    
    @patch('news.services.requests.get')
    def test_fetch_articles_success(self, mock_get):
        # Mock the API response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'data': [
                {
                    'title': 'Test Article',
                    'description': 'Test Description',
                    'url': 'https://example.com/test',
                    'published_at': '2023-01-01T12:00:00Z',
                    'source': 'Test Source',
                    'category': 'general'
                }
            ],
            'pagination': {
                'total': 1
            }
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        # Call the method
        articles, total = self.service.fetch_articles()
        
        # Assertions
        self.assertEqual(len(articles), 1)
        self.assertEqual(total, 1)
        self.assertEqual(articles[0]['title'], 'Test Article')
    
    def test_generate_fake_articles(self):
        # Test the fake article generation
        articles, total = self.service._generate_fake_articles(limit=10)
        
        # Assertions
        self.assertEqual(len(articles), 10)
        self.assertEqual(total, 100)  # Default total is 100
        
        # Test with keywords
        articles, total = self.service._generate_fake_articles(keywords=['technology'], limit=5)
        self.assertEqual(len(articles), 5)
        
        # Test with categories
        articles, total = self.service._generate_fake_articles(categories=['business'], limit=5)
        self.assertEqual(len(articles), 5)

class UserPreferenceServiceTests(TestCase):
    """Tests for the UserPreferenceService"""
    
    def setUp(self):
        self.service = UserPreferenceService()
        self.user = User.objects.create_user(username='testuser', password='password')
    
    def test_get_user_preference(self):
        # Test getting a user preference that doesn't exist yet
        preference = self.service.get_user_preference(self.user)
        
        # It should create a new one
        self.assertIsNotNone(preference)
        self.assertEqual(preference.user, self.user)
        
        # Test getting an existing preference
        preference2 = self.service.get_user_preference(self.user)
        self.assertEqual(preference.id, preference2.id)
    
    def test_update_user_preference(self):
        # Update user preference
        data = {
            'interests': ['technology', 'science'],
            'preferred_categories': ['technology', 'science'],
            'preferred_sources': ['BBC', 'Reuters'],
            'excluded_sources': ['Breitbart'],
            'preferred_countries': ['us', 'gb']
        }
        
        preference = self.service.update_user_preference(self.user, data)
        
        # Assertions
        self.assertEqual(preference.interests, ['technology', 'science'])
        self.assertEqual(preference.preferred_categories, ['technology', 'science'])
        self.assertEqual(preference.preferred_sources, ['BBC', 'Reuters'])
        self.assertEqual(preference.excluded_sources, ['Breitbart'])
        self.assertEqual(preference.preferred_countries, ['us', 'gb'])
    
    def test_record_user_interaction(self):
        # Create an article
        article = Article.objects.create(
            title='Test Article',
            url='https://example.com/test',
            published_at=datetime.now()
        )
        
        # Record an interaction
        interaction = self.service.record_user_interaction(
            user=self.user,
            article_id=article.id,
            interaction_type='view'
        )
        
        # Assertions
        self.assertIsNotNone(interaction)
        self.assertEqual(interaction.user, self.user)
        self.assertEqual(interaction.article, article)
        self.assertEqual(interaction.interaction_type, 'view')
        
        # Check if reading history was updated
        preference = self.service.get_user_preference(self.user)
        self.assertIn(article.id, preference.reading_history)

class ArticlesViewTests(APITestCase):
    """Tests for the ArticlesView API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news:articles')
        
        # Create some bias sources
        BiasSource.objects.create(
            name='Test Source',
            bias_score=0.1,
            reliability_score=0.8
        )
    
    @patch('news.services.MediastackService.fetch_articles')
    def test_get_articles(self, mock_fetch):
        # Mock the fetch_articles method
        mock_fetch.return_value = ([
            {
                'title': 'Test Article',
                'description': 'Test Description',
                'url': 'https://example.com/test',
                'published_at': '2023-01-01T12:00:00Z',
                'source': 'Test Source',
                'category': 'general'
            }
        ], 1)
        
        # Make the request
        response = self.client.get(self.url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Article')
        
        # Test with query parameters
        response = self.client.get(f'{self.url}?keywords=test&categories=general&limit=10&offset=0')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserPreferenceViewTests(APITestCase):
    """Tests for the UserPreferenceView API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news:user_preferences')
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
    
    def test_get_preference(self):
        # Make the request
        response = self.client.get(self.url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_update_preference(self):
        # Data to update
        data = {
            'interests': ['technology', 'science'],
            'preferred_categories': ['technology', 'science'],
            'preferred_sources': ['BBC', 'Reuters'],
            'excluded_sources': ['Breitbart'],
            'preferred_countries': ['us', 'gb']
        }
        
        # Make the request
        response = self.client.put(self.url, data, format='json')
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['interests'], ['technology', 'science'])
        self.assertEqual(response.data['preferred_categories'], ['technology', 'science'])
        self.assertEqual(response.data['preferred_sources'], ['BBC', 'Reuters'])
        self.assertEqual(response.data['excluded_sources'], ['Breitbart'])
        self.assertEqual(response.data['preferred_countries'], ['us', 'gb'])

class PersonalizedArticlesViewTests(APITestCase):
    """Tests for the PersonalizedArticlesView API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news:personalized_articles')
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        
        # Create user preference
        UserPreference.objects.create(user=self.user)
        
        # Create some bias sources
        BiasSource.objects.create(
            name='Test Source',
            bias_score=0.1,
            reliability_score=0.8
        )
    
    @patch('news.services.UserPreferenceService.get_personalized_articles')
    def test_get_personalized_articles(self, mock_get):
        # Mock the get_personalized_articles method
        mock_get.return_value = ([
            {
                'title': 'Test Personalized Article',
                'description': 'Test Description',
                'url': 'https://example.com/test',
                'published_at': '2023-01-01T12:00:00Z',
                'source': 'Test Source',
                'category': 'technology'
            }
        ], 1)
        
        # Make the request
        response = self.client.get(self.url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Personalized Article')

class UserInteractionViewTests(APITestCase):
    """Tests for the UserInteractionView API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news:user_interaction')
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        
        # Create an article
        self.article = Article.objects.create(
            title='Test Article',
            url='https://example.com/test',
            published_at=datetime.now()
        )
    
    def test_create_interaction(self):
        # Data to create
        data = {
            'article': self.article.id,
            'interaction_type': 'view'
        }
        
        # Make the request
        response = self.client.post(self.url, data, format='json')
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user'], self.user.id)
        self.assertEqual(response.data['article'], self.article.id)
        self.assertEqual(response.data['interaction_type'], 'view')
        
        # Check if the interaction was created in the database
        self.assertTrue(UserInteraction.objects.filter(
            user=self.user,
            article=self.article,
            interaction_type='view'
        ).exists())

class BiasSourceViewTests(APITestCase):
    """Tests for the BiasSourceView API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news:bias_sources')
        
        # Create some bias sources
        self.bias_source = BiasSource.objects.create(
            name='Test Source',
            bias_score=0.1,
            reliability_score=0.8,
            description='Test description'
        )
    
    def test_get_all_bias_sources(self):
        # Make the request
        response = self.client.get(self.url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Source')
        self.assertEqual(response.data[0]['bias_score'], 0.1)
        self.assertEqual(response.data[0]['reliability_score'], 0.8)
        self.assertEqual(response.data[0]['bias_label'], 'Center')
        self.assertEqual(response.data[0]['reliability_label'], 'High')
    
    def test_get_specific_bias_source(self):
        # Make the request
        url = reverse('news:bias_source_detail', args=['Test Source'])
        response = self.client.get(url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Source')
        self.assertEqual(response.data['bias_score'], 0.1)
        self.assertEqual(response.data['reliability_score'], 0.8)
        self.assertEqual(response.data['description'], 'Test description')

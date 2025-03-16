from django.test import TestCase
from django.contrib.auth.models import User
from datetime import datetime
from news.models import Article, UserPreference, UserInteraction, BiasSource

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

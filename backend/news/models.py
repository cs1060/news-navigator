from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Article(models.Model):
    """Model for storing news articles from Mediastack API"""
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    url = models.URLField()
    image = models.URLField(null=True, blank=True)
    published_at = models.DateTimeField()
    source = models.CharField(max_length=100)
    category = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=10, null=True, blank=True)
    language = models.CharField(max_length=10, null=True, blank=True)
    
    # Fields for bias and reliability indicators
    bias_score = models.FloatField(null=True, blank=True)  # Range from -1 (left) to 1 (right)
    reliability_score = models.FloatField(null=True, blank=True)  # Range from 0 (unreliable) to 1 (reliable)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['published_at']),
            models.Index(fields=['source']),
            models.Index(fields=['category']),
            models.Index(fields=['country']),
        ]
    
    def __str__(self):
        return self.title

class UserPreference(models.Model):
    """Model for storing user preferences for personalized news"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    interests = models.JSONField(default=list)  # List of keywords/topics of interest
    preferred_categories = models.JSONField(default=list)  # List of preferred categories
    preferred_sources = models.JSONField(default=list)  # List of preferred news sources
    excluded_sources = models.JSONField(default=list)  # List of sources to exclude
    preferred_countries = models.JSONField(default=list)  # List of preferred countries
    reading_history = models.JSONField(default=list)  # List of recently read article IDs
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s preferences"

class UserInteraction(models.Model):
    """Model for tracking user interactions with articles for behavior-based recommendations"""
    INTERACTION_TYPES = (
        ('view', 'Viewed'),
        ('click', 'Clicked'),
        ('save', 'Saved'),
        ('like', 'Liked'),
        ('dislike', 'Disliked'),
        ('share', 'Shared'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'interaction_type']),
            models.Index(fields=['article', 'interaction_type']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.username} {self.interaction_type} {self.article.title[:30]}"

class BiasSource(models.Model):
    """Model for storing bias information about news sources"""
    name = models.CharField(max_length=100, unique=True)
    bias_score = models.FloatField()  # Range from -1 (left) to 1 (right)
    reliability_score = models.FloatField()  # Range from 0 (unreliable) to 1 (reliable)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name

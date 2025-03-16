from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)
    url = models.URLField()
    image = models.URLField(null=True, blank=True)
    published_at = models.DateTimeField()
    source = models.CharField(max_length=200)
    category = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        ordering = ['-published_at']
    
    def __str__(self):
        return self.title

class UserPreference(models.Model):
    """Model to store user preferences for personalized news recommendations"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    interests = models.JSONField(default=list, help_text='List of user interests/topics')
    preferred_categories = models.JSONField(default=list, help_text='List of preferred news categories')
    preferred_sources = models.JSONField(default=list, help_text='List of preferred news sources')
    excluded_sources = models.JSONField(default=list, help_text='List of news sources to exclude')
    preferred_countries = models.JSONField(default=list, help_text='List of preferred countries for news')
    reading_history = models.JSONField(default=list, help_text='List of article IDs the user has read')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s preferences"

class UserInteraction(models.Model):
    """Model to track user interactions with articles for behavior-based recommendations"""
    INTERACTION_TYPES = (
        ('view', 'Viewed Article'),
        ('click', 'Clicked Article'),
        ('save', 'Saved Article'),
        ('share', 'Shared Article'),
        ('like', 'Liked Article'),
        ('dislike', 'Disliked Article'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='user_interactions')
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'interaction_type']),
            models.Index(fields=['article', 'interaction_type']),
        ]
    
    def __str__(self):
        return f"{self.user.username} {self.interaction_type} {self.article.title[:30]}"

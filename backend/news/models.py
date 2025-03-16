from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):
    title = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)
    url = models.URLField()
    image = models.URLField(null=True, blank=True)
    published_at = models.DateTimeField()
    source = models.CharField(max_length=200, db_index=True)
    category = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    country = models.CharField(max_length=2, null=True, blank=True, db_index=True)
    bias_score = models.FloatField(null=True, blank=True)
    reliability_score = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['published_at']),
        ]
    
    def __str__(self):
        return self.title

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    interests = models.JSONField(default=list)
    preferred_categories = models.JSONField(default=list)
    preferred_sources = models.JSONField(default=list)
    excluded_sources = models.JSONField(default=list)
    preferred_countries = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(user__isnull=False) | models.Q(session_id__isnull=False),
                name="user_or_session_required"
            )
        ]
    
    def __str__(self):
        return f"Preferences for {self.user.username if self.user else self.session_id}"

class UserInteraction(models.Model):
    INTERACTION_TYPES = (
        ('view', 'View'),
        ('click', 'Click'),
        ('save', 'Save'),
        ('like', 'Like'),
        ('dislike', 'Dislike'),
        ('share', 'Share'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(user__isnull=False) | models.Q(session_id__isnull=False),
                name="user_interaction_user_or_session_required"
            )
        ]
        indexes = [
            models.Index(fields=['user', 'interaction_type']),
            models.Index(fields=['article', 'interaction_type']),
        ]
    
    def __str__(self):
        return f"{self.get_interaction_type_display()} by {self.user.username if self.user else self.session_id}"

class BiasSource(models.Model):
    BIAS_CHOICES = (
        ('far_left', 'Far Left'),
        ('left', 'Left'),
        ('center_left', 'Center Left'),
        ('center', 'Center'),
        ('center_right', 'Center Right'),
        ('right', 'Right'),
        ('far_right', 'Far Right'),
    )
    
    source_name = models.CharField(max_length=200, unique=True)
    bias_rating = models.CharField(max_length=20, choices=BIAS_CHOICES, null=True, blank=True)
    reliability_score = models.FloatField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.source_name} ({self.get_bias_rating_display() if self.bias_rating else 'Unknown'})"

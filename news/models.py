from django.db import models
from django.contrib.auth.models import User

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests')
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'category']

class NewsArticle(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    summary = models.TextField()
    source = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    bias_rating = models.FloatField(default=0.0)  # -1 to 1 scale
    published_date = models.DateTimeField()
    url = models.URLField(max_length=500)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return self.title

class SavedArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_articles')
    article = models.ForeignKey(NewsArticle, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'article']

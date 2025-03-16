from django.db import models

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

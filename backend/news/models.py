from django.db import models

class Interest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    interests = models.ManyToManyField(Interest, related_name='articles')
    source = models.CharField(max_length=100)
    bias_rating = models.FloatField(default=0.0)  # -1 to 1 scale
    published_date = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.title

from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    description = serializers.CharField(max_length=2000, allow_null=True, allow_blank=True)
    url = serializers.URLField(max_length=2000)  # Increased max_length for URLs
    image = serializers.URLField(max_length=2000, allow_null=True, allow_blank=True)
    published_at = serializers.DateTimeField(allow_null=True)
    source = serializers.CharField(max_length=200, allow_null=True, allow_blank=True)
    category = serializers.CharField(max_length=100, allow_null=True, allow_blank=True)
    country = serializers.CharField(max_length=2, allow_null=True, allow_blank=True)  # Add country field

from rest_framework import serializers
from .models import Interest, Article

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name', 'description']

class ArticleSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True, read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'interests', 'source', 
                 'bias_rating', 'published_date', 'location', 
                 'latitude', 'longitude']

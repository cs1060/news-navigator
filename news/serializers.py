from rest_framework import serializers
from .models import UserInterest, NewsArticle, SavedArticle
from django.contrib.auth.models import User

class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = ['id', 'category', 'created_at']

class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'

class SavedArticleSerializer(serializers.ModelSerializer):
    article = NewsArticleSerializer()
    
    class Meta:
        model = SavedArticle
        fields = ['id', 'article', 'saved_at']

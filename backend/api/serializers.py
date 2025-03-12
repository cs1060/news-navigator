from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Article, SavedArticle

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'interests', 'created_at', 'updated_at')

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class SavedArticleSerializer(serializers.ModelSerializer):
    article = ArticleSerializer(read_only=True)
    
    class Meta:
        model = SavedArticle
        fields = ('id', 'user', 'article', 'saved_at')

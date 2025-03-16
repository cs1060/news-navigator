from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Article, UserPreference, UserInteraction

class ArticleSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    description = serializers.CharField(max_length=2000, allow_null=True, allow_blank=True)
    url = serializers.URLField(max_length=2000)  # Increased max_length for URLs
    image = serializers.URLField(max_length=2000, allow_null=True, allow_blank=True)
    published_at = serializers.DateTimeField(allow_null=True)
    source = serializers.CharField(max_length=200, allow_null=True, allow_blank=True)
    category = serializers.CharField(max_length=100, allow_null=True, allow_blank=True)
    country = serializers.CharField(max_length=2, allow_null=True, allow_blank=True)  # Add country field

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserPreferenceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserPreference
        fields = ['id', 'user', 'interests', 'preferred_categories', 'preferred_sources', 
                  'excluded_sources', 'preferred_countries', 'reading_history', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_interests(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Interests must be a list")
        return value
    
    def validate_preferred_categories(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Preferred categories must be a list")
        return value

class UserInteractionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserInteraction
        fields = ['id', 'user', 'article', 'interaction_type', 'timestamp']
        read_only_fields = ['id', 'timestamp']
        
    def validate_interaction_type(self, value):
        valid_types = [choice[0] for choice in UserInteraction.INTERACTION_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Interaction type must be one of {valid_types}")
        return value

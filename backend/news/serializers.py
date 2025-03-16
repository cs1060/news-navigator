from rest_framework import serializers
from .models import Article, UserPreference, UserInteraction, BiasSource
from django.contrib.auth.models import User

class ArticleSerializer(serializers.ModelSerializer):
    """Serializer for the Article model"""
    bias_label = serializers.SerializerMethodField()
    reliability_label = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'content', 'url', 'image', 
            'published_at', 'source', 'category', 'country', 'language',
            'bias_score', 'reliability_score', 'bias_label', 'reliability_label'
        ]
    
    def get_bias_label(self, obj):
        """Convert numerical bias score to a human-readable label"""
        if obj.bias_score is None:
            return "Unknown"
        
        if obj.bias_score < -0.66:
            return "Left"
        elif obj.bias_score < -0.33:
            return "Lean Left"
        elif obj.bias_score < 0.33:
            return "Center"
        elif obj.bias_score < 0.66:
            return "Lean Right"
        else:
            return "Right"
    
    def get_reliability_label(self, obj):
        """Convert numerical reliability score to a human-readable label"""
        if obj.reliability_score is None:
            return "Unknown"
        
        if obj.reliability_score < 0.3:
            return "Low"
        elif obj.reliability_score < 0.7:
            return "Medium"
        else:
            return "High"

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for the UserPreference model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'interests', 'preferred_categories', 
            'preferred_sources', 'excluded_sources', 'preferred_countries',
            'reading_history', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate_interests(self, value):
        """Validate that interests are provided as a list of strings"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Interests must be a list")
        return value
    
    def validate_preferred_categories(self, value):
        """Validate that categories are from a predefined set"""
        valid_categories = [
            'general', 'business', 'entertainment', 'health', 
            'science', 'sports', 'technology'
        ]
        
        if not isinstance(value, list):
            raise serializers.ValidationError("Preferred categories must be a list")
        
        for category in value:
            if category not in valid_categories:
                raise serializers.ValidationError(f"Invalid category: {category}")
        
        return value

class UserInteractionSerializer(serializers.ModelSerializer):
    """Serializer for the UserInteraction model"""
    class Meta:
        model = UserInteraction
        fields = ['id', 'user', 'article', 'interaction_type', 'timestamp']
        read_only_fields = ['id', 'timestamp']
    
    def validate_interaction_type(self, value):
        """Validate that interaction type is from the predefined choices"""
        valid_types = [choice[0] for choice in UserInteraction.INTERACTION_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid interaction type: {value}")
        return value

class BiasSourceSerializer(serializers.ModelSerializer):
    """Serializer for the BiasSource model"""
    bias_label = serializers.SerializerMethodField()
    reliability_label = serializers.SerializerMethodField()
    
    class Meta:
        model = BiasSource
        fields = [
            'id', 'name', 'bias_score', 'reliability_score', 
            'description', 'bias_label', 'reliability_label'
        ]
    
    def get_bias_label(self, obj):
        """Convert numerical bias score to a human-readable label"""
        if obj.bias_score < -0.66:
            return "Left"
        elif obj.bias_score < -0.33:
            return "Lean Left"
        elif obj.bias_score < 0.33:
            return "Center"
        elif obj.bias_score < 0.66:
            return "Lean Right"
        else:
            return "Right"
    
    def get_reliability_label(self, obj):
        """Convert numerical reliability score to a human-readable label"""
        if obj.reliability_score < 0.3:
            return "Low"
        elif obj.reliability_score < 0.7:
            return "Medium"
        else:
            return "High"

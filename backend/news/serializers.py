from rest_framework import serializers
from .models import Article, UserPreference, UserInteraction, BiasSource

class ArticleSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    description = serializers.CharField(max_length=2000, allow_null=True, allow_blank=True)
    url = serializers.URLField(max_length=2000)  # Increased max_length for URLs
    image = serializers.URLField(max_length=2000, allow_null=True, allow_blank=True)
    published_at = serializers.DateTimeField(allow_null=True)
    source = serializers.CharField(max_length=200, allow_null=True, allow_blank=True)
    category = serializers.CharField(max_length=100, allow_null=True, allow_blank=True)
    country = serializers.CharField(max_length=2, allow_null=True, allow_blank=True)
    bias_score = serializers.FloatField(allow_null=True)
    reliability_score = serializers.FloatField(allow_null=True)
    
    class Meta:
        model = Article
        fields = '__all__'

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'session_id', 'interests', 'preferred_categories',
            'preferred_sources', 'excluded_sources', 'preferred_countries',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'session_id', 'created_at', 'updated_at']

class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = ['id', 'user', 'session_id', 'article', 'interaction_type', 'timestamp']
        read_only_fields = ['id', 'user', 'session_id', 'timestamp']

class BiasSourceSerializer(serializers.ModelSerializer):
    bias_rating_display = serializers.CharField(source='get_bias_rating_display', read_only=True)
    
    class Meta:
        model = BiasSource
        fields = ['id', 'source_name', 'bias_rating', 'bias_rating_display', 'reliability_score', 'description']
        read_only_fields = ['id']

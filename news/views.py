from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Interest, Article
from .serializers import InterestSerializer, ArticleSerializer
from django.utils import timezone

class InterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all()
        interests = self.request.query_params.getlist('interests')
        if interests:
            queryset = queryset.filter(interests__id__in=interests).distinct()
        return queryset

@api_view(['GET'])
def initialize_demo_data(request):
    # Create sample interests
    interests = [
        {"name": "Technology", "description": "Tech news and innovations"},
        {"name": "Politics", "description": "Political news and updates"},
        {"name": "Science", "description": "Scientific discoveries and research"},
        {"name": "Business", "description": "Business and economic news"},
        {"name": "Health", "description": "Health and medical news"},
    ]
    
    created_interests = []
    for interest_data in interests:
        interest, _ = Interest.objects.get_or_create(**interest_data)
        created_interests.append(interest)

    # Create sample articles
    articles = [
        {
            "title": "AI Breakthrough in Medical Research",
            "content": "Scientists have developed a new AI system that can predict disease progression with 95% accuracy.",
            "source": "Tech Daily",
            "bias_rating": 0.1,
            "location": "San Francisco, USA",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "interests": ["Technology", "Health"]
        },
        {
            "title": "Global Climate Agreement Reached",
            "content": "World leaders have agreed on ambitious new climate targets at the latest summit.",
            "source": "World News",
            "bias_rating": -0.2,
            "location": "Paris, France",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "interests": ["Politics", "Science"]
        },
        {
            "title": "Stock Markets Hit Record High",
            "content": "Global markets surge as tech sector shows strong growth in Q1 2024.",
            "source": "Financial Times",
            "bias_rating": 0.3,
            "location": "New York, USA",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "interests": ["Business", "Technology"]
        }
    ]

    for article_data in articles:
        interest_names = article_data.pop("interests")
        article = Article.objects.create(**article_data)
        for interest_name in interest_names:
            interest = Interest.objects.get(name=interest_name)
            article.interests.add(interest)

    return Response({"message": "Demo data initialized successfully"})

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import UserInterest, NewsArticle, SavedArticle
from .serializers import UserInterestSerializer, NewsArticleSerializer, SavedArticleSerializer
from django.utils import timezone

# Sample news data for prototype
SAMPLE_ARTICLES = [
    {
        "title": "Global Climate Summit Reaches Historic Agreement",
        "content": "World leaders have reached a landmark agreement on climate change...",
        "summary": "195 countries agree to reduce emissions by 50% by 2030.",
        "source": "Global News Network",
        "category": "Environment",
        "bias_rating": 0.1,
        "url": "https://example.com/climate-summit",
        "image_url": "https://example.com/climate-image.jpg"
    },
    {
        "title": "Tech Innovation Revolutionizes Healthcare",
        "content": "A breakthrough in AI-powered diagnostics promises to transform...",
        "summary": "New AI system achieves 95% accuracy in early disease detection.",
        "source": "Tech Daily",
        "category": "Technology",
        "bias_rating": -0.2,
        "url": "https://example.com/tech-health",
        "image_url": "https://example.com/tech-image.jpg"
    },
    # Add more sample articles as needed
]

class UserInterestViewSet(viewsets.ModelViewSet):
    serializer_class = UserInterestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserInterest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NewsArticleViewSet(viewsets.ModelViewSet):
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # In a real application, this would filter based on user interests
        # For prototype, return sample articles
        user_interests = UserInterest.objects.filter(user=self.request.user).values_list('category', flat=True)
        
        # Create sample articles if they don't exist
        if not NewsArticle.objects.exists():
            for article in SAMPLE_ARTICLES:
                NewsArticle.objects.create(
                    **article,
                    published_date=timezone.now()
                )
        
        return NewsArticle.objects.all()

class SavedArticleViewSet(viewsets.ModelViewSet):
    serializer_class = SavedArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedArticle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

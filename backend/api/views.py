from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile, Article, SavedArticle
from .serializers import (
    UserSerializer, UserProfileSerializer,
    ArticleSerializer, SavedArticleSerializer
)

# Create your views here.

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-published_date')
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save_article(self, request, pk=None):
        article = self.get_object()
        user = request.user
        
        if SavedArticle.objects.filter(user=user, article=article).exists():
            return Response(
                {'message': 'Article already saved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        SavedArticle.objects.create(user=user, article=article)
        return Response(
            {'message': 'Article saved successfully'},
            status=status.HTTP_201_CREATED
        )

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['put'])
    def update_interests(self, request):
        profile = self.get_queryset().first()
        if not profile:
            return Response(
                {'message': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        interests = request.data.get('interests', [])
        profile.interests = interests
        profile.save()
        
        return Response(
            UserProfileSerializer(profile).data,
            status=status.HTTP_200_OK
        )

class SavedArticleViewSet(viewsets.ModelViewSet):
    serializer_class = SavedArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedArticle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

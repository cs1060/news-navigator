from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, UserProfileViewSet, SavedArticleViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'saved-articles', SavedArticleViewSet, basename='saved-articles')

urlpatterns = [
    path('', include(router.urls)),
]

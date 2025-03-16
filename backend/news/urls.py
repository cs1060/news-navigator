from django.urls import path
from .views import ArticlesView
from .views_preferences import UserPreferenceView, PersonalizedArticlesView, UserInteractionView

urlpatterns = [
    path('articles/', ArticlesView.as_view(), name='articles'),
    path('preferences/', UserPreferenceView.as_view(), name='user_preferences'),
    path('personalized-articles/', PersonalizedArticlesView.as_view(), name='personalized_articles'),
    path('interactions/', UserInteractionView.as_view(), name='user_interactions'),
]

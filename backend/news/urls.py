from django.urls import path
from .views import (
    ArticlesView, 
    UserPreferenceView, 
    PersonalizedArticlesView, 
    UserInteractionView,
    BiasSourceView
)

app_name = 'news'

urlpatterns = [
    # General articles endpoint
    path('articles/', ArticlesView.as_view(), name='articles'),
    
    # User preferences endpoints
    path('preferences/', UserPreferenceView.as_view(), name='user_preferences'),
    
    # Personalized articles endpoint
    path('personalized/', PersonalizedArticlesView.as_view(), name='personalized_articles'),
    
    # User interaction endpoint
    path('interaction/', UserInteractionView.as_view(), name='user_interaction'),
    
    # Bias source endpoints
    path('bias-sources/', BiasSourceView.as_view(), name='bias_sources'),
    path('bias-sources/<str:source_name>/', BiasSourceView.as_view(), name='bias_source_detail'),
]

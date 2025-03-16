from django.urls import path
from .views import (
    ArticlesView, UserPreferenceView, PersonalizedNewsView, 
    UserInteractionView, BiasSourceView
)

urlpatterns = [
    path('articles/', ArticlesView.as_view(), name='articles'),
    path('preferences/', UserPreferenceView.as_view(), name='preferences'),
    path('personalized/', PersonalizedNewsView.as_view(), name='personalized'),
    path('interaction/', UserInteractionView.as_view(), name='interaction'),
    path('bias-sources/', BiasSourceView.as_view(), name='bias-sources'),
    path('bias-sources/<str:source_name>/', BiasSourceView.as_view(), name='bias-source-detail'),
]

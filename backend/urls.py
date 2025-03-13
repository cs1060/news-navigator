from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from news.views import InterestViewSet, ArticleViewSet, initialize_demo_data

router = DefaultRouter()
router.register(r'interests', InterestViewSet)
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/init-demo/', initialize_demo_data, name='init-demo'),
]

# News Navigator Backend

Django REST Framework backend for the News Navigator application, providing robust API endpoints for news article management, geospatial queries, and user interactions.

## Technology Stack

- **Django**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database (configurable)
- **PostGIS**: Geospatial capabilities
- **JWT**: Authentication
- **Swagger**: API documentation

## Features

- **RESTful API**
  - Article management
  - User authentication
  - Profile customization
  - Saved articles
  - Advanced geographic queries

- **Geospatial Features**
  - Location-based article filtering
  - Geographic coordinate handling
  - Distance-based queries
  - Region-based content
  - Map integration support

- **Data Models**
  - Articles with bias scoring and location
  - User profiles with preferences
  - Saved article management
  - Geographic data types
  - Spatial indexing

- **Security**
  - JWT authentication
  - Permission-based access
  - CORS configuration
  - Input validation
  - Rate limiting

## Project Structure

```
backend/
├── api/                    # Main API application
│   ├── management/         # Django management commands
│   │   └── commands/
│   │       └── generate_sample_data.py
│   ├── models/            # Database models
│   │   ├── article.py     # Article with geo coordinates
│   │   ├── user_profile.py
│   │   └── saved_article.py
│   ├── views/             # API views
│   │   ├── article_views.py
│   │   └── user_views.py
│   ├── serializers.py     # Data serializers
│   └── urls.py            # API routing
├── news_navigator/        # Project settings
│   ├── settings.py
│   └── urls.py
└── manage.py
```

## Getting Started

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   python manage.py migrate
   ```

4. **Generate Sample Data**
   ```bash
   python manage.py generate_sample_data
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver 5001
   ```
   Access API at http://localhost:5001/api/
   Access documentation at http://localhost:5001/swagger/

## API Endpoints

### Articles
- `GET /api/articles/`: List all articles
- `GET /api/articles/{id}/`: Retrieve article
- `POST /api/articles/{id}/save/`: Save article
- `GET /api/articles/by-location/`: Geographic search
- `GET /api/articles/nearby/`: Articles near coordinates
- `GET /api/articles/in-region/`: Articles in region

### Authentication
- `POST /api/auth/login/`: User login
- `POST /api/auth/register/`: User registration
- `POST /api/auth/refresh/`: Refresh JWT token

### User Profiles
- `GET /api/profiles/`: Get user profile
- `PUT /api/profiles/`: Update preferences
- `GET /api/profiles/saved-articles/`: List saved articles

## Development Guidelines

- Use Django REST Framework viewsets for consistent API design
- Implement proper serialization for all models
- Add docstrings and comments for complex logic
- Follow Django's security best practices
- Write tests for new features
- Use Django's ORM effectively
- Optimize geospatial queries

## Database Models

### Article
```python
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    source = models.CharField(max_length=100)
    url = models.URLField()
    published_date = models.DateTimeField()
    category = models.CharField(max_length=50)
    bias_score = models.FloatField()
    # Geospatial fields
    latitude = models.FloatField()
    longitude = models.FloatField()
    location = models.PointField(srid=4326, null=True)  # For PostGIS
    region = models.CharField(max_length=100, null=True)
```

### UserProfile
```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    interests = models.JSONField(default=list)
    preferred_sources = models.JSONField(default=list)
    # Location preferences
    preferred_regions = models.JSONField(default=list)
    location = models.PointField(srid=4326, null=True)
```

### SavedArticle
```python
class SavedArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    saved_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
```

## Geospatial Features

### Location-Based Queries
```python
# Example view for nearby articles
class NearbyArticlesView(APIView):
    def get(self, request):
        lat = float(request.query_params.get('lat'))
        lon = float(request.query_params.get('lon'))
        radius = float(request.query_params.get('radius', 50))  # km
        
        point = Point(lon, lat, srid=4326)
        articles = Article.objects.filter(
            location__distance_lte=(point, D(km=radius))
        ).distance(point).order_by('distance')
        
        return Response(ArticleSerializer(articles, many=True).data)
```

### Region-Based Filtering
```python
# Example view for articles in a region
class RegionArticlesView(APIView):
    def get(self, request):
        region = request.query_params.get('region')
        articles = Article.objects.filter(region=region)
        return Response(ArticleSerializer(articles, many=True).data)
```

## Performance Optimizations

- Spatial indexing for geographic queries
- Database indexing on frequently queried fields
- Efficient serialization with select_related/prefetch_related
- Caching for frequently accessed data
- Pagination for large datasets
- Query optimization
- Geospatial query optimization

## Security Considerations

- JWT token-based authentication
- CORS configuration for frontend access
- Permission-based access control
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure password handling
- Coordinate validation

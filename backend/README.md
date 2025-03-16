# News Navigator Backend

This is the backend API for the News Navigator application, which curates news from multiple sources and displays them in one interface.

## Features

- Fetch news articles from the Mediastack API
- Personalized news feed based on user interests and behavior
- Bias indicators for news sources
- User preference management
- User interaction tracking

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Copy `news/env.example` to `.env`
   - Add your Mediastack API key to the `.env` file

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Initialize bias data for news sources:
   ```
   python manage.py initialize_bias_data
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### News Articles

- `GET /api/articles/` - Get news articles from Mediastack API
  - Query parameters:
    - `keywords`: Search query string
    - `categories`: Comma-separated list of categories (general, business, entertainment, health, science, sports, technology)
    - `countries`: Comma-separated list of country codes (us, gb, de, etc.)
    - `limit`: Number of results (default: 25)
    - `offset`: Offset for pagination

### User Preferences

- `GET /api/preferences/` - Get user preferences
- `POST /api/preferences/` - Update user preferences
  - Request body:
    ```json
    {
      "interests": ["politics", "technology"],
      "preferred_categories": ["general", "business"],
      "preferred_sources": ["BBC", "Reuters"],
      "excluded_sources": ["Breitbart"],
      "preferred_countries": ["US", "GB"]
    }
    ```

### Personalized News Feed

- `GET /api/personalized/` - Get personalized news feed based on user preferences
  - Query parameters:
    - `limit`: Number of results (default: 25)
    - `offset`: Offset for pagination

### User Interactions

- `POST /api/interaction/` - Record user interaction with an article
  - Request body:
    ```json
    {
      "article_id": 1,
      "interaction_type": "like"
    }
    ```
  - Valid interaction types: "view", "click", "save", "like", "dislike", "share"

### Bias Sources

- `GET /api/bias-sources/` - Get bias information for all news sources
- `GET /api/bias-sources/{source_name}/` - Get bias information for a specific news source

## Testing

Run the test suite:
```
python manage.py test
```

## Dependencies

- Django and Django REST Framework for backend development
- Mediastack API for fetching news articles
- Requests library for handling HTTP requests
- pytest and pytest-django for testing

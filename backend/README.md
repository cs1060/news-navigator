# News Navigator Backend

This is the backend API for the News Navigator application, which provides personalized news feeds based on user preferences and interests.

## Features

- Fetch news articles from Mediastack API
- Personalized news recommendations based on user preferences
- User interaction tracking for behavior-based recommendations
- Bias and reliability indicators for news sources

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MEDIASTACK_API_KEY=your_mediastack_api_key
   ```
4. Run migrations:
   ```
   python manage.py migrate
   ```
5. Initialize bias source data:
   ```
   python manage.py initialize_bias_data
   ```
6. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### News Articles

- `GET /api/articles/`: Get news articles
  - Query parameters:
    - `keywords`: Comma-separated list of keywords
    - `categories`: Comma-separated list of categories
    - `countries`: Comma-separated list of country codes
    - `sources`: Comma-separated list of news sources
    - `limit`: Number of results to return (default: 25)
    - `offset`: Offset for pagination (default: 0)

### User Preferences

- `GET /api/preferences/`: Get user preferences
- `PUT /api/preferences/`: Update user preferences
  - Request body:
    ```json
    {
      "interests": ["technology", "science"],
      "preferred_categories": ["technology", "science"],
      "preferred_sources": ["BBC", "Reuters"],
      "excluded_sources": ["Breitbart"],
      "preferred_countries": ["us", "gb"]
    }
    ```

### Personalized Articles

- `GET /api/personalized/`: Get personalized articles based on user preferences
  - Query parameters:
    - `limit`: Number of results to return (default: 25)
    - `offset`: Offset for pagination (default: 0)

### User Interactions

- `POST /api/interaction/`: Record user interaction with an article
  - Request body:
    ```json
    {
      "article": 1,
      "interaction_type": "view"
    }
    ```
  - Interaction types: `view`, `click`, `save`, `like`, `dislike`, `share`

### Bias Sources

- `GET /api/bias-sources/`: Get all bias sources
- `GET /api/bias-sources/{source_name}/`: Get bias information for a specific news source

## Development

### Testing

Run the tests with:
```
python manage.py test
```

### Using Fake Data

For development without a Mediastack API key, set `USE_FAKE_NEWS_DATA = True` in `settings.py` (already set by default).

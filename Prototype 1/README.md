# News Navigator

## Description
News Navigator is a news recommendation platform designed to provide users with news articles from multiple sources while highlighting potential biases. It ensures transparency in news consumption by curating articles based on user interests and offering unbiased summaries of key global events. An interactive world map highlights news hotspots, allowing users to explore stories geographically.

## Implementation Details
This prototype implements a Flask-based API that uses AI to generate summaries of news articles. It demonstrates how AI can be integrated into a backend service for text summarization.

## Features

- RESTful API built with Flask
- AI-powered text summarization using OpenAI's GPT models
- Mock news article dataset for testing
- PostgreSQL database support for storing articles and summaries
- Environment variable configuration

## Project Structure

```
.
├── app.py              # Main Flask application
├── mock_articles.json  # Mock dataset of news articles
├── requirements.txt    # Python dependencies
├── test_api.py         # Script to test the API endpoints
├── static/             # Static assets (JS, CSS)
├── templates/          # HTML templates
└── .env                # Environment variables (not tracked in git)
```

## Setup Instructions

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Configure environment variables:
   - Copy the `.env` file and update with your own values
   - Set `OPENAI_API_KEY` to your OpenAI API key
   - Set `USE_DB=true` if you want to use PostgreSQL (requires database setup)

3. Run the application:
   ```
   python app.py
   ```

4. Test the API:
   ```
   python test_api.py
   ```

## API Endpoints

- `GET /api/status` - Check API status
- `GET /api/articles` - Get all articles
- `GET /api/articles?id=<id>` - Get article by ID
- `GET /api/summaries` - Get all summaries
- `GET /api/summaries?article_id=<id>` - Get summaries for a specific article
- `POST /api/summarize` - Generate a summary for an article

## Database Setup (Optional)

If you want to use a PostgreSQL database instead of the mock data:

1. Create a PostgreSQL database named `news_summaries`
2. Set `USE_DB=true` in your `.env` file
3. Update the database connection parameters in `.env`
4. The application will automatically create the necessary tables on startup

## Notes

- This is a prototype implementation and not intended for production use
- The mock data mode doesn't require a database connection
- When using the mock data mode, summaries are generated but not persisted

## Project Documents
- [Google Drive](https://drive.google.com/drive/folders/1aKeN54HV-DNzzb9e38mWx4OPBNVIYptg?usp=sharing)

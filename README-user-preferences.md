# User Preferences Feature

This branch implements a personalized news recommendation system for the News Navigator application. The feature allows users to specify their interests and preferences, and then receive news articles tailored to those preferences. The system also learns from user behavior to improve recommendations over time.

## Features

- **User Preference Management**:
  - Users can specify topics of interest
  - Users can select preferred news categories
  - Users can choose preferred sources and countries
  - Users can exclude specific sources

- **Personalized News Feed**:
  - News articles are filtered based on user preferences
  - Articles are ranked by relevance to user interests
  - Bias indicators show potential political leanings of sources

- **Behavior-Based Learning**:
  - System tracks user interactions with articles (views, clicks, saves, likes/dislikes)
  - Recommendations evolve based on user behavior
  - Reading history is maintained to avoid showing duplicate content

## Technical Implementation

### Backend (Django)

- **Models**:
  - `UserPreference`: Stores user interests, preferred categories, sources, and countries
  - `UserInteraction`: Tracks user interactions with articles for behavior-based recommendations

- **API Endpoints**:
  - `/api/preferences/`: GET and PUT endpoints for managing user preferences
  - `/api/personalized-articles/`: GET endpoint for fetching personalized news
  - `/api/interactions/`: POST endpoint for recording user interactions

- **Services**:
  - `UserPreferenceService`: Handles preference management and recommendation logic
  - Combines explicit preferences with behavior-based interests for better recommendations

### Frontend (React)

- **Components**:
  - `UserPreferencesForm`: Form for users to manage their preferences
  - `PersonalizedNewsFeed`: Displays personalized news articles with interaction options

## How It Works

1. **Initial Setup**:
   - User selects interests, preferred categories, and countries
   - System stores these preferences in the database

2. **Recommendation Process**:
   - System combines explicit user preferences with behavior-based interests
   - Articles are fetched from news API based on these combined preferences
   - Articles from excluded sources are filtered out
   - Results are returned to the user

3. **Learning Loop**:
   - User interactions (clicks, saves, likes) are recorded
   - These interactions influence future recommendations
   - System gradually learns user preferences over time

## Future Enhancements

- Implement machine learning models for more sophisticated recommendations
- Add content-based filtering using NLP to analyze article content
- Implement collaborative filtering to recommend articles based on similar users
- Add A/B testing framework to optimize recommendation algorithms
- Implement user feedback mechanisms for explicit rating of recommendations

## Getting Started

1. Checkout this branch: `git checkout user-preferences-feature`
2. Run migrations: `python manage.py migrate`
3. Start the development server: `python manage.py runserver`
4. Access the user preferences page at `/preferences`
5. Start receiving personalized news recommendations!

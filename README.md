# News Navigator

A news recommendation platform designed to provide users with news articles from multiple sources while highlighting potential biases. Users can explore content before creating an account, and their preferences will be saved once they sign up.

## Features
- Interactive world map showing news hotspots
- Bias analysis and transparency in news reporting
- Interest-based content filtering
- Account-free exploration
- Save articles and preferences after signing up

## Project Structure
```
news-navigator/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
└── templates/         # HTML templates
```

## Setup Instructions
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Development
The application is currently in prototype phase with sample data. Future implementations will include:
- Real news API integration
- User authentication system
- Persistent storage for user preferences
- Advanced bias analysis
- Social sharing features

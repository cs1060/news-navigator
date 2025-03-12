# News Navigator

A modern, map-centric news exploration platform that helps users discover and analyze news articles through geographic and temporal visualization.

## Features

### Map-First Experience
- Interactive heatmap showing news density
- Timeline-based news exploration
- Cluster view for related stories
- Real-time updates and smooth animations

### Anonymous Exploration
- Browse without account
- Set temporary preferences
- Geographic news exploration
- Bias analysis visualization

### User Benefits
- Save articles for later
- Share with friends
- Personalized recommendations
- Reading history tracking

## Tech Stack

### Backend
- FastAPI (async web framework)
- MongoDB (geospatial database)
- Motor (async MongoDB driver)
- NLTK (text analysis)

### Frontend
- Bootstrap 5 (UI framework)
- Mapbox GL JS (advanced mapping)
- Custom JavaScript (async updates)

## Getting Started

1. Install MongoDB
```bash
brew install mongodb-community
```

2. Create virtual environment and install dependencies
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Start MongoDB
```bash
mongod --dbpath ~/data/db
```

4. Run the application
```bash
python app.py
```

5. Visit http://localhost:5001

## Project Structure
```
news-navigator/
├── app.py              # FastAPI application
├── requirements.txt    # Python dependencies
├── static/            # Static assets
│   ├── css/          # Custom styles
│   └── js/           # Frontend scripts
└── templates/         # HTML templates
    ├── base.html     # Base template
    └── index.html    # Map-centric interface
```

## Development

### Requirements
- Python 3.8+
- MongoDB 4.4+
- Node.js 14+ (for development)

# News Navigator

## Description
News Navigator is a news recommendation platform designed to provide users with news articles from multiple sources while highlighting potential biases. It ensures transparency in news consumption by curating articles based on user interests and offering unbiased summaries of key global events. An interactive world map highlights news hotspots, allowing users to explore stories geographically.

## Features
- User interest-based news curation
- Bias detection and transparency
- Accessible interface designed for all users
- Easy-to-use interest management
- Visual article cards with clear information hierarchy

## Tech Stack
- Backend: Django + Django REST Framework
- Frontend: React + Chakra UI
- Database: SQLite (development)

## Setup Instructions

### Backend Setup
1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run database migrations:
```bash
python manage.py migrate
```

3. Start the Django development server:
```bash
python manage.py runserver
```

### Frontend Setup
1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the React development server:
```bash
npm start
```

## Project Structure
```
news-navigator/
├── backend/          # Django project root
├── news/            # Django app for news functionality
├── frontend/        # React frontend application
│   ├── src/         # React source files
│   └── public/      # Static assets
└── requirements.txt # Python dependencies
```

## Accessibility Features
- Large, readable text and buttons
- High contrast color scheme
- Keyboard navigation support
- Screen reader compatibility
- Simple, uncluttered interface
- Clear visual feedback
- Semantic HTML structure

## Project Documents
- [Google Drive](https://drive.google.com/drive/folders/1aKeN54HV-DNzzb9e38mWx4OPBNVIYptg?usp=sharing)

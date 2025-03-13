# News Navigator

## Description
News Navigator is a news recommendation platform designed to provide users with news articles from multiple sources while highlighting potential biases. It ensures transparency in news consumption by curating articles based on user interests and offering unbiased summaries of key global events. An interactive world map highlights news hotspots, allowing users to explore stories geographically.

## Features
- Modern, youth-focused UI with dark/light mode
- Personalized news feed based on user interests
- Bias rating system for articles
- Trending news section
- Save articles for later
- Share functionality
- Interactive article cards with hover effects

## Tech Stack
- Frontend: React with Material-UI
- Backend: FastAPI
- Data: Generated sample news articles (for prototype)

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Setup
1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Project Documents
- [Google Drive](https://drive.google.com/drive/folders/1aKeN54HV-DNzzb9e38mWx4OPBNVIYptg?usp=sharing)

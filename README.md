# News Navigator

A modern, mobile-first news exploration platform that helps users discover, analyze, and share news articles while understanding potential biases. Built as a Progressive Web App (PWA) using React, Material-UI, and Django REST Framework.

## Features

- **Progressive Web App**
  - Offline capability
  - Mobile-first responsive design
  - App-like experience
  - Fast loading and performance
  - Home screen installation

- **Interactive News Exploration**
  - Browse articles without account requirement
  - Visual bias indicators
  - Category-based filtering
  - Geographic article visualization
  - Source credibility metrics

- **Mobile-First Experience**
  - Touch-optimized interface
  - Responsive Material Design
  - Smooth animations
  - Gesture support
  - Adaptive layouts

- **Technical Highlights**
  - Modern React frontend with Material-UI
  - Django REST Framework backend
  - JWT authentication
  - Interactive map integration with Leaflet.js
  - Redux state management
  - Service Worker for offline support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/news-navigator.git
   cd news-navigator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py generate_sample_data  # Generate sample articles
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   python manage.py runserver 5001
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Documentation: http://localhost:5001/swagger/

## Project Structure

```
news-navigator/
├── frontend/                 # React PWA frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── service-worker.js # PWA service worker
│   │   └── App.js          # Main application component
│   └── package.json
│
└── backend/                 # Django backend application
    ├── api/                # Main API application
    │   ├── models/         # Database models
    │   ├── views/          # API views and viewsets
    │   ├── serializers.py  # Data serializers
    │   └── urls.py         # API routing
    └── news_navigator/     # Project settings
```

## Key Features

### For Users
- Install as a mobile app through PWA support
- Offline access to previously viewed articles
- Touch-optimized interface for mobile devices
- Browse news articles without account creation
- Interactive world map for geographic news exploration
- Visual bias indicators and source credibility metrics
- Save articles for later reading (requires account)
- Share articles with others
- Personalize news feed based on interests

### For Developers
- Clean, modular architecture
- Progressive Web App implementation
- Service Worker configuration
- Comprehensive API documentation
- JWT-based authentication
- Efficient state management with Redux
- Responsive Material-UI components
- Geographic data handling with Leaflet.js

## API Endpoints

- `/api/articles/` - Article management
- `/api/auth/` - Authentication endpoints
- `/api/profiles/` - User profile management
- `/api/saved-articles/` - Saved article management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the modern UI components
- Django REST Framework for the robust API framework
- Leaflet.js for the interactive mapping capabilities

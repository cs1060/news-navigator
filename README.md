# News Navigator

News Navigator is a full-stack web application that provides users with news articles from multiple sources while highlighting potential biases. The platform allows users to save articles, categorize them by topic and date, and share them with others.

## Features

### User Authentication
- User registration and login
- Secure authentication using JWT tokens
- User profile management

### News Consumption
- Personalized news feed based on user interests
- Articles labeled with potential bias ratings
- Interactive world map showing news hotspots
- Search functionality for finding specific news

### Article Management
- Save articles for later reading
- Categorize saved articles by topic (politics, tech, etc.)
- Filter articles by date
- Access saved articles across different user sessions

### Sharing Capabilities
- Share articles with others
- Copy article links
- Sharing available for both authenticated and unauthenticated users

## Technology Stack

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- News API for fetching articles

### Frontend
- React
- Material-UI for component styling
- React Router for navigation
- Leaflet for interactive maps
- Axios for API requests

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- News API key (from [newsapi.org](https://newsapi.org/))

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd NewsNavigator/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/news-navigator
   JWT_SECRET=your_jwt_secret_key_here
   NEWS_API_KEY=your_news_api_key_here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd NewsNavigator/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Register for an account or log in if you already have one
2. Set your news interests and preferences in your profile
3. Browse the personalized news feed
4. Save articles of interest for later reading
5. Explore the world map to find news by region
6. Share interesting articles with friends

## Project Structure

```
NewsNavigator/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── README.md
└── README.md
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [News API](https://newsapi.org/) for providing the news data
- [Material-UI](https://mui.com/) for the UI components
- [React Leaflet](https://react-leaflet.js.org/) for the interactive map functionality

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SavedArticlesPage from './pages/SavedArticlesPage';
import WorldMapPage from './pages/WorldMapPage';
import WorldMapPrototype from './pages/WorldMapPrototype';
import NewsFeedPrototype from './pages/NewsFeedPrototype';
import SearchPrototype from './pages/SearchPrototype';
import RecommendationsPrototype from './pages/RecommendationsPrototype';
import TestWorldMap from './pages/TestWorldMap';
import StandaloneWorldMap from './pages/StandaloneWorldMap';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/world-map" element={<WorldMapPage />} />
            <Route path="/world-map-prototype" element={<WorldMapPrototype />} />
            <Route path="/test-map" element={<TestWorldMap />} />
            <Route path="/standalone-map" element={<StandaloneWorldMap />} />
            <Route path="/news-feed-prototype" element={<NewsFeedPrototype />} />
            <Route path="/search-prototype" element={<SearchPrototype />} />
            <Route path="/recommendations-prototype" element={<RecommendationsPrototype />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/saved-articles" 
              element={
                <PrivateRoute>
                  <SavedArticlesPage />
                </PrivateRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

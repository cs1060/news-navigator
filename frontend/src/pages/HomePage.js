import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [savedArticleIds, setSavedArticleIds] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let response;
        
        if (searchQuery) {
          // Search results
          response = await axios.get(`/api/news/search?q=${searchQuery}`);
        } else if (tabValue === 0) {
          // Top headlines
          response = await axios.get('/api/news/headlines');
        } else if (tabValue === 1 && isAuthenticated) {
          // Personalized feed based on interests
          response = await axios.get('/api/news/interests');
        } else {
          // Category-based news
          const categories = ['politics', 'technology', 'business', 'health', 'science', 'sports', 'entertainment', 'world'];
          const category = categories[tabValue - (isAuthenticated ? 2 : 1)];
          response = await axios.get(`/api/news/headlines?category=${category}`);
        }
        
        setArticles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to fetch articles. Please try again later.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [tabValue, isAuthenticated, searchQuery]);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get('/api/articles');
          setSavedArticleIds(response.data.map(article => article._id));
        } catch (err) {
          console.error('Error fetching saved articles:', err);
        }
      }
    };

    fetchSavedArticles();
  }, [isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveArticle = async (article) => {
    try {
      const response = await axios.post('/api/articles', article);
      setSavedArticleIds([...savedArticleIds, response.data._id]);
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article. Please try again.');
    }
  };

  const handleRemoveArticle = async (articleId) => {
    try {
      await axios.delete(`/api/articles/${articleId}`);
      setSavedArticleIds(savedArticleIds.filter(id => id !== articleId));
    } catch (err) {
      console.error('Error removing article:', err);
      setError('Failed to remove article. Please try again.');
    }
  };

  // Generate tabs based on authentication status
  const generateTabs = () => {
    const tabs = [
      { label: 'Top Headlines', value: 0 }
    ];
    
    if (isAuthenticated) {
      tabs.push({ label: 'For You', value: 1 });
    }
    
    const categories = [
      { label: 'Politics', value: isAuthenticated ? 2 : 1 },
      { label: 'Technology', value: isAuthenticated ? 3 : 2 },
      { label: 'Business', value: isAuthenticated ? 4 : 3 },
      { label: 'Health', value: isAuthenticated ? 5 : 4 },
      { label: 'Science', value: isAuthenticated ? 6 : 5 },
      { label: 'Sports', value: isAuthenticated ? 7 : 6 },
      { label: 'Entertainment', value: isAuthenticated ? 8 : 7 },
      { label: 'World', value: isAuthenticated ? 9 : 8 }
    ];
    
    return [...tabs, ...categories];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {searchQuery ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results: {searchQuery}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isAuthenticated ? `Welcome, ${user?.name}` : 'Welcome to News Navigator'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {isAuthenticated 
              ? 'Your personalized news feed with bias transparency'
              : 'Discover news from multiple sources with bias transparency'}
          </Typography>
          
          {isAuthenticated && user?.interests?.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2">Your interests:</Typography>
              {user.interests.map((interest, index) => (
                <Chip 
                  key={index} 
                  label={interest.charAt(0).toUpperCase() + interest.slice(1)} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!searchQuery && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="news categories tabs"
          >
            {generateTabs().map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : articles.length > 0 ? (
        <Grid container spacing={3}>
          {articles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ArticleCard
                article={article}
                isSaved={savedArticleIds.includes(article._id)}
                onSave={handleSaveArticle}
                onRemove={handleRemoveArticle}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">
            {searchQuery ? 'No articles found for your search.' : 'No articles found.'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;

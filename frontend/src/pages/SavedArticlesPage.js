import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import { getMockSavedArticles } from '../services/mockDataService';

const SavedArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      setLoading(true);
      try {
        // Use mock data instead of API call
        let mockArticles = getMockSavedArticles();
        
        if (tabValue !== 0) {
          // Category-based saved articles
          const categories = ['politics', 'technology', 'business', 'health', 'science', 'sports', 'entertainment', 'world'];
          const category = categories[tabValue - 1];
          mockArticles = mockArticles.filter(article => article.category === category);
        }
        
        setArticles(mockArticles);
        setFilteredArticles(mockArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching saved articles:', err);
        setError('Failed to fetch saved articles. Please try again later.');
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [tabValue]);

  useEffect(() => {
    // Filter articles based on search query and date range
    let filtered = [...articles];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        (article.description && article.description.toLowerCase().includes(query))
      );
    }
    
    if (startDate) {
      filtered = filtered.filter(article => 
        new Date(article.publishedAt) >= startDate
      );
    }
    
    if (endDate) {
      filtered = filtered.filter(article => 
        new Date(article.publishedAt) <= endDate
      );
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, startDate, endDate, articles]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRemoveArticle = async (articleId) => {
    try {
      // Mock removal without API call
      setArticles(articles.filter(article => article.id !== articleId));
      setFilteredArticles(filteredArticles.filter(article => article.id !== articleId));
    } catch (err) {
      console.error('Error removing article:', err);
      setError('Failed to remove article. Please try again.');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Saved Articles
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your saved articles by category and date
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="saved articles categories tabs"
        >
          <Tab label="All" />
          <Tab label="Politics" />
          <Tab label="Technology" />
          <Tab label="Business" />
          <Tab label="Health" />
          <Tab label="Science" />
          <Tab label="Sports" />
          <Tab label="Entertainment" />
          <Tab label="World" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search saved articles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="From Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="To Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
            {(startDate || endDate) && (
              <IconButton onClick={handleClearDates}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </LocalizationProvider>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredArticles.length > 0 ? (
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <ArticleCard
                article={article}
                isSaved={true}
                onRemove={handleRemoveArticle}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">
            {searchQuery || startDate || endDate 
              ? 'No articles match your filters.' 
              : 'No saved articles found. Start saving articles to see them here!'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SavedArticlesPage;

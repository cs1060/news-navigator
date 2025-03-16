import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Drawer,
  IconButton,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon,
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
// Import mock data service
import { getMockGlobalNewsActivity, getMockNewsByCountry } from '../services/mockDataService';
import ArticleCard from '../components/ArticleCard';
import AuthContext from '../context/AuthContext';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Country coordinates mapping
const countryCoordinates = {
  us: [37.0902, -95.7129],
  gb: [55.3781, -3.4360],
  ca: [56.1304, -106.3468],
  au: [-25.2744, 133.7751],
  in: [20.5937, 78.9629],
  fr: [46.2276, 2.2137],
  de: [51.1657, 10.4515],
  jp: [36.2048, 138.2529],
  br: [-14.2350, -51.9253],
  za: [-30.5595, 22.9375],
  ru: [61.5240, 105.3188],
  cn: [35.8617, 104.1954],
  mx: [23.6345, -102.5528],
  it: [41.8719, 12.5674],
  es: [40.4637, -3.7492],
  kr: [35.9078, 127.7669],
  sg: [1.3521, 103.8198],
  ae: [23.4241, 53.8478],
  ar: [-38.4161, -63.6167],
  ng: [9.0820, 8.6753],
};

// Custom marker icons for news hotspots based on activity level
const newsIcons = {
  high: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  medium: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  low: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// News categories for filtering
const newsCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'general', label: 'General' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'politics', label: 'Politics' },
  { value: 'world', label: 'World' }
];

const WorldMapPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryNews, setCountryNews] = useState({});
  const [globalActivity, setGlobalActivity] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedArticleIds, setSavedArticleIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingCountryNews, setLoadingCountryNews] = useState(false);

  useEffect(() => {
    const fetchGlobalNewsActivity = async () => {
      setLoading(true);
      try {
        // Use mock data instead of API call
        const mockData = getMockGlobalNewsActivity();
        setGlobalActivity(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching global news activity:', err);
        setError('Failed to fetch global news data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalNewsActivity();
  }, []);
  
  // Fetch country-specific news when a country is selected or category changes
  useEffect(() => {
    if (selectedCountry) {
      fetchCountryNews(selectedCountry, selectedCategory);
    }
  }, [selectedCountry, selectedCategory]);
  
  const fetchCountryNews = async (country, category) => {
    setLoadingCountryNews(true);
    try {
      // Use mock data instead of API call
      const mockData = getMockNewsByCountry(country, category);
      
      // Update the countryNews state with the mock data
      setCountryNews(prev => ({
        ...prev,
        [country]: mockData
      }));
      
    } catch (err) {
      console.error(`Error fetching news for ${country}:`, err);
      setError(`Failed to fetch news for ${getCountryName(country)}. Please try again.`);
    } finally {
      setLoadingCountryNews(false);
    }
  };

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (isAuthenticated) {
        try {
          // Use mock saved articles IDs
          const mockSavedIds = ['us-0-1615234567890', 'gb-1-1615234567891', 'ca-2-1615234567892'];
          setSavedArticleIds(mockSavedIds);
        } catch (err) {
          console.error('Error fetching saved articles:', err);
        }
      }
    };

    fetchSavedArticles();
  }, [isAuthenticated]);

  const handleMarkerClick = (country) => {
    setSelectedCountry(country);
    setDrawerOpen(true);
    
    // Fetch country news if we don't have it yet or if it's for a different category
    if (!countryNews[country] || 
        (countryNews[country]?.metadata?.category !== selectedCategory && selectedCategory !== 'all')) {
      fetchCountryNews(country, selectedCategory);
    }
  };
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
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

  const getCountryName = (countryCode) => {
    const countryNames = {
      us: 'United States',
      gb: 'United Kingdom',
      ca: 'Canada',
      au: 'Australia',
      in: 'India',
      fr: 'France',
      de: 'Germany',
      jp: 'Japan',
      br: 'Brazil',
      za: 'South Africa',
      ru: 'Russia',
      cn: 'China',
      mx: 'Mexico',
      it: 'Italy',
      es: 'Spain',
      kr: 'South Korea',
      sg: 'Singapore',
      ae: 'United Arab Emirates',
      ar: 'Argentina',
      ng: 'Nigeria',
    };
    
    return countryNames[countryCode] || countryCode.toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          World News Map
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Explore news from around the world by clicking on the markers
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>News Activity:</Typography>
          <Chip 
            label="High" 
            color="error" 
            size="small" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            label="Medium" 
            color="warning" 
            size="small" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            label="Low" 
            color="info" 
            size="small" 
          />
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            startAdornment={<FilterIcon fontSize="small" sx={{ mr: 1 }} />}
          >
            {newsCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Paper sx={{ height: '70vh', width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%' }}
            minZoom={2}
            maxBounds={[[-90, -180], [90, 180]]}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {Object.keys(globalActivity).map(country => (
              <Marker 
                key={country}
                position={countryCoordinates[country]}
                icon={newsIcons[globalActivity[country].activity || 'low']}
                eventHandlers={{
                  click: () => handleMarkerClick(country)
                }}
              >
                <Popup>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {getCountryName(country)}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={globalActivity[country].activity.toUpperCase()} 
                      color={globalActivity[country].activity === 'high' ? 'error' : 
                             globalActivity[country].activity === 'medium' ? 'warning' : 'info'} 
                      size="small" 
                      sx={{ mr: 1, textTransform: 'capitalize' }} 
                    />
                    {globalActivity[country].count || 0} news articles
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click to view detailed news from this region
                  </Typography>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: '70%', md: '50%' },
            padding: 2
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            News from {selectedCountry ? getCountryName(selectedCountry) : ''}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {selectedCountry && globalActivity[selectedCountry] && countryNews[selectedCountry] && (
          <Card sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="div">
                  Key Events Summary
                </Typography>
                <Chip 
                  label={globalActivity[selectedCountry].activity.toUpperCase()} 
                  color={globalActivity[selectedCountry].activity === 'high' ? 'error' : 
                         globalActivity[selectedCountry].activity === 'medium' ? 'warning' : 'info'} 
                  size="small" 
                  sx={{ textTransform: 'capitalize' }} 
                />
              </Box>
              <Typography variant="body1">
                {countryNews[selectedCountry]?.metadata?.summary || 'No summary available'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {globalActivity[selectedCountry].count} articles in this region
                </Typography>
                <Tooltip title="News activity is calculated based on the volume and recency of articles from this region">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        )}
        
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="drawer-category-select-label">Filter by Category</InputLabel>
            <Select
              labelId="drawer-category-select-label"
              id="drawer-category-select"
              value={selectedCategory}
              label="Filter by Category"
              onChange={handleCategoryChange}
            >
              {newsCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {loadingCountryNews ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedCountry && countryNews[selectedCountry]?.articles?.length > 0 ? (
          <Grid container spacing={2}>
            {countryNews[selectedCountry].articles.map((article, index) => (
              <Grid item xs={12} key={index}>
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
          <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
            No news articles available for this region and category.
          </Typography>
        )}
      </Drawer>
    </Container>
  );
};

export default WorldMapPage;

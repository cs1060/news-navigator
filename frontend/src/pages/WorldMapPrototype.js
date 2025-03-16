import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Close as CloseIcon,
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  FilterAlt as FilterIcon,
  Map as MapIcon,
  Layers as LayersIcon,
  Thermostat as HeatMapIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { getMockGlobalNewsActivity, getMockNewsByCountry } from '../services/mockDataService';

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
    iconSize: [30, 45],  // Larger size for high activity
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  medium: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],  // Medium size for medium activity
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  low: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],  // Smaller size for low activity
    iconAnchor: [10, 35],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Create marker cluster group for grouping markers in close proximity
const createClusterGroup = () => {
  return L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: function(cluster) {
      const childCount = cluster.getChildCount();
      let size, className;
      
      if (childCount < 5) {
        size = 'small';
        className = 'cluster-small';
      } else if (childCount < 10) {
        size = 'medium';
        className = 'cluster-medium';
      } else {
        size = 'large';
        className = 'cluster-large';
      }
      
      return L.divIcon({ 
        html: `<div><span>${childCount}</span></div>`, 
        className: `marker-cluster marker-cluster-${size} ${className}`,
        iconSize: L.point(40, 40)
      });
    }
  });
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

// Note: In a production environment, we would implement a proper MarkerClusterGroup component
// using react-leaflet-markercluster. For this prototype, we're using a simplified approach
// with standard markers and the cluster toggle just switches between different visualization modes.

const WorldMapPrototype = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryNews, setCountryNews] = useState({});
  const [globalActivity, setGlobalActivity] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingCountryNews, setLoadingCountryNews] = useState(false);
  const [viewMode, setViewMode] = useState('markers'); // 'markers', 'heatmap', or 'circles'
  const [showClusters, setShowClusters] = useState(true);
  const mapRef = useRef(null);

  // Fetch global news activity on component mount
  useEffect(() => {
    const fetchGlobalNewsActivity = async () => {
      setLoading(true);
      try {
        // Use mock data
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
    
    // Add custom CSS for marker clusters
    const style = document.createElement('style');
    style.textContent = `
      .marker-cluster-small { background-color: rgba(181, 226, 140, 0.6); }
      .marker-cluster-small div { background-color: rgba(110, 204, 57, 0.6); }
      .marker-cluster-medium { background-color: rgba(241, 211, 87, 0.6); }
      .marker-cluster-medium div { background-color: rgba(240, 194, 12, 0.6); }
      .marker-cluster-large { background-color: rgba(253, 156, 115, 0.6); }
      .marker-cluster-large div { background-color: rgba(241, 128, 23, 0.6); }
      .marker-cluster { background-clip: padding-box; border-radius: 20px; }
      .marker-cluster div { width: 30px; height: 30px; margin-left: 5px; margin-top: 5px; text-align: center; border-radius: 15px; font-weight: bold; }
      .marker-cluster span { line-height: 30px; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
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
      // Use mock data
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
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  const handleClusterToggle = (event) => {
    setShowClusters(event.target.checked);
  };
  
  // Prepare heat map data points
  const getHeatmapData = () => {
    return Object.entries(globalActivity).map(([country, data]) => {
      const coordinates = countryCoordinates[country] || [0, 0];
      // Intensity based on activity level and count
      let intensity = 0;
      switch (data.activity) {
        case 'high':
          intensity = 30;
          break;
        case 'medium':
          intensity = 20;
          break;
        case 'low':
          intensity = 10;
          break;
        default:
          intensity = 5;
      }
      
      // Add count factor
      intensity += Math.min(data.count / 2, 20);
      
      return {
        lat: coordinates[0],
        lng: coordinates[1],
        intensity: intensity
      };
    });
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

  // Simple article card component for the prototype
  const SimpleArticleCard = ({ article }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {article.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {article.source_name}
          </Typography>
          <Chip 
            label={article.category.charAt(0).toUpperCase() + article.category.slice(1)} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          World News Map Prototype
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

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="markers" aria-label="markers">
              <Tooltip title="Standard Markers">
                <MapIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="heatmap" aria-label="heatmap">
              <Tooltip title="Heat Map View">
                <HeatMapIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="circles" aria-label="circles">
              <Tooltip title="Circle Radius View">
                <LayersIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          
          {viewMode === 'markers' && (
            <FormControlLabel
              control={
                <Switch
                  checked={showClusters}
                  onChange={handleClusterToggle}
                  name="clusters"
                  color="primary"
                  size="small"
                />
              }
              label="Cluster Markers"
            />
          )}
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
            ref={mapRef}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Standard Map">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                  url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
                  attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  subdomains="abcd"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            
            {/* Heat Map Layer */}
            {viewMode === 'heatmap' && (
              <HeatmapLayer
                points={getHeatmapData()}
                longitudeExtractor={m => m.lng}
                latitudeExtractor={m => m.lat}
                intensityExtractor={m => m.intensity}
                radius={30}
                max={50}
                blur={15}
                gradient={{ 0.4: 'blue', 0.6: 'lime', 0.8: 'orange', 1.0: 'red' }}
              />
            )}
            
            {/* Circle Radius View */}
            {viewMode === 'circles' && Object.keys(globalActivity).map(country => {
              const activity = globalActivity[country];
              const radius = activity.activity === 'high' ? 300000 :
                           activity.activity === 'medium' ? 200000 : 100000;
              const color = activity.activity === 'high' ? '#ff3b30' :
                           activity.activity === 'medium' ? '#ff9500' : '#007aff';
              
              return (
                <Circle
                  key={country}
                  center={countryCoordinates[country]}
                  radius={radius + (activity.count * 5000)} // Add count factor
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    weight: 1
                  }}
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
                        label={activity.activity.toUpperCase()} 
                        color={activity.activity === 'high' ? 'error' : 
                               activity.activity === 'medium' ? 'warning' : 'info'} 
                        size="small" 
                        sx={{ mr: 1, textTransform: 'capitalize' }} 
                      />
                      {activity.count || 0} news articles
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Click to view detailed news from this region
                    </Typography>
                  </Popup>
                </Circle>
              );
            })}
            
            {/* Standard Markers View */}
            {viewMode === 'markers' && !showClusters && Object.keys(globalActivity).map(country => (
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
            
            {/* Clustered Visualization (using circles with different sizes to simulate clusters) */}
            {viewMode === 'markers' && showClusters && Object.keys(globalActivity).map(country => {
              const activity = globalActivity[country];
              // Calculate size based on activity and article count
              const size = activity.activity === 'high' ? 15 : 
                          activity.activity === 'medium' ? 10 : 5;
              const finalSize = size + Math.min(activity.count / 5, 10);
              
              return (
                <Circle
                  key={country}
                  center={countryCoordinates[country]}
                  radius={finalSize * 10000}
                  pathOptions={{
                    color: activity.activity === 'high' ? '#ff3b30' :
                           activity.activity === 'medium' ? '#ff9500' : '#007aff',
                    fillColor: activity.activity === 'high' ? '#ff3b30' :
                              activity.activity === 'medium' ? '#ff9500' : '#007aff',
                    fillOpacity: 0.7,
                    weight: 1
                  }}
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
                        label={activity.activity.toUpperCase()} 
                        color={activity.activity === 'high' ? 'error' : 
                               activity.activity === 'medium' ? 'warning' : 'info'} 
                        size="small" 
                        sx={{ mr: 1, textTransform: 'capitalize' }} 
                      />
                      {activity.count || 0} news articles
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Click to view detailed news from this region
                    </Typography>
                  </Popup>
                </Circle>
              );
            })}
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
          <Box sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
            {countryNews[selectedCountry].articles.map((article, index) => (
              <SimpleArticleCard key={index} article={article} />
            ))}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
            No news articles available for this region and category.
          </Typography>
        )}
      </Drawer>
    </Container>
  );
};

export default WorldMapPrototype;

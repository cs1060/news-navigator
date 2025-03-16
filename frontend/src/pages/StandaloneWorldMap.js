import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for global news activity
const mockGlobalNewsActivity = {
  us: { activity: 'high', count: 45 },
  gb: { activity: 'high', count: 38 },
  ca: { activity: 'medium', count: 24 },
  au: { activity: 'medium', count: 22 },
  de: { activity: 'high', count: 32 },
  fr: { activity: 'medium', count: 26 },
  jp: { activity: 'medium', count: 28 },
  cn: { activity: 'high', count: 35 },
  in: { activity: 'high', count: 30 },
  br: { activity: 'medium', count: 20 },
  za: { activity: 'low', count: 12 },
  ru: { activity: 'medium', count: 25 },
  mx: { activity: 'low', count: 15 },
  it: { activity: 'medium', count: 22 },
  es: { activity: 'medium', count: 20 },
  kr: { activity: 'low', count: 18 },
  sa: { activity: 'low', count: 10 },
  ng: { activity: 'low', count: 8 },
  eg: { activity: 'low', count: 9 },
  ar: { activity: 'low', count: 14 }
};

// Country coordinates for placing markers
const countryCoordinates = {
  us: [37.0902, -95.7129],
  gb: [55.3781, -3.4360],
  ca: [56.1304, -106.3468],
  au: [-25.2744, 133.7751],
  de: [51.1657, 10.4515],
  fr: [46.2276, 2.2137],
  jp: [36.2048, 138.2529],
  cn: [35.8617, 104.1954],
  in: [20.5937, 78.9629],
  br: [-14.2350, -51.9253],
  za: [-30.5595, 22.9375],
  ru: [61.5240, 105.3188],
  mx: [23.6345, -102.5528],
  it: [41.8719, 12.5674],
  es: [40.4637, -3.7492],
  kr: [35.9078, 127.7669],
  sa: [23.8859, 45.0792],
  ng: [9.0820, 8.6753],
  eg: [26.8206, 30.8025],
  ar: [-38.4161, -63.6167]
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

// News categories for filtering
const newsCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'politics', label: 'Politics' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'science', label: 'Science' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'world', label: 'World' }
];

const StandaloneWorldMap = () => {



  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Global News Map
      </Typography>
      <Typography variant="body1" paragraph>
        Explore news activity around the world. Click on markers to view detailed news from each region.
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: 600, 
          width: '100%', 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={[37.0902, -95.7129]}>
            <Popup>
              <div>
                <h3>United States</h3>
                <p>High activity: 45 news articles</p>
              </div>
            </Popup>
          </Marker>
          
          <Marker position={[55.3781, -3.4360]}>
            <Popup>
              <div>
                <h3>United Kingdom</h3>
                <p>High activity: 38 news articles</p>
              </div>
            </Popup>
          </Marker>
          
          <Marker position={[35.8617, 104.1954]}>
            <Popup>
              <div>
                <h3>China</h3>
                <p>High activity: 35 news articles</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </Paper>
    </Container>
  );
};

export default StandaloneWorldMap;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const { articles } = useSelector((state) => state.news);

  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each article
    articles.forEach(article => {
      const marker = L.marker([article.latitude, article.longitude])
        .addTo(map)
        .bindPopup(`
          <h3>${article.title}</h3>
          <p>${article.content.substring(0, 100)}...</p>
          <small>Source: ${article.source}</small>
        `);
    });

    return () => {
      map.remove();
    };
  }, [articles]);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          p: 2,
          maxWidth: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          News Around the World
        </Typography>
        <Typography variant="body2">
          Click on markers to view news stories from different locations.
          The size of each marker indicates the number of related stories.
        </Typography>
      </Paper>
      <div id="map" style={{ height: '100%' }} />
    </Box>
  );
};

export default Map;

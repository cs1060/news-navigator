import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const BasicMap = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Global News Map
      </Typography>
      <Typography variant="body1" paragraph>
        Explore news activity around the world. This is a simplified version of the map.
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: 600, 
          width: '100%', 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}
      >
        <Typography variant="h5" component="div">
          World Map Placeholder
        </Typography>
      </Paper>
    </Container>
  );
};

export default BasicMap;

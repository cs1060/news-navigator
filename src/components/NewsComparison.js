import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Divider,
  Link,
  Paper
} from '@mui/material';

// Bias color mapping
const getBiasColor = (bias) => {
  const biasColors = {
    'Far-Left': '#8b0000',
    'Left': '#ff4500',
    'Center-Left': '#ffa500',
    'Center': '#008000',
    'Center-Right': '#4169e1',
    'Right': '#0000cd',
    'Far-Right': '#4b0082'
  };
  
  return biasColors[bias] || '#757575';
};

const NewsComparison = ({ article }) => {
  if (!article) return null;
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {article.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip label={article.topic} color="primary" />
        <Chip label={article.region} color="secondary" />
        <Chip label={article.date} variant="outlined" />
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Compare Perspectives
      </Typography>
      
      <Grid container spacing={3}>
        {article.sources.map((source) => (
          <Grid item xs={12} md={6} key={source.name}>
            <Paper 
              elevation={3} 
              sx={{ 
                height: '100%',
                borderTop: 5, 
                borderColor: getBiasColor(source.bias)
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{source.name}</Typography>
                  <Chip 
                    label={source.bias} 
                    size="small"
                    sx={{ 
                      bgcolor: getBiasColor(source.bias),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  {source.summary}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Link href={source.url} target="_blank" rel="noopener noreferrer">
                    Read full article
                  </Link>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          About Source Bias Indicators
        </Typography>
        <Typography variant="body2">
          The bias indicators shown above are based on generally accepted media bias ratings from organizations 
          that study media bias. These ratings reflect the typical political leaning of each source's reporting 
          and editorial stance, not the accuracy or quality of individual articles. All sources may produce 
          factual reporting regardless of their bias rating.
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsComparison;

import React from 'react';
import { 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Box,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SummaryDisplay = ({ summaries, selectedArticle }) => {
  // Format the timestamp
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Summary
      </Typography>
      
      {!selectedArticle ? (
        <Typography variant="body1" color="text.secondary">
          Select an article to view its summary
        </Typography>
      ) : summaries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No summary available for this article
        </Typography>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {selectedArticle.title}
            </Typography>
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Generated: ${formatDate(summaries[0].created_at)}`}
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {summaries[0].summary_text}
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Source: {selectedArticle.source}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published: {new Date(selectedArticle.published_date).toLocaleDateString()}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SummaryDisplay;

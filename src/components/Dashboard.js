import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Card, 
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { mockNews } from '../data/mockNews';
import NewsComparison from './NewsComparison';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [newsData, setNewsData] = useState(mockNews);
  const [filteredNews, setFilteredNews] = useState(mockNews);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Get unique topics and regions for filters
  const topics = [...new Set(newsData.map(item => item.topic))];
  const regions = [...new Set(newsData.map(item => item.region))];

  // Apply filters
  useEffect(() => {
    let filtered = newsData;
    
    if (selectedTopic) {
      filtered = filtered.filter(item => item.topic === selectedTopic);
    }
    
    if (selectedRegion) {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }
    
    setFilteredNews(filtered);
    
    // Reset selected article if it's no longer in filtered results
    if (selectedArticle && !filtered.find(item => item.id === selectedArticle.id)) {
      setSelectedArticle(null);
    }
  }, [selectedTopic, selectedRegion, newsData, selectedArticle]);

  // Handle topic filter change
  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  // Handle region filter change
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  // Handle article selection
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  // Prepare data for source bias distribution chart
  const prepareBiasData = () => {
    const biasCategories = ['Far-Left', 'Left', 'Center-Left', 'Center', 'Center-Right', 'Right', 'Far-Right'];
    const biasCount = biasCategories.reduce((acc, bias) => {
      acc[bias] = 0;
      return acc;
    }, {});

    // Count sources by bias category
    filteredNews.forEach(article => {
      article.sources.forEach(source => {
        if (biasCount[source.bias] !== undefined) {
          biasCount[source.bias]++;
        }
      });
    });

    return {
      labels: biasCategories,
      datasets: [
        {
          label: 'Sources by Bias',
          data: biasCategories.map(bias => biasCount[bias]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(201, 203, 207, 0.6)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for topics distribution chart
  const prepareTopicsData = () => {
    const topicCount = {};
    
    newsData.forEach(article => {
      if (topicCount[article.topic]) {
        topicCount[article.topic]++;
      } else {
        topicCount[article.topic] = 1;
      }
    });

    return {
      labels: Object.keys(topicCount),
      datasets: [
        {
          label: 'Articles by Topic',
          data: Object.values(topicCount),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="topic-select-label">Filter by Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Filter by Topic"
              onChange={handleTopicChange}
            >
              <MenuItem value="">
                <em>All Topics</em>
              </MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>{topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="region-select-label">Filter by Region</InputLabel>
            <Select
              labelId="region-select-label"
              id="region-select"
              value={selectedRegion}
              label="Filter by Region"
              onChange={handleRegionChange}
            >
              <MenuItem value="">
                <em>All Regions</em>
              </MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Source Bias Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={prepareBiasData()} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Topics Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={prepareTopicsData()} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* News Articles List */}
      <Typography variant="h5" gutterBottom>News Articles</Typography>
      <Grid container spacing={3}>
        {filteredNews.map((article) => (
          <Grid item xs={12} key={article.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                bgcolor: selectedArticle?.id === article.id ? 'primary.light' : 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleArticleSelect(article)}
            >
              <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2 }}>
                  <Chip label={article.topic} color="primary" size="small" />
                  <Chip label={article.region} color="secondary" size="small" />
                  <Chip label={article.date} variant="outlined" size="small" />
                  <Chip label={`${article.sources.length} sources`} variant="outlined" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Click to compare perspectives from {article.sources.map(s => s.name).join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* News Comparison Section */}
      {selectedArticle && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <NewsComparison article={selectedArticle} />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

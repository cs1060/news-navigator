import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data service
const getMockNewsArticles = (category = 'all') => {
  const articles = [
    {
      id: '1',
      title: 'Global Tech Summit Announces Breakthrough in Quantum Computing',
      description: 'Leading tech companies unveiled new quantum computing advancements that could revolutionize data processing capabilities.',
      content: 'The annual Global Tech Summit saw major announcements from industry leaders regarding quantum computing breakthroughs. These advancements promise to solve complex problems previously thought impossible with traditional computing methods.',
      url: 'https://example.com/tech-summit',
      url_to_image: 'https://source.unsplash.com/random/800x600/?technology',
      published_at: '2025-03-14T10:30:00Z',
      source_name: 'Tech Insider',
      author: 'Jane Smith',
      category: 'technology',
      sentiment: 'positive',
      bias_rating: 0
    },
    {
      id: '2',
      title: 'New Climate Policy Implemented Across European Union',
      description: 'EU member states have agreed to a comprehensive climate policy aimed at reducing carbon emissions by 60% before 2035.',
      content: 'In a landmark decision, European Union countries have collectively agreed to implement stricter climate policies. The new regulations will require industries to significantly reduce their carbon footprint over the next decade.',
      url: 'https://example.com/eu-climate',
      url_to_image: 'https://source.unsplash.com/random/800x600/?climate',
      published_at: '2025-03-13T14:15:00Z',
      source_name: 'European News Network',
      author: 'Michel Dubois',
      category: 'politics',
      sentiment: 'neutral',
      bias_rating: -2
    },
    {
      id: '3',
      title: 'Global Markets Respond to Central Bank Interest Rate Decision',
      description: 'Stock markets worldwide showed mixed reactions to the latest interest rate adjustments announced by major central banks.',
      content: 'Financial markets experienced volatility following announcements from central banks regarding interest rate changes. Investors are closely monitoring economic indicators to adjust their portfolios accordingly.',
      url: 'https://example.com/market-news',
      url_to_image: 'https://source.unsplash.com/random/800x600/?finance',
      published_at: '2025-03-14T08:45:00Z',
      source_name: 'Financial Times',
      author: 'Robert Johnson',
      category: 'business',
      sentiment: 'negative',
      bias_rating: 1
    },
    {
      id: '4',
      title: 'Breakthrough Medical Research Shows Promise for Alzheimer\'s Treatment',
      description: 'A new study published in a leading medical journal reveals potential treatment pathways for Alzheimer\'s disease.',
      content: 'Medical researchers have identified a novel approach to treating Alzheimer\'s disease that targets specific protein formations in the brain. Clinical trials are expected to begin within the next six months.',
      url: 'https://example.com/medical-research',
      url_to_image: 'https://source.unsplash.com/random/800x600/?medical',
      published_at: '2025-03-12T16:20:00Z',
      source_name: 'Health Science Journal',
      author: 'Dr. Sarah Chen',
      category: 'health',
      sentiment: 'positive',
      bias_rating: 0
    },
    {
      id: '5',
      title: 'Major Sports League Announces Expansion to New International Markets',
      description: 'One of the world\'s largest sports organizations is set to expand its presence with new teams in Asia and Europe.',
      content: 'In a move to increase global reach, the sports league has confirmed plans to establish new teams in major Asian and European cities. This expansion is expected to significantly increase viewership and revenue.',
      url: 'https://example.com/sports-expansion',
      url_to_image: 'https://source.unsplash.com/random/800x600/?sports',
      published_at: '2025-03-13T12:00:00Z',
      source_name: 'Sports Globe',
      author: 'Carlos Mendez',
      category: 'sports',
      sentiment: 'positive',
      bias_rating: 0
    },
    {
      id: '6',
      title: 'Entertainment Industry Embraces New Virtual Reality Platforms',
      description: 'Major studios are investing heavily in virtual reality technology to create immersive entertainment experiences.',
      content: 'The entertainment industry is undergoing a significant transformation with the adoption of virtual reality technologies. Studios are developing new content formats designed specifically for VR platforms.',
      url: 'https://example.com/vr-entertainment',
      url_to_image: 'https://source.unsplash.com/random/800x600/?virtual-reality',
      published_at: '2025-03-11T09:30:00Z',
      source_name: 'Entertainment Weekly',
      author: 'Alicia Thompson',
      category: 'entertainment',
      sentiment: 'positive',
      bias_rating: 0
    },
    {
      id: '7',
      title: 'Archaeological Discovery Reveals Ancient Civilization's Advanced Technology',
      description: 'Archaeologists have unearthed artifacts suggesting an ancient civilization possessed surprisingly sophisticated technological knowledge.',
      content: 'A recent archaeological excavation has uncovered evidence that challenges current understanding of technological development in ancient civilizations. The findings suggest advanced knowledge of metallurgy and engineering principles.',
      url: 'https://example.com/archaeology-news',
      url_to_image: 'https://source.unsplash.com/random/800x600/?archaeology',
      published_at: '2025-03-10T11:45:00Z',
      source_name: 'Historical Science',
      author: 'Professor James Wilson',
      category: 'science',
      sentiment: 'neutral',
      bias_rating: 0
    },
    {
      id: '8',
      title: 'International Diplomatic Summit Addresses Global Security Concerns',
      description: 'World leaders gathered to discuss pressing security issues and establish new cooperative frameworks.',
      content: 'The diplomatic summit brought together representatives from over 50 countries to address growing security challenges. Discussions focused on cybersecurity, terrorism prevention, and regional stability initiatives.',
      url: 'https://example.com/diplomatic-summit',
      url_to_image: 'https://source.unsplash.com/random/800x600/?diplomacy',
      published_at: '2025-03-09T15:30:00Z',
      source_name: 'International Affairs',
      author: 'Elizabeth Chambers',
      category: 'politics',
      sentiment: 'neutral',
      bias_rating: -1
    }
  ];

  if (category === 'all') {
    return articles;
  }
  
  return articles.filter(article => article.category === category);
};

const NewsFeedPrototype = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState([]);

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'politics', label: 'Politics' }
  ];

  // Fetch news articles on component mount and when category changes
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          const data = getMockNewsArticles(selectedCategory);
          setArticles(data);
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to fetch news articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSaveArticle = (article) => {
    setSavedArticles(prev => {
      // Check if article is already saved
      if (prev.some(a => a.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const handleRemoveArticle = (articleId) => {
    setSavedArticles(prev => prev.filter(article => article.id !== articleId));
  };

  const isArticleSaved = (articleId) => {
    return savedArticles.some(article => article.id === articleId);
  };

  // Get bias class for styling
  const getBiasClass = (biasRating) => {
    if (biasRating <= -7) return 'bias-left-strong';
    if (biasRating <= -4) return 'bias-left-moderate';
    if (biasRating <= -1) return 'bias-left-slight';
    if (biasRating >= 7) return 'bias-right-strong';
    if (biasRating >= 4) return 'bias-right-moderate';
    if (biasRating >= 1) return 'bias-right-slight';
    return 'bias-neutral';
  };

  // Get bias description
  const getBiasDescription = (biasRating) => {
    if (biasRating <= -7) return 'Strong Left';
    if (biasRating <= -4) return 'Moderate Left';
    if (biasRating <= -1) return 'Slight Left';
    if (biasRating >= 7) return 'Strong Right';
    if (biasRating >= 4) return 'Moderate Right';
    if (biasRating >= 1) return 'Slight Right';
    return 'Neutral';
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          News Feed Prototype
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Explore the latest news articles with filtering and saving capabilities
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Refresh news">
            <IconButton onClick={() => setLoading(true)}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {article.url_to_image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={article.url_to_image}
                      alt={article.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {article.source_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(article.published_at), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" component="div" gutterBottom>
                      {article.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {article.description?.substring(0, 120)}
                      {article.description?.length > 120 ? '...' : ''}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {article.category && (
                        <Chip 
                          label={article.category.charAt(0).toUpperCase() + article.category.slice(1)} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {article.sentiment && (
                        <Chip 
                          label={article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)} 
                          size="small"
                          color={getSentimentColor(article.sentiment)}
                          variant="outlined"
                        />
                      )}
                      {article.bias_rating !== undefined && (
                        <Chip 
                          label={getBiasDescription(article.bias_rating)} 
                          size="small"
                          className={`bias-indicator ${getBiasClass(article.bias_rating)}`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {isArticleSaved(article.id) ? (
                      <Button 
                        size="small" 
                        startIcon={<BookmarkIcon />}
                        onClick={() => handleRemoveArticle(article.id)}
                        color="primary"
                      >
                        Saved
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        startIcon={<BookmarkIcon />}
                        onClick={() => handleSaveArticle(article)}
                        color="primary"
                      >
                        Save
                      </Button>
                    )}
                    
                    <Button 
                      size="small" 
                      startIcon={<ShareIcon />}
                      sx={{ ml: 'auto' }}
                    >
                      Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {articles.length === 0 && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6">
                No articles found for this category.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try selecting a different category or check back later.
              </Typography>
            </Box>
          )}
        </>
      )}

      {savedArticles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Saved Articles ({savedArticles.length})
          </Typography>
          <Grid container spacing={2}>
            {savedArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={`saved-${article.id}`}>
                <Card sx={{ display: 'flex', height: '100%' }}>
                  {article.url_to_image && (
                    <CardMedia
                      component="img"
                      sx={{ width: 100 }}
                      image={article.url_to_image}
                      alt={article.title}
                    />
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="subtitle1" component="div">
                        {article.title.length > 60 
                          ? `${article.title.substring(0, 60)}...` 
                          : article.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        {article.source_name} • {format(new Date(article.published_at), 'MMM d, yyyy')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveArticle(article.id)}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default NewsFeedPrototype;

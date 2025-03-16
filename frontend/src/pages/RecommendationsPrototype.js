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
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Share as ShareIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock recommendations data
const getMockRecommendations = (type = 'forYou') => {
  const allRecommendations = {
    forYou: [
      {
        id: '1',
        title: 'Global Tech Summit Announces Breakthrough in Quantum Computing',
        description: 'Leading tech companies unveiled new quantum computing advancements that could revolutionize data processing capabilities.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?technology',
        published_at: '2025-03-14T10:30:00Z',
        source_name: 'Tech Insider',
        category: 'technology',
        sentiment: 'positive',
        bias_rating: 0,
        match_score: 98
      },
      {
        id: '4',
        title: 'Breakthrough Medical Research Shows Promise for Alzheimer\'s Treatment',
        description: 'A new study published in a leading medical journal reveals potential treatment pathways for Alzheimer\'s disease.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?medical',
        published_at: '2025-03-12T16:20:00Z',
        source_name: 'Health Science Journal',
        category: 'health',
        sentiment: 'positive',
        bias_rating: 0,
        match_score: 95
      },
      {
        id: '7',
        title: 'Archaeological Discovery Reveals Ancient Civilization\'s Advanced Technology',
        description: 'Archaeologists have unearthed artifacts suggesting an ancient civilization possessed surprisingly sophisticated technological knowledge.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?archaeology',
        published_at: '2025-03-10T11:45:00Z',
        source_name: 'Historical Science',
        category: 'science',
        sentiment: 'neutral',
        bias_rating: 0,
        match_score: 91
      },
      {
        id: '9',
        title: 'Artificial Intelligence Transforms Healthcare Diagnostics',
        description: 'New AI-powered diagnostic tools are showing remarkable accuracy in detecting early signs of disease.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?ai-healthcare',
        published_at: '2025-03-08T13:15:00Z',
        source_name: 'Medical Technology Review',
        category: 'technology',
        sentiment: 'positive',
        bias_rating: 0,
        match_score: 90
      }
    ],
    trending: [
      {
        id: '2',
        title: 'New Climate Policy Implemented Across European Union',
        description: 'EU member states have agreed to a comprehensive climate policy aimed at reducing carbon emissions by 60% before 2035.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?climate',
        published_at: '2025-03-13T14:15:00Z',
        source_name: 'European News Network',
        category: 'politics',
        sentiment: 'neutral',
        bias_rating: -2,
        trending_score: 98
      },
      {
        id: '3',
        title: 'Global Markets Respond to Central Bank Interest Rate Decision',
        description: 'Stock markets worldwide showed mixed reactions to the latest interest rate adjustments announced by major central banks.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?finance',
        published_at: '2025-03-14T08:45:00Z',
        source_name: 'Financial Times',
        category: 'business',
        sentiment: 'negative',
        bias_rating: 1,
        trending_score: 95
      },
      {
        id: '10',
        title: 'Renewable Energy Investments Reach Record Highs Globally',
        description: 'Global investment in renewable energy sources has surpassed fossil fuels for the first time in history.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?renewable-energy',
        published_at: '2025-03-07T09:45:00Z',
        source_name: 'Energy Economics',
        category: 'business',
        sentiment: 'positive',
        bias_rating: -1,
        trending_score: 92
      },
      {
        id: '8',
        title: 'International Diplomatic Summit Addresses Global Security Concerns',
        description: 'World leaders gathered to discuss pressing security issues and establish new cooperative frameworks.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?diplomacy',
        published_at: '2025-03-09T15:30:00Z',
        source_name: 'International Affairs',
        category: 'politics',
        sentiment: 'neutral',
        bias_rating: -1,
        trending_score: 90
      }
    ],
    diverse: [
      {
        id: '5',
        title: 'Major Sports League Announces Expansion to New International Markets',
        description: 'One of the world\'s largest sports organizations is set to expand its presence with new teams in Asia and Europe.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?sports',
        published_at: '2025-03-13T12:00:00Z',
        source_name: 'Sports Globe',
        category: 'sports',
        sentiment: 'positive',
        bias_rating: 0,
        diversity_score: 95
      },
      {
        id: '11',
        title: 'Cultural Festival Celebrates Indigenous Art and Traditions',
        description: 'A month-long festival showcasing indigenous art, music, and cultural practices has drawn record attendance.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?indigenous-art',
        published_at: '2025-03-05T14:30:00Z',
        source_name: 'Cultural Heritage Today',
        category: 'entertainment',
        sentiment: 'positive',
        bias_rating: -2,
        diversity_score: 98
      },
      {
        id: '12',
        title: 'Rural Education Initiative Shows Promising Results',
        description: 'A new approach to education in rural communities is helping bridge the achievement gap between urban and rural students.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?rural-education',
        published_at: '2025-03-06T10:15:00Z',
        source_name: 'Education Insights',
        category: 'general',
        sentiment: 'positive',
        bias_rating: 0,
        diversity_score: 92
      },
      {
        id: '6',
        title: 'Entertainment Industry Embraces New Virtual Reality Platforms',
        description: 'Major studios are investing heavily in virtual reality technology to create immersive entertainment experiences.',
        url_to_image: 'https://source.unsplash.com/random/800x600/?virtual-reality',
        published_at: '2025-03-11T09:30:00Z',
        source_name: 'Entertainment Weekly',
        category: 'entertainment',
        sentiment: 'positive',
        bias_rating: 0,
        diversity_score: 88
      }
    ]
  };
  
  return allRecommendations[type] || [];
};

const RecommendationsPrototype = () => {
  const [activeTab, setActiveTab] = useState('forYou');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const [dislikedArticles, setDislikedArticles] = useState([]);

  // Fetch recommendations on component mount and when tab changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          const data = getMockRecommendations(activeTab);
          setRecommendations(data);
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch recommendations. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const handleLikeArticle = (article) => {
    // Remove from disliked if present
    setDislikedArticles(prev => prev.filter(a => a.id !== article.id));
    
    // Add to liked if not already there
    setLikedArticles(prev => {
      if (prev.some(a => a.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const handleDislikeArticle = (article) => {
    // Remove from liked if present
    setLikedArticles(prev => prev.filter(a => a.id !== article.id));
    
    // Add to disliked if not already there
    setDislikedArticles(prev => {
      if (prev.some(a => a.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
    
    // Remove from recommendations
    setRecommendations(prev => prev.filter(a => a.id !== article.id));
  };

  const isArticleSaved = (articleId) => {
    return savedArticles.some(article => article.id === articleId);
  };

  const isArticleLiked = (articleId) => {
    return likedArticles.some(article => article.id === articleId);
  };

  const isArticleDisliked = (articleId) => {
    return dislikedArticles.some(article => article.id === articleId);
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

  // Get score label based on active tab
  const getScoreLabel = (article) => {
    switch (activeTab) {
      case 'forYou':
        return `${article.match_score}% match`;
      case 'trending':
        return `${article.trending_score}% trending`;
      case 'diverse':
        return `${article.diversity_score}% diverse`;
      default:
        return '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personalized Recommendations Prototype
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Discover news articles tailored to your interests and preferences
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab value="forYou" label="For You" />
          <Tab value="trending" label="Trending" />
          <Tab value="diverse" label="Diverse Perspectives" />
        </Tabs>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {activeTab === 'forYou' && 'Recommended based on your reading history'}
          {activeTab === 'trending' && 'Popular articles trending right now'}
          {activeTab === 'diverse' && 'Expand your perspective with diverse viewpoints'}
        </Typography>
        
        <Tooltip title="Refresh recommendations">
          <IconButton onClick={() => setLoading(true)}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((article) => (
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

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={
                      activeTab === 'forYou' ? 'How well this matches your interests' : 
                      activeTab === 'trending' ? 'How popular this article is currently' :
                      'How this article provides a different perspective'
                    }>
                      <Chip 
                        label={getScoreLabel(article)}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Tooltip>
                  </Box>
                </CardContent>
                
                <CardActions>
                  {isArticleSaved(article.id) ? (
                    <Button 
                      size="small" 
                      startIcon={<BookmarkAddedIcon />}
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
                  
                  <Box sx={{ ml: 'auto', display: 'flex' }}>
                    <Tooltip title="I like this">
                      <IconButton 
                        size="small" 
                        color={isArticleLiked(article.id) ? 'success' : 'default'}
                        onClick={() => handleLikeArticle(article)}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Not interested">
                      <IconButton 
                        size="small"
                        color={isArticleDisliked(article.id) ? 'error' : 'default'}
                        onClick={() => handleDislikeArticle(article)}
                      >
                        <ThumbDownIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {recommendations.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">
            No recommendations available.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try refreshing or switching to a different category.
          </Typography>
        </Box>
      )}

      {likedArticles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Articles You Liked
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your feedback helps us improve your recommendations
          </Typography>
          <Grid container spacing={2}>
            {likedArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={`liked-${article.id}`}>
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

export default RecommendationsPrototype;

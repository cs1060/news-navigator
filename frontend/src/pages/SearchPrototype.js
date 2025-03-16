import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  Slider,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Share as ShareIcon,
  FilterAlt as FilterIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Mock search results
const getMockSearchResults = (query, filters = {}) => {
  if (!query || query.trim() === '') return [];
  
  const allArticles = [
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
      bias_rating: 0,
      relevance_score: 0.95
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
      bias_rating: -2,
      relevance_score: 0.87
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
      bias_rating: 1,
      relevance_score: 0.82
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
      bias_rating: 0,
      relevance_score: 0.91
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
      bias_rating: 0,
      relevance_score: 0.78
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
      bias_rating: 0,
      relevance_score: 0.85
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
      bias_rating: 0,
      relevance_score: 0.88
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
      bias_rating: -1,
      relevance_score: 0.79
    },
    {
      id: '9',
      title: 'Artificial Intelligence Transforms Healthcare Diagnostics',
      description: 'New AI-powered diagnostic tools are showing remarkable accuracy in detecting early signs of disease.',
      content: 'Healthcare providers are increasingly adopting artificial intelligence systems to assist with diagnostics. These systems can analyze medical images and patient data to identify patterns that might be missed by human physicians.',
      url: 'https://example.com/ai-healthcare',
      url_to_image: 'https://source.unsplash.com/random/800x600/?ai-healthcare',
      published_at: '2025-03-08T13:15:00Z',
      source_name: 'Medical Technology Review',
      author: 'Dr. Marcus Lee',
      category: 'technology',
      sentiment: 'positive',
      bias_rating: 0,
      relevance_score: 0.92
    },
    {
      id: '10',
      title: 'Renewable Energy Investments Reach Record Highs Globally',
      description: 'Global investment in renewable energy sources has surpassed fossil fuels for the first time in history.',
      content: 'According to a new report, worldwide investments in renewable energy technologies have reached unprecedented levels. Solar and wind power projects are attracting significant capital as countries work to meet climate goals.',
      url: 'https://example.com/renewable-energy',
      url_to_image: 'https://source.unsplash.com/random/800x600/?renewable-energy',
      published_at: '2025-03-07T09:45:00Z',
      source_name: 'Energy Economics',
      author: 'Sophia Rodriguez',
      category: 'business',
      sentiment: 'positive',
      bias_rating: -1,
      relevance_score: 0.86
    }
  ];
  
  // Filter by search query (simple contains check)
  let results = allArticles.filter(article => {
    const searchTerms = query.toLowerCase().split(' ');
    const titleMatches = searchTerms.some(term => 
      article.title.toLowerCase().includes(term)
    );
    const descriptionMatches = searchTerms.some(term => 
      article.description.toLowerCase().includes(term)
    );
    const contentMatches = searchTerms.some(term => 
      article.content.toLowerCase().includes(term)
    );
    
    return titleMatches || descriptionMatches || contentMatches;
  });
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(article => article.category === filters.category);
  }
  
  // Apply date range filter
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    results = results.filter(article => new Date(article.published_at) >= startDate);
  }
  
  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999); // End of day
    results = results.filter(article => new Date(article.published_at) <= endDate);
  }
  
  // Apply sentiment filter
  if (filters.sentiment && filters.sentiment !== 'all') {
    results = results.filter(article => article.sentiment === filters.sentiment);
  }
  
  // Apply bias range filter
  if (filters.biasRange) {
    const [minBias, maxBias] = filters.biasRange;
    results = results.filter(article => 
      article.bias_rating >= minBias && article.bias_rating <= maxBias
    );
  }
  
  // Sort by relevance or date
  if (filters.sortBy === 'relevance') {
    results.sort((a, b) => b.relevance_score - a.relevance_score);
  } else if (filters.sortBy === 'date') {
    results.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  }
  
  return results;
};

const SearchPrototype = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [biasRange, setBiasRange] = useState([-10, 10]);
  const [hasSearched, setHasSearched] = useState(false);

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

  // Sentiment options
  const sentiments = [
    { value: 'all', label: 'All Sentiments' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    // Apply all filters
    const filters = {
      category: selectedCategory,
      startDate,
      endDate,
      sentiment: selectedSentiment,
      biasRange,
      sortBy
    };
    
    // Simulate API call with mock data
    setTimeout(() => {
      const results = getMockSearchResults(searchQuery, filters);
      setSearchResults(results);
      setLoading(false);
    }, 800); // Simulate network delay
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

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleBiasRangeChange = (event, newValue) => {
    setBiasRange(newValue);
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

  // Bias marks for slider
  const biasMarks = [
    { value: -10, label: 'Left' },
    { value: 0, label: 'Neutral' },
    { value: 10, label: 'Right' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          News Search Prototype
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Search for news articles with advanced filtering options
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search for news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mr: 1 }}
          />
          <Button 
            variant="contained" 
            type="submit"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Button 
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Tabs 
            value={sortBy} 
            onChange={(e, newValue) => setSortBy(newValue)}
            aria-label="sort options"
          >
            <Tab value="relevance" label="Sort by Relevance" icon={<TrendingUpIcon />} iconPosition="start" />
            <Tab value="date" label="Sort by Date" icon={<DateRangeIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="sentiment-select-label">Sentiment</InputLabel>
                  <Select
                    labelId="sentiment-select-label"
                    id="sentiment-select"
                    value={selectedSentiment}
                    label="Sentiment"
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                  >
                    {sentiments.map((sentiment) => (
                      <MenuItem key={sentiment.value} value={sentiment.value}>
                        {sentiment.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                    maxDate={endDate}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                    minDate={startDate}
                    maxDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <Typography id="bias-range-slider" gutterBottom>
                  Political Bias Range
                </Typography>
                <Slider
                  value={biasRange}
                  onChange={handleBiasRangeChange}
                  valueLabelDisplay="auto"
                  marks={biasMarks}
                  min={-10}
                  max={10}
                  aria-labelledby="bias-range-slider"
                  valueLabelFormat={(value) => getBiasDescription(value)}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {hasSearched && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} results for "${searchQuery}"` 
                  : `No results found for "${searchQuery}"`}
              </Typography>
              {searchResults.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  Try broadening your search terms or adjusting your filters.
                </Typography>
              )}
            </Box>
          )}

          <Grid container spacing={3}>
            {searchResults.map((article) => (
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
                      <Tooltip title="Relevance score">
                        <Chip 
                          label={`${Math.round(article.relevance_score * 100)}% relevant`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mr: 1 }}
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
        </>
      )}

      {!hasSearched && !loading && (
        <Box sx={{ textAlign: 'center', my: 8, p: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Search for News Articles
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Enter a search term above to find relevant news articles.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the filters to narrow down your search by category, date, sentiment, and political bias.
          </Typography>
        </Box>
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

export default SearchPrototype;

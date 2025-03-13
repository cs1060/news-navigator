import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container, Box, Typography, Grid, Card, CardContent,
  CardActions, Button, Chip, AppBar, Toolbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import {
  Bookmark, Share, Public, Brightness4,
  Brightness7, TrendingUp
} from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [articles, setArticles] = useState([]);
  const [interests, setInterests] = useState([]);
  const [openInterests, setOpenInterests] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [trendingArticles, setTrendingArticles] = useState([]);

  useEffect(() => {
    // Fetch articles based on interests
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/news?categories=' + interests.join(','));
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    // Fetch trending articles
    const fetchTrending = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/trending');
        const data = await response.json();
        setTrendingArticles(data.trending);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      }
    };

    if (interests.length > 0) {
      fetchArticles();
    }
    fetchTrending();
  }, [interests]);

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const getBiasColor = (rating) => {
    if (rating < 0.3) return '#4caf50';
    if (rating < 0.7) return '#ff9800';
    return '#f44336';
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News Navigator
            </Typography>
            <IconButton onClick={() => setOpenInterests(true)} color="inherit">
              <Public />
            </IconButton>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Trending Now <TrendingUp />
            </Typography>
            <Grid container spacing={3}>
              {trendingArticles.map((article) => (
                <Grid item xs={12} md={4} key={article.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.content.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: getBiasColor(article.bias_rating),
                            ml: 'auto',
                          }}
                        >
                          Bias: {(article.bias_rating * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Bookmark />}>
                        Save
                      </Button>
                      <Button size="small" startIcon={<Share />}>
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Your Feed
            </Typography>
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={12} md={4} key={article.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.content.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: getBiasColor(article.bias_rating),
                            ml: 'auto',
                          }}
                        >
                          Bias: {(article.bias_rating * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Bookmark />}>
                        Save
                      </Button>
                      <Button size="small" startIcon={<Share />}>
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        <Dialog open={openInterests} onClose={() => setOpenInterests(false)}>
          <DialogTitle>Your Interests</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onDelete={() => handleRemoveInterest(interest)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Add new interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddInterest();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInterests(false)}>Close</Button>
            <Button onClick={handleAddInterest} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;

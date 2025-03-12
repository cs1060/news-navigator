import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { setArticles, setLoading, setError } from '../store/slices/newsSlice';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.news);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loginDialog, setLoginDialog] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${API_URL}/articles/`);
        dispatch(setArticles(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchArticles();
  }, [dispatch]);

  const handleSaveArticle = async (articleId) => {
    if (!isAuthenticated) {
      setLoginDialog(true);
      return;
    }
    try {
      await axios.post(`${API_URL}/articles/${articleId}/save_article/`);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const getBiasColor = (score) => {
    if (score < 0.3) return 'success';
    if (score < 0.7) return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest News
      </Typography>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.content.substring(0, 150)}...
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={article.category}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    icon={<WarningIcon />}
                    label={`Bias: ${Math.round(article.bias_score * 100)}%`}
                    color={getBiasColor(article.bias_score)}
                    size="small"
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Source: {article.source}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Published: {formatDate(article.published_date)}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<BookmarkIcon />}
                  onClick={() => handleSaveArticle(article.id)}
                >
                  Save
                </Button>
                <Button size="small" startIcon={<ShareIcon />}>
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={loginDialog} onClose={() => setLoginDialog(false)}>
        <DialogTitle>Sign in Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To save articles and customize your news feed, please sign in or create an account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialog(false)}>Cancel</Button>
          <Button onClick={() => navigate('/login')} variant="contained">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;

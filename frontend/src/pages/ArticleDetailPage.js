import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(!location.state?.article);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (article) return;
      
      setLoading(true);
      try {
        // If id is 'external', we don't have the article in our database
        if (id === 'external') {
          setError('Article not found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`/api/articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to fetch article details');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id, article]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!isAuthenticated || !article) return;
      
      try {
        const response = await axios.get('/api/articles');
        const savedArticleIds = response.data.map(item => item._id);
        setIsSaved(savedArticleIds.includes(article._id));
      } catch (err) {
        console.error('Error checking if article is saved:', err);
      }
    };

    checkIfSaved();
  }, [isAuthenticated, article]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!article) return;
      
      try {
        // Get related articles based on category
        const response = await axios.get(`/api/news/search?q=${article.category || 'news'}`);
        // Filter out the current article and limit to 3 articles
        const filtered = response.data
          .filter(item => item.url !== article.url)
          .slice(0, 3);
        
        setRelatedArticles(filtered);
      } catch (err) {
        console.error('Error fetching related articles:', err);
      }
    };

    fetchRelatedArticles();
  }, [article]);

  const handleSaveArticle = async () => {
    if (!isAuthenticated) return;
    
    try {
      await axios.post('/api/articles', article);
      setIsSaved(true);
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article');
    }
  };

  const handleRemoveArticle = async () => {
    if (!isAuthenticated || !article._id) return;
    
    try {
      await axios.delete(`/api/articles/${article._id}`);
      setIsSaved(false);
    } catch (err) {
      console.error('Error removing article:', err);
      setError('Failed to remove article');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBiasClass = (biasRating) => {
    if (biasRating <= -7) return 'bias-left-strong';
    if (biasRating <= -4) return 'bias-left-moderate';
    if (biasRating <= -1) return 'bias-left-slight';
    if (biasRating >= 7) return 'bias-right-strong';
    if (biasRating >= 4) return 'bias-right-moderate';
    if (biasRating >= 1) return 'bias-right-slight';
    return 'bias-neutral';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Article not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {article.urlToImage && (
          <Box 
            component="img"
            src={article.urlToImage}
            alt={article.title}
            sx={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3
            }}
          />
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {article.source?.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </Typography>
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {article.title}
        </Typography>
        
        {article.author && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {article.author}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          {article.category && (
            <Chip 
              label={article.category.charAt(0).toUpperCase() + article.category.slice(1)} 
              size="small" 
              className="category-chip"
            />
          )}
          {article.biasRating !== undefined && (
            <Chip 
              label={article.biasDescription || 'Neutral'} 
              size="small"
              className={`bias-indicator ${getBiasClass(article.biasRating)}`}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {isAuthenticated ? (
            isSaved ? (
              <Button 
                variant="outlined" 
                startIcon={<BookmarkAddedIcon />}
                onClick={handleRemoveArticle}
              >
                Saved
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                startIcon={<BookmarkIcon />}
                onClick={handleSaveArticle}
              >
                Save Article
              </Button>
            )
          ) : (
            <Button 
              variant="outlined" 
              startIcon={<BookmarkIcon />}
              disabled
              title="Login to save articles"
            >
              Save Article
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            Share
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<CopyIcon />}
            onClick={handleCopyLink}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </Box>
        
        {showShareOptions && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FacebookShareButton url={article.url} quote={article.title}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            
            <TwitterShareButton url={article.url} title={article.title}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            
            <LinkedinShareButton url={article.url} title={article.title}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            
            <WhatsappShareButton url={article.url} title={article.title}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        {article.description && (
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {article.description}
          </Typography>
        )}
        
        {article.content ? (
          <Typography variant="body1" paragraph>
            {article.content.replace(/\[\+\d+ chars\]$/, '')}
          </Typography>
        ) : (
          <Box sx={{ my: 3 }}>
            <Alert severity="info">
              Full article content is not available. Click the button below to read the complete article on the original source.
            </Alert>
            <Button 
              variant="contained" 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              Read Full Article
            </Button>
          </Box>
        )}
        
        {article.biasRating !== undefined && (
          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bias Analysis
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  This article has been analyzed for potential bias:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2">Bias Rating:</Typography>
                  <Chip 
                    label={article.biasDescription || 'Neutral'} 
                    size="small"
                    className={`bias-indicator ${getBiasClass(article.biasRating)}`}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Our bias detection algorithm analyzes the source reputation, language patterns, and content to determine potential political leanings. This is meant as a guide to help readers be aware of potential bias, not as a definitive judgment of the article's quality or accuracy.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>
      
      {relatedArticles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Related Articles
          </Typography>
          <Grid container spacing={3}>
            {relatedArticles.map((relatedArticle, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  className="article-card" 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  onClick={() => {
                    navigate(`/article/external`, { state: { article: relatedArticle } });
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {relatedArticle.urlToImage && (
                    <Box 
                      component="img"
                      src={relatedArticle.urlToImage}
                      alt={relatedArticle.title}
                      sx={{ 
                        width: '100%', 
                        height: '140px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {relatedArticle.source?.name}
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                      {relatedArticle.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(relatedArticle.publishedAt), 'MMM d, yyyy')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ArticleDetailPage;

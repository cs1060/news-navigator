import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Link
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
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

const ArticleCard = ({ 
  article, 
  isSaved = false, 
  onSave, 
  onRemove, 
  showActions = true 
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [showShareOptions, setShowShareOptions] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const getBiasClass = (biasRating) => {
    if (biasRating <= -7) return 'bias-left-strong';
    if (biasRating <= -4) return 'bias-left-moderate';
    if (biasRating <= -1) return 'bias-left-slight';
    if (biasRating >= 7) return 'bias-right-strong';
    if (biasRating >= 4) return 'bias-right-moderate';
    if (biasRating >= 1) return 'bias-right-slight';
    return 'bias-neutral';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="article-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {(article.urlToImage || article.url_to_image) && (
        <CardMedia
          component="img"
          height="140"
          image={article.urlToImage || article.url_to_image}
          alt={article.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {article.source?.name || article.source_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(article.publishedAt || article.published_at), 'MMM d, yyyy')}
          </Typography>
        </Box>
        
        <Link 
          component={RouterLink} 
          to={`/article/${article._id || article.id || 'external'}`}
          state={{ article }}
          underline="none" 
          color="inherit"
        >
          <Typography variant="h6" component="div" gutterBottom>
            {article.title}
          </Typography>
        </Link>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {article.description?.substring(0, 120)}
          {article.description?.length > 120 ? '...' : ''}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
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
      </CardContent>
      
      {showActions && (
        <CardActions>
          {isAuthenticated ? (
            isSaved ? (
              <Button 
                size="small" 
                startIcon={<BookmarkAddedIcon />}
                onClick={() => onRemove(article._id || article.id)}
              >
                Saved
              </Button>
            ) : (
              <Button 
                size="small" 
                startIcon={<BookmarkIcon />}
                onClick={() => onSave(article)}
              >
                Save
              </Button>
            )
          ) : (
            <Tooltip title="Login to save articles">
              <span>
                <Button 
                  size="small" 
                  startIcon={<BookmarkIcon />}
                  disabled
                >
                  Save
                </Button>
              </span>
            </Tooltip>
          )}
          
          <Box sx={{ ml: 'auto', display: 'flex' }}>
            <Tooltip title="Share">
              <IconButton 
                size="small" 
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={copied ? "Copied!" : "Copy link"}>
              <IconButton 
                size="small" 
                onClick={handleCopyLink}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      )}
      
      {showShareOptions && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <FacebookShareButton url={article.url} quote={article.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          
          <TwitterShareButton url={article.url} title={article.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          
          <LinkedinShareButton url={article.url} title={article.title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          
          <WhatsappShareButton url={article.url} title={article.title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </Box>
      )}
    </Card>
  );
};

export default ArticleCard;

import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider,
  Box
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

const ArticleList = ({ articles, selectedArticle, onSelectArticle }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Articles
      </Typography>
      {articles.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No articles available
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {articles.map((article, index) => (
            <React.Fragment key={article.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem disablePadding>
                <ListItemButton 
                  selected={selectedArticle?.id === article.id}
                  onClick={() => onSelectArticle(article)}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ArticleIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText 
                    primary={article.title}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" color="text.secondary">
                          Source: {article.source}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Published: {new Date(article.published_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ArticleList;

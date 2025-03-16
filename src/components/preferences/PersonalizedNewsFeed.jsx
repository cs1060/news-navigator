import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const PersonalizedNewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    total: 0
  });

  // Fetch personalized articles
  const fetchArticles = async (offset = 0) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/personalized-articles/?limit=${pagination.limit}&offset=${offset}`);
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError('Failed to load personalized news. Please try again later.');
      setLoading(false);
      console.error('Error fetching personalized articles:', err);
    }
  };

  // Load articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Record user interaction with an article
  const recordInteraction = async (articleId, interactionType) => {
    try {
      await axios.post('/api/interactions/', {
        article_id: articleId,
        interaction_type: interactionType
      });
    } catch (err) {
      console.error(`Error recording ${interactionType} interaction:`, err);
    }
  };

  // Handle article click
  const handleArticleClick = (article) => {
    // Record click interaction
    recordInteraction(article.id, 'click');
    
    // Open article in new tab
    window.open(article.url, '_blank');
  };

  // Handle save article
  const handleSaveArticle = (article, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    recordInteraction(article.id, 'save');
    // You would typically update UI to show it's saved
    alert(`Article "${article.title}" saved to your reading list!`);
  };

  // Handle like/dislike
  const handleReaction = (article, reaction, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    recordInteraction(article.id, reaction);
    // You would typically update UI to show the reaction
    alert(`You ${reaction}d this article!`);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    fetchArticles(newOffset);
  };

  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      fetchArticles(newOffset);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Determine bias indicator (this would be replaced with actual bias detection)
  const getBiasIndicator = (article) => {
    // This is a placeholder - in a real app, you'd have actual bias detection
    const sources = {
      'CNN': 'left',
      'Fox News': 'right',
      'BBC': 'center',
      'Reuters': 'center',
      'MSNBC': 'left',
      'Breitbart': 'right'
    };
    
    return sources[article.source] || 'unknown';
  };

  // Render bias badge
  const renderBiasBadge = (article) => {
    const bias = getBiasIndicator(article);
    let variant = 'secondary';
    
    if (bias === 'left') variant = 'info';
    if (bias === 'right') variant = 'danger';
    if (bias === 'center') variant = 'success';
    
    return <Badge bg={variant}>{bias.toUpperCase()}</Badge>;
  };

  if (loading && articles.length === 0) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Personalizing your news feed...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Your Personalized News Feed</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {articles.length === 0 && !loading ? (
        <Alert variant="info">
          No personalized articles found. Try updating your preferences or browse general news.
        </Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {articles.map((article, idx) => (
              <Col key={idx}>
                <Card 
                  className="h-100 news-card" 
                  onClick={() => handleArticleClick(article)}
                  style={{ cursor: 'pointer' }}
                >
                  {article.image && (
                    <Card.Img 
                      variant="top" 
                      src={article.image} 
                      alt={article.title}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg="primary">{article.category}</Badge>
                      {renderBiasBadge(article)}
                    </div>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {article.description?.substring(0, 120)}
                      {article.description?.length > 120 ? '...' : ''}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {article.source} • {formatDate(article.published_at)}
                    </small>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={(e) => handleSaveArticle(article, e)}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="me-1"
                        onClick={(e) => handleReaction(article, 'like', e)}
                      >
                        👍
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={(e) => handleReaction(article, 'dislike', e)}
                      >
                        👎
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-primary" 
              disabled={pagination.offset === 0 || loading}
              onClick={handlePrevPage}
            >
              Previous
            </Button>
            <div className="text-muted">
              Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <Button 
              variant="outline-primary" 
              disabled={pagination.offset + pagination.limit >= pagination.total || loading}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default PersonalizedNewsFeed;

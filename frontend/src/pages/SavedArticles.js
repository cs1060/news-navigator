import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { FaBookmark, FaTrash, FaShare } from 'react-icons/fa';

const SavedArticles = ({ savedArticles = [], onRemoveArticle }) => {
  const [articles, setArticles] = useState(savedArticles);
  
  // Handle remove article
  const handleRemoveArticle = (articleId) => {
    if (onRemoveArticle) {
      onRemoveArticle(articleId);
      setArticles(articles.filter(article => article.id !== articleId));
    }
  };

  // Render bias indicator
  const renderBiasIndicator = (biasRating) => {
    let biasClass = 'bias-center';
    let biasText = 'Center';
    
    if (biasRating <= -3) {
      biasClass = 'bias-left';
      biasText = 'Left';
    } else if (biasRating >= 3) {
      biasClass = 'bias-right';
      biasText = 'Right';
    }
    
    return (
      <Badge className={`bias-indicator ${biasClass}`}>
        <i className="fas fa-balance-scale me-1"></i> {biasText}
      </Badge>
    );
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <FaBookmark className="me-2" /> Saved Articles
          </h2>
          <p className="text-muted">
            Your collection of saved news articles
          </p>
        </Col>
      </Row>
      
      {articles.length === 0 ? (
        <Alert variant="info">
          <p className="mb-0">You haven't saved any articles yet.</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {articles.map(article => (
            <Col key={article.id}>
              <Card className="news-card h-100">
                <Card.Img 
                  variant="top" 
                  src={article.image_url} 
                  alt={article.title}
                  className="news-card-img"
                />
                <Card.Body className="news-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <Badge className={`category-badge category-${article.category}`}>
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Badge>
                    {renderBiasIndicator(article.bias_rating)}
                  </div>
                  <Card.Title className="news-card-title">{article.title}</Card.Title>
                  <Card.Text className="news-card-text">
                    {article.description.substring(0, 120)}...
                  </Card.Text>
                  <div className="source-info mb-2">
                    <small className="text-muted">
                      Source: {article.source}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(article.published_at).toLocaleDateString()}
                    </small>
                    <div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleRemoveArticle(article.id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <FaShare />
                      </Button>
                      <Button variant="primary" size="sm">
                        Read
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {articles.length > 0 && (
        <Row className="mt-4">
          <Col className="text-center">
            <p className="text-muted">
              You have {articles.length} saved article{articles.length !== 1 ? 's' : ''}.
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SavedArticles;

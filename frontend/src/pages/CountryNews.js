import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowLeft, FaFilter, FaBookmark, FaShare, FaChartLine } from 'react-icons/fa';

const CountryNews = ({ onSaveArticle }) => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  
  // Fetch country news data
  useEffect(() => {
    const fetchCountryNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5001/api/country-news/${countryCode}?category=${selectedCategory}`
        );
        setArticles(response.data.articles);
        setFilteredArticles(response.data.articles);
        setCountry(response.data.country);
        setSummary(response.data.summary);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load news for country code: ${countryCode}`);
        setLoading(false);
        console.error('Error fetching country news:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCountryNews();
    fetchCategories();
  }, [countryCode, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle save article
  const handleSaveArticle = (article) => {
    if (onSaveArticle) {
      onSaveArticle(article);
      // Show a temporary success message (in a real app)
      alert(`Article "${article.title}" saved successfully!`);
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

  // Render source reliability indicator
  const renderReliabilityIndicator = (reliability) => {
    let variant = 'secondary';
    
    if (reliability >= 8) {
      variant = 'success';
    } else if (reliability >= 5) {
      variant = 'info';
    } else if (reliability >= 3) {
      variant = 'warning';
    } else {
      variant = 'danger';
    }
    
    return (
      <Badge bg={variant} className="me-1">
        Reliability: {reliability}/10
      </Badge>
    );
  };

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to World Map
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading country news...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <h2>{country?.name} News</h2>
              <p className="text-muted">
                Latest news and updates from {country?.name}
              </p>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">
                    <FaChartLine className="me-2" /> Summary of Key Events
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{summary}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={3}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <FaFilter className="me-2" /> Filters
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      value={selectedCategory} 
                      onChange={handleCategoryChange}
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Source Reliability</Form.Label>
                    <Form.Range min="1" max="10" defaultValue="1" />
                    <div className="d-flex justify-content-between">
                      <small>Low</small>
                      <small>High</small>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Political Bias</Form.Label>
                    <Form.Range min="-5" max="5" defaultValue="0" />
                    <div className="d-flex justify-content-between">
                      <small>Left</small>
                      <small>Center</small>
                      <small>Right</small>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Date Range</Form.Label>
                    <Form.Control type="date" className="mb-2" placeholder="From" />
                    <Form.Control type="date" placeholder="To" />
                  </Form.Group>
                  
                  <Button variant="primary" className="w-100">
                    Apply Filters
                  </Button>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Country Information</h5>
                </Card.Header>
                <Card.Body>
                  {country && (
                    <>
                      <p><strong>Region:</strong> {country.region}</p>
                      <p><strong>Capital:</strong> {country.capital}</p>
                      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                      <p><strong>News Activity:</strong> 
                        <Badge 
                          bg={country.activity_level === 'high' ? 'danger' : 
                             (country.activity_level === 'medium' ? 'warning' : 'success')}
                          className="ms-2"
                        >
                          {country.activity_level.charAt(0).toUpperCase() + country.activity_level.slice(1)}
                        </Badge>
                      </p>
                      <p className="mb-0"><strong>Article Count:</strong> {country.article_count}</p>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={9}>
              {filteredArticles.length === 0 ? (
                <Alert variant="info">
                  No articles found for the selected category in {country?.name}.
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {filteredArticles.map(article => (
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
                            <div className="mt-1">
                              {renderReliabilityIndicator(article.source_reliability)}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(article.published_at).toLocaleDateString()}
                            </small>
                            <div>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleSaveArticle(article)}
                              >
                                <FaBookmark />
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
              
              {filteredArticles.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary">Load More</Button>
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CountryNews;

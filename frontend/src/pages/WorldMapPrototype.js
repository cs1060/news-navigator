import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import { FaNewspaper, FaGlobeAmericas, FaFilter, FaChartLine } from 'react-icons/fa';

// Fix Leaflet icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const WorldMapPrototype = () => {
  const history = useHistory();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch world news data
  useEffect(() => {
    const fetchWorldNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/world-news');
        setCountries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load world news data');
        setLoading(false);
        console.error('Error fetching world news:', err);
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

    const fetchTrendingTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/trending');
        setTrendingTopics(response.data.slice(0, 5)); // Get top 5 trending topics
      } catch (err) {
        console.error('Error fetching trending topics:', err);
      }
    };

    fetchWorldNews();
    fetchCategories();
    fetchTrendingTopics();
  }, []);

  // Fetch country news when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchCountryNews = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/country-news/${selectedCountry.code}?category=${selectedCategory}`
          );
          setSelectedCountry({
            ...selectedCountry,
            news: response.data
          });
        } catch (err) {
          console.error('Error fetching country news:', err);
        }
      };

      fetchCountryNews();
    }
  }, [selectedCountry?.code, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Navigate to country news page
  const goToCountryNews = (countryCode) => {
    history.push(`/country/${countryCode}`);
  };

  // Get marker color based on activity level
  const getMarkerColor = (activityLevel) => {
    switch (activityLevel) {
      case 'high':
        return '#dc3545'; // Red
      case 'medium':
        return '#fd7e14'; // Orange
      case 'low':
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Gray
    }
  };

  // Get marker radius based on article count
  const getMarkerRadius = (articleCount) => {
    const baseSize = 8;
    if (articleCount > 20) return baseSize + 12;
    if (articleCount > 10) return baseSize + 8;
    if (articleCount > 5) return baseSize + 4;
    return baseSize;
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
    <Container fluid className="mt-3">
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaGlobeAmericas className="me-2" /> Interactive World News Map
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="filter-section mb-3">
                <Form.Group>
                  <Form.Label className="filter-title">
                    <FaFilter className="me-2" /> Filter by Category
                  </Form.Label>
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={handleCategoryChange}
                    className="form-select-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading world news data...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="map-container">
                  <MapContainer 
                    center={[20, 0]} 
                    zoom={2} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {countries.map(country => (
                      <CircleMarker
                        key={country.code}
                        center={[country.lat, country.lng]}
                        radius={getMarkerRadius(country.article_count)}
                        pathOptions={{
                          fillColor: getMarkerColor(country.activity_level),
                          color: getMarkerColor(country.activity_level),
                          fillOpacity: 0.7,
                          weight: 2
                        }}
                        eventHandlers={{
                          click: () => setSelectedCountry(country)
                        }}
                      >
                        <Popup>
                          <div>
                            <h6>{country.name}</h6>
                            <p className="mb-1">
                              <Badge bg={country.activity_level === 'high' ? 'danger' : (country.activity_level === 'medium' ? 'warning' : 'success')}>
                                {country.activity_level.charAt(0).toUpperCase() + country.activity_level.slice(1)} Activity
                              </Badge>
                              <Badge bg="info" className="ms-1">{country.article_count} Articles</Badge>
                            </p>
                            <Button 
                              size="sm" 
                              variant="primary" 
                              onClick={() => goToCountryNews(country.code)}
                            >
                              View News
                            </Button>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              )}
              
              <div className="map-legend mt-3">
                <p className="mb-1"><strong>Activity Level:</strong></p>
                <div className="d-flex">
                  <div className="me-3">
                    <span className="badge rounded-pill bg-success me-1"></span> Low
                  </div>
                  <div className="me-3">
                    <span className="badge rounded-pill bg-warning me-1"></span> Medium
                  </div>
                  <div>
                    <span className="badge rounded-pill bg-danger me-1"></span> High
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {selectedCountry && selectedCountry.news && (
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-secondary text-white">
                <h5 className="mb-0">News from {selectedCountry.name}</h5>
              </Card.Header>
              <Card.Body>
                <div className="country-summary mb-3">
                  <h6>Summary of Key Events:</h6>
                  <p className="mb-0">{selectedCountry.news.summary}</p>
                </div>
                
                <h6>Top Stories:</h6>
                <Row xs={1} md={2} className="g-3">
                  {selectedCountry.news.articles.slice(0, 4).map(article => (
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
                            {article.description.substring(0, 100)}...
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(article.published_at).toLocaleDateString()}
                            </small>
                            <Button variant="outline-primary" size="sm">
                              Read More
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                
                <div className="text-center mt-3">
                  <Button 
                    variant="primary" 
                    onClick={() => goToCountryNews(selectedCountry.code)}
                  >
                    View All News from {selectedCountry.name}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <FaChartLine className="me-2" /> Trending Topics
              </h5>
            </Card.Header>
            <Card.Body>
              {trendingTopics.length > 0 ? (
                <div>
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="trending-topic">
                      <h6 className="trending-topic-title">{topic.keyword}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="trending-topic-count">
                          {topic.count} articles
                        </span>
                        <Button variant="link" size="sm" className="p-0">
                          View Articles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-3">Loading trending topics...</p>
              )}
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <FaNewspaper className="me-2" /> Latest News
              </h5>
            </Card.Header>
            <Card.Body>
              {countries.length > 0 ? (
                <div>
                  {countries
                    .filter(country => country.top_articles && country.top_articles.length > 0)
                    .slice(0, 3)
                    .map(country => (
                      <div key={country.code} className="mb-3">
                        <h6 className="mb-2">{country.name}</h6>
                        {country.top_articles.slice(0, 1).map(article => (
                          <Card key={article.id} className="news-card">
                            <Card.Body className="news-card-body p-2">
                              <div className="d-flex justify-content-between mb-1">
                                <Badge className={`category-badge category-${article.category}`}>
                                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                                </Badge>
                                {renderBiasIndicator(article.bias_rating)}
                              </div>
                              <Card.Title className="news-card-title fs-6">{article.title}</Card.Title>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {new Date(article.published_at).toLocaleDateString()}
                                </small>
                                <Button variant="link" size="sm" className="p-0">
                                  Read
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-3">Loading latest news...</p>
              )}
              
              <div className="text-center mt-2">
                <Button variant="outline-success" size="sm">
                  View All Latest News
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WorldMapPrototype;

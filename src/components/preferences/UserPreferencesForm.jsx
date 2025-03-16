import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const UserPreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    interests: [],
    preferred_categories: [],
    preferred_sources: [],
    excluded_sources: [],
    preferred_countries: []
  });
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Available options for categories and countries
  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'in', name: 'India' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
    { code: 'cn', name: 'China' },
    { code: 'ru', name: 'Russia' }
  ];

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/preferences/');
        setPreferences(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your preferences. Please try again later.');
        setLoading(false);
        console.error('Error fetching preferences:', err);
      }
    };

    fetchPreferences();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/preferences/', preferences);
      setSuccess(true);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to save your preferences. Please try again.');
      setLoading(false);
      console.error('Error saving preferences:', err);
    }
  };

  // Add a new interest
  const addInterest = () => {
    if (newInterest.trim() && !preferences.interests.includes(newInterest.trim())) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  // Remove an interest
  const removeInterest = (interest) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter(i => i !== interest)
    });
  };

  // Handle checkbox change for categories
  const handleCategoryChange = (category) => {
    if (preferences.preferred_categories.includes(category)) {
      setPreferences({
        ...preferences,
        preferred_categories: preferences.preferred_categories.filter(c => c !== category)
      });
    } else {
      setPreferences({
        ...preferences,
        preferred_categories: [...preferences.preferred_categories, category]
      });
    }
  };

  // Handle checkbox change for countries
  const handleCountryChange = (countryCode) => {
    if (preferences.preferred_countries.includes(countryCode)) {
      setPreferences({
        ...preferences,
        preferred_countries: preferences.preferred_countries.filter(c => c !== countryCode)
      });
    } else {
      setPreferences({
        ...preferences,
        preferred_countries: [...preferences.preferred_countries, countryCode]
      });
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading your preferences...</div>;
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h4">Your News Preferences</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Preferences saved successfully!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label as="h5">Topics of Interest</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add a topic of interest (e.g., climate change, artificial intelligence)"
                />
                <Button variant="primary" className="ms-2" onClick={addInterest}>Add</Button>
              </div>
              
              <div className="d-flex flex-wrap">
                {preferences.interests.map((interest, index) => (
                  <div key={index} className="bg-light rounded-pill py-1 px-3 me-2 mb-2 d-flex align-items-center">
                    {interest}
                    <Button 
                      variant="link" 
                      className="p-0 ms-2 text-danger" 
                      onClick={() => removeInterest(interest)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label as="h5">News Categories</Form.Label>
              <div className="d-flex flex-wrap">
                {categories.map((category) => (
                  <Form.Check
                    key={category}
                    type="checkbox"
                    id={`category-${category}`}
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    className="me-3 mb-2"
                    checked={preferences.preferred_categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label as="h5">Preferred Countries</Form.Label>
              <div className="d-flex flex-wrap">
                {countries.map((country) => (
                  <Form.Check
                    key={country.code}
                    type="checkbox"
                    id={`country-${country.code}`}
                    label={country.name}
                    className="me-3 mb-2"
                    checked={preferences.preferred_countries.includes(country.code)}
                    onChange={() => handleCountryChange(country.code)}
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserPreferencesForm;

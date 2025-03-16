import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaEdit, FaSave, FaNewspaper } from 'react-icons/fa';

const UserProfile = ({ user, interests = [], onUpdateInterests }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState(interests);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [successMessage, setSuccessMessage] = useState('');
  
  // All available categories/interests
  const allInterests = [
    'politics', 'business', 'technology', 'health', 
    'science', 'sports', 'entertainment', 'environment',
    'education', 'economy', 'world', 'opinion'
  ];
  
  // Handle interest selection
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedInterests([...selectedInterests, value]);
    } else {
      setSelectedInterests(selectedInterests.filter(interest => interest !== value));
    }
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    if (onUpdateInterests) {
      onUpdateInterests(selectedInterests);
    }
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <FaUser className="me-2" /> User Profile
          </h2>
          <p className="text-muted">
            Manage your account and preferences
          </p>
        </Col>
      </Row>
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      
      {!user ? (
        <Alert variant="info">
          <p className="mb-0">Please log in to view your profile.</p>
        </Alert>
      ) : (
        <Row>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Account Information</h5>
              </Card.Header>
              <Card.Body>
                {editMode ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed.
                      </Form.Text>
                    </Form.Group>
                  </Form>
                ) : (
                  <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                )}
                
                <div className="mt-3">
                  {editMode ? (
                    <Button 
                      variant="success" 
                      onClick={handleSaveProfile}
                      className="w-100"
                    >
                      <FaSave className="me-2" /> Save Changes
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => setEditMode(true)}
                      className="w-100"
                    >
                      <FaEdit className="me-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FaNewspaper className="me-2" /> News Statistics
                </h5>
              </Card.Header>
              <Card.Body>
                <p><strong>Articles Read:</strong> 42</p>
                <p><strong>Saved Articles:</strong> 15</p>
                <p><strong>Shared Articles:</strong> 7</p>
                <p><strong>Most Read Category:</strong> Technology</p>
                <p className="mb-0"><strong>Bias Preference:</strong> Slightly Left</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">News Interests</h5>
              </Card.Header>
              <Card.Body>
                {editMode ? (
                  <Form>
                    <p className="mb-3">Select categories you're interested in:</p>
                    <Row xs={1} md={2} lg={3}>
                      {allInterests.map(interest => (
                        <Col key={interest} className="mb-2">
                          <Form.Check 
                            type="checkbox"
                            id={`interest-${interest}`}
                            label={interest.charAt(0).toUpperCase() + interest.slice(1)}
                            value={interest}
                            checked={selectedInterests.includes(interest)}
                            onChange={handleInterestChange}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Form>
                ) : (
                  <div>
                    <p className="mb-3">Your selected news interests:</p>
                    {selectedInterests.length > 0 ? (
                      <div className="d-flex flex-wrap">
                        {selectedInterests.map(interest => (
                          <span 
                            key={interest} 
                            className="badge bg-primary p-2 m-1"
                          >
                            {interest.charAt(0).toUpperCase() + interest.slice(1)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No interests selected yet.</p>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Card className="mt-4 shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">Notification Preferences</h5>
              </Card.Header>
              <Card.Body>
                {editMode ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="email-notifications"
                        label="Email Notifications"
                        defaultChecked
                      />
                      <Form.Text className="text-muted">
                        Receive daily news digests based on your interests.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="breaking-news"
                        label="Breaking News Alerts"
                        defaultChecked
                      />
                      <Form.Text className="text-muted">
                        Get notified about major breaking news events.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="weekly-summary"
                        label="Weekly Summary"
                        defaultChecked
                      />
                      <Form.Text className="text-muted">
                        Receive a weekly summary of top news stories.
                      </Form.Text>
                    </Form.Group>
                  </Form>
                ) : (
                  <div>
                    <p><strong>Email Notifications:</strong> Enabled</p>
                    <p><strong>Breaking News Alerts:</strong> Enabled</p>
                    <p className="mb-0"><strong>Weekly Summary:</strong> Enabled</p>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Card className="mt-4 shadow-sm">
              <Card.Header className="bg-danger text-white">
                <h5 className="mb-0">Account Actions</h5>
              </Card.Header>
              <Card.Body>
                <Button variant="outline-secondary" className="me-2">
                  Download My Data
                </Button>
                <Button variant="outline-danger">
                  Delete Account
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserProfile;

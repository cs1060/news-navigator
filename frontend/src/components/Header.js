import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { FaGlobeAmericas, FaNewspaper, FaBookmark, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ user, onLogin, onLogout }) => {
  const history = useHistory();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', interests: [] });
  
  // Handle login form change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };
  
  // Handle signup form change
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };
  
  // Handle interest selection
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSignupForm({ ...signupForm, interests: [...signupForm.interests, value] });
    } else {
      setSignupForm({ 
        ...signupForm, 
        interests: signupForm.interests.filter(interest => interest !== value) 
      });
    }
  };
  
  // Handle login submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Mock login - in a real app, this would call an API
    onLogin({ 
      id: 1, 
      name: 'Demo User', 
      email: loginForm.email 
    });
    setShowLoginModal(false);
    history.push('/news-feed');
  };
  
  // Handle signup submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Mock signup - in a real app, this would call an API
    onLogin({ 
      id: 1, 
      name: signupForm.name, 
      email: signupForm.email,
      interests: signupForm.interests
    });
    setShowSignupModal(false);
    history.push('/news-feed');
  };
  
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FaGlobeAmericas className="me-2" />
            News Navigator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                <FaGlobeAmericas className="me-1" /> World Map
              </Nav.Link>
              <Nav.Link as={Link} to="/news-feed">
                <FaNewspaper className="me-1" /> News Feed
              </Nav.Link>
              {user && (
                <Nav.Link as={Link} to="/saved-articles">
                  <FaBookmark className="me-1" /> Saved Articles
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    <FaUser className="me-1" /> {user.name}
                  </Nav.Link>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={onLogout}
                    className="ms-2"
                  >
                    <FaSignOutAlt className="me-1" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={() => setShowLoginModal(true)}
                    className="me-2"
                  >
                    <FaSignInAlt className="me-1" /> Login
                  </Button>
                  <Button 
                    variant="light" 
                    size="sm" 
                    onClick={() => setShowSignupModal(true)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Enter email" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Password" 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-center w-100 mb-0">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => {
                setShowLoginModal(false);
                setShowSignupModal(true);
              }}
            >
              Sign up
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
      
      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create an Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={signupForm.name}
                onChange={handleSignupChange}
                placeholder="Enter your name" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="Enter email" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                placeholder="Password" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select your interests</Form.Label>
              <div>
                {['politics', 'business', 'technology', 'health', 'science', 'sports', 'entertainment'].map(interest => (
                  <Form.Check 
                    key={interest}
                    type="checkbox"
                    id={`interest-${interest}`}
                    label={interest.charAt(0).toUpperCase() + interest.slice(1)}
                    value={interest}
                    onChange={handleInterestChange}
                    checked={signupForm.interests.includes(interest)}
                    className="mb-1"
                  />
                ))}
              </div>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-center w-100 mb-0">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => {
                setShowSignupModal(false);
                setShowLoginModal(true);
              }}
            >
              Login
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;

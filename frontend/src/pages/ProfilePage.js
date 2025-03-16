import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import AuthContext from '../context/AuthContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const interestOptions = [
  'politics',
  'technology',
  'business',
  'health',
  'science',
  'sports',
  'entertainment',
  'world'
];

const ProfilePage = () => {
  const { user, updateProfile, error: authError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    interests: [],
    preferences: {
      factBasedReporting: true,
      biasAlerts: true
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        interests: user.interests || [],
        preferences: {
          factBasedReporting: user.preferences?.factBasedReporting !== undefined ? user.preferences.factBasedReporting : true,
          biasAlerts: user.preferences?.biasAlerts !== undefined ? user.preferences.biasAlerts : true
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear success message when user makes changes
    if (success) {
      setSuccess(false);
    }
  };

  const handleInterestsChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      interests: typeof value === 'string' ? value.split(',') : value,
    });
    
    if (success) {
      setSuccess(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: checked
      }
    });
    
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccess(false);
    
    const result = await updateProfile(formData);
    
    setIsSubmitting(false);
    
    if (result) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Manage your account settings and preferences
          </Typography>
        </Box>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}
        
        {authError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {authError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                value={user.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                News Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="interests-label">Your Interests</InputLabel>
                <Select
                  labelId="interests-label"
                  id="interests"
                  multiple
                  name="interests"
                  value={formData.interests}
                  onChange={handleInterestsChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Your Interests" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value.charAt(0).toUpperCase() + value.slice(1)} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {interestOptions.map((interest) => (
                    <MenuItem
                      key={interest}
                      value={interest}
                    >
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Content Preferences
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.preferences.factBasedReporting}
                        onChange={handlePreferenceChange}
                        name="factBasedReporting"
                      />
                    }
                    label="Prioritize fact-based reporting over opinion pieces"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.preferences.biasAlerts}
                        onChange={handlePreferenceChange}
                        name="biasAlerts"
                      />
                    }
                    label="Show bias alerts on articles"
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;

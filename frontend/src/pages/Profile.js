import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { setInterests } from '../store/slices/authSlice';

const AVAILABLE_INTERESTS = [
  'Technology',
  'Politics',
  'Business',
  'Science',
  'Health',
  'Entertainment',
  'Sports',
  'Environment',
  'Education',
  'World News',
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, interests } = useSelector((state) => state.auth);
  const { savedArticles } = useSelector((state) => state.news);
  const [selectedInterests, setSelectedInterests] = useState(interests);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = () => {
    dispatch(setInterests(selectedInterests));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Settings
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Welcome back, {user?.username}!
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Interests
            </Typography>
            <Box sx={{ mb: 2 }}>
              {AVAILABLE_INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => handleInterestToggle(interest)}
                  color={selectedInterests.includes(interest) ? 'primary' : 'default'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <Button
              variant="contained"
              onClick={handleSaveInterests}
              sx={{ mt: 2 }}
            >
              Save Interests
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Saved Articles
          </Typography>
          <Grid container spacing={2}>
            {savedArticles.map((article) => (
              <Grid item xs={12} md={6} key={article.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {article.source}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;

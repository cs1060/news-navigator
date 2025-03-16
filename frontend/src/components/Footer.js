import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              News Navigator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Providing transparent and unbiased news from multiple sources.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Features
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/" color="inherit">Home</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/world-map" color="inherit">World Map</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/saved-articles" color="inherit">Saved Articles</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">Privacy Policy</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">Terms of Service</Link>
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' News Navigator. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

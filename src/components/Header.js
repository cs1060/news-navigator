import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';

const Header = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <SummarizeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Article Summary App
        </Typography>
        <Box>
          <Typography variant="subtitle2" component="div">
            Prototype 2: React + Material UI
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

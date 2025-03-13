import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Container, Grid, VStack } from '@chakra-ui/react';
import InterestSelector from './components/InterestSelector';
import NewsFeed from './components/NewsFeed';
import NewsMap from './components/NewsMap';
import theme from './theme';

function App() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Initialize demo data when the app starts
    fetch('http://localhost:8000/api/init-demo/', {
      method: 'GET',
    });
  }, []);

  useEffect(() => {
    // Fetch articles based on selected interests
    const queryParams = selectedInterests.map(id => `interests=${id}`).join('&');
    fetch(`http://localhost:8000/api/articles/?${queryParams}`)
      .then(response => response.json())
      .then(data => setArticles(data));
  }, [selectedInterests]);

  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.50" minH="100vh" py={5}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
            <InterestSelector
              selectedInterests={selectedInterests}
              onInterestsChange={setSelectedInterests}
            />
            <VStack spacing={6} align="stretch">
              <NewsMap articles={articles} />
              <NewsFeed articles={articles} />
            </VStack>
          </Grid>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;

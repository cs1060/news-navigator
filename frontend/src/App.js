import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  SimpleGrid,
  useToast,
  Container,
  Tag,
  TagLabel,
  TagCloseButton,
  Card,
  CardBody,
  Image,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { theme } from './theme';

function App() {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [articles, setArticles] = useState([]);
  const toast = useToast();

  // Simulated articles data for prototype
  const sampleArticles = [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement",
      summary: "195 countries agree to reduce emissions by 50% by 2030.",
      source: "Global News Network",
      category: "Environment",
      bias_rating: 0.1,
      image_url: "https://via.placeholder.com/300x200?text=Climate+Summit"
    },
    {
      id: 2,
      title: "Tech Innovation Revolutionizes Healthcare",
      summary: "New AI system achieves 95% accuracy in early disease detection.",
      source: "Tech Daily",
      category: "Technology",
      bias_rating: -0.2,
      image_url: "https://via.placeholder.com/300x200?text=Healthcare+Tech"
    },
    // More sample articles can be added here
  ];

  useEffect(() => {
    // In a real app, this would fetch from the backend
    setArticles(sampleArticles);
  }, []);

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
      toast({
        title: "Interest added",
        description: `${newInterest} has been added to your interests.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const getBiasColor = (rating) => {
    if (rating > 0.3) return "red.500";
    if (rating < -0.3) return "blue.500";
    return "green.500";
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
              News Navigator
            </Heading>

            {/* Interests Section */}
            <Box bg="white" p={6} borderRadius="lg" shadow="base">
              <Heading as="h2" size="lg" mb={4}>
                Your Interests
              </Heading>
              <VStack spacing={4}>
                <Box w="100%">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add a new interest (e.g., Technology, Environment)"
                    size="lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    aria-label="Add new interest"
                  />
                  <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={handleAddInterest}
                    isDisabled={!newInterest.trim()}
                    w="100%"
                  >
                    Add Interest
                  </Button>
                </Box>
                <Box w="100%">
                  {interests.map((interest) => (
                    <Tag
                      key={interest}
                      size="lg"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      m={1}
                    >
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveInterest(interest)}
                        aria-label={`Remove ${interest} from interests`}
                      />
                    </Tag>
                  ))}
                </Box>
              </VStack>
            </Box>

            {/* News Articles Section */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Recommended News
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {articles.map((article) => (
                  <Card key={article.id} maxW="md" role="article">
                    <CardBody>
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        borderRadius="lg"
                        mb={4}
                      />
                      <Stack spacing={3}>
                        <Heading size="md">{article.title}</Heading>
                        <Text py={2}>{article.summary}</Text>
                        <Box>
                          <Tag colorScheme="gray" mr={2}>
                            {article.source}
                          </Tag>
                          <Tag colorScheme="blue">
                            {article.category}
                          </Tag>
                        </Box>
                        <Text
                          color={getBiasColor(article.bias_rating)}
                          fontSize="sm"
                        >
                          Bias Rating: {article.bias_rating > 0 ? '+' : ''}{article.bias_rating}
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;

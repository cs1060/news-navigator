import React from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Spacer,
  Icon,
} from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

function getBiasColor(rating) {
  if (rating < -0.3) return 'red';
  if (rating > 0.3) return 'blue';
  return 'green';
}

function NewsFeed({ articles }) {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg" mb={2}>Latest News</Heading>
      {articles.map(article => (
        <Box
          key={article.id}
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
        >
          <HStack spacing={4} mb={2}>
            <Badge colorScheme={getBiasColor(article.bias_rating)}>
              Bias Rating: {article.bias_rating}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {new Date(article.published_date).toLocaleDateString()}
            </Text>
            <Spacer />
            {article.location && (
              <HStack spacing={1}>
                <Icon as={FaMapMarkerAlt} color="gray.500" />
                <Text fontSize="sm" color="gray.500">{article.location}</Text>
              </HStack>
            )}
          </HStack>
          
          <Heading size="md" mb={2}>{article.title}</Heading>
          <Text color="gray.600" mb={3}>{article.content}</Text>
          
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.500">Source:</Text>
            <Text fontSize="sm" fontWeight="medium">{article.source}</Text>
            <Spacer />
            <HStack spacing={2}>
              {article.interests.map(interest => (
                <Badge key={interest.id} colorScheme="purple" variant="subtle">
                  {interest.name}
                </Badge>
              ))}
            </HStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}

export default NewsFeed;

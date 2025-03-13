import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Checkbox,
  CheckboxGroup,
  Skeleton
} from '@chakra-ui/react';

function InterestSelector({ selectedInterests, onInterestsChange }) {
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/interests/')
      .then(response => response.json())
      .then(data => {
        setInterests(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="sm"
      position="sticky"
      top="20px"
    >
      <Heading size="md" mb={4}>Areas of Interest</Heading>
      {isLoading ? (
        <VStack align="stretch" spacing={3}>
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} height="24px" />
          ))}
        </VStack>
      ) : (
        <CheckboxGroup
          colorScheme="blue"
          value={selectedInterests}
          onChange={onInterestsChange}
        >
          <VStack align="start" spacing={3}>
            {interests.map(interest => (
              <Checkbox
                key={interest.id}
                value={interest.id.toString()}
                fontSize="sm"
              >
                {interest.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      )}
    </Box>
  );
}

export default InterestSelector;

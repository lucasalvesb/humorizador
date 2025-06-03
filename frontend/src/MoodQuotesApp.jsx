import React, { useState, useEffect } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  SimpleGrid, 
  Spinner,
  Center
} from '@chakra-ui/react';
import { FiRefreshCw, FiHeart, FiSun, FiAlertCircle } from 'react-icons/fi';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:5102';

const MoodQuotesApp = () => {
  const [moodTypes, setMoodTypes] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moodTypesLoading, setMoodTypesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mood types on component mount
  useEffect(() => {
    fetchMoodTypes();
  }, []);

  const fetchMoodTypes = async () => {
    try {
      setMoodTypesLoading(true);
      const response = await fetch(`${API_BASE_URL}/mood-types`);
      if (!response.ok) throw new Error('Failed to fetch mood types');
      const data = await response.json();
      setMoodTypes(data);
    } catch (err) {
      setError('Unable to load mood types. Please make sure the API is running.');
      console.error('Error fetching mood types:', err);
    } finally {
      setMoodTypesLoading(false);
    }
  };

  const fetchRandomQuote = async (moodType) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/quotes/mood/${moodType}/random`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No quotes found for this mood type yet.');
        }
        throw new Error('Failed to fetch quote');
      }
      
      const data = await response.json();
      setCurrentQuote(data);
      setSelectedMood(moodType);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching quote:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAnotherQuote = () => {
    if (selectedMood) {
      fetchRandomQuote(selectedMood);
    }
  };

  const resetToMoodSelection = () => {
    setCurrentQuote(null);
    setSelectedMood(null);
    setError(null);
  };

  const getMoodTypeStyle = (moodType) => {
    const styles = {
      'Depression': { bg: '#F3E8FF', hoverBg: '#E9D5FF' },
      'Anxiety': { bg: '#EBF8FF', hoverBg: '#DBEAFE' },
      'Lack of Focus': { bg: '#F0FDF4', hoverBg: '#DCFCE7' },
      'Sadness': { bg: '#F9FAFB', hoverBg: '#F3F4F6' },
      'Stress': { bg: '#FFF7ED', hoverBg: '#FED7AA' },
      'Loneliness': { bg: '#FDF2F8', hoverBg: '#FCE7F3' },
      'Anger': { bg: '#FEF2F2', hoverBg: '#FECACA' },
      'Fear': { bg: '#FEFCE8', hoverBg: '#FEF08A' },
      'Overwhelmed': { bg: '#F0FDFA', hoverBg: '#CCFBF1' },
      'Low Self-Esteem': { bg: '#ECFDF5', hoverBg: '#D1FAE5' },
      'Guilt': { bg: '#F5F3FF', hoverBg: '#EDE9FE' },
      'Hopelessness': { bg: '#FDF4FF', hoverBg: '#FAE8FF' }
    };
    return styles[moodType] || { bg: '#F9FAFB', hoverBg: '#F3F4F6' };
  };

  if (moodTypesLoading) {
    return (
      <ChakraProvider value={defaultSystem}>
        <Box bg="white" minH="100vh" color="#374151">
          <Container maxW="4xl" py={10}>
            <Center h="50vh">
              <VStack gap={4}>
                <Spinner size="xl" color="#9CA3AF" />
                <Text color="#6B7280">Loading your wellness companion...</Text>
              </VStack>
            </Center>
          </Container>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <Box bg="white" minH="100vh" color="#374151">
        <Container maxW="4xl" py={10}>
          <VStack gap={8} align="stretch">
            {/* Header */}
            <VStack gap={4} textAlign="center">
              <HStack gap={2}>
                <FiSun size={32} color="#FB923C" />
                <Text fontSize="4xl" fontWeight="300" color="#374151">
                  Mindful Quotes
                </Text>
              </HStack>
              <Text fontSize="lg" color="#6B7280" maxW="md">
                {currentQuote 
                  ? "Here's something to brighten your day" 
                  : "How are you feeling right now? Choose what resonates with you."
                }
              </Text>
            </VStack>

            {!currentQuote ? (
              /* Mood Type Selection */
              <Box>
                <Text fontSize="xl" mb={6} textAlign="center" color="#4B5563" fontWeight="300">
                  Select your current mood
                </Text>
                
                {error && (
                  <Box 
                    bg="#FEF2F2" 
                    border="1px solid #FECACA" 
                    borderRadius="lg" 
                    p={4} 
                    mb={6}
                    display="flex"
                    alignItems="center"
                    gap={3}
                  >
                    <FiAlertCircle size={20} color="#EF4444" />
                    <Text color="#991B1B">{error}</Text>
                  </Box>
                )}

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                  {moodTypes.map((mood) => {
                    const style = getMoodTypeStyle(mood.displayName);
                    return (
                      <Box
                        key={mood.value}
                        bg={style.bg}
                        border="1px solid #E5E7EB"
                        borderRadius="xl"
                        p={6}
                        textAlign="center"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          bg: style.hoverBg,
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                          borderColor: '#D1D5DB'
                        }}
                        onClick={() => fetchRandomQuote(mood.value)}
                      >
                        <Text fontSize="lg" fontWeight="400" color="#374151">
                          {mood.displayName}
                        </Text>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Box>
            ) : (
              /* Quote Display */
              <VStack gap={8}>
                <Box 
                  maxW="2xl" 
                  mx="auto" 
                  bg="#F9FAFB" 
                  border="1px solid #E5E7EB"
                  borderRadius="2xl"
                  boxShadow="xl"
                  p={8}
                >
                  <VStack gap={6} textAlign="center">
                    {loading ? (
                      <Spinner size="lg" color="#9CA3AF" />
                    ) : (
                      <>
                        <FiHeart size={24} color="#F472B6" />
                        
                        <Text 
                          fontSize="2xl" 
                          fontWeight="300" 
                          lineHeight="tall" 
                          color="#374151"
                          fontStyle="italic"
                        >
                          "{currentQuote.text}"
                        </Text>
                        
                        {/* Custom divider */}
                        <Box 
                          width="60%" 
                          height="1px" 
                          bg="#D1D5DB" 
                          mx="auto"
                        />
                        
                        <VStack gap={2}>
                          <Text fontSize="lg" fontWeight="400" color="#4B5563">
                            — {currentQuote.authorName}
                          </Text>
                          <Text fontSize="sm" color="#9CA3AF" fontWeight="300">
                            For when you're feeling {currentQuote.moodTypeDisplay.toLowerCase()}
                          </Text>
                        </VStack>
                      </>
                    )}
                  </VStack>
                </Box>

                {/* Action Buttons */}
                <HStack gap={4}>
                  <Button
                    variant="outline"
                    borderColor="#D1D5DB"
                    color="#4B5563"
                    _hover={{ bg: '#F9FAFB', borderColor: '#9CA3AF' }}
                    size="lg"
                    borderRadius="xl"
                    isLoading={loading}
                    loadingText="Finding another quote..."
                    onClick={getAnotherQuote}
                  >
                    <FiRefreshCw size={18} style={{ marginRight: '8px' }} />
                    Another Quote
                  </Button>
                  
                  <Button
                    onClick={resetToMoodSelection}
                    bg="#374151"
                    color="white"
                    _hover={{ bg: '#1F2937' }}
                    size="lg"
                    borderRadius="xl"
                  >
                    Choose Different Mood
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* Footer */}
            <Center pt={8}>
              <Text fontSize="sm" color="#9CA3AF" textAlign="center">
                Take a moment to breathe. You're doing better than you think. 🌿
              </Text>
            </Center>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default MoodQuotesApp;
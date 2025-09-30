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
import { keyframes } from '@chakra-ui/system';
import { FiRefreshCw, FiHeart, FiSun, FiAlertCircle } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

// API base URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://humorizador.onrender.com';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const MoodQuotesApp = () => {
  const [moodTypes, setMoodTypes] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moodTypesLoading, setMoodTypesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState('');

  // Fetch mood types and set client ID on component mount
  useEffect(() => {
    fetchMoodTypes();
    let storedClientId = localStorage.getItem('moodQuotesClientId');
    if (!storedClientId) {
      storedClientId = uuidv4();
      localStorage.setItem('moodQuotesClientId', storedClientId);
    }
    setClientId(storedClientId);
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
      const response = await fetch(`${API_BASE_URL}/quotes/mood/${moodType}/random?clientId=${clientId}`);

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

  const getQuoteEffectProps = (moodType) => {
    switch (moodType) {
      case 'Depression':
        return {
          bg: 'linear-gradient(to bottom, #2C3E50, #4A6070)',
          color: 'white',
          animation: `${fadeIn} 1s ease-out`,
          _before: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'rgba(0,0,0,0.6)',
            animation: `${fadeIn} 1s reverse forwards`,
            zIndex: -1,
          },
        };
      case 'Anxiety':
        return {
          bg: 'linear-gradient(to right, #EBF8FF, #DBEAFE)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 10s ease infinite`,
          color: '#374151',
          boxShadow: '0 0 15px rgba(0, 123, 255, 0.2)',
        };
      case 'LackOfFocus':
        return {
          bg: 'white',
          color: '#374151',
          boxShadow: 'none',
          border: 'none',
          p: 10, // More padding to emphasize simplicity
          _before: { content: 'none' }, // Remove any pseudo-elements
          _after: { content: 'none' },
        };
      case 'Sadness':
        return {
          bg: 'linear-gradient(to bottom, #F9FAFB, #E5E7EB)',
          color: '#4B5563',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          animation: `${fadeIn} 0.8s ease-out`,
        };
      case 'Stress':
        return {
          bg: 'linear-gradient(to top right, #FFF7ED, #FED7AA)',
          color: '#374151',
          boxShadow: '0 0 20px rgba(255, 165, 0, 0.2)',
          animation: `${pulse} 2s infinite`,
        };
      case 'Loneliness':
        return {
          bg: 'linear-gradient(to bottom, #FDF2F8, #FCE7F3)',
          color: '#374151',
          boxShadow: '0 0 15px rgba(255, 192, 203, 0.3)',
          animation: `${fadeIn} 1s ease-out`,
        };
      case 'Anger':
        return {
          bg: 'linear-gradient(to top left, #FEF2F2, #FECACA)',
          color: '#374151',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
          animation: `${fadeIn} 0.5s ease-in-out`,
        };
      case 'Fear':
        return {
          bg: 'linear-gradient(to bottom, #333, #555)',
          color: 'white',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          animation: `${fadeIn} 1.2s ease-out`,
        };
      case 'Overwhelmed':
        return {
          bg: 'linear-gradient(to bottom right, #F0FDFA, #CCFBF1)',
          color: '#374151',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
          animation: `${slideIn} 0.8s ease-out`,
        };
      case 'LowSelfEsteem':
        return {
          bg: 'linear-gradient(to top, #ECFDF5, #D1FAE5)',
          color: '#374151',
          boxShadow: '0 0 15px rgba(0, 128, 0, 0.2)',
          animation: `${fadeIn} 1s ease-out`,
        };
      case 'Guilt':
        return {
          bg: 'linear-gradient(to bottom, #F5F3FF, #EDE9FE)',
          color: '#374151',
          boxShadow: '0 0 15px rgba(128, 0, 128, 0.2)',
          animation: `${fadeIn} 0.9s ease-out`,
        };
      case 'Hopelessness':
        return {
          bg: 'linear-gradient(to bottom, #1A202C, #2D3748)',
          color: 'white',
          boxShadow: '0 0 20px rgba(0,0,0,0.7)',
          animation: `${fadeIn} 1.5s ease-out`,
          _after: {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            bg: 'linear-gradient(to top, rgba(255,255,0,0.1), transparent)',
            animation: `${fadeIn} 2s ease-out`,
            zIndex: -1,
          },
        };
      default:
        return {
          bg: '#F9FAFB',
          color: '#374151',
          boxShadow: 'xl',
          border: '1px solid #E5E7EB',
        };
    }
  };

  const quoteEffectProps = currentQuote ? getQuoteEffectProps(currentQuote.moodTypeDisplay) : {};

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
                  borderRadius="2xl"
                  boxShadow="xl"
                  p={8}
                  position="relative" // Needed for pseudo-elements
                  overflow="hidden" // Clip pseudo-elements if they go outside
                  {...quoteEffectProps} // Apply dynamic props here
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
                          fontStyle="italic"
                        >
                          "{currentQuote.text}"
                        </Text>

                        {/* Custom divider */}
                        <Box
                          width="60%"
                          height="1px"
                          bg="currentColor" // Use currentColor to adapt to text color
                          mx="auto"
                        />

                        <VStack gap={2}>
                          <Text fontSize="lg" fontWeight="400">
                            — {currentQuote.authorName}
                          </Text>
                          <Text fontSize="sm" fontWeight="300">
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
                    _hover={{ bg: 'rgba(0,0,0,0.05)', borderColor: '#9CA3AF' }} // Adjust hover for dark themes
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
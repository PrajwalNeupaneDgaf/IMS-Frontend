import { Box, Center, Button, Text, VStack, Image, Icon, Spinner } from '@chakra-ui/react';
import { BiErrorCircle } from 'react-icons/bi';
import { FaRedoAlt } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { useState, useEffect } from 'react';

const NotAuthenticated = () => {
  const [loading, setLoading] = useState(true);

  // Simulate a 1-second loading delay before displaying the message
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Center h="100vh" bg="gray.800" color="white">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Center h="100vh" bg="gray.800" color="white">
      <VStack spacing={6}>
        {/* Icon and Message */}
        <Box textAlign="center">
          <Icon as={BiErrorCircle} w={20} h={20} color="red.500" />
          <Text fontSize="2xl" fontWeight="bold" mt={4}>
            Oops! You Are Not Authenticated
          </Text>
          <Text fontSize="md" mt={2} color="gray.300">
            It seems like you're not logged in. Let's get you back on track.
          </Text>
        </Box>

        {/* Image */}
        <Image
          src="https://cdni.iconscout.com/illustration/premium/thumb/otp-authentication-7182780-5840953.png"
          alt="Not Authenticated Illustration"
          borderRadius="lg"
          boxShadow="lg"
          w="40vw"
          h="55vh"
        />

        {/* Actions */}
        <Box display="flex" flexDirection="row" gap={4}>
          <Button
            leftIcon={<FaRedoAlt />}
            variant="solid"
            bg="teal.500"
            _hover={{ bg: 'teal.600' }}
            onClick={() => {
              location.reload();
            }}
          >
            Try Reload
          </Button>
          <Button
            leftIcon={<MdLogin />}
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Try Login
          </Button>
        </Box>
      </VStack>
    </Center>
  );
};

export default NotAuthenticated;

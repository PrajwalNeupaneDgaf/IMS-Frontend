import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // Import the custom axios instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // to redirect after successful login

  // Check if the user is already authenticated
  const token = localStorage.getItem('token');
  if (token) {
    axios.get('/auth/profile')
    .then((response) => {
      const user = response.data
      if(user.role=='employee' || user.role=='admin'){
        navigate('/')
      }
      
    })
   
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send login request to the backend using axios instance
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);

        // Optionally, update context or state for auth status here

        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        location.reload()
        navigate('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Welcome Back
          </Heading>
          <Text color="gray.600">Sign in to your account</Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="sm"
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Don't have an account?{' '}
          <ChakraLink as={Link} to="/register" color="teal.500">
            Sign up
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
}

export default Login;

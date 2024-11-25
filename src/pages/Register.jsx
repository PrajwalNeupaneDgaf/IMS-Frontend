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

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // To navigate after registration

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

    // Password mismatch check
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Send registration request to the backend using axios instance
      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
      });

      if (response.data.token) {
        // Optionally, store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);

        toast({
          title: 'Registration Successful',
          description: 'Your account has been created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        throw new Error('Registration failed');
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
            Create an Account
          </Heading>
          <Text color="gray.600">Sign up to get started</Text>
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
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </FormControl>

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
                autoComplete="new-password"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Already have an account?{' '}
          <ChakraLink as={Link} to="/login" color="teal.500">
            Sign in
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
}

export default Register;

import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Heading,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';

const Setting = () => {

  const {user} = useAuth()

  const { colorMode, toggleColorMode } = useColorMode(); // Dark mode handling
  const [profileName, setProfileName] = useState(user?.name); // User profile name
  const [email, setEmail] = useState(user?.email); // User email
  const [nameError, setNameError] = useState(''); // Error state for name validation
  const [emailError, setEmailError] = useState(''); // Error state for email validation

  const [oldPassword, setOldPassword] = useState(''); // Old password input
  const [newPassword, setNewPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password input

  const [passwordError, setPasswordError] = useState(''); // Error state for password fields
  const toast = useToast();

  // Handle profile save
  const handleProfileSave = async () => {
    let isValid = true;

    // Simple validation for profile
    if (!profileName) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (isValid) {
      try {
        const response = await axios.put(
          '/auth/profile', // Adjust the endpoint based on your backend route
          {
            name: profileName,
            email: email,
          }
        );

        toast({
          title: 'Profile Updated',
          description: response.data.message || 'Your profile has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'An error occurred while updating the profile.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Handle password save
  const handlePasswordSave = async () => {
    let isValid = true;
    setPasswordError('');

    // Simple validation for password
    if (!oldPassword) {
      setPasswordError('Old password is required.');
      isValid = false;
    } else if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password must match.');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.put(
          '/auth/password', // Adjust the endpoint based on your backend route
          {
            oldPassword,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
            },
          }
        );

        toast({
          title: 'Password Updated',
          description: response.data.message || 'Your password has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'An error occurred while updating the password.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Dynamic color handling for background and input fields based on color mode
  const bg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.600');
  const buttonColor = useColorModeValue('teal', 'teal');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      p={6}
      bg={bg}
      borderRadius="md"
      boxShadow="md"
      maxWidth="500px"
      mx="auto"
      mt={10}
    >
      <Heading color={headingColor} fontSize={'1.5rem'} mb={6} textAlign="center">
        Update Profile & Password
      </Heading>

      <Stack spacing={4}>
        {/* Profile Information */}
        <FormControl isInvalid={nameError}>
          <FormLabel htmlFor="profileName">Name</FormLabel>
          <Input
            id="profileName"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Enter your full name"
            bg={inputBg}
          />
          {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={emailError}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            bg={inputBg}
          />
          {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
        </FormControl>

        {/* Save Profile Button */}
        <Button
          colorScheme={buttonColor}
          size="lg"
          onClick={handleProfileSave}
          width="full"
        >
          Save Profile
        </Button>

        {/* Password Change */}
        <Heading size="md" mt={6} color={headingColor}>Change Password</Heading>
        <FormControl isInvalid={passwordError}>
          <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
            bg={inputBg}
          />
        </FormControl>

        <FormControl isInvalid={passwordError}>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            bg={inputBg}
          />
        </FormControl>

        <FormControl isInvalid={passwordError}>
          <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            bg={inputBg}
          />
          {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
        </FormControl>

        {/* Save Password Button */}
        <Button
          colorScheme={buttonColor}
          size="lg"
          onClick={handlePasswordSave}
          width="full"
          mt={4}
        >
          Save Password
        </Button>
      </Stack>
    </Box>
  );
};

export default Setting;

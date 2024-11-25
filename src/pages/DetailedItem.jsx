import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  useColorModeValue,
  VStack,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios'; // Assuming you have an axios instance set up

const DetailedItem = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const history = useNavigate(); // To navigate after the user views the item details
  const toast = useToast();

  // Item state and loading state
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const bg = useColorModeValue('gray.50', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');

  // Fetch the item data from the API (simulate with useEffect)
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/items/${id}`) // Assuming endpoint returns the item by its _id
      .then((response) => {
        setItem(response.data); // Populate the item state with the fetched data
        setLoading(false);
      })
      .catch((error) => {
        setError('Item not found or there was an error fetching the data');
        setLoading(false);
      });
  }, [id]);

  const handleEditClick = () => {
    // Navigate to the edit page when the user wants to edit the item
    history(`/inventory/edit/${id}`);
  };

  return (
    <Box
      p={{ base: 4, md: 8 }}
      bg={bg}
      borderRadius="md"
      boxShadow="sm"
      maxWidth="800px"
      mx="auto"
      mt={10}
    >
      <Heading mb={6} textAlign="center">
        Item Details
      </Heading>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : item ? (
        <VStack spacing={6} align="flex-start">
          {/* Item Name */}
          <FormControl>
            <FormLabel htmlFor="name">Item Name</FormLabel>
            <Input
              id="name"
              value={item.name}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>

          {/* SKU */}
          <FormControl>
            <FormLabel htmlFor="sku">SKU</FormLabel>
            <Input
              id="sku"
              value={item.sku}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>

          {/* Category */}
          <FormControl>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Select
              id="category"
              value={item.category}
              isReadOnly
              bg={inputBg}
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Toys">Toys</option>
              <option value="Books">Books</option>
            </Select>
          </FormControl>

          {/* Quantity */}
          <FormControl>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <NumberInput value={item.quantity} isReadOnly>
              <NumberInputField
                id="quantity"
                value={item.quantity}
                isReadOnly
                bg={inputBg}
              />
            </NumberInput>
          </FormControl>

          {/* Price */}
          <FormControl>
            <FormLabel htmlFor="price">Price</FormLabel>
            <NumberInput
              id="price"
              value={item.price}
              isReadOnly
              precision={2}
              step={0.01}
            >
              <NumberInputField
                id="price"
                value={item.price}
                isReadOnly
                bg={inputBg}
              />
            </NumberInput>
          </FormControl>

          {/* Supplier */}
          <FormControl>
            <FormLabel htmlFor="supplier">Supplier</FormLabel>
            <Input
              id="supplier"
              value={item.supplier.name}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="supplier1">Supplier Contact</FormLabel>
            <Input
              id="supplier1"
              value={item.supplier.contact}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="supplier2">Supplier E-Mail</FormLabel>
            <Input
              id="supplier2"
              value={item.supplier.email}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>

          {/* Date */}
          <FormControl>
            <FormLabel htmlFor="description">Date of Added/Updated</FormLabel>
            <Input
              id="description"
              value={new Date(item.updatedAt).toLocaleString()}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>
          {/* Description */}
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              value={item.description}
              isReadOnly
              bg={inputBg}
            />
          </FormControl>

          {/* Edit Button */}
          <Button
            leftIcon={<EditIcon />}
            colorScheme="teal"
            onClick={handleEditClick}
            width="full"
            mt={4}
          >
            Edit Item
          </Button>
        </VStack>
      ) : (
        <Text>Item not found</Text>
      )}
    </Box>
  );
};

export default DetailedItem;

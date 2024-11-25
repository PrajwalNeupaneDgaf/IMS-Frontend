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
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toast = useToast();

  const bg = useColorModeValue('gray.50', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const buttonColor = useColorModeValue('teal', 'teal');

  // Fetch item details
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/items/${id}`)
      .then((response) => {
        const item = response.data;
        setName(item.name);
        setSku(item.sku);
        setCategory(item.category);
        setQuantity(item.quantity);
        setPrice(item.price);
        setSupplier(item.supplier._id);
        setDescription(item.description);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to fetch item details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [id]);

  // Fetch suppliers
  useEffect(() => {
    axiosInstance
      .get('/entities')
      .then((res) => {
        const suppliers = res.data.filter((item) => item.type === 'Supplier');
        setSupplierData(suppliers);
      })
      .catch((err) => console.error(err));
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Item name is required';
    if (!sku) newErrors.sku = 'SKU is required';
    if (!category) newErrors.category = 'Category is required';
    if (quantity <= 0) newErrors.quantity = 'Quantity should be greater than 0';
    if (price <= 0) newErrors.price = 'Price should be greater than 0';
    if (!supplier) newErrors.supplier = 'Supplier is required';
    if (description.length > 300) newErrors.description = 'Description is too long (max 300 characters)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    axiosInstance
      .put(`/items/${id}`, {
        name,
        sku,
        category,
        quantity,
        price,
        supplier,
        description,
      })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Item updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate('/inventory');
      })
      .catch(() => {
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to update item.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
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
        Edit Inventory Item
      </Heading>

      <VStack spacing={6}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Item Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            bg={inputBg}
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.sku}>
          <FormLabel>SKU</FormLabel>
          <Input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter SKU"
            bg={inputBg}
          />
          {errors.sku && <FormErrorMessage>{errors.sku}</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.category}>
          <FormLabel>Category</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            bg={inputBg}
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Toys">Toys</option>
            <option value="Books">Books</option>
          </Select>
          {errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.quantity}>
          <FormLabel>Quantity</FormLabel>
          <NumberInput
            value={quantity}
            onChange={(value) => setQuantity(value)}
            min={1}
          >
            <NumberInputField bg={inputBg} />
          </NumberInput>
          {errors.quantity && <FormErrorMessage>{errors.quantity}</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.price}>
          <FormLabel>Price</FormLabel>
          <NumberInput
            value={price}
            onChange={(value) => setPrice(value)}
            min={1}
            precision={2}
            step={0.01}
          >
            <NumberInputField bg={inputBg} />
          </NumberInput>
          {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.supplier}>
          <FormLabel>Supplier</FormLabel>
          <Select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            bg={inputBg}
          >
            <option value="">Select Supplier</option>
            {supplierData.map((sup, index) => (
              <option key={index} value={sup._id}>
                {sup.name}
              </option>
            ))}
          </Select>
          {errors.supplier && <FormErrorMessage>{errors.supplier}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter item description"
            bg={inputBg}
            maxLength={300}
          />
          {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
        </FormControl>

        <Button
          leftIcon={<AddIcon />}
          colorScheme={buttonColor}
          isLoading={loading}
          onClick={handleSubmit}
          width="full"
          mt={4}
        >
          Update Item
        </Button>
      </VStack>
    </Box>
  );
};

export default EditItem;

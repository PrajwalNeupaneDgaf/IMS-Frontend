import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  useColorModeValue,
  VStack,
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react';
import Select from 'react-select';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const AddItem = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplier, setSupplier] = useState(null); // Adjusted for react-select
  const [description, setDescription] = useState('');
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toast = useToast();

  const bg = useColorModeValue('gray.50', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const buttonColor = useColorModeValue('teal', 'teal');

  // Fetch suppliers and format them for react-select
  useEffect(() => {
    axiosInstance
      .get('/entities')
      .then((res) => {
        const suppliers = res.data
          .filter((item) => item.type === 'Supplier')
          .map((sup) => ({
            value: sup._id,
            label: sup.name,
          }));
        setSupplierOptions(suppliers);
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
      .post('/items/add', {
        name,
        sku,
        category,
        quantity,
        price,
        supplier: supplier.value, // Get the selected supplier's value
        description,
      })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Item added successfully.',
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
          description: 'Failed to add item.',
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
        Add New Item
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
           theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent', // Transparent background for control
              color: 'white',  
              border:'1px solid grey',
              padding:'2px',
              borderRadius:'5px'  // Text color for the selected value
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? 'gray.600' : 'transparent', // Hover effect
              color: 'grey', // Text color for options
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',  // Color of the selected value
            }),
          }}
            options={[
              { value: 'Electronics', label: 'Electronics' },
              { value: 'Clothing', label: 'Clothing' },
              { value: 'Furniture', label: 'Furniture' },
              { value: 'Toys', label: 'Toys' },
              { value: 'Books', label: 'Books' },
            ]}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            placeholder="Select category"
            bg={inputBg}
          />
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
           theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent', // Transparent background for control
              color: 'white',
              border:'1px solid grey',
              padding:'2px',
              borderRadius:'5px'  // Text color for the selected value
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? 'gray.600' : 'transparent', // Hover effect
              color: 'grey', // Text color for options
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',  // Color of the selected value
            }),
          }}
            options={supplierOptions}
            onChange={(selectedOption) => setSupplier(selectedOption)}
            placeholder="Select supplier"
          />
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
          Add Item
        </Button>
      </VStack>
    </Box>
  );
};

export default AddItem;

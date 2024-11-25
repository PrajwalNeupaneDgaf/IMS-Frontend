import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Flex,
} from '@chakra-ui/react';
import Select from 'react-select'; // Import React Select for searchable dropdowns
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AddDealPage = () => {
  const [itemName, setItemName] = useState(null); // Updated for React Select
  const [category, setCategory] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [buyer, setBuyer] = useState(null); // Updated for React Select
  const [supplier, setSupplier] = useState(null); // Updated for React Select
  const [saleDate, setSaleDate] = useState('');
  const [price, setPrice] = useState('');
  const [amountSold, setAmountSold] = useState('');
  const [items, setItems] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch entities (buyers and suppliers)
  useEffect(() => {
    axios
      .get('/entities')
      .then((res) => {
        const data = res.data;
        setBuyers(data.filter((entity) => entity.type === 'Buyer'));
        setSuppliers(data.filter((entity) => entity.type === 'Supplier'));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Fetch items
  useEffect(() => {
    axios
      .get('/items/get')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Handle form submission
  const handleAddDeal = async () => {
    if (!itemName || !buyer || !supplier || !saleDate || !price || !amountSold) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newDeal = {
      itemName: itemName.value,
      category,
      soldTo: buyer.value,
      supplier: supplier.value,
      soldOn: saleDate,
      price: parseFloat(price),
      amountSold: parseInt(amountSold, 10),
    };

    try {
      await axios.post('/sales', newDeal);
      toast({
        title: 'Deal Added',
        description: 'The new deal has been added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add the deal.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxWidth="600px" mx="auto">
      <Heading mb={6} textAlign="center">
        Add New Deal
      </Heading>

      {/* Item Name Dropdown */}
      <FormControl mb={4}>
        <FormLabel>Item Name</FormLabel>
        <Select
          options={items.map((item) => ({
            value: item._id,
            label: item.name,
            category: item.category,
          }))}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          placeholder="Select an item"
          value={itemName}
          onChange={(selectedItem) => {
            setItemName(selectedItem);
            setCategory(selectedItem.category); // Automatically populate category
          }}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent', // Transparent background for control
              color: 'white', 
              border:'1px solid grey',
              padding:'2px',
              borderRadius:'5px'   // Text color for the selected value
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
        />
      </FormControl>

      {/* Category (Read-Only) */}
      <FormControl mb={4}>
        <FormLabel>Category</FormLabel>
        <Input value={category} isReadOnly />
      </FormControl>

      {/* Buyer Dropdown */}
      <FormControl mb={4}>
        <FormLabel>Buyer</FormLabel>
        <Select
          options={buyers.map((buyer) => ({
            value: buyer._id,
            label: buyer.name,
          }))}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          placeholder="Select a buyer"
          value={buyer}
          onChange={(selectedBuyer) => setBuyer(selectedBuyer)}
          isSearchable
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent',
              color: 'white',
              border:'1px solid grey',
              padding:'2px',
              borderRadius:'5px'  
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? 'gray.600' : 'transparent', // Hover effect
              color: 'grey',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
          }}
        />
      </FormControl>

      {/* Supplier Dropdown */}
      <FormControl mb={4}>
        <FormLabel>Supplier</FormLabel>
        <Select
          options={suppliers.map((supplier) => ({
            value: supplier._id,
            label: supplier.name,
          }))}
          placeholder="Select a supplier"
          value={supplier}
          onChange={(selectedSupplier) => setSupplier(selectedSupplier)}
          isSearchable
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
              backgroundColor: 'transparent',
              color: 'white',
              border:'1px solid grey',
              padding:'2px',
              borderRadius:'5px'  
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? 'gray.600' : 'transparent', // Hover effect
              color: 'grey',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
          }}
        />
      </FormControl>

      {/* Sale Date */}
      <FormControl mb={4}>
        <FormLabel>Sale Date</FormLabel>
        <Input
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
        />
      </FormControl>

      {/* Price */}
      <FormControl mb={4}>
        <FormLabel>Price</FormLabel>
        <Input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </FormControl>

      {/* Amount Sold */}
      <FormControl mb={4}>
        <FormLabel>Amount Sold</FormLabel>
        <Input
          type="number"
          placeholder="Enter amount sold"
          value={amountSold}
          onChange={(e) => setAmountSold(e.target.value)}
        />
      </FormControl>

      {/* Actions */}
      <Flex justify="space-between">
        <Button colorScheme="teal" onClick={handleAddDeal}>
          Add Deal
        </Button>
        <Button colorScheme="gray" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default AddDealPage;

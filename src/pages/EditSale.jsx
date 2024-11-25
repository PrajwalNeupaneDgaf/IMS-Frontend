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
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';

const EditSale = () => {
  const [itemName, setItemName] = useState(null);
  const [category, setCategory] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [buyer, setBuyer] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [saleDate, setSaleDate] = useState('');
  const [price, setPrice] = useState('');
  const [amountSold, setAmountSold] = useState('');
  const [items, setItems] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams(); // Get sale ID from route

  // Fetch buyers, suppliers, and items
  useEffect(() => {
    axios
      .get('/entities')
      .then((res) => {
        const data = res.data;
        setBuyers(data.filter((entity) => entity.type === 'Buyer'));
        setSuppliers(data.filter((entity) => entity.type === 'Supplier'));
      })
      .catch((err) => console.error(err));

    axios
      .get('/items/get')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch the sale details to edit
  useEffect(() => {
    axios
      .get(`/sales/${id}`)
      .then((res) => {
        const sale = res.data;
        setItemName({ value: sale.itemName._id, label: sale.itemName.name });
        setCategory(sale.category);
        setBuyer({ value: sale.soldTo._id, label: sale.soldTo.name });
        setSupplier({ value: sale.supplier._id, label: sale.supplier.name });
        setSaleDate(sale.soldOn.split('T')[0]); // Format date
        setPrice(sale.price);
        setAmountSold(sale.amountSold);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle form submission
  const handleEditSale = async () => {
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

    const updatedSale = {
      itemName: itemName.value,
      category,
      soldTo: buyer.value,
      supplier: supplier.value,
      soldOn: saleDate,
      price: parseFloat(price),
      amountSold: parseInt(amountSold, 10),
    };

    try {
      await axios.put(`/sales/${id}`, updatedSale);
      toast({
        title: 'Sale Updated',
        description: 'The sale has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Redirect to sales overview
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update the sale.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxWidth="600px" mx="auto">
      <Heading mb={6} textAlign="center">
        Edit Sale
      </Heading>

      {/* Item Name Dropdown */}
      <FormControl mb={4}>
        <FormLabel>Item Name</FormLabel>
        <Select
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
          }} theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          options={items.map((item) => ({
            value: item._id,
            label: item.name,
            category: item.category,
          }))}
          value={itemName}
          onChange={(selectedItem) => {
            setItemName(selectedItem);
            setCategory(selectedItem.category);
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
          }} theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          options={buyers.map((buyer) => ({
            value: buyer._id,
            label: buyer.name,
          }))}
          value={buyer}
          onChange={(selectedBuyer) => setBuyer(selectedBuyer)}
        />
      </FormControl>

      {/* Supplier Dropdown */}
      <FormControl mb={4}>
        <FormLabel>Supplier</FormLabel>
        <Select
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
          }} theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'gray.600',  // Hover color
              primary: 'white',       // Text color
            },
          })}
          options={suppliers.map((supplier) => ({
            value: supplier._id,
            label: supplier.name,
          }))}
          value={supplier}
          onChange={(selectedSupplier) => setSupplier(selectedSupplier)}
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </FormControl>

      {/* Amount Sold */}
      <FormControl mb={4}>
        <FormLabel>Amount Sold</FormLabel>
        <Input
          type="number"
          value={amountSold}
          onChange={(e) => setAmountSold(e.target.value)}
        />
      </FormControl>

      {/* Actions */}
      <Flex justify="space-between">
        <Button colorScheme="teal" onClick={handleEditSale}>
          Update Sale
        </Button>
        <Button colorScheme="gray" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default EditSale;

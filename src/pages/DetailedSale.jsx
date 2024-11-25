import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Spinner,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const DetailedSale = () => {
  const { id } = useParams(); // Extract sale ID from the URL
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sale details
    axios
      .get(`/sales/${id}`)
      .then((res) => {
        setSale(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!sale) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text>Sale not found</Text>
      </Flex>
    );
  }

  return (
    <Box p={6} maxWidth="800px" mx="auto" bg="gray.900" borderRadius="md" boxShadow="md">
      <Heading mb={6}fontSize={'xl'} textAlign="center">
        Sale Details
      </Heading>

      <Stack spacing={4}>
        {/* Item Information */}
        <Box>
          <Heading size="md" mb={2}>
            Product Information
          </Heading>
          <Text>
            <strong>Name:</strong> {sale.itemName.name}
          </Text>
          <Text>
            <strong>Category:</strong> {sale.category}
          </Text>
          <Text>
            <strong>Price:</strong> ${sale.price.toFixed(2)}
          </Text>
          <Text>
            <strong>Amount Sold:</strong> {sale.amountSold}
          </Text>
        </Box>
        <Divider />

        {/* Buyer Information */}
        <Box>
          <Heading size="md" mb={2}>
            Buyer Information
          </Heading>
          <Text>
            <strong>Name:</strong> {sale.soldTo.name}
          </Text>
          <Text>
            <strong>Contact:</strong> {sale.soldTo.contact}
          </Text>
          <Text>
            <strong>Address:</strong> {sale.soldTo.address}
          </Text>
        </Box>
        <Divider />

        {/* Supplier Information */}
        <Box>
          <Heading size="md" mb={2}>
            Supplier Information
          </Heading>
          <Text>
            <strong>Name:</strong> {sale.supplier.name}
          </Text>
          <Text>
            <strong>Contact:</strong> {sale.supplier.contact}
          </Text>
          <Text>
            <strong>Address:</strong> {sale.supplier.address}
          </Text>
        </Box>
        <Divider />

        {/* Sale Date */}
        <Box>
          <Heading size="md" mb={2}>
            Sale Date
          </Heading>
          <Text>{new Date(sale.soldOn).toLocaleDateString()}</Text>
        </Box>
      </Stack>

      {/* Navigation Actions */}
      <Flex justify="flex-end" mt={6}>
        <Button colorScheme="blue" onClick={() => navigate('/')} mr={2}>
          Back to Sales
        </Button>
        <Button colorScheme="teal" onClick={() => navigate(`/sales/edit/${id}`)}>
          Edit Sale
        </Button>
      </Flex>
    </Box>
  );
};

export default DetailedSale;

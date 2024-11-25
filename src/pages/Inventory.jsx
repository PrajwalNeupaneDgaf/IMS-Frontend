import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grid,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Input,
  Select,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios'; // Import the axios instance

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch data from API
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/items/get')
      .then((response) => {
        setInventory(response.data); 
        console.log(response.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
        setLoading(false);
      });
  }, []);

  // Search and Filter Items
  const filteredItems = inventory.filter((item) =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory ? item.category === filterCategory : true)
  );

  // Handle Delete Confirmation
  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    onOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      axiosInstance
        .delete(`items/${deleteItem._id}`)
        .then(() => {
          setInventory(inventory.filter((item) => item._id !== deleteItem._id));
          setDeleteItem(null);
          onClose();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    }
  };

  const bg = useColorModeValue('gray.50', 'gray.800');
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Box p={6} bg={bg} minH="80vh">
      <Heading mb={6}>Inventory Management</Heading>

      {/* Search and Filter Section */}
      <Grid templateColumns={["1fr ","1fr 1fr","1fr 2fr 1fr"]} gap={6} mb={6}>
        <Input
          placeholder="Search by name or SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Filter by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
        </Select>
        <Button leftIcon={<AddIcon />} as={Link} to={'/inventory/add'} colorScheme="teal" variant="solid">
          Add New Item
        </Button>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" variant="left-accent" borderRadius="md" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>Are you sure you want to delete this item?</AlertTitle>
                <AlertDescription>
                  <Box mb={2}>
                    <strong>{deleteItem?.name}</strong>
                  </Box>
                  <Box>Supplier: {deleteItem?.supplier?.name}</Box>
                  <Box>Price: ${deleteItem?.price}</Box>
                </AlertDescription>
              </Box>
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteConfirm} mr={3}>Delete</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Inventory Table */}
      <Box overflowX="auto">
        <Table fontSize={['xs,sm.md']} variant="simple" overflowX={'scroll'} bg={tableBg} borderRadius="md" boxShadow="sm">
          <Thead>
            <Tr>
              <Th fontSize={'sm'}>Item</Th>
              <Th fontSize={'sm'}>SKU</Th>
              <Th fontSize={'sm'}>Category</Th>
              <Th fontSize={'sm'}>Quantity</Th>
              <Th fontSize={'sm'}>Price</Th>
              <Th fontSize={'sm'}>Supplier</Th>
              <Th fontSize={'sm'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan="7" textAlign="center">
                  Loading...
                </Td>
              </Tr>
            ) : (
              filteredItems.map((item) => (
                <Tr key={item._id} _hover={{ bg: hoverBg }}>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>{item.name}</Td>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>{item.sku}</Td>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>{item.category}</Td>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>{item.quantity}</Td>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>${item.price}</Td>
                  <Td fontSize={{ base: 'sm', md: 'md' }}>{item.supplier.name}</Td>
                  <Td>
                    <Tooltip label="View Details">
                      <IconButton
                        as={Link}
                        to={`/inventory/detail/${item._id}`}
                        icon={<ViewIcon />}
                        aria-label="View Details"
                        variant="ghost"
                        colorScheme="green"
                        mr={2}
                      />
                    </Tooltip>
                    <Tooltip label="Edit Item">
                      <IconButton
                        as={Link}
                        to={`/inventory/edit/${item._id}`}
                        icon={<EditIcon />}
                        aria-label="Edit"
                        variant="ghost"
                        colorScheme="blue"
                        mr={2}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Item">
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Inventory;

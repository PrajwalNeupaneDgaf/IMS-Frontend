import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import api from '../utils/axios'; // Import axios instance

const ManageEntitiesPage = () => {
  const [entities, setEntities] = useState([]);
  const [editingEntity, setEditingEntity] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const [entityType, setEntityType] = useState('Buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [deletingItem, setdeletingItem] = useState({});
  const [deleting, setDeleting] = useState(false);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const { data } = await api.get('/entities');
        setEntities(data);
      } catch (err) {
        console.error('Error fetching entities:', err);
        toast({
          title: 'Error fetching entities',
          description: 'There was an error fetching the entities.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEntities();
  }, [toast]);

  const resetForm = () => {
    setEntityType('Buyer');
    setName('');
    setEmail('');
    setBusiness('');
    setContact('');
    setAddress('');
    setEditingEntity(null);
  };

  const handleOpenModal = (entity = null) => {
    if (entity) {
      setEditingEntity(entity);
      setEntityType(entity.type);
      setName(entity.name);
      setEmail(entity.email);
      setBusiness(entity.business);
      setContact(entity.contact);
      setAddress(entity.address);
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleSaveEntity = async () => {
    if (!name || !email || !business || !contact || !address) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingEntity) {
        // Update existing entity
        const { data } = await api.put(`/entities/${editingEntity._id}`, {
          type: entityType,
          name,
          email,
          business,
          contact,
          address,
        });

        setEntities((prev) =>
          prev.map((entity) =>
            entity.id === editingEntity.id ? data : entity
          )
        );
        toast({
          title: 'Entity Updated',
          description: 'The entity details have been updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create a new entity
        const { data } = await api.post('/entities', {
          type: entityType,
          name,
          email,
          business,
          contact,
          address,
        });

        setEntities((prev) => [...prev, data]);
        toast({
          title: 'Entity Added',
          description: 'A new entity has been added.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error('Error saving entity:', err);
      toast({
        title: 'Error',
        description: 'There was an error saving the entity.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEntity = async (id) => {
    try {
      await api.delete(`/entities/${id}`);
      setEntities((prev) => prev.filter((entity) => entity.id !== id));
      toast({
        title: 'Entity Deleted',
        description: 'The entity has been removed.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error deleting entity:', err);
      toast({
        title: 'Error',
        description: 'There was an error deleting the entity.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filtering and Searching
  const filteredEntities = entities.filter((entity) => {
    const matchesSearchQuery =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.business.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterType = filterType ? entity.type === filterType : true;
    return matchesSearchQuery && matchesFilterType;
  });

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Heading mb={6} textAlign="center" fontSize="2xl">
        Manage Buyers & Suppliers
      </Heading>

      <Box mb={4}>
        <FormControl display="flex" alignItems="center" gap={3}>
        <Button colorScheme="teal" onClick={() => handleOpenModal()} fontSize="sm">
            Add New Entity
          </Button>
          <Input
            placeholder="Search by Name or Business"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            width="300px"
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            placeholder="Filter by Type"
            size="sm"
            width="200px"
          >
            <option value="Buyer">Buyer</option>
            <option value="Supplier">Supplier</option>
          </Select>
        </FormControl>
      </Box>

      <Table variant="simple" fontSize="sm">
        <Thead fontFamily={'12px'}>
          <Tr>
            <Th>Type</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Business</Th>
            <Th>Contact No.</Th>
            <Th>Address</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody fontSize={'.8rem'}>
          {filteredEntities.map((entity) => (
            <Tr key={entity._id}>
              <Td>{entity.type}</Td>
              <Td>{entity.name}</Td>
              <Td>{entity.email}</Td>
              <Td>{entity.business}</Td>
              <Td>{entity.contact}</Td>
              <Td>{entity.address}</Td>
              <Td>
                <Box display="flex" gap={2} justifyContent="center">
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => handleOpenModal(entity)}
                    colorScheme="teal"
                    size="sm"
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      setDeleting(true);
                      setdeletingItem(entity);
                    }}
                    colorScheme="red"
                    size="sm"
                  />
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={deleting} onClose={() => {
        setDeleting(false);
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Delete Entity</ModalHeader>
          <ModalBody>
            <Box>
              <Text>Are you sure you want to delete this entity?</Text>
            </Box>
            <Box className='p-4 text-[#221e1e] rounded-md' bg={'red.100'} border={'1px solid black'}>
              <Text>
                Name: {deletingItem?.name}
              </Text>
              <Text>
                Type: {deletingItem?.type}
              </Text>
              <Text>
                E-mail: {deletingItem?.email}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => {
              setDeleting(false);
              setdeletingItem({});
            }}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => {
              setDeleting(false);
              handleDeleteEntity(deletingItem._id);
              setdeletingItem(null);
            }}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{editingEntity ? 'Edit Entity' : 'Add New Entity'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Type</FormLabel>
              <Select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                <option value="Buyer">Buyer</option>
                <option value="Supplier">Supplier</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Business</FormLabel>
              <Input
                placeholder="Enter business type"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Contact No.</FormLabel>
              <Input
                placeholder="Enter contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEntity} fontSize="sm">
              Save
            </Button>
            <Button colorScheme="gray" onClick={onClose} ml={3} fontSize="sm">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageEntitiesPage;

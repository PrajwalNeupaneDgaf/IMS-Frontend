import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import {
  Box,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useToast,
  Spinner,
  Flex,
  FormControl,
  FormLabel,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Avatar,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for deletion
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {user} = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/users');
        setUsers(data);
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: error.message || 'Failed to load users',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (id, newRole) => {
    if(user.role!='admin'){
      toast({
        title: 'Role not Updated',
        description: `User's role can be changed by Only Admins`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.put(`/users/${id}/role`, { role: newRole });
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
      toast({
        title: 'Role Updated',
        description: `User's role has been changed to ${newRole}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating role',
        description: error.message || 'Failed to update role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    onOpen(); // Open the confirmation modal
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/users/${selectedUser._id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      toast({
        title: 'User Deleted',
        description: `${selectedUser.name} has been deleted successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: error.response.data.message || 'Failed to delete user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSelectedUser(null);
      onClose();
    }
  };

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Heading mb={6} textAlign="center">
        Users List
      </Heading>

      <Flex mb={6} justifyContent="space-between" alignItems="center">
        <FormControl width="50%">
          <FormLabel htmlFor="search">Search Users</FormLabel>
          <Input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or role"
            size="md"
            width="100%"
          />
        </FormControl>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td>
                    <Flex align="center">
                      <Avatar name={user.name} size="sm" mr={3} />
                      <Text>{user.name}</Text>
                    </Flex>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Change Role"
                        icon={<SettingsIcon />}
                        colorScheme="teal"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleRoleChange(user._id, 'admin')}>Promote to Admin</MenuItem>
                        <MenuItem onClick={() => handleRoleChange(user._id, 'employee')}>Promote to Employee</MenuItem>
                        <MenuItem onClick={() => handleRoleChange(user._id, 'user')}>Set as User</MenuItem>
                      </MenuList>
                    </Menu>
                    <IconButton
                      aria-label="Delete User"
                      icon={<DeleteIcon />}
                      onClick={() => confirmDeleteUser(user)}
                      colorScheme="red"
                      size="sm"
                      ml={2}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            {selectedUser && (
              <Text>
                Are you sure you want to delete <strong>{selectedUser.name}</strong> ({selectedUser.email})?
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteUser} mr={3}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UsersPage;

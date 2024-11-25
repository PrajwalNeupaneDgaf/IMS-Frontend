import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaRegEye } from "react-icons/fa";
import axios from "../utils/axios";

const SalePage = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const toast = useToast();

  const cancelRef = React.useRef();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("/sales");
      setSalesData(response.data);
    } catch (error) {
      toast({
        title: "Error fetching sales",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = (sale) => {
    setSaleToDelete(sale);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSale = async () => {
    try {
      await axios.delete(`/sales/${saleToDelete._id}`);
      setSalesData((prevData) =>
        prevData.filter((sale) => sale._id !== saleToDelete._id)
      );
      toast({
        title: "Sale deleted",
        description: "The sale has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error deleting sale",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Heading mb={6} textAlign="center">
        Sales Overview
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8}>
        <Stat>
          <StatLabel>Total Sales</StatLabel>
          <StatNumber>
            $
            {salesData.reduce(
              (sum, item) => sum + item.price * item.amountSold,
              0
            )}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      <Box mb={6}>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Item or Supplier"
        />
        <Button mt={4} as={Link} to="/add-deal">
          Add New Deal
        </Button>
      </Box>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Sold On</Th>
              <Th>Sold To</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {salesData.map((sale) => (
              <Tr key={sale._id}>
                <Td>{sale.itemName.name}</Td>
                <Td>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(sale.soldOn))}
                </Td>
                <Td>{sale.soldTo.name}</Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/sales/${sale._id}`}
                    icon={<FaRegEye />}
                    aria-label="View Details"
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                  />
                  <IconButton
                    as={Link}
                    to={`/edit-sale/${sale._id}`}
                    icon={<EditIcon />}
                    aria-label="Edit Sale"
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete Sale"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleConfirmDelete(sale)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Sale
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this sale? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteSale} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default SalePage;

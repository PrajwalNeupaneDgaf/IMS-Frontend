import { Box, Button, Center, Container, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import NotAuthenticated from './NotAuthenticated';

function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  if (!isAuthenticated) {
    return (
      <NotAuthenticated/>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Container maxW="container.xl" px={4}>
        <Box display="flex" gap={6} pt={20}>
          <Sidebar />
          <Box flex={1} py={8}>
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
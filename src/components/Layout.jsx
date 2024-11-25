import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import NotAuthenticated from './NotAuthenticated';

function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main layout container */}
      <Box display="flex" pt={16}> {/* Adjust pt to ensure content is below navbar */}
        <Sidebar />

        {/* Content area */}
        <Box flex={1} p={4} overflowY="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

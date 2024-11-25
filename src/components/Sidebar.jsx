import {
  Box,
  VStack,
  Icon,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  BarChart2,
  Settings,
  Users,
  Menu,
  ShoppingCart,
  User2Icon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: ShoppingCart, label: 'Sales', path: '/sales' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: User2Icon, label: 'Entities', path: '/manage-entity' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgActive = useColorModeValue('brand.50', 'brand.900');
  const borderColor = useColorModeValue('brand.100', 'brand.700');
  const sidebarBg = useColorModeValue('white', 'gray.800');

  const renderMenuItems = () =>
    menuItems.map((item) => {
      if (item.roles && !item.roles.includes(user?.role)) {
        return null;
      }

      const isActive = location.pathname === item.path;

      return (
        <Box
          key={item.path}
          as={Link}
          to={item.path}
          p={3}
          borderRadius="md"
          bg={isActive ? bgActive : 'transparent'}
          color={isActive ? 'brand.500' : undefined}
          _hover={{ bg: bgActive }}
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Icon as={item.icon} boxSize={5} />
          <Text fontWeight={isActive ? 'medium' : 'normal'}>{item.label}</Text>
        </Box>
      );
    });

  return (
    <>
      {/* Mobile Toggle Button */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        position="fixed"
        top="4"
        left="4"
        zIndex="overlay"
      >
        <Button
          color={useColorModeValue('brand.600', 'brand.200')}
          bg={useColorModeValue('white', 'brand.600')}
          _hover={{ bg: useColorModeValue('gray.100', 'brand.500')}}
          onClick={onOpen}
          leftIcon={<Icon as={Menu} />}
          colorScheme="brand"
          variant="solid"
        >
          IMS
        </Button>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        as="nav"
        pos="sticky"
        top="20"
        h="calc(100vh - 5rem)"
        w="64"
        borderRight="1px"
        borderColor={borderColor}
        py={8}
        bg={sidebarBg}
        display={{ base: 'none', lg: 'block' }}
      >
        <VStack spacing={2} align="stretch">
          {renderMenuItems()}
        </VStack>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg}>
          <DrawerCloseButton />
          <DrawerBody pt={10}>
            <VStack spacing={2} align="stretch">
              {renderMenuItems()}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;

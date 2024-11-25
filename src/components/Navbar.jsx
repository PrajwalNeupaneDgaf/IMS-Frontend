import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      className='top-0 left-0 right-0'
      bg={bg}
      px={4}
      position="fixed"
      w="full"
      zIndex={10}
      boxShadow="sm"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.200')}>
          IMS
        </Text>

        <Flex alignItems="center" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />

          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.name} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>Profile</MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
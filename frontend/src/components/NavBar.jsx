import React, { useState, useEffect } from 'react';
import { HStack, Box, Button, IconButton, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronLeftIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getToken, getUserFromToken, logout } from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme, brand, text, bgSecondary, border } = useTheme();
  const [auth, setAuth] = useState({ token: getToken(), user: getUserFromToken() });

  useEffect(() => {
    const onAuthChanged = () => setAuth({ token: getToken(), user: getUserFromToken() });
    window.addEventListener('authChanged', onAuthChanged);
    return () => window.removeEventListener('authChanged', onAuthChanged);
  }, []);

  const logout_handler = () => {
    logout();
    navigate('/');
  };

  // Hide back button on homepage
  const isHomePage = location.pathname === '/';

  // Shared button size & padding for consistency
  const btnProps = {
    size: 'sm',
    height: '36px',
    px: 4,
    fontWeight: 'bold',
    borderRadius: '8px',
  };

  return (
    <Box bg={bgSecondary} borderBottom="1px solid" borderColor={border} px={6} py={2} boxShadow="sm">
      <HStack justify="space-between" align="center">
        <HStack spacing={2}>
          {/* Back button — hidden on homepage */}
          {!isHomePage && (
            <IconButton
              aria-label="back"
              icon={<ChevronLeftIcon boxSize={5} />}
              size="sm"
              height="36px"
              width="36px"
              borderRadius="8px"
              onClick={() => navigate(-1)}
              bg={brand}
              color="white"
              _hover={{ bg: '#e63c3c', transform: 'translateY(-1px)' }}
              transition="all 0.15s ease"
            />
          )}
          <Button as={Link} to="/" variant="ghost" fontWeight="bold" color={brand} borderRadius="8px"
            _hover={{ bg: isDarkMode ? '#3a3a3a' : '#ffecec' }} height="36px" px={3}>
            🏠 Home
          </Button>
          <Button as={Link} to="/properties" variant="ghost" fontWeight="bold" color={brand} borderRadius="8px"
            _hover={{ bg: isDarkMode ? '#3a3a3a' : '#ffecec' }} height="36px" px={3}>
            🏘️ Properties
          </Button>
          <Button as={Link} to="/requests" variant="ghost" fontWeight="bold" color={brand} borderRadius="8px"
            _hover={{ bg: isDarkMode ? '#3a3a3a' : '#ffecec' }} height="36px" px={3}>
            📋 Requests
          </Button>
        </HStack>

        <HStack spacing={3}>
          {/* Theme Toggle — styled consistently with other buttons */}
          <IconButton
            aria-label="toggle theme"
            icon={isDarkMode ? <SunIcon boxSize={4} /> : <MoonIcon boxSize={4} />}
            onClick={toggleTheme}
            size="sm"
            height="36px"
            width="36px"
            borderRadius="8px"
            border="1px solid"
            borderColor={isDarkMode ? '#555' : brand}
            bg={isDarkMode ? '#2d2d2d' : 'white'}
            color={isDarkMode ? '#fdd835' : brand}
            _hover={{ bg: isDarkMode ? '#3a3a3a' : '#ffecec', transform: 'translateY(-1px)' }}
            transition="all 0.15s ease"
          />

          {auth.token ? (
            <Menu>
              <MenuButton>
                <HStack spacing={2} align="center" cursor="pointer"
                  bg={isDarkMode ? '#2d2d2d' : '#fff5f5'} px={3} py={1}
                  borderRadius="8px" border="1px solid" borderColor={isDarkMode ? '#555' : '#ffc0c0'}>
                  <Avatar name={auth.user?.name || 'User'} size="xs" bg={brand} color="white" />
                  <Text fontSize="sm" fontWeight="bold" color={brand}>{auth.user?.name?.split(' ')[0] || auth.user?.role || 'User'}</Text>
                </HStack>
              </MenuButton>
              <MenuList bg={isDarkMode ? '#2d2d2d' : 'white'} borderColor={border}>
                <MenuItem as={Link} to="/profile" color={text}>👤 Profile</MenuItem>
                <MenuItem onClick={() => navigate(auth.user?.role === 'admin' ? '/admin/dashboard' : auth.user?.role === 'landlord' ? '/landlord/dashboard' : '/dashboard')}
                  color={text}>
                  📊 Dashboard
                </MenuItem>
                <MenuItem onClick={logout_handler} color={brand} fontWeight="bold">🚪 Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={2}>
              <Button
                as={Link} to="/login"
                variant="outline"
                borderColor={brand}
                color={brand}
                bg="transparent"
                borderRadius="8px"
                border="1.5px solid"
                _hover={{ bg: isDarkMode ? '#3a3a3a' : '#ffecec', transform: 'translateY(-1px)' }}
                transition="all 0.15s ease"
                {...btnProps}
              >
                Login
              </Button>
              <Button
                as={Link} to="/signup"
                bg={brand}
                color="white"
                borderRadius="8px"
                border="1.5px solid"
                borderColor={brand}
                _hover={{ bg: '#e63c3c', transform: 'translateY(-1px)', boxShadow: '0 4px 14px rgba(255,77,77,0.35)' }}
                transition="all 0.15s ease"
                {...btnProps}
              >
                Sign up
              </Button>
            </HStack>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}

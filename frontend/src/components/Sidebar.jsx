import React from 'react';
import { Box, VStack, Text, HStack, Avatar } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserFromToken, logout } from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';

// Nav items per role
const NAV_BY_ROLE = {
  tenant: [
    { label: 'Dashboard',   icon: '📊', to: '/dashboard' },
    { label: 'Properties',  icon: '🏘️', to: '/properties' },
    { label: 'My Bookings', icon: '📋', to: '/booking/history' },
    { label: 'Requests',    icon: '📬', to: '/requests' },
    { label: 'Wallet',      icon: '💰', to: '/wallet' },
    { label: 'Profile',     icon: '👤', to: '/profile' },
  ],
  landlord: [
    { label: 'Dashboard',   icon: '📊', to: '/landlord/dashboard' },
    { label: 'Properties',  icon: '🏘️', to: '/properties' },
    { label: 'My Listings', icon: '🏠', to: '/landlord/dashboard' }, // tab inside landlord dash
    { label: 'Requests',    icon: '📬', to: '/requests' },
    { label: 'Profile',     icon: '👤', to: '/profile' },
  ],
  admin: [
    { label: 'Dashboard',   icon: '📊', to: '/admin/dashboard' },
    { label: 'Properties',  icon: '🏘️', to: '/properties' },
    { label: 'Requests',    icon: '📬', to: '/requests' },
    { label: 'Profile',     icon: '👤', to: '/profile' },
  ],
};

const ROLE_LABEL = {
  tenant:   { label: 'Tenant',        color: '#60a5fa' },
  landlord: { label: 'Landlord',      color: '#34d399' },
  admin:    { label: 'Administrator', color: '#f59e0b' },
};

export default function Sidebar() {
  const { isDarkMode, toggleTheme, text } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserFromToken();
  const role = user?.role || 'tenant';

  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.tenant;
  const roleInfo = ROLE_LABEL[role] || ROLE_LABEL.tenant;

  const sidebarBg    = isDarkMode ? '#111111' : '#1a1a2e';
  const dividerColor = 'rgba(255,255,255,0.08)';
  const labelColor   = 'rgba(255,255,255,0.30)';
  const itemColor    = 'rgba(255,255,255,0.68)';
  const activeColor  = '#ff4d4d';
  const activeBg     = 'rgba(255,77,77,0.15)';
  const hoverBg      = 'rgba(255,255,255,0.06)';

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (to) =>
    location.pathname === to ||
    (to !== '/dashboard' && to !== '/landlord/dashboard' && to !== '/admin/dashboard'
      && location.pathname.startsWith(to));

  return (
    <Box
      as="nav"
      w="230px" minW="230px" minH="100vh"
      bg={sidebarBg}
      display="flex" flexDirection="column"
      boxShadow="4px 0 20px rgba(0,0,0,0.28)"
    >
      {/* ── Logo — clicks go to homepage ── */}
      <Box
        as={Link} to="/"
        px={5} pt={5} pb={4}
        borderBottom={`1px solid ${dividerColor}`}
        _hover={{ textDecoration: 'none', opacity: 0.85 }}
        transition="opacity 0.14s"
        display="block"
      >
        <HStack spacing={3}>
          <Box w="34px" h="34px" bg="#ff4d4d" borderRadius="9px"
            display="flex" alignItems="center" justifyContent="center"
            fontSize="17px" flexShrink={0}>
            🏠
          </Box>
          <Text fontWeight="800" fontSize="lg" color="white" letterSpacing="-0.3px">
            Co‑Live
          </Text>
        </HStack>
      </Box>

      {/* ── User Info ── */}
      <Box px={4} py={4} borderBottom={`1px solid ${dividerColor}`}>
        <HStack spacing={3}>
          <Avatar name={user?.name || 'User'} size="sm" bg="#ff4d4d" color="white" flexShrink={0} />
          <Box overflow="hidden">
            <Text fontWeight="700" fontSize="sm" color="white" noOfLines={1}>
              {user?.name || 'User'}
            </Text>
            <Text fontSize="10px" fontWeight="600" textTransform="capitalize"
              letterSpacing="wide" color={roleInfo.color}>
              {roleInfo.label}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* ── Nav Links ── */}
      <VStack spacing={1} align="stretch" px={3} py={4} flex="1">
        <Text fontSize="10px" fontWeight="700" color={labelColor}
          textTransform="uppercase" letterSpacing="widest" px={3} pb={2}>
          Menu
        </Text>

        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Box
              key={`${item.to}-${item.label}`}
              as={Link} to={item.to}
              display="flex" alignItems="center"
              px={3} py="9px" borderRadius="9px"
              bg={active ? activeBg : 'transparent'}
              color={active ? activeColor : itemColor}
              fontWeight={active ? '700' : '400'}
              fontSize="sm"
              borderLeft={active ? `3px solid ${activeColor}` : '3px solid transparent'}
              _hover={{ bg: hoverBg, color: 'white', textDecoration: 'none' }}
              transition="all 0.14s ease"
            >
              <Box mr={3} fontSize="15px" flexShrink={0}>{item.icon}</Box>
              {item.label}
            </Box>
          );
        })}
      </VStack>

      {/* ── Bottom: Theme + Logout ── */}
      <Box px={3} py={4} borderTop={`1px solid ${dividerColor}`}>
        <Text fontSize="10px" fontWeight="700" color={labelColor}
          textTransform="uppercase" letterSpacing="widest" px={3} pb={2}>
          Settings
        </Text>

        {/* Theme Toggle */}
        <Box display="flex" alignItems="center" px={3} py="9px" borderRadius="9px"
          cursor="pointer" color={itemColor} fontSize="sm" fontWeight="400"
          _hover={{ bg: hoverBg, color: 'white' }} transition="all 0.14s"
          onClick={toggleTheme} mb={1}>
          <Box mr={3} fontSize="15px">{isDarkMode ? '☀️' : '�'}</Box>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Box>

        {/* Logout */}
        <Box display="flex" alignItems="center" px={3} py="9px" borderRadius="9px"
          cursor="pointer" color="rgba(255,100,100,0.70)" fontSize="sm" fontWeight="400"
          _hover={{ bg: 'rgba(255,77,77,0.12)', color: '#ff6b6b' }} transition="all 0.14s"
          onClick={handleLogout}>
          <Box mr={3} fontSize="15px">🚪</Box>
          Logout
        </Box>
      </Box>
    </Box>
  );
}

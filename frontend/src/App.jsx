import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, HStack, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { getToken, getUserFromToken, logout } from './utils/auth';
import { useState, useEffect } from 'react';

// Public pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Tenant pages
import Dashboard from './pages/Dashboard';
import BookingHistory from './pages/BookingHistory';
import Wallet from './pages/Wallet';

// Admin + Landlord dashboards
import AdminDashboard from './pages/AdminDashboard';
import LandlordDashboardMain from './pages/LandlordDashboardMain';

// Shared / common pages
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';

import ProtectedRoute from './components/ProtectedRoute';

// Pages that handle their own full layout
const PUBLIC_ROUTES = ['/', '/login', '/signup'];

function TopBar() {
  const { isDarkMode, toggleTheme, text } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({ token: getToken(), user: getUserFromToken() });

  useEffect(() => {
    const onAuthChanged = () => setAuth({ token: getToken(), user: getUserFromToken() });
    window.addEventListener('authChanged', onAuthChanged);
    return () => window.removeEventListener('authChanged', onAuthChanged);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  // Derive a readable page title from the current path
  const pageTitle = {
    '/dashboard':          'Dashboard',
    '/landlord/dashboard': 'Landlord Dashboard',
    '/admin/dashboard':    'Admin Dashboard',
    '/properties':         'Properties',
    '/booking/history':    'My Bookings',
    '/requests':           'Requests',
    '/wallet':             'Wallet',
    '/profile':            'Profile',
  }[location.pathname] ?? 'Co‑Live';

    const pillBg     = isDarkMode ? '#252525' : '#f4f4f4';
    const pillBorder = isDarkMode ? '#333333' : '#e2e2e2';
    const pillHover  = isDarkMode ? '#2e2e2e' : '#ebebeb';
    const pillColor  = isDarkMode ? '#e0e0e0' : '#333333';

  return (
    <Box
      px={6} py={0}
      h="54px"
      bg={isDarkMode ? '#161616' : '#fafafa'}
      borderBottom="1px solid"
      borderColor={isDarkMode ? '#242424' : '#ececec'}
      boxShadow={isDarkMode ? '0 1px 0 rgba(255,255,255,0.04)' : '0 1px 6px rgba(0,0,0,0.05)'}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Page title */}
      <Text fontSize="sm" fontWeight="700" color={isDarkMode ? '#e0e0e0' : '#1a1a1a'} letterSpacing="-0.2px">
        {pageTitle}
      </Text>

      <HStack spacing={2}>
        {/* Dark mode toggle — pill style, same as user button */}
        <Box
          as="button"
          display="flex" alignItems="center" justifyContent="center"
          h="34px" w="34px"
          borderRadius="8px"
          bg={pillBg}
          border="1px solid"
          borderColor={pillBorder}
          color={pillColor}
          cursor="pointer"
          onClick={toggleTheme}
          _hover={{ bg: pillHover }}
          transition="all 0.14s"
          fontSize="16px"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </Box>

        {auth.token && (
          <Menu>
            {/* User pill — same height, border, bg as the theme button */}
            <MenuButton>
              <HStack
                spacing={2} align="center"
                h="34px" px={3}
                borderRadius="8px"
                bg={pillBg}
                border="1px solid"
                borderColor={pillBorder}
                cursor="pointer"
                _hover={{ bg: pillHover }}
                transition="all 0.14s"
              >
                <Avatar name={auth.user?.name || 'User'} size="xs" bg="#ff4d4d" color="white" />
                <Text fontSize="sm" fontWeight="600" color={pillColor}>
                  {auth.user?.name?.split(' ')[0] || 'User'}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList
              bg={isDarkMode ? '#242424' : 'white'}
              borderColor={isDarkMode ? '#3a3a3a' : '#e8e8e8'}
              boxShadow={isDarkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.10)'}
              py={1}
            >
              <MenuItem as={Link} to="/profile" color={text} fontSize="sm">👤 Profile</MenuItem>
              <MenuItem
                onClick={() => navigate(
                  auth.user?.role === 'admin' ? '/admin/dashboard' :
                  auth.user?.role === 'landlord' ? '/landlord/dashboard' : '/dashboard'
                )}
                color={text} fontSize="sm"
              >
                📊 Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout} color="#ff4d4d" fontWeight="600" fontSize="sm">
                🚪 Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Box>
  );
}

function AppContent() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  if (isPublic) {
    // Public pages render full-screen without any chrome
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Box display="flex" minH="100vh" bg={isDarkMode ? '#0f0f0f' : '#f4f5f7'}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content column */}
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        {/* Top bar */}
        <TopBar />

        {/* Page content — no Container, fills full width */}
        <Box flex="1" overflowY="auto" bg={isDarkMode ? '#0f0f0f' : '#f4f5f7'}>
          <Routes>
            {/* Tenant */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/booking/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

            {/* Landlord */}
            <Route path="/landlord/dashboard" element={<ProtectedRoute><LandlordDashboardMain /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* Shared */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

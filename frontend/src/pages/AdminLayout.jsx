// src/pages/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Box, VStack, Button, Heading, HStack, Spacer, IconButton, useToast } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('colive_token');
    localStorage.removeItem('colive_user');
    toast({
      title: 'Logged out',
      description: 'You have been signed out successfully.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    navigate('/login');
  };

  return (
    <HStack align="start" minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <VStack
        bg="white"
        w="220px"
        p={4}
        align="stretch"
        borderRight="1px solid"
        borderColor="gray.200"
        justify="space-between"
      >
        <Box>
          <Heading size="sm" color="red.500" mb={6}>Co-Live Admin</Heading>
          <VStack align="start" spacing={3}>
            <Link to="/admin/dashboard">Overview</Link>
            <Link to="/admin/dashboard/properties">Property Verification</Link>
            <Link to="/admin/dashboard/users">Users</Link>
            <Link to="/admin/dashboard/reports">Reports</Link>
            <Link to="/profile">Profile</Link>
          </VStack>
        </Box>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          colorScheme="red"
          variant="outline"
          leftIcon={<FaSignOutAlt />}
          size="sm"
        >
          Logout
        </Button>
      </VStack>

      {/* Main Content */}
      <Box flex="1" p={6}>
        <HStack mb={6}>
          <Heading size="lg">Admin Panel</Heading>
          <Spacer />
          <IconButton icon={<BellIcon />} aria-label="notifications" />
        </HStack>

        <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
          <Outlet /> {/* Child pages render here */}
        </Box>
      </Box>
    </HStack>
  );
}

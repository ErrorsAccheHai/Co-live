// src/pages/AdminDashboardMain.jsx
import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  IconButton,
  Heading,
  Text,
  Badge,
  Spacer,
  Avatar,
  Container,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import AdminVerification from './AdminDashboard'; // your existing admin file (the one that lists pending props)
import Properties from './Properties'; // optional admin properties view
import Profile from './Profile';

export default function AdminDashboardMain() {
  // Lightweight shared header/sidebar. For deep features (users/reports) create pages and route them.
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <VStack
        as="nav"
        spacing={6}
        align="stretch"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        minW={{ base: 14, md: 64 }}
        p={4}
      >
        <Heading size="sm" color="red.500">Co-Live Admin</Heading>

        <VStack align="start" spacing={2} pt={4}>
          <Text as="a" href="#overview" fontWeight="medium">Overview</Text>
          <Text as="a" href="#verify" fontWeight="medium">Property Verification</Text>
          <Text as="a" href="#properties" fontWeight="medium">All Properties</Text>
          <Text as="a" href="#users" fontWeight="medium">Users</Text>
          <Text as="a" href="#reports" fontWeight="medium">Reports</Text>
        </VStack>

        <Spacer />

        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Signed in as</Text>
          <HStack>
            <Avatar name="Admin" size="sm" />
            <Text fontSize="sm">Admin</Text>
          </HStack>
        </VStack>
      </VStack>

      {/* Main area */}
      <Box flex="1" p={6}>
        {/* Top bar */}
        <HStack mb={6}>
          <Heading size="lg">Admin Workspace</Heading>
          <Badge colorScheme="purple" ml={2}>Admin</Badge>
          <Spacer />
          <HStack spacing={4}>
            <IconButton aria-label="notifications" icon={<BellIcon />} />
            <Text fontSize="sm" color="gray.600">Realtime: <strong id="admin-pending-count">0</strong></Text>
            <Box textAlign="right">
              <Text fontSize="sm">System</Text>
              <Text fontSize="xs" color="green.500">All systems operational</Text>
            </Box>
          </HStack>
        </HStack>

        {/* Sections */}
        <Container maxW="container.xl" p={0}>
          {/* Overview */}
          <Box id="overview" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={2}>Overview</Heading>
            <Text color="gray.600" mb={3}>
              Quick stats and actions. (You can later plug in metrics endpoints here.)
            </Text>
            <HStack spacing={4}>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500">Pending Verifications</Text>
                <Heading size="md" id="overview-pending">0</Heading>
              </Box>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500">Total Users</Text>
                <Heading size="md">0</Heading>
              </Box>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500">Total Properties</Text>
                <Heading size="md">0</Heading>
              </Box>
            </HStack>
          </Box>

          {/* Verification - reuse your AdminVerification component */}
          <Box id="verify" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>Property Verification</Heading>
            <AdminVerification />
          </Box>

          {/* Admin properties (optional list) */}
          <Box id="properties" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>All Properties (Admin)</Heading>
            <Properties />
          </Box>

          {/* Users / Reports - placeholders */}
          <Box id="users" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={2}>Users</Heading>
            <Text color="gray.600">User management UI goes here. (Create pages / endpoints to manage roles, block/unblock, view details.)</Text>
          </Box>

          <Box id="reports" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={2}>Reports</Heading>
            <Text color="gray.600">Reports and exports UI placeholder.</Text>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
}

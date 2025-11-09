import React, { useState, useEffect } from 'react';
import { getAuthHeader } from '../utils/auth';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    Button,
    useToast,
    Badge,
    VStack,
    HStack,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Tabs,
    IconButton
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

const AdminDashboard = () => {
    const [pendingProperties, setPendingProperties] = useState([]);
    const [lastResponseStatus, setLastResponseStatus] = useState(null);
    const [lastResponseBody, setLastResponseBody] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const toast = useToast();

    useEffect(() => {
        // Check token on mount
        const token = localStorage.getItem('colive_token');
        console.log('AdminDashboard - Token check:', token ? 'present' : 'missing');
        if (!token) {
            toast({
                title: 'Authentication Error',
                description: 'No auth token found. Please log in again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        fetchPendingProperties();
        // start polling for pending count
        const interval = setInterval(() => {
            fetchPendingProperties();
        }, 20000);
        return () => clearInterval(interval);
    }, [toast]);

    const fetchPendingProperties = async () => {
        try {
                const headers = getAuthHeader();
                console.log('Fetching pending properties with headers:', headers);

                const response = await fetch('http://localhost:5000/api/property/admin/pending', {
                    headers: headers
                });
                const data = await response.json();

                console.log('Response status:', response.status);
                console.log('Response data:', data);

                // store debug info for UI
                setLastResponseStatus(response.status);
                setLastResponseBody(data);

                if (response.ok) {
                    setPendingProperties(data);
                    setPendingCount(Array.isArray(data) ? data.length : 0);
                } else {
                    throw new Error(data.msg || data.message || 'Failed to fetch properties');
                }
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch pending properties',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleVerification = async (propertyId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/property/admin/verify/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                const data = await response.json();
                toast({
                    title: status === 'approved' ? 'Property Approved' : 'Property Rejected',
                    description: `Successfully ${status} property: ${data.title}. Owner will be notified.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchPendingProperties();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update property status',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={8}>
                <Heading mb={6}>Admin Dashboard - Property Verification</Heading>
                {/* Debug + navigation area */}
                <HStack justify="space-between" mb={4}>
                    <Text fontSize="sm" color="gray.600">Token: {localStorage.getItem('colive_token') ? 'present' : 'missing'}</Text>
                    <HStack>
                        <IconButton aria-label="notifications" icon={<BellIcon />} size="sm" />
                        <Badge colorScheme="red">{pendingCount}</Badge>
                        <Button size="sm" onClick={fetchPendingProperties}>Refresh</Button>
                        <Text fontSize="sm" color="gray.500">Last status: {lastResponseStatus ?? '-'}</Text>
                    </HStack>
                </HStack>

                <Tabs variant="enclosed" mb={4}>
                    <TabList>
                        <Tab>Requests</Tab>
                        <Tab>Properties</Tab>
                        <Tab>Notifications</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text mb={3}>Pending verification requests</Text>
                            {/* Keep existing grid rendering here */}
                        </TabPanel>
                        <TabPanel>
                            <Text mb={3}>All properties (admin view)</Text>
                        </TabPanel>
                        <TabPanel>
                            <Text mb={3}>Notifications</Text>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {pendingProperties.map((property) => (
                        <Box
                            key={property._id}
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <VStack align="stretch" spacing={3}>
                                <Heading fontSize="xl">{property.title}</Heading>
                                <Text>{property.description}</Text>
                                <Text>Price: ${property.price}</Text>
                                <Text>
                                    {property.bedrooms} beds • {property.bathrooms} baths
                                </Text>
                                <Text>
                                    {property.address.city}, {property.address.state}
                                </Text>
                                <Text>
                                    Owner: {property.owner.name} ({property.owner.email})
                                </Text>
                                <Badge colorScheme="yellow">Pending Verification</Badge>
                                <HStack spacing={4} mt={4}>
                                    <Button
                                        colorScheme="green"
                                        onClick={() => handleVerification(property._id, 'approved')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => handleVerification(property._id, 'rejected')}
                                    >
                                        Reject
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
                {pendingProperties.length === 0 && (
                    <Box textAlign="center" mt={4}>
                        <Text>No pending properties for verification</Text>
                        <Text fontSize="sm" color="gray.600" mt={2}>Last response body:</Text>
                        <pre style={{ textAlign: 'left', maxHeight: 200, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
                            {lastResponseBody ? JSON.stringify(lastResponseBody, null, 2) : '---'}
                        </pre>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
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
    HStack
} from '@chakra-ui/react';

const AdminDashboard = () => {
    const [pendingProperties, setPendingProperties] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchPendingProperties();
    }, []);

    const fetchPendingProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/property/admin/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPendingProperties(data);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch pending properties',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleVerification = async (propertyId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/property/admin/verify/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: `Property ${status}`,
                    status: 'success',
                    duration: 3000,
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
                    <Text textAlign="center" mt={4}>
                        No pending properties for verification
                    </Text>
                )}
            </Box>
        </Container>
    );
};

export default AdminDashboard;
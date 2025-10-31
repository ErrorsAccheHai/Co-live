import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Button,
    SimpleGrid,
    Text,
    useToast,
    Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/property');
            const data = await response.json();
            if (response.ok) {
                setProperties(data);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch properties',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={8}>
                <Heading mb={4}>Available Properties</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {properties.map((property) => (
                        <Box
                            key={property._id}
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <Heading fontSize="xl" mb={2}>{property.title}</Heading>
                            <Text mb={2}>{property.description}</Text>
                            <Text mb={2}>Price: ${property.price}</Text>
                            <Text mb={2}>
                                {property.bedrooms} beds • {property.bathrooms} baths
                            </Text>
                            <Text mb={4}>
                                {property.address.city}, {property.address.state}
                            </Text>
                            <Button
                                colorScheme="blue"
                                onClick={() => navigate(`/property/${property._id}`)}
                            >
                                View Details
                            </Button>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </Container>
    );
};

export default Properties;
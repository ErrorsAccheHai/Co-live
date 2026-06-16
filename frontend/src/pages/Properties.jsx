import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Button, SimpleGrid, Text, useToast,
    Container, Badge, HStack, VStack, Image, Skeleton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { API_BASE } from '../config';
import { useTheme } from '../utils/ThemeContext';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();

    useEffect(() => { fetchProperties(); }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/property`);
            const data = await response.json();
            if (response.ok) setProperties(data);
        } catch (error) {
            toast({ title: 'Failed to fetch properties', status: 'error', duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (property) => {
        if (!getToken()) {
            localStorage.setItem('afterLogin', JSON.stringify({ action: 'view', propertyId: property._id }));
            navigate('/login');
            return;
        }
        navigate(`/properties/${property._id}`);
    };

    const handleBooking = (bookingData) => {
        toast({
            title: '🎉 Booking Submitted!',
            description: 'Your booking is awaiting landlord approval.',
            status: 'success',
            duration: 4000,
        });
        setIsModalOpen(false);
    };

    return (
        <Box bg={bg} minH="100vh">
            <Container maxW="container.xl" py={8}>
                {/* Header */}
                <HStack justify="space-between" mb={8}>
                    <Box>
                        <Heading color={text} fontWeight="800">Browse Properties</Heading>
                        <Text color={isDarkMode ? '#999' : 'gray.500'} mt={1}>
                            {properties.length} properties available
                        </Text>
                    </Box>
                </HStack>

                {/* Property Grid */}                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {[1,2,3,4,5,6].map(i => (
                            <Skeleton key={i} height="320px" borderRadius="16px" />
                        ))}
                    </SimpleGrid>
                ) : properties.length === 0 ? (
                    <Box textAlign="center" py={20} bg={bgSecondary} borderRadius="20px">
                        <Text fontSize="5xl" mb={4}>🏠</Text>
                        <Heading size="md" color={text} mb={2}>No properties yet</Heading>
                        <Text color={isDarkMode ? '#999' : 'gray.500'}>Check back soon for new listings.</Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {properties.map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                                onViewDetails={handleViewDetails}
                                isDarkMode={isDarkMode}
                                bgCard={bgSecondary}
                                text={text}
                                brand={brand}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    );
};

/* ─── Property Card ─────────────────────────────────────────── */
const PropertyCard = ({ property, onViewDetails, isDarkMode, bgCard, text, brand }) => {
    const image = property.images?.[0];

    return (
        <Box
            bg={bgCard}
            borderRadius="16px"
            overflow="hidden"
            boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            border="1px solid"
            borderColor={isDarkMode ? '#2a2a2a' : '#f0f0f0'}
            transition="transform .15s, box-shadow .15s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 10px 28px rgba(0,0,0,0.13)' }}
        >
            {/* Image */}
            <Box h="180px" bg={isDarkMode ? '#2a2a2a' : '#f0f0f0'} overflow="hidden" position="relative">
                {image ? (
                    <Image src={image} alt={property.title} w="100%" h="100%" objectFit="cover" />
                ) : (
                    <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" fontSize="4xl">
                        🏠
                    </Box>
                )}
                <Badge
                    position="absolute" top={3} right={3}
                    colorScheme={property.status === 'approved' ? 'green' : 'yellow'}
                    borderRadius="full" px={2}
                >
                    {property.status}
                </Badge>
            </Box>

            {/* Content */}
            <Box p={5}>
                <Heading fontSize="lg" color={brand} mb={1} noOfLines={1}>{property.title}</Heading>
                <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'} noOfLines={2} mb={3}>
                    {property.description}
                </Text>

                <HStack fontSize="sm" color={text} mb={2}>
                    <Text>🛏️ {property.bedrooms} Bed</Text>
                    <Text>🚿 {property.bathrooms} Bath</Text>
                </HStack>
                <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'} mb={3}>
                    📍 {property.address?.city}, {property.address?.state}
                </Text>

                <HStack justify="space-between" align="center" mb={4}>
                    <Text fontSize="xl" fontWeight="800" color={brand}>
                        ₹{property.price?.toLocaleString()}
                        <Text as="span" fontSize="sm" fontWeight="400">/mo</Text>
                    </Text>
                </HStack>

                <Button
                    w="full"
                    bg={brand}
                    color="white"
                    borderRadius="10px"
                    _hover={{ opacity: 0.85 }}
                    onClick={() => onViewDetails(property)}
                >
                    View Details & Book
                </Button>
            </Box>
        </Box>
    );
};

export default Properties;

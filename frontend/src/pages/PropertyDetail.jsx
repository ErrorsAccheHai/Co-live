import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Heading, Text, VStack, HStack, Badge, Button,
    SimpleGrid, Divider, Image, Skeleton, SkeletonText, Avatar,
    Wrap, WrapItem, useToast
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import { getToken } from '../utils/auth';
import { API_BASE } from '../config';
import PropertyDetailModal from '../components/PropertyDetailModal';

export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();
    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/property/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProperty(data);
            } else {
                toast({ title: 'Property not found', status: 'error', duration: 3000 });
                navigate('/properties');
            }
        } catch (e) {
            toast({ title: 'Failed to load property', status: 'error', duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleBook = () => {
        if (!getToken()) {
            localStorage.setItem('afterLogin', JSON.stringify({ action: 'view', propertyId: id }));
            navigate('/login');
            return;
        }
        setShowBookingModal(true);
    };

    const handleBookingSuccess = () => {
        toast({
            title: '🎉 Booking Submitted!',
            description: 'Awaiting landlord approval.',
            status: 'success', duration: 4000
        });
        setShowBookingModal(false);
    };

    if (loading) return <LoadingSkeleton bg={bg} bgCard={bgCard} />;
    if (!property) return null;

    const images = property.images?.length ? property.images : [];
    const amenities = property.amenities || [];

    return (
        <Box bg={bg} minH="100vh" pb={12}>
            <Container maxW="container.xl" py={8}>

                {/* Back button */}
                <Button variant="ghost" color={brand} mb={6} onClick={() => navigate('/properties')}
                    leftIcon={<Text>←</Text>}>
                    Back to Properties
                </Button>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>

                    {/* ── Left: Images ── */}
                    <Box>
                        {/* Main image */}
                        <Box h="360px" borderRadius="20px" overflow="hidden" bg={isDarkMode ? '#2a2a2a' : '#f0f0f0'} mb={3} position="relative">
                            {images.length > 0 ? (
                                <Image src={images[currentImage]} alt={property.title}
                                    w="100%" h="100%" objectFit="cover" />
                            ) : (
                                <Box w="100%" h="100%" display="flex" alignItems="center"
                                    justifyContent="center" fontSize="6xl">🏠</Box>
                            )}
                            {/* Status badge */}
                            <Badge position="absolute" top={4} right={4} borderRadius="full" px={3} py={1}
                                colorScheme={property.status === 'approved' ? 'green' : 'yellow'}
                                fontSize="sm">
                                {property.status}
                            </Badge>
                        </Box>

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <HStack spacing={2} overflowX="auto" pb={2}>
                                {images.map((img, i) => (
                                    <Box key={i} w="72px" h="72px" borderRadius="10px" overflow="hidden"
                                        border="2px solid" cursor="pointer"
                                        borderColor={currentImage === i ? brand : 'transparent'}
                                        flexShrink={0}
                                        onClick={() => setCurrentImage(i)}>
                                        <Image src={img} alt="" w="100%" h="100%" objectFit="cover" />
                                    </Box>
                                ))}
                            </HStack>
                        )}
                    </Box>

                    {/* ── Right: Details ── */}
                    <VStack align="stretch" spacing={5}>
                        {/* Title & price */}
                        <Box>
                            <Heading size="lg" color={text} fontWeight="800" mb={1}>
                                {property.title}
                            </Heading>
                            <Text color={isDarkMode ? '#999' : 'gray.500'} fontSize="sm">
                                📍 {[property.address?.street, property.address?.city, property.address?.state]
                                    .filter(Boolean).join(', ')}
                                {property.address?.zipCode ? ` - ${property.address.zipCode}` : ''}
                            </Text>
                        </Box>

                        {/* Price */}
                        <Box bg={bgCard} borderRadius="16px" p={5} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>Pricing</Text>
                            <HStack spacing={6} flexWrap="wrap">
                                <Box>
                                    <Text fontSize="2xl" fontWeight="900" color={brand}>
                                        ₹{property.price?.toLocaleString()}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">Buy / Base Price</Text>
                                </Box>
                                {property.pricing?.dailyRate > 0 && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="700" color={brand}>
                                            ₹{property.pricing.dailyRate.toLocaleString()}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">Per Day</Text>
                                    </Box>
                                )}
                                {property.pricing?.monthlyRate > 0 && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="700" color={brand}>
                                            ₹{property.pricing.monthlyRate.toLocaleString()}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">Per Month</Text>
                                    </Box>
                                )}
                                {property.pricing?.yearlyRate > 0 && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="700" color={brand}>
                                            ₹{property.pricing.yearlyRate.toLocaleString()}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">Per Year</Text>
                                    </Box>
                                )}
                            </HStack>
                        </Box>

                        {/* Key stats */}
                        <SimpleGrid columns={3} spacing={3}>
                            {[
                                { icon: '🛏️', label: 'Bedrooms', value: property.bedrooms },
                                { icon: '🚿', label: 'Bathrooms', value: property.bathrooms },
                                { icon: '👥', label: 'Capacity', value: property.capacity || 1 },
                            ].map(s => (
                                <Box key={s.label} bg={bgCard} borderRadius="12px" p={4}
                                    textAlign="center" boxShadow="0 2px 8px rgba(0,0,0,0.06)">
                                    <Text fontSize="2xl">{s.icon}</Text>
                                    <Text fontWeight="800" fontSize="xl" color={text}>{s.value}</Text>
                                    <Text fontSize="xs" color="gray.500">{s.label}</Text>
                                </Box>
                            ))}
                        </SimpleGrid>

                        {/* Book buttons */}
                        <VStack spacing={2}>
                            <Button w="full" bg={brand} color="white" borderRadius="12px"
                                size="lg" fontWeight="700" _hover={{ opacity: 0.85 }}
                                onClick={handleBook}>
                                🏠 Rent / Buy This Property
                            </Button>
                        </VStack>
                    </VStack>
                </SimpleGrid>

                {/* ── Description ── */}
                <Box bg={bgCard} borderRadius="16px" p={6} mt={8} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                    <Text fontWeight="700" color={text} mb={3}>About this Property</Text>
                    <Text color={isDarkMode ? '#bbb' : 'gray.600'} lineHeight="tall">
                        {property.description || 'No description provided.'}
                    </Text>
                </Box>

                {/* ── Amenities ── */}
                {amenities.length > 0 && (
                    <Box bg={bgCard} borderRadius="16px" p={6} mt={6} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                        <Text fontWeight="700" color={text} mb={4}>Amenities</Text>
                        <Wrap spacing={3}>
                            {amenities.map((a, i) => (
                                <WrapItem key={i}>
                                    <Badge borderRadius="full" px={3} py={1}
                                        bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'}
                                        color={brand} fontSize="sm">
                                        ✅ {a}
                                    </Badge>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                )}

                {/* ── Rules & Facilities ── */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
                    {property.rules?.length > 0 && (
                        <Box bg={bgCard} borderRadius="16px" p={6} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                            <Text fontWeight="700" color={text} mb={3}>House Rules</Text>
                            <VStack align="stretch" spacing={2}>
                                {property.rules.map((r, i) => (
                                    <HStack key={i} spacing={2}>
                                        <Text color={brand}>•</Text>
                                        <Text fontSize="sm" color={isDarkMode ? '#bbb' : 'gray.600'}>
                                            {r.title || r}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    )}
                    {property.facilities?.length > 0 && (
                        <Box bg={bgCard} borderRadius="16px" p={6} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                            <Text fontWeight="700" color={text} mb={3}>Facilities</Text>
                            <VStack align="stretch" spacing={2}>
                                {property.facilities.map((f, i) => (
                                    <HStack key={i} spacing={2}>
                                        <Text color="green.400">✓</Text>
                                        <Text fontSize="sm" color={isDarkMode ? '#bbb' : 'gray.600'}>
                                            {f.name || f}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </SimpleGrid>

                {/* ── Owner ── */}
                {property.owner && (
                    <Box bg={bgCard} borderRadius="16px" p={6} mt={6} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                        <Text fontWeight="700" color={text} mb={4}>Listed by</Text>
                        <HStack spacing={4}>
                            <Avatar name={property.owner.name} size="md"
                                bgGradient="linear(to-br, #ff4d4d, #ff8c8c)" color="white" />
                            <Box>
                                <Text fontWeight="700" color={text}>{property.owner.name}</Text>
                                <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'}>
                                    📧 {property.owner.email}
                                </Text>
                                {property.owner.phone && (
                                    <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'}>
                                        📱 {property.owner.phone}
                                    </Text>
                                )}
                            </Box>
                        </HStack>
                    </Box>
                )}
            </Container>

            {/* Booking Modal */}
            {property && showBookingModal && (
                <PropertyDetailModal
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    property={property}
                    onBook={handleBookingSuccess}
                />
            )}
        </Box>
    );
}

/* ─── Loading Skeleton ───────────────────────────────────────── */
const LoadingSkeleton = ({ bg, bgCard }) => (
    <Box bg={bg} minH="100vh">
        <Container maxW="container.xl" py={8}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Skeleton h="360px" borderRadius="20px" />
                <VStack align="stretch" spacing={5}>
                    <Skeleton h="40px" borderRadius="10px" />
                    <Skeleton h="20px" w="60%" borderRadius="10px" />
                    <Skeleton h="100px" borderRadius="16px" />
                    <SimpleGrid columns={3} spacing={3}>
                        <Skeleton h="80px" borderRadius="12px" />
                        <Skeleton h="80px" borderRadius="12px" />
                        <Skeleton h="80px" borderRadius="12px" />
                    </SimpleGrid>
                    <Skeleton h="50px" borderRadius="12px" />
                </VStack>
            </SimpleGrid>
            <Box bg={bgCard} borderRadius="16px" p={6} mt={8}>
                <SkeletonText noOfLines={4} spacing={3} />
            </Box>
        </Container>
    </Box>
);

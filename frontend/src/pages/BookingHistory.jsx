import React, { useState, useEffect } from 'react';
import {
    Box, Container, Heading, Text, VStack, HStack, Badge,
    Button, Skeleton, Divider, useToast, SimpleGrid
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import { getToken } from '../utils/auth';
import { API_BASE } from '../config';

const TABS = ['All', 'Confirmed', 'Pending', 'Cancelled'];

const statusColor = (s) => {
    if (s === 'confirmed') return 'green';
    if (s === 'cancelled' || s === 'rejected') return 'red';
    if (s === 'payment_completed') return 'blue';
    return 'yellow';
};

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();
    const toast = useToast();
    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/booking/my-bookings?limit=50`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data.bookings || []);
            }
        } catch (e) {
            toast({ title: 'Failed to load bookings', status: 'error', duration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Cancel this booking? A partial refund may apply.')) return;
        try {
            const res = await fetch(`${API_BASE}/api/booking/${bookingId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ reason: 'Cancelled by tenant' })
            });
            if (res.ok) {
                const data = await res.json();
                toast({
                    title: 'Booking Cancelled',
                    description: data.refundAmount > 0 ? `₹${data.refundAmount} refunded to your wallet.` : 'No refund applicable.',
                    status: 'info', duration: 3000
                });
                fetchBookings();
            }
        } catch (e) {
            toast({ title: 'Failed to cancel', status: 'error' });
        }
    };

    const filtered = bookings.filter(b => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Confirmed') return b.bookingStatus === 'confirmed';
        if (activeTab === 'Pending') return ['awaiting_payment', 'payment_completed'].includes(b.bookingStatus);
        if (activeTab === 'Cancelled') return ['cancelled', 'rejected'].includes(b.bookingStatus);
        return true;
    });

    return (
        <Box bg={bg} minH="100vh">
            <Container maxW="container.lg" py={8}>
                <Box mb={8}>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={1}>
                        Tenant
                    </Text>
                    <Heading color={text} fontWeight="800">📋 My Bookings</Heading>
                    <Text color={isDarkMode ? '#999' : 'gray.500'} mt={1}>
                        Track and manage all your property bookings.
                    </Text>
                </Box>

                {/* Tabs */}
                <HStack spacing={2} mb={6} flexWrap="wrap">
                    {TABS.map(tab => (
                        <Button key={tab} size="sm" borderRadius="full"
                            bg={activeTab === tab ? brand : isDarkMode ? '#2a2a2a' : '#f0f0f0'}
                            color={activeTab === tab ? 'white' : text}
                            _hover={{ bg: activeTab === tab ? brand : isDarkMode ? '#333' : '#e0e0e0' }}
                            onClick={() => setActiveTab(tab)}>
                            {tab}
                            {tab !== 'All' && (
                                <Badge ml={2} borderRadius="full" fontSize="xs"
                                    bg={activeTab === tab ? 'whiteAlpha.300' : 'transparent'}
                                    color={activeTab === tab ? 'white' : 'gray.500'}>
                                    {bookings.filter(b => {
                                        if (tab === 'Confirmed') return b.bookingStatus === 'confirmed';
                                        if (tab === 'Pending') return ['awaiting_payment','payment_completed'].includes(b.bookingStatus);
                                        if (tab === 'Cancelled') return ['cancelled','rejected'].includes(b.bookingStatus);
                                        return false;
                                    }).length}
                                </Badge>
                            )}
                        </Button>
                    ))}
                </HStack>

                {/* Booking List */}
                {loading ? (
                    <VStack spacing={4}>
                        {[1,2,3].map(i => <Skeleton key={i} h="140px" borderRadius="16px" w="full" />)}
                    </VStack>
                ) : filtered.length === 0 ? (
                    <Box textAlign="center" py={16} bg={bgCard} borderRadius="20px">
                        <Text fontSize="4xl" mb={3}>📋</Text>
                        <Heading size="md" color={text} mb={2}>No bookings found</Heading>
                        <Text color={isDarkMode ? '#999' : 'gray.500'} fontSize="sm">
                            {activeTab === 'All' ? 'You haven\'t made any bookings yet.' : `No ${activeTab.toLowerCase()} bookings.`}
                        </Text>
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {filtered.map(booking => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                onCancel={handleCancel}
                                isDarkMode={isDarkMode}
                                bgCard={bgCard}
                                text={text}
                                brand={brand}
                            />
                        ))}
                    </VStack>
                )}
            </Container>
        </Box>
    );
}

const BookingCard = ({ booking, onCancel, isDarkMode, bgCard, text, brand }) => {
    const amount = booking.rentDetails?.totalPrice || booking.buyDetails?.totalPrice || 0;
    const canCancel = !['cancelled', 'rejected', 'completed'].includes(booking.bookingStatus);

    return (
        <Box bg={bgCard} borderRadius="16px" overflow="hidden"
            boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            border="1px solid" borderColor={isDarkMode ? '#2a2a2a' : '#f0f0f0'}>
            <Box h="4px" bg={
                booking.bookingStatus === 'confirmed' ? 'green.400' :
                booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'rejected' ? 'red.400' :
                booking.bookingStatus === 'payment_completed' ? 'blue.400' : 'yellow.400'
            } />
            <Box p={5}>
                <HStack justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                    <Box>
                        <Text fontWeight="700" fontSize="lg" color={brand}>
                            {booking.property?.title || 'Property'}
                        </Text>
                        <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'}>
                            📍 {booking.property?.address?.city || '—'}
                        </Text>
                    </Box>
                    <VStack align="flex-end" spacing={1}>
                        <Badge colorScheme={statusColor(booking.bookingStatus)} borderRadius="full" px={2}>
                            {booking.bookingStatus?.replace(/_/g, ' ')}
                        </Badge>
                        <Badge colorScheme="purple" borderRadius="full" px={2} textTransform="capitalize">
                            {booking.bookingType}
                        </Badge>
                    </VStack>
                </HStack>

                <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} mb={3} />

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={3}>
                    <Box>
                        <Text fontSize="xs" color="gray.500">Amount Paid</Text>
                        <Text fontWeight="700" color={brand}>₹{amount.toLocaleString()}</Text>
                    </Box>
                    {booking.bookingType === 'rent' && booking.rentDetails && (
                        <>
                            <Box>
                                <Text fontSize="xs" color="gray.500">Check-in</Text>
                                <Text fontSize="sm" fontWeight="600" color={text}>
                                    {booking.rentDetails.startDate
                                        ? new Date(booking.rentDetails.startDate).toLocaleDateString()
                                        : '—'}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="xs" color="gray.500">Check-out</Text>
                                <Text fontSize="sm" fontWeight="600" color={text}>
                                    {booking.rentDetails.endDate
                                        ? new Date(booking.rentDetails.endDate).toLocaleDateString()
                                        : '—'}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="xs" color="gray.500">Duration</Text>
                                <Text fontSize="sm" fontWeight="600" color={text}>
                                    {booking.rentDetails.nights} {booking.rentDetails.period}(s)
                                </Text>
                            </Box>
                        </>
                    )}
                    <Box>
                        <Text fontSize="xs" color="gray.500">Booked on</Text>
                        <Text fontSize="sm" fontWeight="600" color={text}>
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </Text>
                    </Box>
                </SimpleGrid>

                {/* Landlord info */}
                {booking.landlord && (
                    <Box p={3} bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" mb={3}>
                        <Text fontSize="xs" color="gray.500" mb={1}>Owner</Text>
                        <HStack>
                            <Text fontSize="sm" fontWeight="600" color={text}>👤 {booking.landlord.name}</Text>
                            <Text fontSize="xs" color={isDarkMode ? '#999' : 'gray.500'}>· {booking.landlord.email}</Text>
                        </HStack>
                    </Box>
                )}

                {canCancel && (
                    <Button size="sm" colorScheme="red" variant="outline" borderRadius="10px"
                        onClick={() => onCancel(booking._id)}>
                        Cancel Booking
                    </Button>
                )}
            </Box>
        </Box>
    );
};

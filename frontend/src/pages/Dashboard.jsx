import React, { useState, useEffect } from 'react';
import {
    Box, Text, VStack, HStack, Button,
    SimpleGrid, Badge, Skeleton, Heading
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken, getToken } from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';
import { API_BASE } from '../config';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode, bgSecondary, text } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const userData = getUserFromToken();
        if (!userData) { navigate('/login'); return; }
        setUser(userData);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [walletRes, bookingsRes] = await Promise.all([
                fetch(`${API_BASE}/api/wallet/balance`, { headers }),
                fetch(`${API_BASE}/api/booking/my-bookings?limit=5`, { headers }),
            ]);
            if (walletRes.ok) {
                const w = await walletRes.json();
                setWalletBalance(w.balance);
            }
            if (bookingsRes.ok) {
                const b = await bookingsRes.json();
                setBookings(b.bookings || []);
            }
        } catch (e) {
            console.error('Dashboard fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const pendingBookings   = bookings.filter(b => ['awaiting_payment', 'payment_completed'].includes(b.bookingStatus)).length;

    const stats = [
        { label: 'Wallet Balance',  value: walletBalance !== null ? `₹${walletBalance.toLocaleString()}` : '—', icon: '💰', accent: '#ff4d4d', iconBg: isDarkMode ? 'rgba(255,77,77,0.20)' : 'rgba(255,77,77,0.10)' },
        { label: 'Active Bookings', value: confirmedBookings, icon: '🏠', accent: isDarkMode ? '#ff6b6b' : '#e63c3c', iconBg: isDarkMode ? 'rgba(255,107,107,0.20)' : 'rgba(230,60,60,0.10)' },
        { label: 'Pending',         value: pendingBookings,   icon: '⏳', accent: isDarkMode ? '#ffaa00' : '#dd8800', iconBg: isDarkMode ? 'rgba(255,170,0,0.20)' : 'rgba(221,136,0,0.10)' },
        { label: 'Total Bookings',  value: bookings.length,   icon: '📋', accent: isDarkMode ? '#60a5fa' : '#2563eb', iconBg: isDarkMode ? 'rgba(96,165,250,0.20)' : 'rgba(37,99,235,0.10)' },
    ];

    return (
        <Box p={6} minH="100%">

            {/* Welcome Banner */}
            <Box
                mb={6}
                p={6}
                borderRadius="20px"
                bgGradient="linear(135deg, #ff4d4d, #ff6b6b)"
                boxShadow="0 8px 30px rgba(255,77,77,0.28)"
                color="white"
            >
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase"
                    letterSpacing="widest" opacity={0.8} mb={1}>
                    Tenant Dashboard
                </Text>
                <Heading fontWeight="800" fontSize="2xl" mb={1}>
                    Welcome back, {user.name}! 👋
                </Heading>
                <Text opacity={0.85} fontSize="sm">
                    Here's an overview of your activity.
                </Text>
            </Box>

            {/* Stat Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
                {stats.map((s) => (
                    <StatCard
                        key={s.label}
                        {...s}
                        bgCard={bgSecondary}
                        text={text}
                        loading={loading}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </SimpleGrid>

            {/* Recent Bookings */}
            <Box
                bg={bgSecondary}
                borderRadius="16px"
                p={6}
                boxShadow={isDarkMode
                    ? '0 2px 16px rgba(0,0,0,0.30)'
                    : '0 2px 16px rgba(0,0,0,0.06)'}
                borderTop="3px solid #ff4d4d"
            >
                <HStack justify="space-between" mb={4}>
                    <Text fontWeight="700" fontSize="md" color={text}>Recent Bookings</Text>
                    <Button as={Link} to="/booking/history" size="sm" variant="ghost"
                        color="#ff4d4d" fontWeight="600"
                        _hover={{ bg: isDarkMode ? 'rgba(255,77,77,0.15)' : '#fff0f0' }}>
                        View all →
                    </Button>
                </HStack>

                {loading ? (
                    <VStack spacing={3}>
                        {[1, 2, 3].map(i => <Skeleton key={i} h="60px" borderRadius="10px" w="full" />)}
                    </VStack>
                ) : bookings.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Text fontSize="3xl" mb={2}>🏠</Text>
                        <Text color={isDarkMode ? '#999' : 'gray.500'} fontSize="sm">
                            No bookings yet. Start by browsing properties!
                        </Text>
                        <Button
                            as={Link} to="/properties" mt={4} size="sm"
                            bgGradient="linear(135deg, #ff4d4d, #ff6b6b)"
                            color="white" borderRadius="10px" fontWeight="600"
                            _hover={{ bgGradient: 'linear(135deg, #e63c3c, #ff4d4d)', boxShadow: '0 4px 14px rgba(255,77,77,0.30)' }}
                        >
                            Browse Now
                        </Button>
                    </Box>
                ) : (
                    <VStack spacing={3} align="stretch">
                        {bookings.map((booking) => (
                            <Box key={booking._id} p={4}
                                bg={isDarkMode ? '#2a2a2a' : '#fff5f5'}
                                borderRadius="12px" borderLeft="3px solid #ff4d4d">
                                <HStack justify="space-between">
                                    <Box>
                                        <Text fontWeight="600" fontSize="sm" color={text}>
                                            {booking.property?.title || 'Property'}
                                        </Text>
                                        <Text fontSize="xs" color={isDarkMode ? '#999' : 'gray.500'} textTransform="capitalize">
                                            {booking.bookingType} · {new Date(booking.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                    <Badge
                                        colorScheme={
                                            booking.bookingStatus === 'confirmed' ? 'green' :
                                            ['cancelled', 'rejected'].includes(booking.bookingStatus) ? 'red' : 'yellow'
                                        }
                                        borderRadius="full" px={2}
                                    >
                                        {booking.bookingStatus}
                                    </Badge>
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                )}
            </Box>
        </Box>
    );
}

function StatCard({ label, value, icon, accent, iconBg, bgCard, text, loading, isDarkMode }) {
    return (
        <Box
            bg={bgCard}
            borderRadius="16px"
            p={5}
            boxShadow={isDarkMode
                ? '0 2px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.40)'
                : '0 4px 20px rgba(0,0,0,0.07)'}
            borderTop="3px solid"
            borderTopColor={accent}
            transition="transform 0.15s ease, box-shadow 0.15s ease"
            _hover={{
                transform: 'translateY(-3px)',
                boxShadow: isDarkMode ? '0 8px 28px rgba(0,0,0,0.55)' : '0 8px 28px rgba(0,0,0,0.12)',
            }}
        >
            <HStack justify="space-between" align="flex-start">
                <Box flex="1">
                    <Text
                        fontSize="10px" fontWeight="700"
                        color={isDarkMode ? '#888' : '#999'}
                        textTransform="uppercase" letterSpacing="widest" mb={2}
                    >
                        {label}
                    </Text>
                    {loading ? (
                        <Skeleton h="32px" w="60px" />
                    ) : (
                        <Text fontSize="2xl" fontWeight="800" color={isDarkMode ? '#f0f0f0' : '#111'} lineHeight="1">
                            {value}
                        </Text>
                    )}
                </Box>
                <Box
                    fontSize="xl" p={2} bg={iconBg} borderRadius="12px" flexShrink={0}
                    border={isDarkMode ? '1px solid rgba(255,255,255,0.08)' : 'none'}
                >
                    {icon}
                </Box>
            </HStack>
            {/* Accent color shown as small bar label */}
            <Box mt={3} h="2px" bg={accent} opacity={0.25} borderRadius="full" />
        </Box>
    );
}

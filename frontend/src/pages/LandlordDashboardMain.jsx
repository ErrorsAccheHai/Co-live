import React, { useEffect, useState } from 'react';
import {
    Box, VStack, HStack, Button, Heading, Badge, useToast,
    Text, SimpleGrid, Skeleton
} from '@chakra-ui/react';
import MyProperties from './MyProperties';
import Requests from './Requests';
import { getAuthHeader } from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';
import { API_BASE } from '../config';

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, accent, bg, text, isDarkMode }) => (
    <Box bg={bg} borderRadius="16px" p={5}
        boxShadow={isDarkMode
            ? '0 2px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.40)'
            : '0 4px 20px rgba(0,0,0,0.07)'}
        borderTop="3px solid" borderTopColor={accent}
        transition="transform .15s, box-shadow .15s"
        _hover={{ transform: 'translateY(-3px)', boxShadow: isDarkMode ? '0 8px 28px rgba(0,0,0,0.55)' : '0 8px 28px rgba(0,0,0,0.12)' }}>
        <HStack justify="space-between" align="flex-start">
            <Box>
                <Text fontSize="10px" fontWeight="700" color={isDarkMode ? '#888' : '#999'}
                    textTransform="uppercase" letterSpacing="widest" mb={2}>{label}</Text>
                <Text fontSize="2xl" fontWeight="800" color={isDarkMode ? '#f0f0f0' : '#111'} lineHeight="1">{value}</Text>
            </Box>
            <Box fontSize="xl" p={2} bg={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}
                borderRadius="12px">{icon}</Box>
        </HStack>
    </Box>
);

/* ─── Tab Button ─────────────────────────────────────────────── */
const TabBtn = ({ icon, label, active, badge, onClick, isDarkMode, brand }) => (
    <Button onClick={onClick} variant="ghost" borderRadius="10px" px={4} py={2} h="auto"
        bg={active ? brand : 'transparent'}
        color={active ? 'white' : isDarkMode ? '#aaa' : '#555'}
        fontWeight={active ? '700' : '500'} fontSize="sm"
        _hover={{ bg: active ? brand : isDarkMode ? 'rgba(255,255,255,0.06)' : '#f5f5f5' }}
        transition="all .14s">
        <HStack spacing={2}>
            <Text>{icon}</Text>
            <Text>{label}</Text>
            {badge > 0 && (
                <Badge bg={active ? 'white' : brand} color={active ? brand : 'white'}
                    borderRadius="full" fontSize="10px" px="6px" minW="18px">{badge}</Badge>
            )}
        </HStack>
    </Button>
);

/* ─── Booking Approval Card ─────────────────────────────────── */
const BookingApprovalCard = ({ booking, onApprove, onReject, isDarkMode, bgCard, text, brand }) => {
    const amount = booking.rentDetails?.totalPrice || booking.buyDetails?.totalPrice || 0;
    return (
        <Box bg={bgCard} borderRadius="16px" overflow="hidden"
            boxShadow={isDarkMode ? '0 4px 20px rgba(0,0,0,0.40)' : '0 2px 12px rgba(0,0,0,0.08)'}
            border="1px solid" borderColor={isDarkMode ? '#2e2e2e' : '#f0f0f0'}>
            <Box h="3px" bgGradient="linear(to-r, #ff4d4d, #ff8c8c)" />
            <Box p={5}>
                <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="yellow" borderRadius="full" px={2} textTransform="capitalize">
                        {booking.bookingType}
                    </Badge>
                    <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'}>
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </Text>
                </HStack>
                <Text fontWeight="700" color={brand} mb={1}>{booking.property?.title || 'Property'}</Text>
                <Box p={3} bg={isDarkMode ? '#252525' : '#f9f9f9'} borderRadius="10px" mb={3}>
                    <Text fontSize="sm" fontWeight="600" color={text}>👤 {booking.tenant?.name}</Text>
                    <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'}>📧 {booking.tenant?.email}</Text>
                    {booking.tenant?.phone && (
                        <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'}>📱 {booking.tenant?.phone}</Text>
                    )}
                </Box>
                {booking.bookingType === 'rent' && booking.rentDetails && (
                    <HStack fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'} mb={3}>
                        <Text>📅 {new Date(booking.rentDetails.startDate).toLocaleDateString()}</Text>
                        <Text>→</Text>
                        <Text>{new Date(booking.rentDetails.endDate).toLocaleDateString()}</Text>
                    </HStack>
                )}
                <Text fontSize="xl" fontWeight="800" color={brand} mb={4}>₹{amount.toLocaleString()}</Text>
                <HStack spacing={2}>
                    <Button flex={1} size="sm" borderRadius="10px" bg="green.500" color="white"
                        _hover={{ bg: 'green.600' }} onClick={() => onApprove(booking._id)}>✅ Approve</Button>
                    <Button flex={1} size="sm" borderRadius="10px" bg="red.500" color="white"
                        _hover={{ bg: 'red.600' }} onClick={() => onReject(booking._id)}>❌ Reject</Button>
                </HStack>
            </Box>
        </Box>
    );
};

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function LandlordDashboardMain() {
    const [notifications, setNotifications] = useState([]);
    const [propertiesCount, setPropertiesCount] = useState(0);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();

    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 20000);
        return () => clearInterval(interval);
    }, []);

    const fetchAll = async () => {
        const headers = getAuthHeader();
        try {
            const [propRes, bookingRes, earningsRes] = await Promise.all([
                fetch(`${API_BASE}/api/property/my-properties`, { headers }),
                fetch(`${API_BASE}/api/booking/landlord/pending`, { headers }),
                fetch(`${API_BASE}/api/booking/landlord/earnings`, { headers }),
            ]);
            if (propRes.ok) {
                const data = await propRes.json();
                const notifs = (data || []).flatMap(p =>
                    (p.notifications || []).map(n => ({ ...n, propertyTitle: p.title }))
                );
                setNotifications(notifs.reverse());
                setPropertiesCount((data || []).length);
            }
            if (bookingRes.ok) {
                const data = await bookingRes.json();
                setPendingBookings(data.bookings || []);
            }
            if (earningsRes.ok) {
                const data = await earningsRes.json();
                setEarnings(data.earnings);
            }
        } catch (err) {
            console.error('Landlord fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId) => {
        try {
            const res = await fetch(`${API_BASE}/api/booking/${bookingId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({ message: 'Approved' })
            });
            if (res.ok) { toast({ title: '✅ Booking Approved', status: 'success', duration: 2000 }); fetchAll(); }
        } catch (e) { toast({ title: 'Failed to approve', status: 'error' }); }
    };

    const handleReject = async (bookingId) => {
        try {
            const res = await fetch(`${API_BASE}/api/booking/${bookingId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({ message: 'Rejected' })
            });
            if (res.ok) { toast({ title: '❌ Booking Rejected — Refund processed', status: 'info', duration: 2000 }); fetchAll(); }
        } catch (e) { toast({ title: 'Failed to reject', status: 'error' }); }
    };

    const tabs = [
        { icon: '🏠', label: 'Overview',    badge: 0 },
        { icon: '⏳', label: 'Approvals',   badge: pendingBookings.length },
        { icon: '🏢', label: 'Properties',  badge: 0 },
        { icon: '📋', label: 'Requests',    badge: 0 },
    ];

    return (
        <Box p={6} minH="100%">

            {/* Page Header */}
            <HStack justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="11px" fontWeight="700" color={isDarkMode ? '#888' : '#999'}
                        textTransform="uppercase" letterSpacing="widest" mb={1}>
                        Landlord Panel
                    </Text>
                    <Heading size="lg" color={isDarkMode ? '#f0f0f0' : '#111'} fontWeight="800">
                        {tabs[activeTab].icon} {tabs[activeTab].label}
                    </Heading>
                </Box>
                {pendingBookings.length > 0 && (
                    <HStack bg={isDarkMode ? '#2a1a1a' : '#fff5f5'}
                        border="1px solid" borderColor={isDarkMode ? '#5a2a2a' : '#ffd5d5'}
                        borderRadius="12px" px={4} py={2} spacing={2}>
                        <Text>🔔</Text>
                        <Text fontSize="sm" fontWeight="700" color={brand}>
                            {pendingBookings.length} pending approval{pendingBookings.length > 1 ? 's' : ''}
                        </Text>
                    </HStack>
                )}
            </HStack>

            {/* Stat Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
                <StatCard label="Properties" value={propertiesCount} icon="🏢" accent={brand} bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Pending Approvals" value={pendingBookings.length} icon="⏳" accent="#f59e0b" bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Total Earnings" value={earnings ? `₹${earnings.totalEarnings?.toLocaleString()}` : '—'} icon="💰" accent="#22c55e" bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Active Bookings" value={earnings?.activeBookings ?? '—'} icon="✅" accent="#60a5fa" bg={bgCard} text={text} isDarkMode={isDarkMode} />
            </SimpleGrid>

            {/* Tab Bar */}
            <Box bg={bgCard} borderRadius="14px" p={2} mb={6} display="inline-flex" gap={1}
                boxShadow={isDarkMode ? '0 2px 12px rgba(0,0,0,0.30)' : '0 2px 12px rgba(0,0,0,0.06)'}>
                {tabs.map((tab, i) => (
                    <TabBtn key={i} icon={tab.icon} label={tab.label} badge={tab.badge}
                        active={activeTab === i} onClick={() => setActiveTab(i)}
                        isDarkMode={isDarkMode} brand={brand} />
                ))}
            </Box>

            {/* Overview Tab */}
            {activeTab === 0 && (
                <Box bg={bgCard} borderRadius="16px" p={6}
                    boxShadow={isDarkMode ? '0 4px 20px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.06)'}
                    borderTop="3px solid #ff4d4d">
                    <Text fontWeight="700" fontSize="md" color={text} mb={4}>🔔 Recent Activity</Text>
                    {loading ? (
                        <VStack spacing={3}>
                            {[1,2,3].map(i => <Skeleton key={i} h="70px" borderRadius="10px" w="full" />)}
                        </VStack>
                    ) : notifications.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Text fontSize="3xl" mb={2}>🔔</Text>
                            <Text color={isDarkMode ? '#888' : 'gray.500'} fontSize="sm">No notifications yet.</Text>
                        </Box>
                    ) : (
                        <VStack align="stretch" spacing={3} maxH="420px" overflowY="auto">
                            {notifications.slice(0, 10).map((n, idx) => (
                                <Box key={idx} p={4} borderRadius="12px"
                                    bg={isDarkMode ? '#252525' : '#fff5f5'}
                                    borderLeft="3px solid #ff4d4d">
                                    <HStack justify="space-between" mb={2}>
                                        <Badge colorScheme={n.type === 'rental' ? 'green' : 'blue'} borderRadius="full">
                                            {n.type === 'rental' ? '🏠 Rental' : '🏢 Purchase'}
                                        </Badge>
                                        <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'}>
                                            {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" fontWeight="600" color={text} mb={1}>{n.message}</Text>
                                    {n.userName && (
                                        <VStack align="start" spacing={0} fontSize="xs" color={isDarkMode ? '#888' : 'gray.600'}>
                                            <Text>👤 {n.userName}</Text>
                                            {n.userEmail && <Text>📧 {n.userEmail}</Text>}
                                            {n.userPhone && <Text>📱 {n.userPhone}</Text>}
                                        </VStack>
                                    )}
                                    <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'} mt={1}>📍 {n.propertyTitle}</Text>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            )}

            {/* Approvals Tab */}
            {activeTab === 1 && (
                pendingBookings.length === 0 ? (
                    <Box textAlign="center" p={12}
                        bg={isDarkMode ? '#0f1f0f' : '#f0fff4'}
                        borderRadius="20px" border="1px dashed"
                        borderColor={isDarkMode ? '#1a4a1a' : 'green.200'}>
                        <Text fontSize="4xl" mb={3}>✅</Text>
                        <Heading size="md" color={isDarkMode ? 'green.400' : 'green.600'} mb={1}>All caught up!</Heading>
                        <Text color={isDarkMode ? '#888' : 'gray.500'} fontSize="sm">No bookings awaiting your approval.</Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {pendingBookings.map(booking => (
                            <BookingApprovalCard key={booking._id} booking={booking}
                                onApprove={handleApprove} onReject={handleReject}
                                isDarkMode={isDarkMode} bgCard={bgCard} text={text} brand={brand} />
                        ))}
                    </SimpleGrid>
                )
            )}

            {/* Properties Tab */}
            {activeTab === 2 && <MyProperties />}

            {/* Requests Tab */}
            {activeTab === 3 && <Requests />}
        </Box>
    );
}

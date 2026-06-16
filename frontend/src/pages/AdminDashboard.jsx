import React, { useState, useEffect } from 'react';
import { getAuthHeader } from '../utils/auth';
import { API_BASE } from '../config';
import { useTheme } from '../utils/ThemeContext';
import {
    Box, Heading, Text, Button, Badge, VStack, HStack,
    Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Textarea, SimpleGrid, useToast,
    Divider
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon, CloseIcon, BellIcon } from '@chakra-ui/icons';

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, accent, bg, text, isDarkMode }) => (
    <Box
        bg={bg}
        borderRadius="16px"
        p={5}
        boxShadow={isDarkMode
            ? '0 2px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.40)'
            : '0 4px 20px rgba(0,0,0,0.07)'}
        borderTop="3px solid"
        borderTopColor={accent}
        transition="transform .15s, box-shadow .15s"
        _hover={{ transform: 'translateY(-3px)', boxShadow: isDarkMode ? '0 8px 28px rgba(0,0,0,0.55)' : '0 8px 28px rgba(0,0,0,0.12)' }}
    >
        <HStack justify="space-between" align="flex-start">
            <Box>
                <Text fontSize="10px" fontWeight="700" color={isDarkMode ? '#888' : '#999'}
                    textTransform="uppercase" letterSpacing="widest" mb={2}>
                    {label}
                </Text>
                <Text fontSize="2xl" fontWeight="800" color={isDarkMode ? '#f0f0f0' : '#111'} lineHeight="1">
                    {value}
                </Text>
            </Box>
            <Box fontSize="xl" p={2} bg={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}
                borderRadius="12px">
                {icon}
            </Box>
        </HStack>
    </Box>
);

/* ─── Pending Property Card ─────────────────────────────────── */
const PendingCard = ({ property, onVerify, isDarkMode, bgCard, text, brand }) => (
    <Box bg={bgCard} borderRadius="16px" overflow="hidden"
        boxShadow={isDarkMode ? '0 4px 20px rgba(0,0,0,0.40)' : '0 2px 12px rgba(0,0,0,0.08)'}
        border="1px solid" borderColor={isDarkMode ? '#2e2e2e' : '#f0f0f0'}
        transition="transform .15s" _hover={{ transform: 'translateY(-3px)' }}>
        <Box h="3px" bgGradient="linear(to-r, #ff4d4d, #ff8c8c)" />
        <Box p={5}>
            <HStack justify="space-between" mb={3}>
                <Heading fontSize="md" color={brand} noOfLines={1}>{property.title}</Heading>
                <Badge colorScheme="yellow" borderRadius="full" px={2}>Pending</Badge>
            </HStack>
            <Text fontSize="sm" color={isDarkMode ? '#888' : 'gray.500'} noOfLines={2} mb={3}>
                {property.description}
            </Text>
            <HStack spacing={4} fontSize="sm" color={text} mb={2}>
                <Text>🛏️ {property.bedrooms} Bed</Text>
                <Text>🚿 {property.bathrooms} Bath</Text>
            </HStack>
            <Text fontSize="sm" color={isDarkMode ? '#888' : 'gray.500'} mb={3}>
                📍 {property.address?.city}, {property.address?.state}
            </Text>
            <Text fontSize="xl" fontWeight="800" color={brand} mb={3}>
                ₹{property.price?.toLocaleString()}
                <Text as="span" fontSize="sm" fontWeight="400">/mo</Text>
            </Text>
            <Box p={3} bg={isDarkMode ? '#252525' : '#fff5f5'} borderRadius="10px" mb={4}>
                <Text fontSize="xs" color={text}>
                    👤 <strong>{property.owner?.name}</strong> &nbsp;·&nbsp; {property.owner?.email}
                </Text>
            </Box>
            <HStack spacing={2}>
                <Button flex={1} size="sm" borderRadius="10px" bg="green.500" color="white"
                    leftIcon={<CheckIcon />} _hover={{ bg: 'green.600' }}
                    onClick={() => onVerify(property._id, 'approved')}>
                    Approve
                </Button>
                <Button flex={1} size="sm" borderRadius="10px" bg="red.500" color="white"
                    leftIcon={<CloseIcon boxSize={2.5} />} _hover={{ bg: 'red.600' }}
                    onClick={() => onVerify(property._id, 'rejected')}>
                    Reject
                </Button>
            </HStack>
        </Box>
    </Box>
);

/* ─── Admin Property View ────────────────────────────────────── */
const AdminPropertyView = ({ property, onRemove, isDarkMode, bgCard, text, brand }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [removalReason, setRemovalReason] = useState('');
    const toast = useToast();
    const reportCount = property.reports?.length || 0;

    const handleRemove = async () => {
        if (!removalReason.trim()) {
            toast({ title: 'Provide a reason', status: 'warning', duration: 2000 });
            return;
        }
        await onRemove(property._id, removalReason);
        setRemovalReason('');
        onClose();
    };

    return (
        <>
            <Box bg={bgCard} borderRadius="16px" overflow="hidden"
                boxShadow={isDarkMode ? '0 4px 20px rgba(0,0,0,0.40)' : '0 2px 12px rgba(0,0,0,0.08)'}
                border="1px solid" borderColor={reportCount > 2 ? 'red.300' : isDarkMode ? '#2e2e2e' : '#f0f0f0'}
                transition="transform .15s" _hover={{ transform: 'translateY(-3px)' }}>
                <Box h="3px" bg={
                    property.status === 'approved' ? 'green.400' :
                    property.status === 'rejected' ? 'red.400' : 'yellow.400'
                } />
                <Box p={5}>
                    <HStack justify="space-between" mb={2}>
                        <Heading fontSize="md" color={brand} noOfLines={1}>{property.title}</Heading>
                        <Badge
                            colorScheme={property.status === 'approved' ? 'green' : property.status === 'rejected' ? 'red' : 'yellow'}
                            borderRadius="full" px={2}>
                            {property.status}
                        </Badge>
                    </HStack>
                    <Text fontSize="sm" color={isDarkMode ? '#888' : 'gray.500'} noOfLines={2} mb={3}>
                        {property.description}
                    </Text>
                    <Text fontSize="lg" fontWeight="800" color={brand} mb={2}>
                        ₹{property.price?.toLocaleString()}<Text as="span" fontSize="sm" fontWeight="400">/mo</Text>
                    </Text>
                    <HStack fontSize="sm" color={text} mb={2}>
                        <Text>🛏️ {property.bedrooms}</Text>
                        <Text>🚿 {property.bathrooms}</Text>
                        <Text>📍 {property.address?.city}</Text>
                    </HStack>
                    <Box p={2} bg={isDarkMode ? '#252525' : '#f9f9f9'} borderRadius="8px" mb={3}>
                        <Text fontSize="xs" color={text}>👤 <strong>{property.owner?.name}</strong></Text>
                    </Box>
                    {reportCount > 0 && (
                        <HStack mb={3}>
                            <Badge colorScheme={reportCount > 2 ? 'red' : 'orange'} borderRadius="full">
                                ⚠️ {reportCount} Report{reportCount > 1 ? 's' : ''}
                            </Badge>
                        </HStack>
                    )}
                    <Button w="full" size="sm" borderRadius="10px"
                        colorScheme="red" variant={reportCount > 0 ? 'solid' : 'outline'}
                        leftIcon={<DeleteIcon />} onClick={onOpen}>
                        Remove Listing
                    </Button>
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent bg={bgCard} color={text} borderRadius="16px">
                    <ModalHeader borderBottom="1px solid" borderColor={isDarkMode ? '#2e2e2e' : '#eee'}>
                        🗑️ Remove: {property.title}
                    </ModalHeader>
                    <ModalBody py={4}>
                        <Text fontSize="sm" mb={3} color={isDarkMode ? '#aaa' : 'gray.600'}>
                            Provide a reason — the landlord will be notified.
                        </Text>
                        <Textarea placeholder="e.g. Violates listing policy..."
                            value={removalReason} onChange={(e) => setRemovalReason(e.target.value)}
                            borderRadius="10px" rows={3}
                            bg={isDarkMode ? '#252525' : 'white'}
                            borderColor={isDarkMode ? '#3a3a3a' : 'gray.200'} />
                    </ModalBody>
                    <ModalFooter gap={2}>
                        <Button variant="ghost" onClick={onClose} borderRadius="10px">Cancel</Button>
                        <Button colorScheme="red" onClick={handleRemove} borderRadius="10px">Confirm Remove</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

/* ─── Tab Button ─────────────────────────────────────────────── */
const TabBtn = ({ icon, label, active, badge, onClick, isDarkMode, brand }) => (
    <Button
        onClick={onClick}
        variant="ghost"
        borderRadius="10px"
        px={4} py={2} h="auto"
        bg={active ? brand : 'transparent'}
        color={active ? 'white' : isDarkMode ? '#aaa' : '#555'}
        fontWeight={active ? '700' : '500'}
        fontSize="sm"
        _hover={{ bg: active ? brand : isDarkMode ? 'rgba(255,255,255,0.06)' : '#f5f5f5' }}
        transition="all .14s"
        position="relative"
    >
        <HStack spacing={2}>
            <Text>{icon}</Text>
            <Text>{label}</Text>
            {badge > 0 && (
                <Badge bg={active ? 'white' : brand} color={active ? brand : 'white'}
                    borderRadius="full" fontSize="10px" px="6px" minW="18px">
                    {badge}
                </Badge>
            )}
        </HStack>
    </Button>
);

/* ─── Main Dashboard ─────────────────────────────────────────── */
const AdminDashboard = () => {
    const [pendingProperties, setPendingProperties] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const [lastStatus, setLastStatus] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const toast = useToast();
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();

    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    useEffect(() => {
        const token = localStorage.getItem('colive_token');
        if (!token) { toast({ title: 'Not authenticated', status: 'error' }); return; }
        fetchPending();
        fetchAll();
        const interval = setInterval(() => { fetchPending(); fetchAll(); }, 20000);
        return () => clearInterval(interval);
    }, []);

    const fetchPending = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/property/admin/pending`, { headers: getAuthHeader() });
            const data = await res.json();
            setLastStatus(res.status);
            if (res.ok) { setPendingProperties(data); setPendingCount(Array.isArray(data) ? data.length : 0); }
        } catch (e) { console.error(e); }
    };

    const fetchAll = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/property`, { headers: getAuthHeader() });
            if (res.ok) setAllProperties(await res.json() || []);
        } catch (e) { console.error(e); }
    };

    const handleVerify = async (propertyId, status) => {
        try {
            const res = await fetch(`${API_BASE}/api/property/admin/verify/${propertyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast({ title: status === 'approved' ? '✅ Approved' : '❌ Rejected', status: 'success', duration: 2000 });
                fetchPending(); fetchAll();
            }
        } catch (e) { toast({ title: 'Update failed', status: 'error' }); }
    };

    const handleRemoveProperty = async (propertyId, reason) => {
        try {
            const res = await fetch(`${API_BASE}/api/property/${propertyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({ removalReason: reason })
            });
            if (res.ok) {
                toast({ title: '🗑️ Removed', description: 'Landlord notified', status: 'success', duration: 2000 });
                fetchAll();
            }
        } catch (e) { toast({ title: 'Removal failed', status: 'error' }); }
    };

    const approvedCount = allProperties.filter(p => p.status === 'approved').length;
    const rejectedCount = allProperties.filter(p => p.status === 'rejected').length;

    const tabs = [
        { icon: '✅', label: 'Verification', badge: pendingCount },
        { icon: '🏢', label: 'Properties', badge: 0 },
        { icon: '🔧', label: 'Debug', badge: 0 },
    ];

    return (
        <Box p={6} minH="100%">
            {/* Page Header */}
            <HStack justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="11px" fontWeight="700" color={isDarkMode ? '#888' : '#999'}
                        textTransform="uppercase" letterSpacing="widest" mb={1}>
                        Admin Panel
                    </Text>
                    <Heading size="lg" color={isDarkMode ? '#f0f0f0' : '#111'} fontWeight="800">
                        {tabs[activeTab].icon} {tabs[activeTab].label}
                    </Heading>
                </Box>
                {pendingCount > 0 && (
                    <HStack bg={isDarkMode ? '#2a1a1a' : '#fff5f5'}
                        border="1px solid" borderColor={isDarkMode ? '#5a2a2a' : '#ffd5d5'}
                        borderRadius="12px" px={4} py={2} spacing={2}>
                        <BellIcon color={brand} />
                        <Text fontSize="sm" fontWeight="700" color={brand}>
                            {pendingCount} pending review{pendingCount > 1 ? 's' : ''}
                        </Text>
                    </HStack>
                )}
            </HStack>

            {/* Stat Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
                <StatCard label="Total Listings" value={allProperties.length} icon="🏢" accent={brand} bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Pending Review" value={pendingCount} icon="⏳" accent="#f59e0b" bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Approved" value={approvedCount} icon="✅" accent="#22c55e" bg={bgCard} text={text} isDarkMode={isDarkMode} />
                <StatCard label="Rejected" value={rejectedCount} icon="❌" accent="#ef4444" bg={bgCard} text={text} isDarkMode={isDarkMode} />
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

            {/* Tab: Verification */}
            {activeTab === 0 && (
                pendingProperties.length === 0 ? (
                    <Box textAlign="center" p={12}
                        bg={isDarkMode ? '#0f1f0f' : '#f0fff4'}
                        borderRadius="20px" border="1px dashed"
                        borderColor={isDarkMode ? '#1a4a1a' : 'green.200'}>
                        <Text fontSize="4xl" mb={3}>✅</Text>
                        <Heading size="md" color={isDarkMode ? 'green.400' : 'green.600'} mb={1}>All caught up!</Heading>
                        <Text color={isDarkMode ? '#888' : 'gray.500'} fontSize="sm">No properties awaiting review.</Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                        {pendingProperties.map(p => (
                            <PendingCard key={p._id} property={p} onVerify={handleVerify}
                                isDarkMode={isDarkMode} bgCard={bgCard} text={text} brand={brand} />
                        ))}
                    </SimpleGrid>
                )
            )}

            {/* Tab: All Properties */}
            {activeTab === 1 && (
                allProperties.length === 0 ? (
                    <Box textAlign="center" p={12} bg={bgCard} borderRadius="20px">
                        <Text fontSize="4xl" mb={3}>🏢</Text>
                        <Text color={isDarkMode ? '#888' : 'gray.500'}>No properties listed yet.</Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                        {allProperties.map(p => (
                            <AdminPropertyView key={p._id} property={p} onRemove={handleRemoveProperty}
                                isDarkMode={isDarkMode} bgCard={bgCard} text={text} brand={brand} />
                        ))}
                    </SimpleGrid>
                )
            )}

            {/* Tab: Debug */}
            {activeTab === 2 && (
                <Box maxW="480px">
                    <Box bg={bgCard} borderRadius="16px" p={5}
                        boxShadow={isDarkMode ? '0 4px 20px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.06)'}>
                        <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'}
                            textTransform="uppercase" letterSpacing="wide" mb={3}>
                            System Info
                        </Text>
                        <VStack align="stretch" spacing={3} divider={<Divider borderColor={isDarkMode ? '#2e2e2e' : '#eee'} />}>
                            {[
                                { label: 'JWT Token', node: <Badge colorScheme={localStorage.getItem('colive_token') ? 'green' : 'red'} borderRadius="full">{localStorage.getItem('colive_token') ? '✅ Present' : '❌ Missing'}</Badge> },
                                { label: 'Last API Status', node: <Badge colorScheme={lastStatus === 200 ? 'green' : lastStatus === 401 ? 'red' : 'yellow'} borderRadius="full">{lastStatus ?? '—'}</Badge> },
                                { label: 'API Base', node: <Text fontSize="xs" color={isDarkMode ? '#888' : 'gray.500'} fontFamily="mono">{API_BASE}</Text> },
                                { label: 'Total Properties', node: <Badge colorScheme="blue" borderRadius="full">{allProperties.length}</Badge> },
                            ].map(({ label, node }) => (
                                <HStack key={label} justify="space-between">
                                    <Text fontSize="sm" color={text}>{label}</Text>
                                    {node}
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AdminDashboard;

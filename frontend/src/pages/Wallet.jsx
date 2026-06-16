import React, { useState, useEffect } from 'react';
import {
    Box, Container, Heading, Text, VStack, HStack, Badge,
    Button, Skeleton, Divider, useToast, Input, SimpleGrid
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import { getToken } from '../utils/auth';
import { API_BASE } from '../config';

const reasonColor = (r) => {
    if (r === 'deposit') return 'green';
    if (r === 'refund') return 'blue';
    if (r === 'payment') return 'red';
    return 'gray';
};

export default function Wallet() {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addAmount, setAddAmount] = useState('');
    const [adding, setAdding] = useState(false);
    const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();
    const toast = useToast();
    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    useEffect(() => { fetchWallet(); }, []);

    const fetchWallet = async () => {
        const headers = { Authorization: `Bearer ${getToken()}` };
        try {
            const [balRes, txRes] = await Promise.all([
                fetch(`${API_BASE}/api/wallet/balance`, { headers }),
                fetch(`${API_BASE}/api/wallet/transactions?limit=20`, { headers }),
            ]);
            if (balRes.ok) { const d = await balRes.json(); setBalance(d.balance); }
            if (txRes.ok) { const d = await txRes.json(); setTransactions(d.transactions || []); }
        } catch (e) {
            toast({ title: 'Failed to load wallet', status: 'error', duration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCredit = async (quickAmount) => {
        const amount = parseInt(quickAmount || addAmount);
        if (!amount || amount <= 0) {
            toast({ title: 'Enter a valid amount', status: 'warning', duration: 2000 });
            return;
        }
        if (amount > 50000) {
            toast({ title: 'Maximum ₹50,000 per transaction', status: 'warning', duration: 2000 });
            return;
        }
        try {
            setAdding(true);
            const res = await fetch(`${API_BASE}/api/wallet/add-credit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setBalance(data.balance);
                setAddAmount('');
                toast({ title: `✅ ₹${amount} added!`, status: 'success', duration: 2000 });
                fetchWallet();
            } else {
                toast({ title: data.error || 'Failed to add credit', status: 'error', duration: 2000 });
            }
        } catch (e) {
            toast({ title: 'Error adding credit', status: 'error', duration: 2000 });
        } finally {
            setAdding(false);
        }
    };

    const totalCredits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

    return (
        <Box bg={bg} minH="100vh">
            <Container maxW="container.md" py={8}>
                <Box mb={8}>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={1}>
                        Tenant
                    </Text>
                    <Heading color={text} fontWeight="800">💰 My Wallet</Heading>
                </Box>

                {/* Balance Card */}
                <Box bg={bgCard} borderRadius="20px" p={8} mb={6}
                    boxShadow="0 4px 24px rgba(255,77,77,0.12)"
                    bgGradient={isDarkMode
                        ? 'linear(to-br, #1e1e1e, #2a1a1a)'
                        : 'linear(to-br, #fff, #fff5f5)'}
                    border="1px solid" borderColor={isDarkMode ? '#3a2a2a' : '#ffd5d5'}>
                    <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'} mb={2}>Current Balance</Text>
                    {loading ? (
                        <Skeleton h="56px" w="200px" borderRadius="10px" />
                    ) : (
                        <Text fontSize="5xl" fontWeight="900" color={brand}>
                            ₹{(balance ?? 0).toLocaleString()}
                        </Text>
                    )}
                </Box>

                {/* Stats */}
                <SimpleGrid columns={2} spacing={4} mb={6}>
                    <Box bg={bgCard} borderRadius="16px" p={4}
                        boxShadow="0 2px 12px rgba(0,0,0,0.06)"
                        borderLeft="4px solid" borderLeftColor="green.400">
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">Total Added</Text>
                        <Text fontSize="2xl" fontWeight="800" color={text}>₹{totalCredits.toLocaleString()}</Text>
                    </Box>
                    <Box bg={bgCard} borderRadius="16px" p={4}
                        boxShadow="0 2px 12px rgba(0,0,0,0.06)"
                        borderLeft="4px solid" borderLeftColor="red.400">
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">Total Spent</Text>
                        <Text fontSize="2xl" fontWeight="800" color={text}>₹{totalDebits.toLocaleString()}</Text>
                    </Box>
                </SimpleGrid>

                {/* Add Money */}
                <Box bg={bgCard} borderRadius="16px" p={6} mb={6}
                    boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                    <Text fontWeight="700" color={text} mb={4}>Add Money</Text>

                    {/* Quick amounts */}
                    <HStack spacing={2} mb={4} flexWrap="wrap">
                        {[500, 1000, 2000, 5000].map(amt => (
                            <Button key={amt} size="sm" borderRadius="full"
                                variant="outline" borderColor={brand} color={brand}
                                _hover={{ bg: brand, color: 'white' }}
                                onClick={() => handleAddCredit(amt)}
                                isLoading={adding}>
                                +₹{amt.toLocaleString()}
                            </Button>
                        ))}
                    </HStack>

                    <HStack spacing={3}>
                        <Input
                            type="number"
                            placeholder="Enter custom amount"
                            value={addAmount}
                            onChange={e => setAddAmount(e.target.value)}
                            borderRadius="10px"
                            bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'}
                            borderColor={isDarkMode ? '#444' : 'gray.200'}
                            min={1} max={50000}
                        />
                        <Button bg={brand} color="white" borderRadius="10px"
                            _hover={{ opacity: 0.85 }} px={6}
                            isLoading={adding}
                            onClick={() => handleAddCredit()}>
                            Add
                        </Button>
                    </HStack>
                </Box>

                {/* Transaction History */}
                <Box bg={bgCard} borderRadius="16px" p={6} boxShadow="0 2px 12px rgba(0,0,0,0.06)">
                    <Text fontWeight="700" color={text} mb={4}>Transaction History</Text>

                    {loading ? (
                        <VStack spacing={3}>
                            {[1,2,3,4].map(i => <Skeleton key={i} h="60px" borderRadius="10px" w="full" />)}
                        </VStack>
                    ) : transactions.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Text fontSize="3xl" mb={2}>📜</Text>
                            <Text color={isDarkMode ? '#999' : 'gray.500'} fontSize="sm">No transactions yet.</Text>
                        </Box>
                    ) : (
                        <VStack spacing={3} align="stretch">
                            {transactions.map((tx, i) => (
                                <Box key={tx._id || i} p={4}
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'}
                                    borderRadius="12px"
                                    borderLeft="3px solid"
                                    borderLeftColor={tx.type === 'credit' ? 'green.400' : 'red.400'}>
                                    <HStack justify="space-between">
                                        <Box>
                                            <HStack spacing={2} mb={1}>
                                                <Text fontSize="sm" fontWeight="600" color={text} textTransform="capitalize">
                                                    {tx.reason}
                                                </Text>
                                                <Badge colorScheme={reasonColor(tx.reason)} borderRadius="full" fontSize="xs">
                                                    {tx.reason}
                                                </Badge>
                                            </HStack>
                                            <Text fontSize="xs" color={isDarkMode ? '#999' : 'gray.500'}>
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </Text>
                                            {tx.description && (
                                                <Text fontSize="xs" color={isDarkMode ? '#999' : 'gray.500'}>
                                                    {tx.description}
                                                </Text>
                                            )}
                                        </Box>
                                        <Text
                                            fontWeight="800" fontSize="lg"
                                            color={tx.type === 'credit' ? 'green.400' : 'red.400'}>
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </Text>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </Container>
        </Box>
    );
}

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  useToast,
  Spinner,
  Badge,
  Input
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import { API_BASE } from '../config';
import { getToken } from '../utils/auth';

const PaymentModal = ({
  isOpen,
  onClose,
  property,
  bookingType,
  amount,
  details,
  onBook
}) => {
  const { isDarkMode, bg, bgSecondary, text, brand, border } = useTheme();
  const toast = useToast();

  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');

  // Fetch wallet balance on mount
  React.useEffect(() => {
    if (isOpen) {
      fetchWalletBalance();
    }
  }, [isOpen]);

  const fetchWalletBalance = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleAddCredit = async () => {
    try {
      setLoading(true);
      const amount = parseInt(creditAmount);

      if (!amount || amount <= 0) {
        toast({
          title: 'Invalid amount',
          status: 'error',
          duration: 2000
        });
        return;
      }

      if (amount > 50000) {
        toast({
          title: 'Maximum ₹50,000 per transaction',
          status: 'error',
          duration: 2000
        });
        return;
      }

      const token = getToken();
      const response = await axios.post(
        `${API_BASE}/api/wallet/add-credit`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setWalletBalance(response.data.balance);
        setCreditAmount('');
        setShowAddCredit(false);
        toast({
          title: `₹${amount} added to wallet!`,
          status: 'success',
          duration: 2000
        });
      }
    } catch (error) {
      toast({
        title: 'Error adding credit',
        description: error.response?.data?.error || 'Something went wrong',
        status: 'error',
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    try {
      setProcessingPayment(true);

      if (walletBalance < amount) {
        toast({
          title: 'Insufficient balance',
          description: `You need ₹${amount - walletBalance} more`,
          status: 'error',
          duration: 2000
        });
        setProcessingPayment(false);
        return;
      }

      const token = getToken();

      // Create booking request
      const bookingResponse = await axios.post(
        `${API_BASE}/api/booking/create`,
        {
          propertyId: property._id,
          bookingType,
          rentDetails: bookingType === 'rent' ? {
            period: details.rentPeriod,
            startDate: details.startDate,
            endDate: details.endDate,
            nights: details.nights,
            pricePerUnit: Math.round(amount / details.nights),
            totalPrice: amount
          } : null,
          buyDetails: bookingType === 'buy' ? {
            totalPrice: amount,
            ownership: details.buyOwnership
          } : null,
          paymentMethod: 'wallet'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingId = bookingResponse.data.booking._id;

      // Process payment from wallet
      const paymentResponse = await axios.post(
        `${API_BASE}/api/booking/${bookingId}/pay`,
        { paymentMethod: 'wallet' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentResponse.data.success) {
        toast({
          title: '✅ Payment Successful!',
          description: 'Your booking has been created. Awaiting landlord approval.',
          status: 'success',
          duration: 3000
        });

        // Update local balance
        setWalletBalance(walletBalance - amount);
        onBook?.(bookingResponse.data.booking);
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.response?.data?.error || 'Something went wrong',
        status: 'error',
        duration: 2000
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const insufficientBalance = walletBalance < amount;
  const tax = Math.round(amount * 0.05); // 5% tax
  const total = amount + tax;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bgSecondary} color={text}>
        <ModalHeader borderBottom={`1px solid ${border}`} pb={4}>
          <Text fontSize="xl" fontWeight="bold">
            💳 Payment Details
          </Text>
        </ModalHeader>
        <ModalCloseButton isDisabled={processingPayment} />

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Booking Summary */}
            <Box bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'} p={4} borderRadius="lg">
              <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" fontWeight="bold">
                  📦 Booking Summary
                </Text>
                <Divider />
                <HStack justify="space-between" fontSize="sm">
                  <Text>Property:</Text>
                  <Text fontWeight="bold">{property.title}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text>Booking Type:</Text>
                  <Badge colorScheme="blue" textTransform="capitalize">
                    {bookingType}
                  </Badge>
                </HStack>
                {bookingType === 'rent' && (
                  <>
                    <HStack justify="space-between" fontSize="sm">
                      <Text>Duration:</Text>
                      <Text>{details.nights} {details.rentPeriod}(s)</Text>
                    </HStack>
                    <HStack justify="space-between" fontSize="sm">
                      <Text>Check-in:</Text>
                      <Text>{new Date(details.startDate).toLocaleDateString()}</Text>
                    </HStack>
                    <HStack justify="space-between" fontSize="sm">
                      <Text>Check-out:</Text>
                      <Text>{new Date(details.endDate).toLocaleDateString()}</Text>
                    </HStack>
                  </>
                )}
              </VStack>
            </Box>

            {/* Price Breakdown */}
            <Box bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'} p={4} borderRadius="lg">
              <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" fontWeight="bold">
                  💰 Price Breakdown
                </Text>
                <Divider />
                <HStack justify="space-between" fontSize="sm">
                  <Text>Booking Amount:</Text>
                  <Text fontWeight="bold">₹{amount.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text>Tax (5%):</Text>
                  <Text fontWeight="bold">₹{tax.toLocaleString()}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between" fontWeight="bold">
                  <Text>Total Amount:</Text>
                  <Text color={brand} fontSize="lg">
                    ₹{total.toLocaleString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Wallet Info */}
            <Box
              p={4}
              borderRadius="lg"
              border={`2px solid ${brand}`}
              bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'}
            >
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <HStack>
                    <Text fontSize="xl">💰</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={isDarkMode ? '#b0b0b0' : '#666'}>
                        Wallet Balance
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color={brand}>
                        ₹{walletBalance.toLocaleString()}
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge
                    colorScheme={walletBalance >= total ? 'green' : 'red'}
                    fontSize="xs"
                  >
                    {walletBalance >= total ? '✓ Sufficient' : '✗ Low'}
                  </Badge>
                </HStack>

                {insufficientBalance && (
                  <>
                    <Divider />
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={brand}>
                          Need ₹{(total - walletBalance).toLocaleString()} more
                        </Text>
                        <Button
                          size="sm"
                          bg={brand}
                          color="white"
                          onClick={() => setShowAddCredit(!showAddCredit)}
                          _hover={{ opacity: 0.8 }}
                        >
                          + Add Credit
                        </Button>
                      </HStack>

                      {showAddCredit && (
                        <HStack spacing={2}>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                            bg={isDarkMode ? '#1a1a1a' : '#ffffff'}
                            border={`1px solid ${border}`}
                            min="0"
                            max="50000"
                          />
                          <Button
                            size="sm"
                            bg={brand}
                            color="white"
                            onClick={handleAddCredit}
                            isLoading={loading}
                            _hover={{ opacity: 0.8 }}
                          >
                            Add
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </>
                )}
              </VStack>
            </Box>

            {/* Quick Add Options */}
            {insufficientBalance && !showAddCredit && (
              <VStack spacing={2} w="100%">
                <Text fontSize="xs" color={isDarkMode ? '#b0b0b0' : '#666'}>
                  Quick Add Credit:
                </Text>
                <HStack spacing={2} w="100%" justify="space-around">
                  {[500, 1000, 2000, 5000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      size="sm"
                      variant="outline"
                      borderColor={brand}
                      color={brand}
                      onClick={() => {
                        setCreditAmount(quickAmount.toString());
                        setShowAddCredit(true);
                      }}
                    >
                      +₹{quickAmount}
                    </Button>
                  ))}
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop={`1px solid ${border}`} py={4}>
          <HStack spacing={2} w="100%">
            <Button
              variant="ghost"
              onClick={onClose}
              flex={1}
              isDisabled={processingPayment}
            >
              Cancel
            </Button>
            <Button
              bg={brand}
              color="white"
              onClick={handleWalletPayment}
              flex={1}
              _hover={{ opacity: 0.8 }}
              isDisabled={insufficientBalance || processingPayment}
              isLoading={processingPayment}
              loadingText="Processing..."
            >
              Pay ₹{total.toLocaleString()}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;

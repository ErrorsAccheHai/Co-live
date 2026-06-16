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
  Input,
  Textarea,
  Box,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Badge,
  useToast
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import PaymentModal from './PaymentModal';

const BookingOptionsModal = ({ isOpen, onClose, property, bookingType, onBook }) => {
  const { isDarkMode, bg, bgSecondary, text, brand, border } = useTheme();
  const toast = useToast();
  
  const [showPayment, setShowPayment] = useState(false);
  
  // Rent state
  const [rentPeriod, setRentPeriod] = useState('daily'); // 'daily' | 'monthly' | 'yearly'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nights, setNights] = useState(1);
  
  // Buy state
  const [buyOwnership, setBuyOwnership] = useState('purchase'); // 'lease' | 'purchase'
  
  // Contact state
  const [contactMessage, setContactMessage] = useState('');
  
  // Shared state
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  // Calculate price
  const calculatePrice = () => {
    if (bookingType === 'rent') {
      let rate = 0;
      if (rentPeriod === 'daily') rate = property.pricing?.dailyRate || 0;
      else if (rentPeriod === 'monthly') rate = property.pricing?.monthlyRate || 0;
      else if (rentPeriod === 'yearly') rate = property.pricing?.yearlyRate || 0;
      
      const price = rate * nights;
      setTotalPrice(price);
      return price;
    } else if (bookingType === 'buy') {
      const price = property.price || property.pricing?.buyPrice || 0;
      setTotalPrice(price);
      return price;
    }
    return 0;
  };

  // Update calculation when dates change
  React.useEffect(() => {
    if (bookingType === 'rent' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0) {
        setNights(daysDiff);
      }
    } else {
      calculatePrice();
    }
  }, [startDate, endDate, rentPeriod, nights, bookingType]);

  const handleProceedToPayment = () => {
    if (bookingType === 'rent') {
      if (!startDate || !endDate) {
        toast({
          title: 'Please select dates',
          status: 'error',
          duration: 2000,
        });
        return;
      }
      if (nights <= 0) {
        toast({
          title: 'Invalid date range',
          status: 'error',
          duration: 2000,
        });
        return;
      }
    }
    
    calculatePrice();
    setShowPayment(true);
  };

  const handleContactOwner = () => {
    if (!contactMessage.trim()) {
      toast({
        title: 'Please write a message',
        status: 'error',
        duration: 2000,
      });
      return;
    }

    onBook?.({
      bookingType: 'own_contact',
      ownDetails: { message: contactMessage }
    });

    toast({
      title: 'Message sent to owner',
      description: 'Owner will respond within 24 hours',
      status: 'success',
      duration: 2000,
    });

    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen && bookingType !== 'own_contact'} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={bgSecondary} color={text}>
          <ModalHeader borderBottom={`1px solid ${border}`} pb={4}>
            <Text fontSize="xl" fontWeight="bold">
              {bookingType === 'rent' ? '🏠 Rent Property' : '💰 Buy Property'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              {/* Rent Options */}
              {bookingType === 'rent' && (
                <>
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      Select Rental Period
                    </Text>
                    <SimpleGrid columns={3} spacing={2} mb={4}>
                      {['daily', 'monthly', 'yearly'].map((period) => (
                        <Button
                          key={period}
                          onClick={() => setRentPeriod(period)}
                          bg={rentPeriod === period ? brand : isDarkMode ? '#2a2a2a' : '#e0e0e0'}
                          color={rentPeriod === period ? 'white' : text}
                          textTransform="capitalize"
                          size="sm"
                        >
                          {period}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      Select Dates
                    </Text>
                    <HStack spacing={2} mb={3}>
                      <VStack align="start" flex={1}>
                        <Text fontSize="xs" color={isDarkMode ? '#b0b0b0' : '#666'}>
                          Check-in
                        </Text>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'}
                          border={`1px solid ${border}`}
                        />
                      </VStack>
                      <VStack align="start" flex={1}>
                        <Text fontSize="xs" color={isDarkMode ? '#b0b0b0' : '#666'}>
                          Check-out
                        </Text>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'}
                          border={`1px solid ${border}`}
                          min={startDate}
                        />
                      </VStack>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      Number of {rentPeriod === 'daily' ? 'Nights' : rentPeriod === 'monthly' ? 'Months' : 'Years'}
                    </Text>
                    <NumberInput
                      value={nights}
                      onChange={(val) => setNights(parseInt(val) || 1)}
                      min={1}
                      max={365}
                    >
                      <NumberInputField bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'} />
                      <NumberInputStepper>
                        <NumberIncrementStepper bg={brand} />
                        <NumberDecrementStepper bg={brand} />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>

                  <Divider />

                  {/* Price Breakdown */}
                  <Box bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'} p={4} borderRadius="lg">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm">
                          ₹{Math.round(
                            (rentPeriod === 'daily'
                              ? property.pricing?.dailyRate || 0
                              : rentPeriod === 'monthly'
                              ? property.pricing?.monthlyRate || 0
                              : property.pricing?.yearlyRate || 0) * nights
                          )} ×{' '}
                          {nights}
                          {rentPeriod === 'daily' ? ' nights' : rentPeriod === 'monthly' ? ' months' : ' years'}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack justify="space-between" fontWeight="bold">
                        <Text>Total:</Text>
                        <Text color={brand} fontSize="lg">
                          ₹
                          {Math.round(
                            (rentPeriod === 'daily'
                              ? property.pricing?.dailyRate || 0
                              : rentPeriod === 'monthly'
                              ? property.pricing?.monthlyRate || 0
                              : property.pricing?.yearlyRate || 0) * nights
                          ).toLocaleString()}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </>
              )}

              {/* Buy Options */}
              {bookingType === 'buy' && (
                <>
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      Ownership Type
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {['lease', 'purchase'].map((type) => (
                        <Button
                          key={type}
                          onClick={() => setBuyOwnership(type)}
                          bg={buyOwnership === type ? brand : isDarkMode ? '#2a2a2a' : '#e0e0e0'}
                          color={buyOwnership === type ? 'white' : text}
                          textTransform="capitalize"
                          size="sm"
                        >
                          {type}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'} p={4} borderRadius="lg">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Property Price ({buyOwnership}):</Text>
                        <Text color={brand} fontWeight="bold">
                          ₹{(property.price || 0).toLocaleString()}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack justify="space-between" fontWeight="bold">
                        <Text>Total Amount:</Text>
                        <Text color={brand} fontSize="lg">
                          ₹{(property.price || 0).toLocaleString()}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Badge colorScheme="purple" alignSelf="flex-start">
                    One-time purchase
                  </Badge>
                </>
              )}

              {/* Contact Owner for Own */}
              {bookingType === 'own_contact' && (
                <VStack spacing={4}>
                  <Text fontSize="sm" color={isDarkMode ? '#b0b0b0' : '#666'}>
                    Interested in owning this property? Send a message to the owner to discuss
                    terms and negotiate.
                  </Text>
                  <Textarea
                    placeholder="Write your message here... e.g., 'I'm interested in purchasing this property. Can we discuss the terms?'"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'}
                    border={`1px solid ${border}`}
                    rows={5}
                  />
                </VStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTop={`1px solid ${border}`} py={4}>
            <HStack spacing={2} w="100%">
              <Button variant="ghost" onClick={onClose} flex={1}>
                Cancel
              </Button>
              {bookingType === 'own_contact' ? (
                <Button
                  bg={brand}
                  color="white"
                  onClick={handleContactOwner}
                  flex={1}
                  _hover={{ opacity: 0.8 }}
                >
                  Send Message
                </Button>
              ) : (
                <Button
                  bg={brand}
                  color="white"
                  onClick={handleProceedToPayment}
                  flex={1}
                  _hover={{ opacity: 0.8 }}
                >
                  Proceed to Payment
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Contact Owner Modal */}
      {bookingType === 'own_contact' && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg={bgSecondary} color={text}>
            <ModalHeader borderBottom={`1px solid ${border}`} pb={4}>
              <Text fontSize="xl" fontWeight="bold">
                🏠 Contact Owner to Own
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <VStack spacing={4}>
                <Text fontSize="sm" color={isDarkMode ? '#b0b0b0' : '#666'}>
                  Interested in owning this property? Send a message to the owner to discuss
                  terms and negotiate.
                </Text>
                <Textarea
                  placeholder="Write your message here... e.g., 'I'm interested in purchasing this property. Can we discuss the terms?'"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  bg={isDarkMode ? '#2a2a2a' : '#f5f5f5'}
                  border={`1px solid ${border}`}
                  rows={5}
                />
              </VStack>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${border}`} py={4}>
              <HStack spacing={2} w="100%">
                <Button variant="ghost" onClick={onClose} flex={1}>
                  Cancel
                </Button>
                <Button
                  bg={brand}
                  color="white"
                  onClick={handleContactOwner}
                  flex={1}
                  _hover={{ opacity: 0.8 }}
                >
                  Send Message
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        property={property}
        bookingType={bookingType}
        amount={totalPrice}
        details={{
          rentPeriod,
          startDate,
          endDate,
          nights,
          buyOwnership
        }}
        onBook={onBook}
      />
    </>
  );
};

export default BookingOptionsModal;

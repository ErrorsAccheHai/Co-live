import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Image,
  Badge,
  Heading,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { useTheme } from '../utils/ThemeContext';
import BookingOptionsModal from './BookingOptionsModal';

const PropertyDetailModal = ({ isOpen, onClose, property, onBook }) => {
  const { isDarkMode, bg, bgSecondary, text, brand, border } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // 'rent' | 'buy' | 'own'

  if (!property) return null;

  const images = property.images || [property.images?.[0] || 'https://via.placeholder.com/400'];
  const amenityIcons = {
    wifi: '📶',
    kitchen: '🍳',
    parking: '🅿️',
    ac: '❄️',
  };

  const handleBookOption = (option) => {
    setSelectedOption(option);
    setShowBookingModal(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={bgSecondary} color={text}>
          <ModalHeader borderBottom={`1px solid ${border}`} pb={4}>
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">
                {property.title}
              </Text>
              <HStack spacing={2}>
                    <Icon as={MapPin} color={brand} w={4} h={4} />
                    <Text fontSize="sm" color={isDarkMode ? '#b0b0b0' : '#666'}>
                  {property.address?.city || property.location?.address || 'Location not specified'}
                </Text>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              {/* Image Carousel */}
              <Box
                position="relative"
                w="100%"
                h="300px"
                borderRadius="lg"
                overflow="hidden"
                bg={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
              >
                <Image
                  src={images[currentImageIndex] || 'https://via.placeholder.com/400'}
                  alt={property.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      position="absolute"
                      left={2}
                      top="50%"
                      transform="translateY(-50%)"
                      bg={`rgba(255,255,255,0.8)`}
                      onClick={handlePrevImage}
                      size="sm"
                    >
                      ←
                    </Button>
                    <Button
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      bg={`rgba(255,255,255,0.8)`}
                      onClick={handleNextImage}
                      size="sm"
                    >
                      →
                    </Button>
                  </>
                )}
                <Text
                  position="absolute"
                  bottom={2}
                  right={2}
                  bg="rgba(0,0,0,0.6)"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </Box>

              {/* Tabs for details */}
              <Tabs variant="soft-rounded" defaultIndex={0}>
                <TabList borderBottom={`1px solid ${border}`} mb={4}>
                  <Tab _selected={{ color: brand, borderBottomColor: brand }}>
                    Details
                  </Tab>
                  <Tab _selected={{ color: brand, borderBottomColor: brand }}>
                    Amenities
                  </Tab>
                  <Tab _selected={{ color: brand, borderBottomColor: brand }}>
                    Owner
                  </Tab>
                  <Tab _selected={{ color: brand, borderBottomColor: brand }}>
                    Pricing
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Details Tab */}
                  <TabPanel>
                    <VStack align="start" spacing={4}>
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Description
                        </Text>
                        <Text fontSize="sm" color={isDarkMode ? '#c0c0c0' : '#555'}>
                          {property.description || 'No description available'}
                        </Text>
                      </Box>

                      <Divider />

                      <SimpleGrid columns={3} spacing={4} w="100%">
                        <Box>
                          <Text fontWeight="bold" fontSize="sm">
                            Bedrooms
                          </Text>
                          <Text fontSize="lg" color={brand}>
                            {property.bedrooms || 1}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" fontSize="sm">
                            Bathrooms
                          </Text>
                          <Text fontSize="lg" color={brand}>
                            {property.bathrooms || 1}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" fontSize="sm">
                            Rating
                          </Text>
                          <Text fontSize="lg" color={brand}>
                            {'⭐'.repeat(Math.round(property.averageRating || 4))}
                          </Text>
                        </Box>
                      </SimpleGrid>

                      <Divider />

                      {property.status && (
                        <HStack spacing={2}>
                          <Text fontWeight="bold" fontSize="sm">
                            Status:
                          </Text>
                          <Badge
                            colorScheme={property.status === 'approved' ? 'green' : 'yellow'}
                          >
                            {property.status}
                          </Badge>
                        </HStack>
                      )}

                      {property.location && (
                        <Box w="100%">
                          <Text fontWeight="bold" fontSize="sm" mb={2}>
                            Location
                          </Text>
                          <SimpleGrid columns={2} spacing={2} fontSize="sm">
                            {property.location.city && (
                              <Text>
                                <strong>City:</strong> {property.location.city}
                              </Text>
                            )}
                            {property.location.state && (
                              <Text>
                                <strong>State:</strong> {property.location.state}
                              </Text>
                            )}
                            {property.location.zipCode && (
                              <Text>
                                <strong>ZIP:</strong> {property.location.zipCode}
                              </Text>
                            )}
                          </SimpleGrid>
                        </Box>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Amenities Tab */}
                  <TabPanel>
                    <SimpleGrid columns={2} spacing={4}>
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities.map((amenity, idx) => (
                          <HStack key={idx} spacing={2}>
                            <Text>{amenityIcons[amenity.toLowerCase()] || '✅'}</Text>
                            <Text fontSize="sm" textTransform="capitalize">
                              {amenity}
                            </Text>
                          </HStack>
                        ))
                      ) : (
                        <Text color={isDarkMode ? '#b0b0b0' : '#999'}>
                          No amenities listed
                        </Text>
                      )}
                    </SimpleGrid>
                  </TabPanel>

                  {/* Owner Tab */}
                  <TabPanel>
                    <VStack align="start" spacing={4}>
                      <HStack spacing={4}>
                        <Avatar name={property.owner?.name || 'Owner'} size="lg" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">
                            {property.owner?.name || 'Property Owner'}
                          </Text>
                          <Text fontSize="sm" color={isDarkMode ? '#b0b0b0' : '#666'}>
                            {property.owner?.email}
                          </Text>
                          {property.owner?.phone && (
                            <Text fontSize="sm" color={isDarkMode ? '#b0b0b0' : '#666'}>
                              {property.owner.phone}
                            </Text>
                          )}
                        </VStack>
                      </HStack>

                      <Divider />

                      <HStack>
                        <Text>⭐</Text>
                        <Text>
                          <strong>{property.totalReviews || 0}</strong> Reviews
                        </Text>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  {/* Pricing Tab */}
                  <TabPanel>
                    <VStack align="start" spacing={3} w="100%">
                      {property.price && (
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="bold">Buy Price:</Text>
                          <Text fontSize="lg" color={brand} fontWeight="bold">
                            ₹{property.price.toLocaleString()}
                          </Text>
                        </HStack>
                      )}
                      {property.pricing?.dailyRate && (
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="bold">Daily Rent:</Text>
                          <Text fontSize="lg" color={brand} fontWeight="bold">
                            ₹{property.pricing.dailyRate.toLocaleString()} /day
                          </Text>
                        </HStack>
                      )}
                      {property.pricing?.monthlyRate && (
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="bold">Monthly Rent:</Text>
                          <Text fontSize="lg" color={brand} fontWeight="bold">
                            ₹{property.pricing.monthlyRate.toLocaleString()} /month
                          </Text>
                        </HStack>
                      )}
                      {property.pricing?.yearlyRate && (
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="bold">Yearly Rent:</Text>
                          <Text fontSize="lg" color={brand} fontWeight="bold">
                            ₹{property.pricing.yearlyRate.toLocaleString()} /year
                          </Text>
                        </HStack>
                      )}

                      <Divider />

                      {property.cancellationPolicy && (
                        <VStack align="start" w="100%">
                          <Text fontWeight="bold" fontSize="sm">
                            Cancellation Policy:
                          </Text>
                          <Badge colorScheme="purple" textTransform="capitalize">
                            {property.cancellationPolicy}
                          </Badge>
                        </VStack>
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </ModalBody>

          <ModalFooter borderTop={`1px solid ${border}`} py={4}>
            <VStack w="100%" spacing={2}>
              <HStack w="100%" spacing={2}>
                {property.bookingOptions?.allowRent !== false && (
                  <Button
                    flex={1}
                    bg={brand}
                    color="white"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => handleBookOption('rent')}
                    size="md"
                  >
                    Rent
                  </Button>
                )}
                {property.bookingOptions?.allowBuy !== false && (
                  <Button
                    flex={1}
                    bg={brand}
                    color="white"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => handleBookOption('buy')}
                    size="md"
                  >
                    Buy
                  </Button>
                )}
                {property.bookingOptions?.allowOwn !== false && (
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor={brand}
                    color={brand}
                    _hover={{ bg: isDarkMode ? '#3a3a3a' : '#f5f5f5' }}
                    onClick={() => handleBookOption('own')}
                    size="md"
                  >
                    Contact
                  </Button>
                )}
              </HStack>
              <Button w="100%" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Booking Options Modal */}
      <BookingOptionsModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
        bookingType={selectedOption}
        onBook={onBook}
      />
    </>
  );
};

export default PropertyDetailModal;

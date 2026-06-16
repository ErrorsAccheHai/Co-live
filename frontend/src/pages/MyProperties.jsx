import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Heading, SimpleGrid, Text, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, Textarea, VStack, HStack, useDisclosure,
    Badge, Menu, MenuButton, MenuList, MenuItem, IconButton, Progress,
    Image, Select, Divider, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    CheckboxGroup, Checkbox, Wrap, WrapItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { FaBuilding, FaTrash } from 'react-icons/fa';
import { getAuthHeader } from '../utils/auth';
import { API_BASE } from '../config';
import { useTheme } from '../utils/ThemeContext';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'AC', 'Kitchen', 'Laundry', 'Security', 'Gym', 'Pool', 'Lift', 'Power Backup'];

const EMPTY_FORM = {
    title: '',
    description: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    price: '',
    dailyRate: '',
    monthlyRate: '',
    yearlyRate: '',
    bedrooms: 1,
    bathrooms: 1,
    capacity: 1,
    propertyType: 'apartment',
    amenities: [],
    rules: '',
    facilities: '',
    images: [],
};

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isDarkMode, bg, text, brand } = useTheme();
    const bgCard = isDarkMode ? '#1e1e1e' : 'white';

    useEffect(() => { fetchProperties(); }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/property/my-properties`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            if (response.ok) setProperties(data);
            else toast({ title: data.message || 'Failed to fetch properties', status: 'error', duration: 3000 });
        } catch {
            toast({ title: 'Something went wrong', status: 'error', duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handle = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumber = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenities = (values) => {
        setFormData(prev => ({ ...prev, amenities: values }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.city) {
            toast({ title: 'Title, price and city are required', status: 'warning', duration: 3000 });
            return;
        }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('bedrooms', formData.bedrooms);
            fd.append('bathrooms', formData.bathrooms);
            fd.append('capacity', formData.capacity);
            fd.append('address', JSON.stringify({
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
            }));
            fd.append('amenities', JSON.stringify(formData.amenities));
            fd.append('pricing', JSON.stringify({
                dailyRate: Number(formData.dailyRate) || 0,
                monthlyRate: Number(formData.monthlyRate) || Number(formData.price) || 0,
                yearlyRate: Number(formData.yearlyRate) || 0,
            }));
            fd.append('rules', formData.rules);
            fd.append('facilities', formData.facilities);
            formData.images.forEach(img => fd.append('images', img));

            const response = await fetch(`${API_BASE}/api/property`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: fd
            });
            const data = await response.json();
            if (response.ok) {
                toast({
                    title: '✅ Property Submitted!',
                    description: 'Under admin review. It will appear once approved.',
                    status: 'success', duration: 5000, isClosable: true,
                });
                setFormData(EMPTY_FORM);
                fetchProperties();
                onClose();
            } else {
                throw new Error(data.message || 'Failed to add property');
            }
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (propertyId) => {
        if (!window.confirm('Delete this property?')) return;
        try {
            const response = await fetch(`${API_BASE}/api/property/${propertyId}`, {
                method: 'DELETE', headers: getAuthHeader()
            });
            if (response.ok) {
                toast({ title: 'Property deleted', status: 'success', duration: 3000 });
                fetchProperties();
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete');
            }
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
        }
    };

    return (
        <Box bg={bg} minH="100vh">
            <Container maxW="container.xl" py={8}>
                <HStack justify="space-between" mb={8}>
                    <Box>
                        <Heading color={text} fontWeight="800">My Properties</Heading>
                        <Text color={isDarkMode ? '#999' : 'gray.500'} mt={1}>
                            {properties.length} listing{properties.length !== 1 ? 's' : ''}
                        </Text>
                    </Box>
                    <Button leftIcon={<AddIcon />} bg={brand} color="white" borderRadius="10px"
                        _hover={{ opacity: 0.85 }} onClick={onOpen}>
                        Add Property
                    </Button>
                </HStack>

                {isLoading ? (
                    <Progress size="xs" isIndeterminate colorScheme="red" />
                ) : properties.length === 0 ? (
                    <Box textAlign="center" py={16} bg={bgCard} borderRadius="20px">
                        <Text fontSize="5xl" mb={3}>🏢</Text>
                        <Heading size="md" color={text} mb={2}>No properties yet</Heading>
                        <Text color={isDarkMode ? '#999' : 'gray.500'} mb={4}>
                            Add your first property to get started.
                        </Text>
                        <Button leftIcon={<AddIcon />} bg={brand} color="white"
                            borderRadius="10px" _hover={{ opacity: 0.85 }} onClick={onOpen}>
                            Add Property
                        </Button>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {properties.map(property => (
                            <PropertyCard key={property._id} property={property}
                                onDelete={handleDelete}
                                isDarkMode={isDarkMode} bgCard={bgCard} text={text} brand={brand} />
                        ))}
                    </SimpleGrid>
                )}
            </Container>

            {/* ── Add Property Modal ── */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent bg={bgCard} color={text} borderRadius="16px">
                    <ModalHeader borderBottom="1px solid" borderColor={isDarkMode ? '#2a2a2a' : '#eee'}>
                        🏠 Add New Property
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <VStack spacing={5} as="form" onSubmit={handleSubmit}>

                            <SectionLabel>Basic Information</SectionLabel>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Property Title</FormLabel>
                                <Input name="title" value={formData.title} onChange={handle}
                                    placeholder="e.g. Cozy 2BHK near Metro"
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Description</FormLabel>
                                <Textarea name="description" value={formData.description} onChange={handle}
                                    placeholder="Describe the property, surroundings, rules..."
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" rows={3} />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Property Type</FormLabel>
                                <Select name="propertyType" value={formData.propertyType} onChange={handle}
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px">
                                    <option value="apartment">Apartment</option>
                                    <option value="house">Independent House</option>
                                    <option value="room">Single Room</option>
                                    <option value="villa">Villa</option>
                                    <option value="pg">PG / Hostel</option>
                                </Select>
                            </FormControl>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Address</SectionLabel>

                            <FormControl>
                                <FormLabel fontSize="sm">Street / Area</FormLabel>
                                <Input name="street" value={formData.street} onChange={handle}
                                    placeholder="e.g. 42 MG Road, Koramangala"
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                            </FormControl>

                            <SimpleGrid columns={2} spacing={3} w="full">
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">City</FormLabel>
                                    <Input name="city" value={formData.city} onChange={handle}
                                        placeholder="e.g. Bangalore"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm">State</FormLabel>
                                    <Input name="state" value={formData.state} onChange={handle}
                                        placeholder="e.g. Karnataka"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                            </SimpleGrid>

                            <SimpleGrid columns={2} spacing={3} w="full">
                                <FormControl>
                                    <FormLabel fontSize="sm">ZIP Code</FormLabel>
                                    <Input name="zipCode" value={formData.zipCode} onChange={handle}
                                        placeholder="560001"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm">Country</FormLabel>
                                    <Input name="country" value={formData.country} onChange={handle}
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                            </SimpleGrid>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Property Details</SectionLabel>

                            <SimpleGrid columns={3} spacing={3} w="full">
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Bedrooms</FormLabel>
                                    <NumberInput min={1} max={20} value={formData.bedrooms}
                                        onChange={(v) => handleNumber('bedrooms', v)}>
                                        <NumberInputField bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Bathrooms</FormLabel>
                                    <NumberInput min={1} max={10} value={formData.bathrooms}
                                        onChange={(v) => handleNumber('bathrooms', v)}>
                                        <NumberInputField bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm">Capacity</FormLabel>
                                    <NumberInput min={1} max={50} value={formData.capacity}
                                        onChange={(v) => handleNumber('capacity', v)}>
                                        <NumberInputField bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                            </SimpleGrid>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Pricing (₹)</SectionLabel>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Base / Buy Price (₹)</FormLabel>
                                <Input type="number" name="price" value={formData.price} onChange={handle}
                                    placeholder="e.g. 500000"
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Used for buy price. Also set monthly rate below for rentals.
                                </Text>
                            </FormControl>

                            <SimpleGrid columns={3} spacing={3} w="full">
                                <FormControl>
                                    <FormLabel fontSize="sm">Daily Rate (₹)</FormLabel>
                                    <Input type="number" name="dailyRate" value={formData.dailyRate} onChange={handle}
                                        placeholder="e.g. 1500"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm">Monthly Rate (₹)</FormLabel>
                                    <Input type="number" name="monthlyRate" value={formData.monthlyRate} onChange={handle}
                                        placeholder="e.g. 25000"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm">Yearly Rate (₹)</FormLabel>
                                    <Input type="number" name="yearlyRate" value={formData.yearlyRate} onChange={handle}
                                        placeholder="e.g. 250000"
                                        bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                </FormControl>
                            </SimpleGrid>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Amenities</SectionLabel>

                            <CheckboxGroup colorScheme="red" value={formData.amenities} onChange={handleAmenities}>
                                <Wrap spacing={3}>
                                    {AMENITY_OPTIONS.map(a => (
                                        <WrapItem key={a}>
                                            <Checkbox value={a}>
                                                <Text fontSize="sm">{a}</Text>
                                            </Checkbox>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            </CheckboxGroup>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Rules & Facilities</SectionLabel>

                            <FormControl>
                                <FormLabel fontSize="sm">House Rules</FormLabel>
                                <Textarea name="rules" value={formData.rules} onChange={handle}
                                    placeholder={'One rule per line\ne.g. No smoking\nNo pets'}
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" rows={3} />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm">Facilities</FormLabel>
                                <Textarea name="facilities" value={formData.facilities} onChange={handle}
                                    placeholder={'One facility per line\ne.g. 24hr water\nCCTV\nFire exit'}
                                    bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" rows={3} />
                            </FormControl>

                            <Divider borderColor={isDarkMode ? '#2a2a2a' : '#eee'} />
                            <SectionLabel>Images</SectionLabel>

                            <FormControl>
                                <FormLabel fontSize="sm">Upload Photos (up to 5)</FormLabel>
                                <Input type="file" accept="image/*" multiple onChange={handleImageChange}
                                    pt={1} bg={isDarkMode ? '#2a2a2a' : '#f9f9f9'} borderRadius="10px" />
                                {formData.images.length > 0 && (
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        {formData.images.length} file(s) selected
                                    </Text>
                                )}
                            </FormControl>

                            <Button type="submit" bg={brand} color="white" w="full"
                                borderRadius="10px" size="lg" _hover={{ opacity: 0.85 }}
                                isLoading={submitting} loadingText="Submitting...">
                                Submit Property for Review
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

/* ─── Section Label ─────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
    <Text w="full" fontWeight="700" fontSize="sm" textTransform="uppercase"
        letterSpacing="wider" color="gray.500" pt={2}>
        {children}
    </Text>
);

/* ─── Property Card ─────────────────────────────────────────── */
const PropertyCard = ({ property, onDelete, isDarkMode, bgCard, text, brand }) => (
    <Box bg={bgCard} borderRadius="16px" overflow="hidden"
        boxShadow="0 2px 12px rgba(0,0,0,0.08)"
        border="1px solid" borderColor={isDarkMode ? '#2a2a2a' : '#f0f0f0'}
        transition="transform .15s" _hover={{ transform: 'translateY(-3px)' }}>
        <Box h="160px" bg={isDarkMode ? '#2a2a2a' : '#f0f0f0'} overflow="hidden">
            {property.images?.[0] ? (
                <Image src={property.images[0]} alt={property.title}
                    w="100%" h="100%" objectFit="cover" />
            ) : (
                <Box w="100%" h="100%" display="flex" alignItems="center"
                    justifyContent="center" fontSize="4xl">🏠</Box>
            )}
        </Box>
        <Box p={5}>
            <HStack justify="space-between" mb={2}>
                <Text fontWeight="700" fontSize="md" color={brand} noOfLines={1}>
                    {property.title}
                </Text>
                <Menu>
                    <MenuButton as={IconButton} aria-label="Options"
                        icon={<ChevronDownIcon />} variant="ghost" size="sm" />
                    <MenuList>
                        <MenuItem icon={<FaTrash />} color="red.400"
                            onClick={() => onDelete(property._id)}>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </HStack>

            <Text fontSize="sm" color={isDarkMode ? '#999' : 'gray.500'} mb={2}>
                📍 {property.address?.city}
                {property.address?.state ? `, ${property.address.state}` : ''}
            </Text>

            <Text fontSize="xl" fontWeight="800" color={brand} mb={3}>
                ₹{property.price?.toLocaleString()}
                <Text as="span" fontSize="sm" fontWeight="400">/mo</Text>
            </Text>

            <HStack fontSize="sm" color={text} mb={3}>
                <Text>🛏️ {property.bedrooms}</Text>
                <Text>🚿 {property.bathrooms}</Text>
                <Text>👥 {property.capacity}</Text>
            </HStack>

            <Badge borderRadius="full" px={2}
                colorScheme={
                    property.status === 'approved' ? 'green' :
                    property.status === 'pending' ? 'yellow' : 'red'
                }>
                {property.statusMessage || property.status}
            </Badge>
        </Box>
    </Box>
);

export default MyProperties;

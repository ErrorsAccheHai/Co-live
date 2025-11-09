import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    SimpleGrid,
    Text,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    HStack,
    useDisclosure,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Progress,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Card,
    CardBody,
    Stack,
    Image,
    Select,
    Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { FaUsers, FaMoneyBill, FaExclamationTriangle, FaBuilding, FaEdit, FaTrash } from 'react-icons/fa';
import { getAuthHeader } from '../utils/auth';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        rent: '',
        propertyType: 'apartment',
        rules: '',
        facilities: '',
        images: []
    });

    // Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/property/my-properties', {
                headers: getAuthHeader()
            });
            const data = await response.json();
            if (response.ok) {
                setProperties(data);
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Failed to fetch properties',
                    status: 'error',
                    duration: 3000,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'images') {
                    formData[key].forEach(image => {
                        formDataObj.append('images', image);
                    });
                } else {
                    formDataObj.append(key, formData[key]);
                }
            });

            const response = await fetch('http://localhost:5000/api/property', {
                method: 'POST',
                headers: getAuthHeader(),
                body: formDataObj
            });

            const data = await response.json();
            if (response.ok) {
                toast({
                    title: 'Property Submitted Successfully',
                    description: 'Your property is under verification. An admin will review it shortly.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchProperties();
                onClose();
            } else {
                throw new Error(data.message || 'Failed to add property');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleDelete = async (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/property/${propertyId}`, {
                    method: 'DELETE',
                    headers: getAuthHeader()
                });

                if (response.ok) {
                    toast({
                        title: 'Success',
                        description: 'Property deleted successfully',
                        status: 'success',
                        duration: 3000,
                    });
                    fetchProperties();
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete property');
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                });
            }
        }
    };

    const PropertyCard = ({ property }) => (
        <Card maxW='md'>
            <CardBody>
                <Image
                    src={property.images && property.images.length ? property.images[0] : 'https://via.placeholder.com/300'}
                    alt={property.title || property.name}
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <HStack justify="space-between">
                        <Heading size='md'>{property.title || property.name}</Heading>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<ChevronDownIcon />}
                                variant='outline'
                            />
                            <MenuList>
                                <MenuItem icon={<FaEdit />} onClick={() => setSelectedProperty(property)}>
                                    Edit
                                </MenuItem>
                                <MenuItem icon={<FaTrash />} onClick={() => handleDelete(property._id)}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                    <Text>
                        {typeof property.address === 'string'
                            ? property.address
                            : property.address
                                ? `${property.address.street || ''} ${property.address.city || ''} ${property.address.state || ''}`.trim()
                                : ''}
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        ₹{property.price || property.rent}/month
                    </Text>
                    <VStack align="start" spacing={2}>
                        <HStack spacing={4}>
                            <Badge colorScheme={
                                property.status === 'approved' ? 'green' :
                                property.status === 'pending' ? 'yellow' :
                                'red'
                            }>
                                {property.statusMessage || property.status}
                            </Badge>
                            {property.propertyType && (
                                <Badge colorScheme='blue'>{property.propertyType}</Badge>
                            )}
                        </HStack>
                        {property.verifiedDetails && (
                            <Text fontSize="sm" color="gray.600">
                                Verified by {property.verifiedDetails.by} on {new Date(property.verifiedDetails.date).toLocaleDateString()}
                            </Text>
                        )}
                    </VStack>
                </Stack>
            </CardBody>
            <Divider />
            <Box p={4}>
                <SimpleGrid columns={3} spacing={4}>
                    <Stat>
                        <StatLabel><FaUsers /> Tenants</StatLabel>
                        <StatNumber>{property.tenants?.length || 0}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel><FaMoneyBill /> Bills</StatLabel>
                        <StatNumber>{property.bills?.length || 0}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel><FaExclamationTriangle /> Issues</StatLabel>
                        <StatNumber>{property.issues?.length || 0}</StatNumber>
                    </Stat>
                </SimpleGrid>
            </Box>
        </Card>
    );

    return (
        <Container maxW='container.xl' py={8}>
            <HStack justify="space-between" mb={8}>
                <Heading>My Properties</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                    Add Property
                </Button>
            </HStack>

            {isLoading ? (
                <Progress size="xs" isIndeterminate />
            ) : properties.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <FaBuilding size={50} style={{ margin: '0 auto' }} />
                    <Text mt={4}>No properties found. Add your first property!</Text>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {properties.map(property => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </SimpleGrid>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Property</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                            <FormControl isRequired>
                                <FormLabel>Property Name</FormLabel>
                                <Input name="name" value={formData.name} onChange={handleInputChange} />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Address</FormLabel>
                                <Textarea name="address" value={formData.address} onChange={handleInputChange} />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Property Type</FormLabel>
                                <Select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="room">Room</option>
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Rent (₹/month)</FormLabel>
                                <Input type="number" name="rent" value={formData.rent} onChange={handleInputChange} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea name="description" value={formData.description} onChange={handleInputChange} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Rules</FormLabel>
                                <Textarea name="rules" value={formData.rules} onChange={handleInputChange} 
                                    placeholder="Enter rules separated by newlines" />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Facilities</FormLabel>
                                <Textarea name="facilities" value={formData.facilities} onChange={handleInputChange}
                                    placeholder="Enter facilities separated by newlines" />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Images</FormLabel>
                                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
                            </FormControl>

                            <Button type="submit" colorScheme="blue" width="full">
                                Add Property
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default MyProperties;
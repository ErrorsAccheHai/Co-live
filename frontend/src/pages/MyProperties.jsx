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
    useDisclosure,
    Badge
} from '@chakra-ui/react';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const fetchMyProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/property/my', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProperties(data);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch properties',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/property', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    }
                })
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Property added successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
                fetchMyProperties();
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    bedrooms: '',
                    bathrooms: '',
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add property',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={8}>
                <Heading mb={4}>My Properties</Heading>
                <Button colorScheme="blue" onClick={onOpen} mb={6}>
                    Add New Property
                </Button>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {properties.map((property) => (
                        <Box
                            key={property._id}
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <Heading fontSize="xl" mb={2}>{property.title}</Heading>
                            <Text mb={2}>{property.description}</Text>
                            <Text mb={2}>Price: ${property.price}</Text>
                            <Text mb={2}>
                                {property.bedrooms} beds • {property.bathrooms} baths
                            </Text>
                            <Text mb={2}>
                                {property.address.city}, {property.address.state}
                            </Text>
                            <Badge
                                colorScheme={
                                    property.status === 'approved' ? 'green' :
                                    property.status === 'rejected' ? 'red' : 'yellow'
                                }
                                mb={4}
                            >
                                {property.status}
                            </Badge>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Property</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Price</FormLabel>
                                    <Input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <SimpleGrid columns={2} spacing={4} width="100%">
                                    <FormControl isRequired>
                                        <FormLabel>Bedrooms</FormLabel>
                                        <Input
                                            name="bedrooms"
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Bathrooms</FormLabel>
                                        <Input
                                            name="bathrooms"
                                            type="number"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <FormControl isRequired>
                                    <FormLabel>Street</FormLabel>
                                    <Input
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <SimpleGrid columns={2} spacing={4} width="100%">
                                    <FormControl isRequired>
                                        <FormLabel>City</FormLabel>
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>State</FormLabel>
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={2} spacing={4} width="100%">
                                    <FormControl isRequired>
                                        <FormLabel>Zip Code</FormLabel>
                                        <Input
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Country</FormLabel>
                                        <Input
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <Button type="submit" colorScheme="blue" width="100%">
                                    Add Property
                                </Button>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default MyProperties;
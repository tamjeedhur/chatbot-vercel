'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Spinner,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import axiosInstance from '@/lib/axiosInstance'; // axios setup
import AdminLayout from '@/components/adminlayout/AdminLayout'; // Admin Layout
// import Loading from "@/app/loading";

interface Product {
  id: string;
  name: string;
  description: string;
  default_price?: string;
  created: number;
}

export default function Products() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();

  const [newProductName, setNewProductName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/products');
      setProductList(response.data.data); // Update to reflect the actual data structure
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: any) => {
    try {
      await axiosInstance.delete(`/api/products/${product.id}`);
      toast({
        title: 'Deleted',
        description: 'Product deleted successfully.',
        status: 'info',
        isClosable: true,
        position: 'top-right',
      });
      setProductList(productList.filter((item: any) => item.id !== product.id));
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCreateProduct = async () => {
    if (!newProductName || !newDescription) {
      toast({
        title: 'Error',
        description: 'Please provide both product name and description.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/api/products', {
        name: newProductName,
        description: newDescription,
      });

      // Update the product list with the newly created product
      setProductList((prev: any) => [...prev, response.data]);

      toast({
        title: 'Success',
        description: 'Product created successfully.',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });

      // Close the create product modal
      onCreateModalClose();
      setNewProductName('');
      setNewDescription('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <AdminLayout>
      <Box p={8} maxW='auto' mx='auto' borderWidth={1} boxShadow='md' mt='10vh' backgroundColor='white' borderRadius='20px'>
        <Flex justifyContent='space-between' mb={6} alignItems='center'>
          <Heading size='lg'>Product Management</Heading>
          <Button colorScheme='blue' onClick={onCreateModalOpen}>
            Create Product
          </Button>
        </Flex>

        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Product ID</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Default Price</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productList.map((product) => (
              <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.name}</Td>
                <Td>{product.description}</Td>
                <Td>{product.default_price || 'N/A'}</Td>
                <Td>{new Date(product.created * 1000).toLocaleDateString()}</Td> {/* Convert UNIX timestamp to human-readable date */}
                <Td>
                  <IconButton aria-label='Delete product' icon={<DeleteIcon />} onClick={() => openDeleteModal(product)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Delete Modal */}
      {selectedProduct && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              <Text>Are you sure you want to delete this product?</Text>
              <Text mt={4}>
                <b>Product ID:</b> {selectedProduct.id}
              </Text>
              <Text>
                <b>Name:</b> {selectedProduct.name}
              </Text>
              <Text>
                <b>Default Price:</b> {selectedProduct.default_price || 'N/A'}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => handleDeleteProduct(selectedProduct)}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Create Product Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Product Name</FormLabel>
              <Input placeholder='Enter product name' value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input placeholder='Enter description' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onCreateModalClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleCreateProduct}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}

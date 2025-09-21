'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axiosInstance from '@/lib/axiosInstance';

export default function GenerateApiKey() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [token, setToken] = useState<string | null>(null);
  const [apiKeyName, setApiKeyName] = useState<string>('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken !== token) setToken(storedToken);
  }, [token]);

  const handleGenerateApiKey = async () => {
    try {
      const response = await axiosInstance.post('/api/generate-api-key', {
        name: apiKeyName,
      });

      const { apiKey } = response.data;
      localStorage.setItem('apiKey', apiKey);

      toast({
        title: 'API Key Generated',
        description: `Your API key ${apiKey} has been successfully generated.`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
        Generate API Key
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Secret Key</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder='Enter a name for your API key (optional)'
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
                variant='outline'
                mb={4}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleGenerateApiKey}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

'use client';
import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import paymentCaptureMachine from '@/machines/paymentCaptureMachine';
import {
  Box,
  Button,
  VStack,
  HStack,
  useRadioGroup,
  useRadio,
  chakra,
  Heading,
  useToast,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import RecentTransactions from './RecentTransactions';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUNISHABLE_KEY || '';
const stripePromise = loadStripe(stripeKey);

function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <chakra.label>
      <input {...input} style={{ display: 'none' }} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        bg={props.isChecked ? 'teal.600' : 'white'}
        color={props.isChecked ? 'white' : 'gray.800'}
        borderColor={props.isChecked ? 'teal.600' : 'gray.300'}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        transition='background-color 0.2s, color 0.2s'>
        {props.children}
      </Box>
    </chakra.label>
  );
}

const SubscriptionForm = () => {
  const [state, send] = useMachine(paymentCaptureMachine, {
    input: {
      email: '',
      organizationId: '',
    },
  });
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'subscription',
    onChange: (value) => {
      const isRecurring = (state.context as any).prices.some((price: any) => price.id === value);
      send({ type: 'SELECT_PACKAGE', packageId: value, isRecurring });
    },
  });

  useEffect(() => {
    if (state.context.toastMessage) {
      toast({
        title: state.context.toastMessage,
        status: state.context.error ? 'error' : 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [state.context.error, state.context.toastMessage]);

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      send({ type: 'ADD_CARD', paymentMethodId: paymentMethod.id });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    send({ type: 'DELETE_CARD', cardId });
  };

  const handleSubmit = () => {
    send({ type: 'CREATE_PAYMENT_INTENT' });
  };

  const handleConfirmPayment = () => {
    send({ type: 'CONFIRM_PAYMENT' });
  };

  return (
    <AdminLayout>
      <Box
        as='form'
        maxWidth='500px'
        margin='auto'
        pt='100px'
        p={8}
        mx='auto'
        borderWidth={1}
        boxShadow='md'
        mt='10vh'
        backgroundColor='white'
        borderRadius='20px'>
        <VStack spacing={8} align='stretch'>
          <Heading size='lg' textAlign='center'>
            Choose Your Subscription
          </Heading>

          <Input
            placeholder='Enter your email'
            value={state.context?.email || ''}
            onChange={(e) => send({ type: 'SET_EMAIL', email: e.target.value })}
            isRequired
          />

          <Heading size='md'>Recurring Payments</Heading>
          {(state.context as any).prices?.length > 0 ? (
            <HStack {...getRootProps()} justifyContent='center'>
              {(state.context as any).prices.map((price: any) => {
                const radio = getRadioProps({ value: price.id });
                return (
                  <RadioCard key={price.id} {...radio} isChecked={state.context.selectedPackage === price.id}>
                    ${price.unitAmount} / month
                  </RadioCard>
                );
              })}
            </HStack>
          ) : (
            <p>No recurring prices available</p>
          )}

          <Heading size='md'>One-Time Payments</Heading>
          {(state.context as any).nonRecurringPrices?.length > 0 ? (
            <HStack {...getRootProps()} justifyContent='center'>
              {(state.context as any).nonRecurringPrices.map((price: any) => {
                const radio = getRadioProps({ value: price.id });
                return (
                  <RadioCard key={price.id} {...radio} isChecked={state.context.selectedPackage === price.id}>
                    ${price.unitAmount}
                  </RadioCard>
                );
              })}
            </HStack>
          ) : (
            <p>No one-time prices available</p>
          )}

          <Box borderWidth='1px' borderRadius='lg' p={6} boxShadow='md' bg='white'>
            <CardElement />
            <Button type='button' colorScheme='teal' onClick={handleAddCard} isLoading={state.matches('addingCard')} mt={4}>
              Add Card Details
            </Button>
          </Box>

          <Select
            placeholder='Select saved card'
            value={state.context.selectedCardId || ''}
            onChange={(e) => send({ type: 'SELECT_CARD', cardId: e.target.value })}>
            {(state.context as any).cards?.map((card: any) => (
              <option key={card.id} value={card.id}>
                **** **** **** {card.card.last4} - {card.card.brand}
              </option>
            ))}
          </Select>

          {state.context.selectedCardId && (
            <Button colorScheme='red' onClick={() => handleDeleteCard(state.context.selectedCardId || '')} isLoading={state.matches('deletingCard')}>
              Delete Selected Card
            </Button>
          )}

          <Button type='button' colorScheme='blue' onClick={handleSubmit} isLoading={state.matches('creatingPaymentIntent')}>
            Subscribe Now
          </Button>
        </VStack>

        <Modal isOpen={state.matches('confirmingPayment')} onClose={() => send({ type: 'CANCEL_PAYMENT' })}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Payment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Are you sure you want to confirm this payment?</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleConfirmPayment} isLoading={state.matches('capturingPayment')}>
                Confirm
              </Button>
              <Button variant='ghost' onClick={() => send({ type: 'CANCEL_PAYMENT' })}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      {(state.context as any).charges?.length > 0 ? <RecentTransactions transactions={(state.context as any).charges} /> : null}
    </AdminLayout>
  );
};

const ManualPayment = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionForm />
  </Elements>
);

export default ManualPayment;

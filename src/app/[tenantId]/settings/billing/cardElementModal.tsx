'use client';

import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Organization } from '@/app/actions/billing-actions';

interface CardElementModalProps {
  onSuccess?: () => void;
  organization: Organization | null;
  onAddPaymentMethod: (paymentMethodId: string, email: string) => void;
  loading?: boolean;
}

const CardElementModal = ({ onSuccess, organization, onAddPaymentMethod, loading = false }: CardElementModalProps) => {
  const stripe = useStripe();
  const elements = useElements();

  // Card element options for better styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleAddPaymentMethod = async () => {
    if (!stripe || !elements || !organization) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Call the parent's add payment method function
      onAddPaymentMethod(paymentMethod.id, organization.email);

      // Call onSuccess callback to close modal
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Card Information</label>
        <div className='p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'>
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button type='submit' onClick={handleAddPaymentMethod} disabled={!stripe || loading}>
          {loading ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </div>
    </div>
  );
};

export default CardElementModal;

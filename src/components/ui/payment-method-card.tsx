import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentMethod } from '@/app/actions/billing-actions';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete: (cardId: string) => void;
  onSelect?: (cardId: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
  className?: string;
}

export function PaymentMethodCard({ paymentMethod, onDelete, onSelect, isSelected = false, showActions = true, className }: PaymentMethodCardProps) {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(paymentMethod.id);
    }
  };

  const handleDelete = () => {
    onDelete(paymentMethod.id);
  };

  return (
    <div className={`p-3 border border-border shadow-sm rounded-2xl ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full'>
            <CreditCard className='h-5 w-5 text-gray-600' />
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <p className='font-medium capitalize'>
                {paymentMethod.card?.brand} •••• {paymentMethod.card?.last4}
              </p>
            </div>
            <p className='text-sm text-muted-foreground'>
              Expires {paymentMethod.card?.exp_month?.toString().padStart(2, '0')}/{paymentMethod.card?.exp_year}
            </p>
            {paymentMethod.billing_details?.name && <p className='text-sm text-muted-foreground'>{paymentMethod.billing_details.name}</p>}
          </div>
        </div>
        {showActions && (
          <div className='flex items-center space-x-2'>
            {onSelect && (
              <Button variant={isSelected ? 'default' : 'outline'} size='sm' onClick={handleSelect}>
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            )}
            <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700' onClick={handleDelete}>
              Remove
            </Button>
          </div>
        )}
      </div>
      {paymentMethod.billing_details?.address && (
        <div className='mt-3 pt-3 border-t'>
          <p className='text-sm text-muted-foreground'>
            Billing Address: {paymentMethod.billing_details.address.country || 'US'}
            {paymentMethod.billing_details.address.line1 && `, ${paymentMethod.billing_details.address.line1}`}
            {paymentMethod.billing_details.address.city && `, ${paymentMethod.billing_details.address.city}`}
            {paymentMethod.billing_details.address.postal_code && ` ${paymentMethod.billing_details.address.postal_code}`}
          </p>
        </div>
      )}
    </div>
  );
}

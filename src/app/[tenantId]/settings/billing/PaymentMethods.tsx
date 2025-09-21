'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PaymentMethodCard } from '@/components/ui/payment-method-card';
import { PaymentMethod, Organization } from '@/app/actions/billing-actions';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  organization: Organization | null;
  onAddPaymentMethod: () => void;
  onDeletePaymentMethod: (cardId: string) => void;
  loading?: boolean;
}

export default function PaymentMethods({
  paymentMethods,
  organization,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  loading = false,
}: PaymentMethodsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl sm:text-2xl font-bold'>Payment Method</CardTitle>
        <CardDescription>Manage your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((paymentMethod: PaymentMethod) => (
              <PaymentMethodCard key={paymentMethod.id} paymentMethod={paymentMethod} onDelete={onDeletePaymentMethod} showActions={true} />
            ))
          ) : (
            <div>
              <p className='text-sm text-muted-foreground'>No payment method on file</p>
            </div>
          )}
          <Button variant='outline' onClick={onAddPaymentMethod} className='flex items-center space-x-2' disabled={loading}>
            <Plus className='h-4 w-4' />
            <span>Add Payment Method</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

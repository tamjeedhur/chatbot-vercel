'use client';

import React from 'react';
import { useBilling } from '@/providers/BillingProvider';
import { PlanCard } from '@/components/ui/plan-card';
import PaymentMethods from './PaymentMethods';
import BillingHistory from './BillingHistory';
import CardElementModal from './cardElementModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

// Initialize Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUNISHABLE_KEY || '';
const stripePromise = loadStripe(stripeKey);

export default function BillingClient() {
  const {
    currentPlan,
    paymentMethods,
    billingHistory,
    organization,
    loading,
    error,
    successMessage,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
    addPaymentMethod,
    deletePaymentMethod,
    clearError,
    clearSuccess,
  } = useBilling();

  // Show success/error messages
  React.useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearSuccess();
    }
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [successMessage, error, clearSuccess, clearError]);

  const handleAddPaymentMethod = (paymentMethodId: string, email: string) => {
    addPaymentMethod(paymentMethodId, email);
  };

  const handleDeletePaymentMethod = (cardId: string) => {
    deletePaymentMethod(cardId);
  };

  const handleViewReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold'>Billing</h1>
        <p className='text-muted-foreground mt-2 text-sm sm:text-base'>Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <PlanCard
        plan={currentPlan}
        chatbotId='mock-chatbot-id' // This should come from context or params
      />

      {/* Payment Methods */}
      <PaymentMethods
        paymentMethods={paymentMethods}
        organization={organization}
        onAddPaymentMethod={openPaymentModal}
        onDeletePaymentMethod={handleDeletePaymentMethod}
        loading={loading}
      />

      {/* Billing History */}
      <BillingHistory billingHistory={billingHistory} onViewReceipt={handleViewReceipt} loading={loading} />

      {/* Payment Method Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={closePaymentModal}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>Add Payment Method</DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <CardElementModal onSuccess={closePaymentModal} organization={organization} onAddPaymentMethod={handleAddPaymentMethod} />
          </Elements>
        </DialogContent>
      </Dialog>
    </div>
  );
}

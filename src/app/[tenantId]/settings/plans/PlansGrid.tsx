'use client'

import React from 'react';
import { useMachine } from '@xstate/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import paymentMachine from '@/machines/paymentMachine';
import { getPriceId, getProductId } from '@/utils/stripeConfig';
import PlanCard from './PlanCard';

interface PlanFeatures {
  maxMembers: number;
  featureLevel: string;
  storageInGB: number;
  support: string;
}

interface Plan {
  _id: string;
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  features: PlanFeatures;
}

interface PlansGridProps {
  plans: Plan[];
  selectedChatbot: any;
  organization: any;
}

export default function PlansGrid({ plans, selectedChatbot, organization }: PlansGridProps) {
  const [paymentState, paymentSend] = useMachine(paymentMachine);
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const router = useRouter();

  // Function to handle Stripe checkout
  const handleStripeCheckout = async (planId: string) => {
    const planConfig = {
      priceId: getPriceId(planId),
      productId: getProductId(planId),
    };

    if (!planConfig || !planConfig.priceId) {
      toast.error('Plan configuration not found');
      return;
    }

    setIsLoading(planId);

    try {
      paymentSend({
        type: 'START',
        priceId: planConfig.priceId,
        productId: planConfig.productId,
        chatbotId: selectedChatbot._id,
        plan: planId,
        organizationId: organization?.id,
        organizationEmail: organization?.owner?.email,
        recurring: true,
      });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to create checkout session');
      }
    } finally {
      setIsLoading(null);
    }
  };

  // Handle successful payment

    if (paymentState.matches('paymentSuccess')) {
      const sessionUrl = paymentState?.context?.sessionUrl;
      if (sessionUrl && typeof sessionUrl === 'string') {
        router.push(sessionUrl);
      }
    }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {plans.map((plan) => (
        <PlanCard
          key={plan._id}
          plan={plan}
          isLoading={isLoading}
          onPlanSelect={handleStripeCheckout}
        />
      ))}
    </div>
  );
}

'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface PlanCardProps {
  plan: Plan;
  isLoading: string | null;
  onPlanSelect: (planId: string) => void;
}

export default function PlanCard({ plan, isLoading, onPlanSelect }: PlanCardProps) {
  // Helper function to get plan description
  const getPlanDescription = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'Perfect for getting started';
      case 'pro':
        return 'Best for growing teams';
      case 'enterprise':
        return 'For large organizations';
      default:
        return 'Flexible plan option';
    }
  };

  // Helper function to get plan features
  const getPlanFeatures = (plan: Plan) => {
    const features = [];

    if (plan.features.maxMembers === -1) {
      features.push('Unlimited members');
    } else {
      features.push(`Up to ${plan.features.maxMembers} member${plan.features.maxMembers > 1 ? 's' : ''}`);
    }

    features.push(`${plan.features.featureLevel} features`);
    features.push(`${plan.features.storageInGB} GB storage`);

    switch (plan.features.support) {
      case 'community':
        features.push('Community support');
        break;
      case 'email':
        features.push('Email support');
        break;
      case 'priority':
        features.push('Priority support');
        break;
      default:
        features.push('Standard support');
    }

    return features;
  };

  // Helper function to get button text and variant
  const getButtonProps = (plan: Plan) => {
    if (plan.isActive) {
      return { text: 'Current Plan', variant: 'outline' as const, disabled: true };
    } else if (plan.id === 'enterprise') {
      return { text: 'Contact Sales', variant: 'default' as const, disabled: false };
    } else if (plan.id === 'free') {
      return { text: 'Free', variant: 'default' as const, disabled: false };
    } else {
      return { text: `Upgrade to ${plan.name.replace(' Plan', '')}`, variant: 'default' as const, disabled: false };
    }
  };

  // Function to handle plan selection
  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      toast.success('You are on the free plan');
      return;
    }

    if (planId === 'enterprise') {
      toast.info('Please contact our sales team for enterprise pricing');
      return;
    }

    onPlanSelect(planId);
  };

  const features = getPlanFeatures(plan);
  const buttonProps = getButtonProps(plan);
  const isPopular = plan.id === 'pro';

  return (
    <Card className={`flex flex-col ${isPopular ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-2xl font-bold ${isPopular ? 'flex items-center justify-between' : ''}`}>
          {plan.name.replace(' Plan', '')}
          {isPopular && <Badge>Popular</Badge>}
        </CardTitle>
        <CardDescription>{getPlanDescription(plan.id)}</CardDescription>
        <div className='text-2xl font-bold'>
          ${plan.price}
          <span className='text-sm font-normal'>/month</span>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col flex-1 space-y-4'>
        <ul className='space-y-2 text-sm flex-1'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center'>
              <span className='w-2 h-2 bg-primary rounded-full mr-2'></span>
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant={buttonProps.variant}
          className='w-full'
          disabled={buttonProps.disabled || isLoading === plan.id}
          onClick={() => handlePlanSelect(plan.id)}>
          {isLoading === plan.id ? 'Redirecting...' : buttonProps.text}
        </Button>
      </CardContent>
    </Card>
  );
}

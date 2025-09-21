import React from 'react';
import { PlanCard } from '@/components/ui/plan-card';
import { BillingPlan } from '@/app/actions/billing-actions';

interface CurrentPlanProps {
  plan: BillingPlan | null;
  chatbotId: string;
  className?: string;
}

export default function CurrentPlan({ plan, chatbotId, className }: CurrentPlanProps) {
  return <PlanCard plan={plan} chatbotId={chatbotId} className={className} />;
}

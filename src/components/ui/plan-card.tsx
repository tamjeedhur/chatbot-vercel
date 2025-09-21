import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BillingPlan } from '@/app/actions/billing-actions';

interface PlanCardProps {
  plan: BillingPlan | null;
  chatbotId: string;
  className?: string;
}

export function PlanCard({ plan, chatbotId, className }: PlanCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex flex-col sm:flex-row sm:items-center sm:justify-between text-xl sm:text-2xl font-bold space-y-2 sm:space-y-0'>
          <span>Current Plan</span>
          <Badge variant='secondary'>{plan?.name || 'No Plan'}</Badge>
        </CardTitle>
        <CardDescription>You're currently on the {plan?.name?.toLowerCase() || 'no'} plan</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <p className='text-sm font-medium text-foreground'>Members</p>
            <p className='text-2xl font-bold text-primary'>{plan?.features?.maxMembers || 0}</p>
            <p className='text-xs text-muted-foreground'>Used: 3 / {plan?.features?.maxMembers || 0}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-foreground'>Projects</p>
            <p className='text-2xl font-bold text-primary'>5</p>
            <p className='text-xs text-muted-foreground'>Used: 2 / 5</p>
          </div>
          <div>
            <p className='text-sm font-medium text-foreground'>Storage</p>
            <p className='text-2xl font-bold text-primary'>{plan?.features?.storageInGB || 0} GB</p>
            <p className='text-xs text-muted-foreground'>Used: 0.3 GB / {plan?.features?.storageInGB || 0} GB</p>
          </div>
        </div>
        <Button asChild className='w-full md:w-auto mt-2'>
          <a href={`/${chatbotId}/settings/plans`}>Upgrade Plan</a>
        </Button>
      </CardContent>
    </Card>
  );
}

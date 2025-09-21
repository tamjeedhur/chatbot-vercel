import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BillingHistoryItem } from '@/components/ui/billing-history-item';
import { BillingCharge } from '@/app/actions/billing-actions';

interface BillingHistoryProps {
  billingHistory: BillingCharge[];
  onViewReceipt?: (receiptUrl: string) => void;
  loading?: boolean;
  className?: string;
}

export default function BillingHistory({ billingHistory, onViewReceipt, loading = false, className }: BillingHistoryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-xl sm:text-2xl font-bold'>Billing History</CardTitle>
        <CardDescription>View your past invoices and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {billingHistory && billingHistory.length > 0 ? (
            billingHistory.map((charge: BillingCharge) => <BillingHistoryItem key={charge.id} charge={charge} onViewReceipt={onViewReceipt} />)
          ) : (
            <div className='flex items-center justify-between py-2 border-b'>
              <div>
                <p className='font-medium'>No billing history available</p>
                <p className='text-sm text-muted-foreground'>You haven't made any payments yet</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

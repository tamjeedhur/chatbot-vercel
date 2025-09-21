import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, RefreshCw, X } from 'lucide-react';
import { BillingCharge } from '@/app/actions/billing-actions';

interface BillingHistoryItemProps {
  charge: BillingCharge;
  onViewReceipt?: (receiptUrl: string) => void;
  className?: string;
}

export function BillingHistoryItem({ charge, onViewReceipt, className }: BillingHistoryItemProps) {
  const handleViewReceipt = () => {
    if (onViewReceipt && charge.receipt_url) {
      onViewReceipt(charge.receipt_url);
    }
  };

  const getStatusIcon = () => {
    switch (charge.status) {
      case 'succeeded':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'pending':
        return <RefreshCw className='h-5 w-5 text-yellow-600' />;
      default:
        return <X className='h-5 w-5 text-red-600' />;
    }
  };

  const getStatusVariant = () => {
    switch (charge.status) {
      case 'succeeded':
        return 'default' as const;
      case 'pending':
        return 'secondary' as const;
      default:
        return 'destructive' as const;
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 py-3 border-border border shadow-sm rounded-2xl p-2 ${className}`}>
      <div className='flex-1'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center justify-center w-10 h-10 bg-green-100 rounded-full'>{getStatusIcon()}</div>
          <div>
            <p className='font-medium'>
              ${(charge.amount / 100).toFixed(2)} {charge.currency?.toUpperCase()}
            </p>
            <p className='text-sm text-muted-foreground'>
              {new Date(charge.created * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {charge.description && <p className='text-sm text-muted-foreground'>{charge.description}</p>}
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        {charge.payment_method_details?.card && (
          <div className='mt-2 ml-13'>
            <p className='text-sm text-muted-foreground'>
              {charge.payment_method_details.card.brand?.charAt(0).toUpperCase() + charge.payment_method_details.card.brand?.slice(1)} ••••{' '}
              {charge.payment_method_details.card.last4}
            </p>
          </div>
        )}
        <div className='flex items-center space-x-2'>
          <Badge variant={getStatusVariant()} className='capitalize'>
            {charge.status}
          </Badge>
          {charge.receipt_url && (
            <Button variant='ghost' size='sm' onClick={handleViewReceipt}>
              <ExternalLink className='h-4 w-4' />
              <span className='sr-only'>View Receipt</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

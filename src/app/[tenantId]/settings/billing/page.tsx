import React from 'react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { BillingProvider } from '@/providers/BillingProvider';
import { getBillingData } from '@/app/actions/billing-actions';
import BillingClient from './BillingClient';

interface BillingPageProps {
  params: {
    tenantId: string;
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  // Fetch all billing data on the server
  const billingData = await getBillingData(params.tenantId);

  return (
    <AdminLayout>
      <BillingProvider tenantId={params.tenantId} initialData={billingData}>
        <BillingClient />
      </BillingProvider>
    </AdminLayout>
  );
}

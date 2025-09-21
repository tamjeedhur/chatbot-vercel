import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { getIntegrationsData } from '@/app/actions/integration-actions';
import IntegrationsClient from './IntegrationsClient';

interface IntegrationsPageProps {
  params: {
    tenantId: string;
  };
  searchParams: {
    chatbotId?: string;
  };
}

export default async function IntegrationsPage({ params, searchParams }: IntegrationsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Get chatbotId from searchParams or use a default
  const chatbotId = searchParams.chatbotId || 'default';

  // Fetch integrations data server-side
  const integrationsData = await getIntegrationsData(chatbotId);

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold'>Integrations</h1>
          <p className='text-muted-foreground mt-2'>Connect your workspace with external services</p>
        </div>

        <IntegrationsClient initialData={integrationsData} chatbotId={chatbotId} tenantId={params.tenantId} />
      </div>
    </AdminLayout>
  );
}

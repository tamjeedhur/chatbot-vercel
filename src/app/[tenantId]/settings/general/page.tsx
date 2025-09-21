import React from 'react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { GeneralSettingsProvider } from '@/providers/GeneralSettingsProvider';
import { getTenantSettings } from '@/app/actions/settings-actions';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import GeneralSettingsClient from '@/app/[tenantId]/settings/general/GeneralSettingsClient';

interface GeneralSettingsPageProps {
  params: {
    tenantId: string;
  };
}

export default async function GeneralSettingsPage({ params }: GeneralSettingsPageProps) {
  // Get session and access token
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    notFound();
  }

  // Fetch tenant settings on server side
  const tenantData = await getTenantSettings();

  if (!tenantData) {
    notFound();
  }

  const initialData = {
    tenant: tenantData,
    settings: tenantData.settings || {},
  };

  return (
    <AdminLayout>
      <GeneralSettingsProvider tenantId={params.tenantId} initialData={initialData} accessToken={accessToken}>
        <GeneralSettingsClient />
      </GeneralSettingsProvider>
    </AdminLayout>
  );
}

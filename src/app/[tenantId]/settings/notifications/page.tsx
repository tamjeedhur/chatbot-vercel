import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { NotificationSettings } from '@/components/features/NotificationSettings';
import { getNotificationSettings } from '@/app/actions/notification-actions';
import { Server_URL } from '@/utils/constants';

interface NotificationPageProps {
  params: {
    tenantId: string;
  };
}

export default async function NotificationPage({ params }: NotificationPageProps) {
  // Get session data server-side
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  // Fetch notification settings server-side
  const initialSettings = await getNotificationSettings();

  // Default settings if none found
  const defaultSettings = {
    email: {
      newTeamMember: true,
      billingUpdates: true,
      securityAlerts: true,
      weeklyUsageReports: false,
    },
    inApp: {
      realTimeUpdates: true,
      soundNotifications: false,
    },
  };

  const settings = initialSettings || defaultSettings;

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold'>Notifications</h1>
          <p className='text-muted-foreground mt-2'>Configure how you receive workspace notifications</p>
        </div>

        <NotificationSettings initialSettings={settings} tenantId={params.tenantId} serverUrl={Server_URL} bearerToken={accessToken} />
      </div>
    </AdminLayout>
  );
}

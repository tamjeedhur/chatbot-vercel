'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';

interface NotificationSettings {
  email: {
    newTeamMember: boolean;
    billingUpdates: boolean;
    securityAlerts: boolean;
    weeklyUsageReports: boolean;
  };
  inApp: {
    realTimeUpdates: boolean;
    soundNotifications: boolean;
  };
}

export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for notification settings fetch');
    return null;
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Notification settings API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    return data.data?.notifications || getDefaultNotificationSettings();
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return getDefaultNotificationSettings();
  }
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify({ notifications: settings }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Notification settings update API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return { success: false, error: `Failed to update settings: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return { success: false, error: 'Failed to update notification settings' };
  }
}

function getDefaultNotificationSettings(): NotificationSettings {
  return {
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
}



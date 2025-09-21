import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
export async function getAPIkeys(): Promise<any> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for api keys fetch');
    return [];
  }
  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/api-keys`, {
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
      console.error('API keys API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching api keys:', error);
    return null;
  }
}

export async function getMembers(): Promise<any> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for api keys fetch');
    return [];
  }
  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/members`, {
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
      console.error('API keys API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching api keys:', error);
    return null;
  }
}

export async function getTenantSettings(): Promise<any> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for tenant settings fetch');
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
      console.error('Tenant settings API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching tenant settings:', error);
    return null;
  }
}

export async function updateTenantSettings(updates: any): Promise<any> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for tenant settings update');
    return null;
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
      body: JSON.stringify(updates),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Tenant settings update API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    return null;
  }
}

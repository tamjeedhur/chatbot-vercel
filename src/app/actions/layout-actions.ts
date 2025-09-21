'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { API_VERSION, Server_URL } from '@/utils/constants';

export async function getChatbotsFromAPI(tenantId: string): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return { success: false, data: [], error: 'Server URL not configured' };
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for chatbot fetch');
      return { success: false, data: [], error: 'No access token available' };
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/ai-support/chatbots`;
  
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      console.error('Chatbot API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      return { success: false, data: [], error: errorMessage };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching chatbots:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined
    });
    return { success: false, data: [], error: errorMessage };
  }
}

export async function getSelectedChatbotById(chatbotId: string): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return { success: false, data: null, error: 'Server URL not configured' };
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for chatbot fetch');
      return { success: false, data: null, error: 'No access token available' };
    }

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/ai-support/chatbots/${chatbotId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      console.error('Chatbot by ID API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        chatbotId
      });
      return { success: false, data: null, error: errorMessage };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching chatbot by ID:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined
    });
    return { success: false, data: null, error: errorMessage };
  }
}

export async function getTenant(): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return { success: false, data: null, error: 'Server URL not configured' };
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for tenant fetch');
      return { success: false, data: null, error: 'No access token available' };
    }

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/current`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      console.error('Tenant settings API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      return { success: false, data: null, error: errorMessage };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching tenant settings:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      serverUrl: Server_URL
    });
    return { success: false, data: null, error: errorMessage };
  }
}

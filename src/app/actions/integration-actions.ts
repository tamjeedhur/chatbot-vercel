'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
import type { IntegrationTool, Webhook, IntegrationsData, ApiResponse, IntegrationError, INTEGRATION_ERROR_CODES } from '@/types/integrations';

/**
 * Fetch integration tools for a specific chatbot
 */
export async function getIntegrationTools(chatbotId: string): Promise<IntegrationTool[]> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for integration tools fetch');
    return [];
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/tools`, {
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
      console.error('Integration tools API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching integration tools:', error);
    return [];
  }
}

/**
 * Fetch webhooks for a specific chatbot
 */
export async function getWebhooks(chatbotId: string): Promise<Webhook[]> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for webhooks fetch');
    return [];
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/webhooks`, {
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
      console.error('Webhooks API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return [];
  }
}

/**
 * Connect an integration tool
 */
export async function connectIntegrationTool(chatbotId: string, toolId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/tools/${toolId}/connect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to connect integration' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error connecting integration tool:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Disconnect an integration tool
 */
export async function disconnectIntegrationTool(chatbotId: string, toolId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/tools/${toolId}/disconnect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to disconnect integration' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error disconnecting integration tool:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Create a new webhook
 */
export async function createWebhook(
  chatbotId: string,
  webhookData: Omit<Webhook, '_id' | 'createdAt' | 'lastTriggered'>
): Promise<{ success: boolean; data?: Webhook; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/webhooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to create webhook' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error creating webhook:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update a webhook
 */
export async function updateWebhook(
  chatbotId: string,
  webhookId: string,
  updates: Partial<Webhook>
): Promise<{ success: boolean; data?: Webhook; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/webhooks/${webhookId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to update webhook' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error updating webhook:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(chatbotId: string, webhookId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    return { success: false, error: 'No access token available' };
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/chatbots/${chatbotId}/integrations/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to delete webhook' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get all integrations data for a chatbot
 */
export async function getIntegrationsData(chatbotId: string): Promise<IntegrationsData> {
  const [tools, webhooks] = await Promise.all([getIntegrationTools(chatbotId), getWebhooks(chatbotId)]);

  return {
    tools,
    webhooks,
  };
}

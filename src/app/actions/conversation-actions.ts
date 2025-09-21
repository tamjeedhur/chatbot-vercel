'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
export async function getConversationUsers(tenantId: string, chatbotId: string): Promise<any[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for conversation fetch');
      return [];
    }

    // Use the existing conversations endpoint and filter by chatbotId
    const apiUrl = `${Server_URL}/api/${API_VERSION}/ai-support/conversations?chatbotId=${chatbotId}`;


    const response = await fetch(apiUrl, {
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
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      console.error('Conversation API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();

    console.log('Conversations data:', JSON.stringify(data, null, 2));
    // Handle different response structures and return raw data
    if (Array.isArray(data)) {
      return data;
    } else if (Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data.conversations)) {
      return data.conversations;
    } else if (data.data && Array.isArray(data.data.conversations)) {
      // Handle the actual API response structure: data.data.conversations
      return data.data.conversations;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn('Unexpected API response structure:', data);
      return [];
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching conversations:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function getConversationDetails(conversationId: string, chatbotId: string, page: number = 1, limit: number = 50): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for conversation details fetch');
      return null;
    }

    // Use the correct endpoint for getting conversation messages with pagination
    const apiUrl = `${Server_URL}/api/v1/ai-support/conversations/${conversationId}/messages?page=${page}&limit=${limit}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // 1-minute cache for messages
    });

    if (!response.ok) {
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      console.error('Conversation details API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    console.log('Conversation details response:', result);

    // Handle the response structure as per your API
    if (result.success && result.data) {
      return {
        messages: result.data.messages || [],
        pagination: result.data.pagination || {}
      };
    } else if (result.messages) {
      return {
        messages: result.messages,
        pagination: {}
      };
    } else if (result.data && Array.isArray(result.data)) {
      return {
        messages: result.data,
        pagination: {}
      };
    } else if (Array.isArray(result)) {
      return {
        messages: result,
        pagination: {}
      };
    } else {
      console.warn('Unexpected response structure:', result);
      return {
        messages: [],
        pagination: {}
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching conversation details:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

export async function refreshConversations(tenantId: string, chatbotId: string): Promise<{ success: boolean; conversations?: any[]; error?: string }> {
  try {
    const conversations = await getConversationUsers(tenantId, chatbotId);
    return { success: true, conversations };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

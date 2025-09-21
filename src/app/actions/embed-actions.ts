'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';

export interface EmbedData {
  chatbotId: string;
  chatbotName: string;
  scriptUrl: string;
  iframeUrl: string;
  widgetKey: string;
  embedKey: string;
  baseUrl: string;
  embedCode: string;
  iframeEmbedCode: string;
  instructions: {
    usage: string;
    example: string;
    iframeUsage: string;
    iframeExample: string;
    note: string;
  };
}

export async function getEmbedData(tenantId: string, chatbotId: string): Promise<EmbedData | null> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for embed data fetch');
      return null;
    }

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/ai-support/chatbots/${chatbotId}/widget/script-url`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Widget script URL API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        chatbotId,
      });
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      console.error('Invalid response from widget script URL API:', data);
      return null;
    }

    const widgetData = data.data;

    return {
      chatbotId: widgetData.chatbotId,
      chatbotName: widgetData.chatbotName,
      scriptUrl: widgetData.scriptUrl,
      iframeUrl: widgetData.iframeUrl,
      widgetKey: widgetData.widgetKey,
      embedKey: widgetData.embedKey,
      baseUrl: widgetData.baseUrl,
      embedCode: widgetData.embedCode,
      iframeEmbedCode: widgetData.iframeEmbedCode,
      instructions: widgetData.instructions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching embed data:', {
      error: errorMessage,
      chatbotId,
      tenantId,
    });
    return null;
  }
}

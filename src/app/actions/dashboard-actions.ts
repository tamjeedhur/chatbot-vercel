
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
export async function totalDocumentsCount(chatbotId: string): Promise<number> {
    try {
      if (!Server_URL) {
        console.error('Server_URL is not configured');
        return 0;
      }
  
      const session = await getServerSession(authOptions);
      const accessToken: string = (session as any)?.accessToken || '';
  
      if (!accessToken) {
        console.warn('No access token available for total documents count fetch');
        return 0;
       
      }
  
      // Use the existing conversations endpoint and filter by chatbotId
      const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents`;
  
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
        console.error('All documents count API error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
        return 0;
      }
  
      const data = await response.json();

  
      return data.data.pagination?.total || 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching all documents count:', {
        error: errorMessage,
        cause: error instanceof Error ? error.cause : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return 0;
    }
  }
  
  export async function totalConversationsCount(chatbotId: string): Promise<number> {
    try {
      if (!Server_URL) {
        console.error('Server_URL is not configured');
        return 0;
      }
  
      const session = await getServerSession(authOptions);
      const accessToken: string = (session as any)?.accessToken || '';
  
      if (!accessToken) {
        console.warn('No access token available for total documents count fetch');
        return 0;
       
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
        console.error('All documents count API error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
        return 0;
      }
  
      const data = await response.json();

  
      return data.data.total || 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching all documents count:', {
        error: errorMessage,
        cause: error instanceof Error ? error.cause : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return 0;
    }
  }  
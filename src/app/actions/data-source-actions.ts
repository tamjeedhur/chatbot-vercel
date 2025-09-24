'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
import {
  Document,
  DocumentStats,
  ContentTypeBreakdown,
  SearchPayload,
  AdvancedSearchPayload,
  ContentTypeDocumentsResponse,
  PaginationInfo,
} from '@/machines/dataSources/types';
import { DataSourceDocument } from '@/redux/slices/scrapSlice';

// New Document Management Functions

export async function listDocuments(
  chatbotId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    url?: string;
  } = {}
): Promise<Document[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for documents fetch');
      return [];
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.search) queryParams.append('search', options.search);
    if (options.url) queryParams.append('url', options.url);

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents?${queryParams.toString()}`;

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
      console.error('Documents API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    // Handle both response structures: data.data.documents and data.documents
    const documents = data.data?.documents || data.documents || data.dataSourcesDocuments || [];
    return documents;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching documents:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function getDocument(chatbotId: string, documentId: string): Promise<Document | null> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for document fetch');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/${documentId}`;

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
      console.error('Document API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    const document = data.data.document;
    return document;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

export async function updateDocument(chatbotId: string, documentId: string, data: Partial<any>): Promise<Document | null> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for document update');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/${documentId}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Document update API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    const document = result.data.document;
    return document;
  } catch (error) {
    console.error('Error updating document:', error);
    return null;
  }
}

export async function deleteDocument(chatbotId: string, documentId: string): Promise<boolean> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return false;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for document deletion');
      return false;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/${documentId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
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
      console.error('Document deletion API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

// Content Creation Functions

export async function processUrls(chatbotId: string, data: any): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for URL processing');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/urls/process`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('URL processing API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error processing URLs:', error);
    return null;
  }
}

export async function uploadFile(chatbotId: string, formData: FormData): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for file upload');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/upload`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('File upload API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

export async function addTextContent(chatbotId: string, data: any): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for text content addition');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/text`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Text content API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding text content:', error);
    return null;
  }
}

export async function addQA(chatbotId: string, data: any): Promise<any> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for Q&A addition');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/qa`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Q&A API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding Q&A:', error);
    return null;
  }
}

// Search Functions

export async function searchDocuments(chatbotId: string, data: SearchPayload): Promise<Document[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for document search');
      return [];
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/search`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Document search API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const result = await response.json();
    // Handle both response structures: result.data.documents and result.documents
    const documents = result.data?.documents || result.documents || result.dataSourcesDocuments || [];
    return documents;
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}

export async function advancedSearchDocuments(chatbotId: string, data: AdvancedSearchPayload): Promise<Document[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for advanced document search');
      return [];
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/search/advanced`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Advanced document search API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const result = await response.json();
    // Handle both response structures: result.data.documents and result.documents
    const documents = result.data?.documents || result.documents || result.dataSourcesDocuments || [];
    return documents;
  } catch (error) {
    console.error('Error in advanced document search:', error);
    return [];
  }
}

export async function getDocumentsByContentType(
  chatbotId: string,
  contentType: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
): Promise<{ documents: DataSourceDocument[]; pagination: PaginationInfo; contentType: string; chatbotId: string }> {
  try {
    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for content type filtering');
      return {
        documents: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        contentType,
        chatbotId,
      };
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', (options.page || 1).toString());
    queryParams.append('limit', Math.min(options.limit || 50, 50).toString()); // Max 50 as per API
    if (options.search) {
      queryParams.append('search', options.search);
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/documents/type/${contentType}?${queryParams.toString()}`;

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

    const result = await response.json();
    // Handle the case where the API returns dataSourcesDocuments containing the response
    const responseData = result.data;
    return {
      documents: responseData.documents,
      pagination: responseData.pagination || { page: 1, limit: 50, total: 0, pages: 0 },
      contentType: responseData.contentType || contentType,
      chatbotId: responseData.chatbotId || chatbotId,
    };
  } catch (error) {
    console.error('Error filtering by content type:', error);
    return {
      documents: [],
      pagination: { page: 1, limit: 50, total: 0, pages: 0 },
      contentType,
      chatbotId,
    };
  }
}

// Analytics Functions

export async function getDocumentStats(chatbotId: string): Promise<DocumentStats | null> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return null;
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for document stats');
      return null;
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/stats`;

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
      console.error('Document stats API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const result = await response.json();
    return result.data.stats;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    return null;
  }
}

export async function getContentTypes(chatbotId: string): Promise<ContentTypeBreakdown[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for content types');
      return [];
    }

    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/content-types`;

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
      console.error('Content types API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const result = await response.json();
    return result.data.contentTypes || [];
  } catch (error) {
    console.error('Error fetching content types:', error);
    return [];
  }
}

// Legacy Functions (for backward compatibility)

export async function listDataSources(): Promise<any[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for data sources fetch');
      return [];
    }

    // Use the existing conversations endpoint and filter by chatbotId
    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources?type=url&page=1&limit=50`;

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
      console.error('Data Source API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    console.log(data, 'this is datasources data');

    return data.data.datasources;
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

export async function getDataSourceDetails(dataSourceId: string): Promise<any> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for data source details fetch');
    return [];
  }
  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/datasources/${dataSourceId}`, {
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
      console.error('Data Source API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }
    const data = await response.json();
    return data.data.datasource;
  } catch (error) {
    console.error('Error fetching data source details:', error);
    return null;
  }
}

// Legacy function - now redirects to new document-based function
export async function getAllDataSourceDocuments(chatbotId: string): Promise<any> {
  return listDocuments(chatbotId);
}

export async function listAllQuestions(chatbotId: string): Promise<any[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for data sources fetch');
      return [];
    }

    // Use the existing conversations endpoint and filter by chatbotId
    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/qa`;

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
      console.error('Q/AAPI error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();

    return data.data.documents;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching q/a documents:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function listAllTextContent(chatbotId: string): Promise<any[]> {
  try {
    if (!Server_URL) {
      console.error('Server_URL is not configured');
      return [];
    }

    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      console.warn('No access token available for data sources fetch');
      return [];
    }

    // Use the existing conversations endpoint and filter by chatbotId
    const apiUrl = `${Server_URL}/api/${API_VERSION}/datasources/chatbots/${chatbotId}/text`;

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
      console.error('Text content API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();

    return data.data.documents;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching text content:', {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

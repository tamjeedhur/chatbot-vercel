// Document interface for new API structure
export interface Document {
  id: string;
  chatbotId: string;
  title: string;
  content: string;
  contentType: 'url' | 'text' | 'file' | 'qa';
  status: 'processing' | 'completed' | 'failed';
  metadata: {
    source?: string;
    url?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    chunkSize?: number;
    chunkOverlap?: number;
    vectorStore?: string;
    namespace?: string;
    title?: string;
    scrapedAt?: string;
    contentLength?: number;
  };
  processingInfo?: {
    chunksCount: number;
    processingTime: number;
    lastProcessedAt: string;
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Content type response interface
export interface ContentTypeDocumentsResponse {
  documents: Document[];
  pagination: PaginationInfo;
  contentType: string;
  chatbotId: string;
}

// Legacy DataSource interface for backward compatibility
export interface DataSource {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  config: {
    settings: {
      chunkSize: number;
      chunkOverlap: number;
    };
    credentials: {
      type: string;
      encrypted: boolean;
    };
    syncSchedule: {
      enabled: boolean;
      frequency: string;
    };
    vectorStore: string;
    namespace: string;
  };
  documentsCount: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// New payload interfaces for document operations
export interface DocumentPayload {
  title: string;
  content: string;
  contentType: 'url' | 'text' | 'file' | 'qa';
  metadata: {
    source?: string;
    url?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    chunkSize?: number;
    chunkOverlap?: number;
    vectorStore?: string;
    namespace?: string;
  };
}

export interface URLProcessPayload {
  urls: string[];
  options: {
    chunkSize: number;
    chunkOverlap: number;
  };
}

export interface TextContentPayload {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  metadata?: {
    author?: string;
    version?: string;
    difficulty?: string;
    lastUpdated?: string;
  };
}

export interface QAPayload {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  priority?: number;
}

export interface SearchPayload {
  query: string;
  filters?: {
    contentType?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  limit?: number;
  offset?: number;
}

export interface AdvancedSearchPayload {
  query: string;
  contentTypes?: string[];
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  includeContent?: boolean;
}

// Legacy DataSourcePayload for backward compatibility
export interface DataSourcePayload {
  name: string;
  description: string;
  type: string;
  vectorStore: string;
  settings: {
    chunkSize: number;
    chunkOverlap: number;
  };
  credentials: {
    type: string;
    credentials: Record<string, any>;
    encrypted: boolean;
  };
  syncSchedule: {
    enabled: boolean;
    frequency: string;
  };
  namespace: string;
}

// Analytics and statistics interfaces
export interface DocumentStats {
  totalDocuments: number;
  documentsByType: Record<string, number>;
  processingStatus: {
    completed: number;
    processing: number;
    failed: number;
  };
  recentActivity: {
    documentsAdded: number;
    lastUpdated: string;
  };
}

export interface ContentTypeBreakdown {
  contentType: string;
  count: number;
  percentage: number;
}

// Updated Context interface for document-based operations
export interface Context {
  isLoading?: boolean;
  error?: string | null;
  documents?: Document[];
  dataSources?: DataSource[]; // Legacy support
  tenantId?: string;
  chatbotId?: string;
  selectedDocument?: Document;
  selectedDataSource?: DataSource; // Legacy support
  documentToDelete?: string;
  dataSourceToDelete?: string; // Legacy support
  formId?: string;
  conversationId?: string;
  searchResults?: Document[];
  stats?: DocumentStats;
  contentTypes?: ContentTypeBreakdown[];
  searchQuery?: string;
  filters?: {
    contentType?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  pagination?: PaginationInfo;
  currentContentType?: string;
}

// Updated Events for document operations
export type Events =
  // Document Management Events
  | { type: 'LIST_DOCUMENTS'; chatbotId: string; options?: { page?: number; limit?: number; search?: string; url?: string } }
  | { type: 'GET_DOCUMENT'; chatbotId: string; documentId: string }
  | { type: 'UPDATE_DOCUMENT'; chatbotId: string; documentId: string; data: Partial<DocumentPayload> }
  | { type: 'DELETE_DOCUMENT'; chatbotId: string; documentId: string }

  // Content Creation Events
  | { type: 'PROCESS_URLS'; chatbotId: string; data: URLProcessPayload }
  | { type: 'UPLOAD_FILE'; chatbotId: string; data: FormData }
  | { type: 'ADD_TEXT'; chatbotId: string; data: TextContentPayload }
  | { type: 'ADD_QA'; chatbotId: string; data: QAPayload }

  // Search Events
  | { type: 'SEARCH_DOCUMENTS'; chatbotId: string; data: SearchPayload }
  | { type: 'ADVANCED_SEARCH'; chatbotId: string; data: AdvancedSearchPayload }
  | { type: 'GET_BY_CONTENT_TYPE'; chatbotId: string; contentType: string; options?: { page?: number; limit?: number; search?: string } }

  // Analytics Events
  | { type: 'GET_STATS'; chatbotId: string }
  | { type: 'GET_CONTENT_TYPES'; chatbotId: string }

  // Legacy DataSource Events (for backward compatibility)
  | { type: 'ADD_DATA_SOURCE'; data: DataSourcePayload }
  | { type: 'UPDATE_DATA_SOURCE'; data: { dataSourceId: string; data: DataSourcePayload } }
  | { type: 'DELETE_DATA_SOURCE'; dataSourceId: string }
  | { type: 'LIST_DATA_SOURCES' }
  | { type: 'PROVIDE_DATA_SOURCES'; dataSources: DataSource[] }
  | { type: 'GET_DATA_SOURCES'; dataSourceType?: string; status?: string }

  // General Events
  | { type: 'PROVIDE_DOCUMENTS'; documents: Document[] }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_ERROR' };

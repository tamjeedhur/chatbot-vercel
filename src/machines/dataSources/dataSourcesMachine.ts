import { assign, fromPromise, setup } from 'xstate';
import {
  Context,
  DataSourcePayload,
  Events,
  DataSource,
  Document,
  DocumentPayload,
  URLProcessPayload,
  TextContentPayload,
  QAPayload,
  SearchPayload,
  AdvancedSearchPayload,
  DocumentStats,
  ContentTypeBreakdown,
  ContentTypeDocumentsResponse,
} from './types';
import { API_VERSION } from '@/utils/constants';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { extractErrorMessage } from '@/utils/utils';
// Removed Redux dependencies - using XState context instead

export const dataSourcesMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      initialDocuments: Document[];
      tenantId: string;
      chatbotId: string;
    },
  },
  actors: {
    // Document Management Actors
    listDocuments: fromPromise(
      async ({ input }: { input: { chatbotId: string; options?: { page?: number; limit?: number; search?: string; url?: string } } }) => {
        try {
          const { listDocuments } = await import('@/app/actions/data-source-actions');
          return await listDocuments(input.chatbotId, input.options || {});
        } catch (error: any) {
          const errorMessage = extractErrorMessage(error);
          throw new Error(errorMessage);
        }
      }
    ),
    getDocument: fromPromise(async ({ input }: { input: { chatbotId: string; documentId: string } }) => {
      try {
        const response = await axiosInstance.get(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateDocument: fromPromise(async ({ input }: { input: { chatbotId: string; documentId: string; data: Partial<DocumentPayload> } }) => {
      try {
        const response = await axiosInstance.put(
          `/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`,
          input.data
        );
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    deleteDocument: fromPromise(async ({ input }: { input: { chatbotId: string; documentId: string } }) => {
      try {
        const response = await axiosInstance.delete(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    // Content Creation Actors
    processUrls: fromPromise(async ({ input }: { input: { chatbotId: string; data: URLProcessPayload } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/urls/process`, input.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    uploadFile: fromPromise(async ({ input }: { input: { chatbotId: string; formData: FormData } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/upload`, input.formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    addTextContent: fromPromise(async ({ input }: { input: { chatbotId: string; data: TextContentPayload } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/text`, input.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    addQA: fromPromise(async ({ input }: { input: { chatbotId: string; data: QAPayload } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/qa`, input.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    // Search Actors
    searchDocuments: fromPromise(async ({ input }: { input: { chatbotId: string; data: SearchPayload } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/search`, input.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    advancedSearchDocuments: fromPromise(async ({ input }: { input: { chatbotId: string; data: AdvancedSearchPayload } }) => {
      try {
        const response = await axiosInstance.post(
          `/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/search/advanced`,
          input.data
        );
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    getDocumentsByContentType: fromPromise(
      async ({ input }: { input: { chatbotId: string; contentType: string; options?: { page?: number; limit?: number; search?: string } } }) => {
        try {
          const { getDocumentsByContentType } = await import('@/app/actions/data-source-actions');
          return await getDocumentsByContentType(input.chatbotId, input.contentType, input.options || {});
        } catch (error: any) {
          const errorMessage = extractErrorMessage(error);
          throw new Error(errorMessage);
        }
      }
    ),

    // Analytics Actors
    getDocumentStats: fromPromise(async ({ input }: { input: { chatbotId: string } }) => {
      try {
        const response = await axiosInstance.get(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/stats`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    getContentTypes: fromPromise(async ({ input }: { input: { chatbotId: string } }) => {
      try {
        const response = await axiosInstance.get(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/content-types`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    // Legacy DataSource Actors (for backward compatibility)
    addDataSource: fromPromise(async ({ input }: { input: DataSourcePayload }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources`, input);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateDataSource: fromPromise(async ({ input }: { input: { dataSourceId: string; data: DataSourcePayload } }) => {
      console.log('input', input);
      try {
        const response = await axiosInstance.put(`/api/${API_VERSION}/datasources/${input.dataSourceId}`, input.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    deleteDataSource: fromPromise(async ({ input }: { input: { dataSourceId: string } }) => {
      try {
        const response = await axiosInstance.delete(`/api/${API_VERSION}/datasources/${input.dataSourceId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Operation completed successfully';
      toast.success(message);
    },
    setErrorWithToast: ({ event }: any) => {
      const errorMessage = event.error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
    setDataSourceToDelete: assign({
      dataSourceToDelete: ({ event }: any) => (event as any).dataSourceId,
    }),
    // Removed Redux dispatch actions - using XState context instead

    // Document Management Actions
    setDocuments: assign({
      documents: ({ event }: any) => event.output?.data?.documents || event.output?.data || [],
      isLoading: false,
      error: null,
    }),
    addDocumentToContext: assign({
      documents: ({ context, event }: any) => {
        const newDocument = event.output?.data?.document || event.output?.data;
        if (newDocument) {
          return [...(context.documents || []), newDocument];
        }
        return context.documents || [];
      },
      isLoading: false,
      error: null,
    }),
    updateDocumentInContext: assign({
      documents: ({ context, event }: any) => {
        const updatedDocument = event.output?.data?.document || event.output?.data;
        if (updatedDocument) {
          return (context.documents || []).map((doc: Document) => (doc.id === updatedDocument.id ? updatedDocument : doc));
        }
        return context.documents || [];
      },
      isLoading: false,
      error: null,
    }),
    removeDocumentFromContext: assign({
      documents: ({ context, event }: any) => {
        const documentId = event.documentId;
        return (context.documents || []).filter((doc: Document) => doc.id !== documentId);
      },
      isLoading: false,
      error: null,
    }),
    setSelectedDocument: assign({
      selectedDocument: ({ event }: any) => event.output?.data?.document || event.output?.data,
      isLoading: false,
      error: null,
    }),
    setDocumentToDelete: assign({
      documentToDelete: ({ event }: any) => event.documentId,
    }),
    clearDocumentToDelete: assign({
      documentToDelete: undefined,
    }),

    // Search Actions
    setSearchResults: assign({
      searchResults: ({ event }: any) => event.output?.data?.documents || event.output?.data || [],
      isLoading: false,
      error: null,
    }),
    setContentTypeResults: assign({
      searchResults: ({ event }: any) => event.output?.documents || [],
      pagination: ({ event }: any) => event.output?.pagination || { page: 1, limit: 50, total: 0, pages: 0 },
      currentContentType: ({ event }: any) => event.output?.contentType,
      isLoading: false,
      error: null,
    }),
    setSearchQuery: assign({
      searchQuery: ({ event }: any) => event.data?.query || '',
    }),
    setFilters: assign({
      filters: ({ event }: any) => event.data?.filters || {},
    }),

    // Analytics Actions
    setDocumentStats: assign({
      stats: ({ event }: any) => event.output?.data?.stats || event.output?.data,
      isLoading: false,
      error: null,
    }),
    setContentTypes: assign({
      contentTypes: ({ event }: any) => event.output?.data?.contentTypes || event.output?.data || [],
      isLoading: false,
      error: null,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcUGUD2BXATgMZwB0AlhADZgDEAggCIMD6DdAKnc5gPICqAJQDCAUQDaABgC6iUAAdssMmjLYAdrJAAPRAGYAHAE4SugEz6AjLolmA7PtsBWXboA0IAJ6JTAFgBsJD62fo5+EobBFhKmFqYAvnHuqBg4BMSw5FS0fAAKbOwirBxcvIKikjJIIApKKuqaOggGxmaW1nYOzm6eiH62FiQWhs4SjhKj1n4WCUnoWHhEpBTUNAwiADIiBUWc3PzC4tKaNcqqGlWNzSbmVjam9k4u7l4I-rqDfoamfqa6w6OOQwzEDJeZpUgoCAQMhqKAMOapRY0CDqMDkNQAN2wAGs0aDEekSJDobD4SkFsQEDCsYR0GcKhVjopTvULogjMYbvcHAYhlZnoghrYSLZbLofGYpvowj4LI5gfiKRCoTC4QilTQwPh8Nh8CQ5JR0AAzXUAWxIivBGWJqrJYMWVMx2FpdTUDKOVROroa7MMnMs3LFlkM-J6TQswojhj8+n091itmjCvVVotYGoKlJKaRKLUaOpOLx2cJEHTYEzavJ4MdNLp6ndlXkzO9bIQHJIXIevJD3Resokg1aVksPkMElsPmTVcWGVLGdtxdoWp1eoNxrNFsXs7LFbtBLANeddbd0kZnubZx9bb9HYDXeDoZejlMxmcY8ctlMpmcFh88sSIJbiQuByMkC7TsQyKouiWK4puEGkCBYFZghh4uvSp4ek2tSXq27adjyD69r0X6BF8FhxsERg+L4U72oSSF0ih9FLtqur6oaaAmvg5qWjOwGgUxlYsWhx4NkyOGsqAjT4XehF8sRCATgMRj6D4EgWJ8PgBvodH7hky66jQWiwBgaBoigRrmfgAAUpjjBIACUyJAYZ+BnthLLnNJgoOSQjhyjGoy-hIfgCm24okPoAXPp+Bg+OpukAXxhKwLghDpLAxmmegFlWVqdkOc5KWkGlGVwLAHnVBeUnaL54z+YF+jBepYVhpYZF+hE0TNWEDgJABajYKW8BVCVo2eS2PkIAAtG1LxzSQDnLSt4y2HpSoZMsYASV5V40eFUTCn8ZjfL+6njiGG2pjazH7rtU11QgISOCKIQ-NFgaKV+7xBC9ER+g42nXfxc7luBLEPbh00-MKMUhEMoyfv44U0ZGnzfqK0SGLoiYgwxgm7ouUO1Y0fg0SQfR8tK4QBfY4Xk-ogzDC+crSpYoz46Qbkk95T0WHK7yJp8XQflE0rhY4ziU4FUS49EcrTMlQFlZlvNXgL0vC8MLhixIEthr4A7ji9+sUT1jhJQkQA */
  id: 'dataSources',
  initial: 'idle',
  context: ({ input }: { input: { initialDocuments: Document[]; tenantId: string; chatbotId: string } }) => ({
    isLoading: false,
    error: null,
    dataSources: [], // Legacy - keeping for backward compatibility
    documents: input.initialDocuments || [],
    tenantId: input.tenantId,
    chatbotId: input.chatbotId,
    selectedDataSource: undefined,
    selectedDocument: undefined,
    dataSourceToDelete: undefined,
    documentToDelete: undefined,
    formId: undefined,
    conversationId: undefined,
    searchResults: [],
    stats: undefined,
    contentTypes: [],
    searchQuery: '',
    filters: {},
    pagination: { page: 1, limit: 50, total: 0, pages: 0 },
    currentContentType: '',
  }),
  states: {
    idle: {
      on: {
        // Legacy DataSource Events
        ADD_DATA_SOURCE: 'addingDataSource',
        UPDATE_DATA_SOURCE: 'updatingDataSource',
        DELETE_DATA_SOURCE: 'deletingDataSource',

        // Document Management Events
        LIST_DOCUMENTS: 'listingDocuments',
        GET_DOCUMENT: 'gettingDocument',
        UPDATE_DOCUMENT: 'updatingDocument',
        DELETE_DOCUMENT: 'deletingDocument',

        // Content Creation Events
        PROCESS_URLS: 'processingUrls',
        UPLOAD_FILE: 'uploadingFile',
        ADD_TEXT: 'addingText',
        ADD_QA: 'addingQA',

        // Search Events
        SEARCH_DOCUMENTS: 'searchingDocuments',
        ADVANCED_SEARCH: 'advancedSearching',
        GET_BY_CONTENT_TYPE: 'filteringByContentType',

        // Analytics Events
        GET_STATS: 'gettingStats',
        GET_CONTENT_TYPES: 'gettingContentTypes',
      },
    },
    addingDataSource: {
      invoke: {
        src: 'addDataSource',
        input: ({ event }) => (event as { type: 'ADD_DATA_SOURCE'; data: DataSourcePayload }).data,
        onDone: {
          target: 'success',
          actions: ['showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    deletingDataSource: {
      entry: 'setDataSourceToDelete',
      invoke: {
        src: 'deleteDataSource',
        input: ({ event }) => ({ dataSourceId: (event as any).dataSourceId }),
        onDone: {
          target: 'success',
          actions: ['showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    updatingDataSource: {
      invoke: {
        src: 'updateDataSource',
        input: ({ event }) => ({
          dataSourceId: (event as any).data.dataSourceId,
          data: (event as any).data.data,
        }),
        onDone: {
          target: 'success',
          actions: ['showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    error: {
      after: {
        2000: {
          target: 'idle',
          actions: assign({
            error: () => null,
            isLoading: () => false,
          }),
        },
      },
    },
    success: {
      after: {
        2000: {
          target: 'idle',
          actions: assign({
            error: () => null,
            isLoading: () => false,
          }),
        },
      },
    },

    // Document Management States
    listingDocuments: {
      invoke: {
        src: 'listDocuments',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          options: (event as any).options || {},
        }),
        onDone: {
          target: 'idle',
          actions: ['setDocuments', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    gettingDocument: {
      invoke: {
        src: 'getDocument',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          documentId: (event as any).documentId,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSelectedDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    updatingDocument: {
      invoke: {
        src: 'updateDocument',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          documentId: (event as any).documentId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['updateDocumentInContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    deletingDocument: {
      entry: 'setDocumentToDelete',
      invoke: {
        src: 'deleteDocument',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          documentId: (event as any).documentId,
        }),
        onDone: {
          target: 'idle',
          actions: ['removeDocumentFromContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },

    // Content Creation States
    processingUrls: {
      invoke: {
        src: 'processUrls',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['addDocumentToContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    uploadingFile: {
      invoke: {
        src: 'uploadFile',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          formData: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['addDocumentToContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    addingText: {
      invoke: {
        src: 'addTextContent',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['addDocumentToContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    addingQA: {
      invoke: {
        src: 'addQA',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['addDocumentToContext', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },

    // Search States
    searchingDocuments: {
      invoke: {
        src: 'searchDocuments',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSearchResults', 'setSearchQuery', 'setFilters'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    advancedSearching: {
      invoke: {
        src: 'advancedSearchDocuments',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          data: (event as any).data,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSearchResults', 'setSearchQuery', 'setFilters'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    filteringByContentType: {
      invoke: {
        src: 'getDocumentsByContentType',
        input: ({ event }) => ({
          chatbotId: (event as any).chatbotId,
          contentType: (event as any).contentType,
          options: (event as any).options || {},
        }),
        onDone: {
          target: 'idle',
          actions: ['setContentTypeResults'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },

    // Analytics States
    gettingStats: {
      invoke: {
        src: 'getDocumentStats',
        input: ({ event }) => ({ chatbotId: (event as any).chatbotId }),
        onDone: {
          target: 'idle',
          actions: ['setDocumentStats'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    gettingContentTypes: {
      invoke: {
        src: 'getContentTypes',
        input: ({ event }) => ({ chatbotId: (event as any).chatbotId }),
        onDone: {
          target: 'idle',
          actions: ['setContentTypes'],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
  },
});

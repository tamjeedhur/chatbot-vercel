import { assign, fromPromise, setup } from 'xstate';
import {
  CrawlerContext,
  CrawlerEvents,
  ParseSitemapPayload,
  ProcessUrlsForDataSourcePayload,
  GetDataSourceDocumentPayload,
  UpdateDataSourceDocumentPayload,
  PostToPineconePayload,
  ScrapingProgressData,
  AddQuestionsAnswersPayload,
  UpdateQuestionsAnswersPayload,
  AddTextContentPayload,
} from './types';
import { API_VERSION } from '@/utils/constants';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { extractErrorMessage } from '@/utils/utils';
import {
  addQuestionsAnswersDocument,
  DataSourceDocument,
  deleteQuestionsAnswersDocument,
  updateQuestionsAnswersDocument,
} from '@/redux/slices/scrapSlice';
import * as dataSourcesSlice from '@/redux/slices/dataSourcesSlice';
import { store } from '@/redux/store';

export const crawlerMachine = setup({
  types: {
    context: {} as CrawlerContext,
    events: {} as CrawlerEvents,
  },
  actors: {
    getDataSourceDocument: fromPromise(async ({ input }: { input: GetDataSourceDocumentPayload }) => {
      try {
        const response = await axiosInstance.get(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    deleteScrapedDocument: fromPromise(async ({ input }: { input: { documentId: string; chatbotId: string } }) => {
      try {
        const response = await axiosInstance.delete(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    parseSitemap: fromPromise(async ({ input }: { input: ParseSitemapPayload }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/sitemap/parse`, input);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    processUrlsForDataSource: fromPromise(async ({ input }: { input: ProcessUrlsForDataSourcePayload }) => {
      try {
        const { chatbotId, ...crawlData } = input;
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${chatbotId}/urls/process`, crawlData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateDataSourceDocument: fromPromise(async ({ input }: { input: UpdateDataSourceDocumentPayload }) => {
      console.log('input', input);
      try {
        const response = await axiosInstance.put(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`, input);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    postToPinecone: fromPromise(async ({ input }: { input: PostToPineconePayload }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/ai-support/chatbot-context`, input);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    addQuestionsAnswersDocument: fromPromise(async ({ input }: { input: AddQuestionsAnswersPayload }) => {
      const { chatbotId, ...bodyData } = input;
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${chatbotId}/qa`, bodyData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    deleteQuestionsAnswersDocument: fromPromise(async ({ input }: { input: { documentId: string; chatbotId: string } }) => {
      try {
        const response = await axiosInstance.delete(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/qa/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateQuestionsAnswersDocument: fromPromise(async ({ input }: { input: UpdateQuestionsAnswersPayload }) => {
      try {
        // Extract only the fields that the API expects
        const { documentId, chatbotId, ...updateData } = input;
        const response = await axiosInstance.put(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/qa/${input.documentId}`, updateData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    addTextContent: fromPromise(async ({ input }: { input: AddTextContentPayload }) => {
      try {
        const { chatbotId, ...bodyData } = input;
        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${chatbotId}/text`, bodyData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    deleteTextContent: fromPromise(async ({ input }: { input: { chatbotId: string; documentId: string } }) => {
      try {
        const response = await axiosInstance.delete(`/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/text/${input.documentId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateTextContent: fromPromise(async ({ input }: { input: { chatbotId: string; documentId: string; updatedContent: any } }) => {
      try {
        const response = await axiosInstance.put(
          `/api/${API_VERSION}/datasources/chatbots/${input.chatbotId}/text/${input.documentId}`,
          input.updatedContent
        );
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    setError: assign({
      error: ({ event }: any) => event.error.message,
    }),
    setPaseSitemapUrls: assign({
      paseSitemapUrls: ({ event }: any) => event.output.data.urls,
    }),
    setSitemapUrls: assign({
      paseSitemapUrls: ({ event }: any) => event.output.data.urls,
    }),
    setUrlContent: assign({
      crawlerResponse: ({ event }: any) => {
        const responseData = event.output?.data;
        if (responseData?.urlsProcessed?.length === 1 && responseData?.urlsProcessed?.[0]?.content) {
          const urlContent = responseData.urlsProcessed[0].content;
          const documentId = responseData.urlsProcessed[0].documentId;
          console.log('Setting URL content:', urlContent);
          return { content: urlContent, documentId: documentId };
        }
        return null;
      },
    }),
    setProceedUrls: assign({
      crawlerResponse: ({ event }: any) => event.output.data.urlsProcessed,
    }),
    markUrlsAsScraped: assign({
      scrapedUrls: ({ context, event }: any) => {
        // When SSE job completes, we need to mark the processed URLs as scraped
        const progressData = event.data;
        if (progressData && progressData.status === 'completed') {
          // Get the URLs that were being processed in this job
          const processedUrls = context.currentJobUrls || [];

          if (processedUrls.length > 0) {
            // Create urlsProcessed array with scraped status
            const urlsProcessed = processedUrls.map((url: string) => ({
              id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              chatbotId: context.chatbotId || '',
              tenantId: '',
              title: url,
              content: '',
              contentType: 'url' as const,
              url: url,
              status: undefined, // No status means completed
              metadata: {
                scrapedAt: new Date().toISOString(),
                contentLength: 0,
                cleanContentLength: 0,
                hasTitle: false,
                source: 'url',
                title: url,
              },
              hash: '',
              vectorId: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));

            console.log('Marking URLs as scraped after job completion:', urlsProcessed);
            return [...context.scrapedUrls, ...urlsProcessed];
          }
        }
        return context.scrapedUrls;
      },
    }),
    clearProceedUrls: assign({
      crawlerResponse: () => null,
    }),
    setDataSourceDocument: assign({
      crawlerResponse: ({ event }: any) => event.output.data.document,
    }),
    addScrapedDocument: assign({
      scrapedUrls: ({ context, event }: any) => {
        const document = event.output.data.document;
        const existingIndex = context.scrapedUrls.findIndex((doc: any) => doc.url === document.url);

        if (existingIndex >= 0) {
          // Update existing document
          const updated = [...context.scrapedUrls];
          updated[existingIndex] = { ...document, status: undefined };
          return updated;
        } else {
          // Add new document
          return [...context.scrapedUrls, { ...document, status: undefined }];
        }
      },
    }),
    addPendingUrls: assign({
      scrapedUrls: ({ context, event }: any) => {
        const { urls, chatbotId } = event.payload || {};
        console.log('addPendingUrls called with urls:', urls, 'chatbotId:', chatbotId);

        if (!urls || !Array.isArray(urls) || !chatbotId) {
          console.warn('Invalid payload for addPendingUrls:', event.payload);
          return context.scrapedUrls;
        }

        // Create pending documents for each URL
        const pendingDocuments = urls.map((url: string) => ({
          id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          chatbotId,
          tenantId: '',
          title: url,
          content: '',
          contentType: 'url' as const,
          url,
          status: 'pending' as const,
          metadata: {
            scrapedAt: new Date().toISOString(),
            contentLength: 0,
            cleanContentLength: 0,
            hasTitle: false,
            source: 'url',
            title: url,
          },
          hash: '',
          vectorId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const updatedScrapedUrls = [...context.scrapedUrls, ...pendingDocuments];
        console.log('addPendingUrls - Updated scrapedUrls:', updatedScrapedUrls);
        return updatedScrapedUrls;
      },
    }),
    updateUrlStatusToError: assign({
      scrapedUrls: ({ context }: any) => {
        const urls = context.currentJobUrls || [];
        console.log('updateUrlStatusToError called with urls:', urls);

        return context.scrapedUrls.map((doc: any) => {
          if (Array.isArray(urls) && urls.includes(doc.url) && doc.status === 'pending') {
            console.log('Updating document to error:', doc.url);
            return { ...doc, status: 'error' };
          }
          return doc;
        });
      },
    }),
    updateUrlStatusToCompleted: assign({
      scrapedUrls: ({ context }: any) => {
        console.log('updateUrlStatusToCompleted called');
        console.log('Context currentJobUrls:', context.currentJobUrls);
        console.log('Current scrapedUrls before update:', context.scrapedUrls);

        return context.scrapedUrls.map((doc: any) => {
          if (doc.status === 'pending' && context.currentJobUrls?.includes(doc.url)) {
            console.log('Updating document to completed:', doc.url);
            return {
              ...doc,
              status: undefined, // Remove status when completed
            };
          }
          return doc;
        });
      },
    }),
    updateScrapedUrlsFromApiResponse: assign({
      scrapedUrls: ({ context, event }: any) => {
        console.log('updateScrapedUrlsFromApiResponse called');
        console.log('API response:', event.output);

        const apiResponse = event.output?.data;
        if (!apiResponse) {
          console.log('No API response data, just updating status');
          return context.scrapedUrls;
        }

        // Check if the response contains processed URLs
        const processedUrls = apiResponse.urlsProcessed || apiResponse.documents || [];
        console.log('Processed URLs from API:', processedUrls);

        if (Array.isArray(processedUrls) && processedUrls.length > 0) {
          // Update existing pending documents with actual data from API
          return context.scrapedUrls.map((doc: any) => {
            if (doc.status === 'pending' && context.currentJobUrls?.includes(doc.url)) {
              const apiDoc = processedUrls.find((apiDoc: any) => apiDoc.url === doc.url);
              if (apiDoc) {
                console.log('Updating document with API data:', doc.url);
                return {
                  ...apiDoc,
                  status: undefined, // Remove status when completed
                };
              }
            }
            return doc;
          });
        }

        // If no processed URLs, just update status
        return context.scrapedUrls.map((doc: any) => {
          if (doc.status === 'pending' && context.currentJobUrls?.includes(doc.url)) {
            console.log('Updating document to completed (no API data):', doc.url);
            return {
              ...doc,
              status: undefined, // Remove status when completed
            };
          }
          return doc;
        });
      },
    }),
    setCurrentUrlStatus: assign({
      currentUrlStatus: ({ event }: any) => event.status || 'idle',
    }),
    initializeScrapedUrls: assign({
      scrapedUrls: ({ event }: any) => {
        // console.log('initializeScrapedUrls called with event:', event);
        // console.log('event.urls:', event.urls);
        return event.urls || [];
      },
    }),
    removeSitemapUrl: assign({
      paseSitemapUrls: ({ context, event }: any) => {
        const urlToRemove = event.payload.url;
        return context.paseSitemapUrls.filter((url: string) => url !== urlToRemove);
      },
    }),
    cancelCurrentJob: ({ context }: any) => {
      if (context.currentJobAbortController) {
        context.currentJobAbortController.abort();
        toast.info('Scraping job cancelled');
      }
    },
    removeScrapedDocument: assign({
      scrapedUrls: ({ context }: any) => {
        const documentId = context.currentDocumentId;
        console.log('Removing scraped document with ID:', documentId);
        if (documentId) {
          return context.scrapedUrls.filter((doc: any) => doc.id !== documentId);
        }
        return context.scrapedUrls;
      },
    }),
    setJobId: assign({
      currentJobId: ({ event }: any) => event.output.data.jobId,
    }),
    addQuestionsAnswersDocument: ({ event }: any) => {
      if (event?.output?.data?.document) {
        store.dispatch(addQuestionsAnswersDocument(event.output.data.document));
      }
    },
    removeQuestionsAnswersDocument: ({ event }: any) => {
      if (event?.output?.data?.documentId) {
        store.dispatch(deleteQuestionsAnswersDocument(event.output.data.documentId));
      }
    },
    updateQuestionsAnswersDocument: ({ event }: any) => {
      if (event?.output?.data?.document) {
        store.dispatch(updateQuestionsAnswersDocument(event.output.data.document));
      }
    },
    addTextContent: ({ event }: any) => {
      if (event?.output?.data?.document) {
        try {
          store.dispatch(dataSourcesSlice.addTextContent(event.output.data.document));
        } catch (error) {
          console.error('Error dispatching addTextContent:', error);
        }
      }
    },
    deleteTextContent: ({ event }: any) => {
      if (event?.output?.data?.documentId) {
        store.dispatch(dataSourcesSlice.deleteTextContent(event.output.data.documentId));
      }
    },
    updateTextContent: ({ event }: any) => {
      if (event?.output?.data?.document) {
        store.dispatch(dataSourcesSlice.updateTextContent(event.output.data.document));
      }
    },
    // SSE Actions
    setSSEConnected: assign({
      sseConnected: true,
      sseError: null,
    }),
    setSSEDisconnected: assign({
      sseConnected: false,
    }),
    setSSEError: assign({
      sseError: ({ event }: any) => event.error,
      sseConnected: false,
    }),
    updateScrapingProgress: assign({
      scrapingProgress: ({ event }: any) => event.data,
    }),
    setCurrentJobId: assign({
      currentJobId: ({ event }: any) => event.payload?.jobId || event.data?.jobId,
    }),
    setCurrentJobUrls: assign({
      currentJobUrls: ({ event }: any) => event.payload?.urls || [],
    }),
    clearSSEState: assign({
      currentJobId: null,
      currentJobUrls: [],
      scrapingProgress: null,
      sseConnected: false,
      sseError: null,
    }),
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Operation successfully done';
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const errorMessage = event.error?.message || 'Operation Failed';
      toast.error(errorMessage);
    },
  },
}).createMachine({
  id: 'crawler',
  initial: 'idle',
  context: {
    error: null,
    crawlerResponse: null,
    isLoading: false,
    paseSitemapUrls: [],
    currentDocumentId: null as string | null,
    // SSE Progress tracking
    currentJobId: null as string | null,
    currentJobUrls: [] as string[],
    scrapingProgress: null as ScrapingProgressData | null,
    sseConnected: false,
    sseError: null as string | null,
    // Cancel functionality
    currentJobAbortController: null as AbortController | null,
    // Scraped URLs and status management
    scrapedUrls: [] as DataSourceDocument[],
    currentUrlStatus: 'idle' as 'idle' | 'pending' | 'error',
  },
  states: {
    idle: {
      on: {
        PARSE_SITMAP: {
          target: 'parsingSitemap',
          actions: assign({
            isLoading: () => true,
          }),
        },
        PROCESS_URLS_FOR_DATA_SOURCE: {
          target: 'processingUrlsForDataSource',
          actions: assign({
            isLoading: () => true,
          }),
        },
        PROCESS_SINGLE_URL_FOR_DATA_SOURCE: {
          target: 'processingSingleUrlsForDataSource',
          actions: assign({
            isLoading: () => true,
          }),
        },
        GET_DATA_SOURCE_DOCUMENT: {
          target: 'gettingDataSourceDocument',
          actions: assign({
            isLoading: () => true,
          }),
        },
        UPDATE_DATA_SOURCE_DOCUMENT: {
          target: 'updatingDataSourceDocument',
          actions: assign({
            isLoading: () => true,
          }),
        },
        DELETE_SCRAPED_DOCUMENT: {
          target: 'deletingScrapedDocument',
          actions: assign({
            isLoading: () => true,
            currentDocumentId: ({ event }: any) => event.payload.documentId,
          }),
        },
        POST_TO_PINECONE: {
          target: 'postingToPinecone',
          actions: assign({
            isLoading: () => true,
          }),
        },
        ADD_QUESTIONS_ANSWERS_DOCUMENT: {
          target: 'addingQuestionsAnswersDocument',
          actions: assign({
            isLoading: () => true,
          }),
        },
        DELETE_QUESTIONS_ANSWERS_DOCUMENT: {
          target: 'deletingQuestionsAnswersDocument',
          actions: assign({
            isLoading: () => true,
          }),
        },
        UPDATE_QUESTIONS_ANSWERS_DOCUMENT: {
          target: 'updatingQuestionsAnswersDocument',
          actions: assign({
            isLoading: () => true,
          }),
        },
        ADD_TEXT_CONTENT: {
          target: 'addingTextContent',
          actions: assign({
            isLoading: () => true,
          }),
        },
        DELETE_TEXT_CONTENT: {
          target: 'deletingTextContent',
          actions: assign({
            isLoading: () => true,
          }),
        },
        UPDATE_TEXT_CONTENT: {
          target: 'updatingTextContent',
          actions: assign({
            isLoading: () => true,
          }),
        },
        // SSE Events
        SSE_CONNECT: {
          actions: 'setCurrentJobId',
        },
        SSE_CONNECTED: {
          actions: 'setSSEConnected',
        },
        SSE_DISCONNECTED: {
          actions: 'setSSEDisconnected',
        },
        SSE_ERROR: {
          actions: 'setSSEError',
        },
        SSE_PROGRESS: {
          actions: 'updateScrapingProgress',
        },
        SSE_JOB_COMPLETED: {
          actions: ['updateScrapingProgress', 'markUrlsAsScraped', 'showSuccessToast'],
        },
        CANCEL_CURRENT_JOB: {
          target: 'cancelling',
          actions: 'cancelCurrentJob',
        },
        INITIALIZE_SCRAPED_URLS: {
          actions: 'initializeScrapedUrls',
        },
        REMOVE_SITEMAP_URL: {
          actions: 'removeSitemapUrl',
        },
      },
    },
    parsingSitemap: {
      invoke: {
        src: 'parseSitemap',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['setSitemapUrls', 'clearProceedUrls', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    gettingDataSourceDocument: {
      invoke: {
        src: 'getDataSourceDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['setDataSourceDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    processingUrlsForDataSource: {
      entry: ['setCurrentJobUrls', 'addPendingUrls'],
      invoke: {
        src: 'processUrlsForDataSource',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['updateScrapedUrlsFromApiResponse', 'setJobId', 'setCurrentJobId', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'updateUrlStatusToError', 'showErrorToast'],
        },
      },
    },

    processingSingleUrlsForDataSource: {
      entry: 'addPendingUrls',
      invoke: {
        src: 'processUrlsForDataSource',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['updateScrapedUrlsFromApiResponse', 'setUrlContent', 'setJobId', 'setCurrentJobId', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'updateUrlStatusToError', 'showErrorToast'],
        },
      },
    },
    updatingDataSourceDocument: {
      invoke: {
        src: 'updateDataSourceDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['addScrapedDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    deletingScrapedDocument: {
      invoke: {
        src: 'deleteScrapedDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['removeScrapedDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    postingToPinecone: {
      invoke: {
        src: 'postToPinecone',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    addingQuestionsAnswersDocument: {
      invoke: {
        src: 'addQuestionsAnswersDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['addQuestionsAnswersDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    deletingQuestionsAnswersDocument: {
      invoke: {
        src: 'deleteQuestionsAnswersDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['removeQuestionsAnswersDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    updatingQuestionsAnswersDocument: {
      invoke: {
        src: 'updateQuestionsAnswersDocument',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['updateQuestionsAnswersDocument', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    addingTextContent: {
      invoke: {
        src: 'addTextContent',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['addTextContent', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    deletingTextContent: {
      invoke: {
        src: 'deleteTextContent',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['deleteTextContent', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    updatingTextContent: {
      invoke: {
        src: 'updateTextContent',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['updateTextContent', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    success: {
      after: {
        500: {
          target: 'idle',
          actions: assign({
            error: () => null,
            isLoading: () => false,
            currentDocumentId: () => null,
          }),
        },
      },
    },

    error: {
      after: {
        500: {
          target: 'idle',
          actions: assign({
            error: () => null,
            isLoading: () => false,
            currentDocumentId: () => null,
          }),
        },
      },
    },
    cancelling: {
      after: {
        100: {
          target: 'idle',
          actions: assign({
            error: () => null,
            isLoading: () => false,
            currentDocumentId: () => null,
            currentJobAbortController: () => null,
          }),
        },
      },
    },
  },
});

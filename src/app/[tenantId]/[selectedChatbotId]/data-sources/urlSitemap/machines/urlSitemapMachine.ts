import { setup, assign, fromPromise } from 'xstate';
import { DataSourceDocument } from '@/redux/slices/scrapSlice';
import { normalizeDiscoveredUrls } from '../utils/urlNormalizer';

// Types
interface UrlSitemapInput {
  tenantId: string;
  chatbotId: string;
  initialDocuments: DataSourceDocument[];
  accessToken: string;
  serverUrl: string;
}

interface UrlSitemapContext {
  tenantId: string;
  chatbotId: string;
  accessToken: string;
  serverUrl: string;

  // UI State
  sitemapUrl: string;
  mode: 'URL' | 'Sitemap';
  searchQuery: string;
  scrapedUrlsSearchQuery: string;
  selectedUrlForModal: string | null;
  selectedUrls: Set<string>;

  // Data State
  discoveredUrls: DiscoveredUrl[];
  scrapedDocuments: DataSourceDocument[];
  currentJobId: string | null;
  scrapingProgress: any;

  // Status
  isLoading: boolean;
  error: string | null;
  deletingDocumentId: string | null;
  reScrapingUrl: string | null;
}

interface DiscoveredUrl {
  name: string;
  url: string;
  selected: boolean;
  status?: 'pending' | 'scraped' | 'error';
  documentId?: string;
}

type UrlSitemapEvents =
  | { type: 'SET_SITEMAP_URL'; url: string }
  | { type: 'SET_MODE'; mode: 'URL' | 'Sitemap' }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_SCRAPED_URLS_SEARCH_QUERY'; query: string }
  | { type: 'SET_SELECTED_URL_FOR_MODAL'; url: string | null }
  | { type: 'TOGGLE_URL_SELECTION'; url: string }
  | { type: 'SELECT_ALL_URLS' }
  | { type: 'DESELECT_ALL_URLS' }
  | { type: 'SCRAPE_DATA' }
  | { type: 'SCRAPE_SELECTED_URLS' }
  | { type: 'RE_SCRAPE_URL'; url: string }
  | { type: 'REMOVE_URL'; url: string }
  | { type: 'UPDATE_DOCUMENT'; documentId: string; content: string }
  | { type: 'DELETE_DOCUMENT'; documentId: string }
  | { type: 'POST_TO_PINECONE' }
  | { type: 'CANCEL_CURRENT_JOB' }
  | { type: 'ADD_RECENTLY_COMPLETED_DOCUMENTS'; documents: any[] }
  | { type: 'SSE_PROGRESS'; data: any }
  | { type: 'SSE_JOB_COMPLETED'; data: any }
  | { type: 'SSE_ERROR'; error: string }
  | { type: 'SSE_CONNECTED' }
  | { type: 'SSE_DISCONNECTED' };

// Guards
const guards = {
  hasSitemapUrl: ({ context }: { context: UrlSitemapContext }) => context.sitemapUrl.trim().length > 0,

  hasSelectedUrls: ({ context }: { context: UrlSitemapContext }) => context.selectedUrls.size > 0,

  isUrlMode: ({ context }: { context: UrlSitemapContext }) => context.mode === 'URL',

  isSitemapMode: ({ context }: { context: UrlSitemapContext }) => context.mode === 'Sitemap',
};

// Machine
export const urlSitemapMachine = setup({
  types: {
    input: {} as UrlSitemapInput,
    context: {} as UrlSitemapContext,
    events: {} as UrlSitemapEvents,
  },
  actors: {
    parseSitemap: fromPromise(async ({ input }: { input: { sitemapUrl: string; serverUrl: string; accessToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/v1/datasources/sitemap/parse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sitemapUrl: input.sitemapUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse sitemap');
      }

      return response.json();
    }),

    scrapeUrls: fromPromise(
      async ({ input }: { input: { urls: string[]; chatbotId: string; options: any; serverUrl: string; accessToken: string } }) => {
        const response = await fetch(`${input.serverUrl}/api/v1/datasources/chatbots/${input.chatbotId}/urls/process`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            urls: input.urls,
            options: input.options,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to scrape URLs');
        }

        const result = await response.json();
        console.log('scrapeUrls - API response:', result);
        return result;
      }
    ),

    updateDocument: fromPromise(
      async ({ input }: { input: { documentId: string; chatbotId: string; content: string; serverUrl: string; accessToken: string } }) => {
        const response = await fetch(`${input.serverUrl}/api/v1/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: input.content }),
        });

        if (!response.ok) {
          throw new Error('Failed to update document');
        }

        return response.json();
      }
    ),

    deleteDocument: fromPromise(async ({ input }: { input: { documentId: string; chatbotId: string; serverUrl: string; accessToken: string } }) => {
      const url = `${input.serverUrl}/api/v1/datasources/chatbots/${input.chatbotId}/documents/${input.documentId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      return response.json();
    }),

    // Note: Pinecone endpoint doesn't exist in the API collection
    postToPinecone: fromPromise(
      async ({ input }: { input: { chatbotId: string; title: string; content: string; metadata: any; serverUrl: string; accessToken: string } }) => {
        // TODO: Implement server endpoint for Pinecone posting
        console.warn('Pinecone endpoint not available in API collection');
        return { success: false, message: 'Pinecone posting not available' };
      }
    ),

    // Scraping progress tracking endpoints
    getScrapingProgress: fromPromise(async ({ input }: { input: { jobId: string; serverUrl: string; accessToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/v1/datasources/scraping/progress/${input.jobId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get scraping progress');
      }

      return response.json();
    }),

    cancelScrapingJob: fromPromise(async ({ input }: { input: { jobId: string; chatbotId: string; serverUrl: string; accessToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/v1/datasources/chatbots/${input.chatbotId}/scraping/cancel/${input.jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel scraping job');
      }

      return response.json();
    }),
  },
  guards,
  actions: {
    setSitemapUrl: assign({
      sitemapUrl: ({ event }: { event: any }) => event.url,
    }),

    clearSitemapUrl: assign({
      sitemapUrl: '',
    }),

    setMode: assign({
      mode: ({ event }: { event: any }) => event.mode,
    }),

    setSearchQuery: assign({
      searchQuery: ({ event }: { event: any }) => event.query,
    }),

    setScrapedUrlsSearchQuery: assign({
      scrapedUrlsSearchQuery: ({ event }: { event: any }) => event.query,
    }),

    setSelectedUrlForModal: assign({
      selectedUrlForModal: ({ event }: { event: any }) => event.url,
    }),

    toggleUrlSelection: assign({
      selectedUrls: ({ context, event }: { context: UrlSitemapContext; event: any }) => {
        const newSet = new Set(context.selectedUrls);
        if (newSet.has(event.url)) {
          newSet.delete(event.url);
        } else {
          newSet.add(event.url);
        }
        return newSet;
      },
      discoveredUrls: ({ context, event }: { context: UrlSitemapContext; event: any }) =>
        context.discoveredUrls.map((url) => (url.url === event.url ? { ...url, selected: !url.selected } : url)),
    }),

    selectAllUrls: assign({
      selectedUrls: ({ context }: { context: UrlSitemapContext }) => new Set(context.discoveredUrls.map((url) => url.url)),
      discoveredUrls: ({ context }: { context: UrlSitemapContext }) => context.discoveredUrls.map((url) => ({ ...url, selected: true })),
    }),

    deselectAllUrls: assign({
      selectedUrls: () => new Set<string>(),
      discoveredUrls: ({ context }: { context: UrlSitemapContext }) => context.discoveredUrls.map((url) => ({ ...url, selected: false })),
    }),

    setLoading: assign({
      isLoading: ({ event }: { event: any }) => event.loading ?? true,
    }),

    setError: assign({
      error: ({ event }: { event: any }) => event.error,
      isLoading: false,
    }),

    clearError: assign({
      error: null,
    }),

    addRecentlyCompletedDocuments: assign({
      scrapedDocuments: ({ context, event }: { context: UrlSitemapContext; event: any }) => {
        const newDocuments = event.documents.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          url: doc.url,
          metadata: doc.metadata,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }));

        // Add new documents to existing ones, avoiding duplicates
        const existingIds = new Set(context.scrapedDocuments.map((doc: any) => doc.id));
        const uniqueNewDocuments = newDocuments.filter((doc: any) => !existingIds.has(doc.id));

        return [...context.scrapedDocuments, ...uniqueNewDocuments];
      },
    }),

    setDiscoveredUrls: assign({
      discoveredUrls: ({ event }: { event: any }) => {
        const response = event.output;
        let urls: any[] = [];

        if (response?.urls) {
          urls = response.urls;
        } else if (response?.data?.urls) {
          urls = response.data.urls;
        } else if (Array.isArray(response)) {
          urls = response;
        } else if (response?.data && Array.isArray(response.data)) {
          urls = response.data;
        }

        return normalizeDiscoveredUrls(urls);
      },
    }),

    setScrapedDocuments: assign({
      scrapedDocuments: ({ event }: { event: any }) => {
        const response = event.output;
        let documents: any[] = [];

        if (response?.documents) {
          documents = response.documents;
        } else if (response?.data?.documents) {
          documents = response.data.documents;
        } else if (Array.isArray(response)) {
          documents = response;
        } else if (response?.data && Array.isArray(response.data)) {
          documents = response.data;
        }

        return documents.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          url: doc.url,
          chatbotId: doc.chatbotId || '',
          tenantId: doc.tenantId || '',
          contentType: doc.contentType || 'text/html',
          hash: doc.hash || '',
          metadata: doc.metadata || {},
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: doc.updatedAt || new Date().toISOString(),
        }));
      },
    }),

    addScrapedDocument: assign({
      scrapedDocuments: ({ context, event }: { context: UrlSitemapContext; event: any }) => {
        const apiResponse = event.output;
        const document = apiResponse?.data;

        if (!document) {
          return context.scrapedDocuments;
        }

        const transformedDocument = {
          id: document.id,
          url: document.url,
          content: document.content,
          chatbotId: document.chatbotId || context.chatbotId,
          tenantId: document.tenantId || context.tenantId,
          title: document.metadata?.title || document.url,
          contentType: document.contentType || 'text/html',
          metadata: {
            title: document.metadata?.title || document.url,
            source: document.metadata?.source || document.url,
            scrapedAt: document.metadata?.scrapedAt || new Date().toISOString(),
            contentLength: document.metadata?.contentLength || document.content?.length || 0,
            cleanContentLength: document.metadata?.cleanContentLength || 0,
            hasTitle: document.metadata?.hasTitle || false,
            originalDatasourceId: document.metadata?.originalDatasourceId,
            fileType: document.metadata?.fileType,
          },
          status: undefined,
          hash: document.hash || '',
          createdAt: document.createdAt || new Date().toISOString(),
          updatedAt: document.updatedAt || new Date().toISOString(),
        };

        // Check if a document with the same URL already exists
        const existingIndex = context.scrapedDocuments.findIndex((doc) => doc.url === document.url);

        if (existingIndex !== -1) {
          // Update existing document
          const updatedDocuments = [...context.scrapedDocuments];
          updatedDocuments[existingIndex] = transformedDocument;
          return updatedDocuments;
        } else {
          // Add new document at the beginning
          return [transformedDocument, ...context.scrapedDocuments];
        }
      },
    }),

    updateScrapedDocument: assign({
      scrapedDocuments: ({ context, event }: { context: UrlSitemapContext; event: any }) =>
        context.scrapedDocuments.map((doc) => (doc.id === event.documentId ? { ...doc, content: event.content } : doc)),
    }),

    setCurrentJobId: assign({
      currentJobId: ({ event }: { event: any }) => event.jobId,
    }),

    setScrapingProgress: assign({
      scrapingProgress: ({ event }: { event: any }) => event.data,
    }),

    setReScrapingUrl: assign({
      reScrapingUrl: ({ event }: { event: any }) => event.url,
    }),

    updateDocument: assign({
      scrapedDocuments: ({ context, event }: { context: UrlSitemapContext; event: any }) =>
        context.scrapedDocuments.map((doc) => (doc.id === event.documentId ? { ...doc, content: event.content } : doc)),
    }),

    removeScrapedDocument: assign({
      scrapedDocuments: ({ context, event }: { context: UrlSitemapContext; event: any }) =>
        context.scrapedDocuments.filter((doc) => doc.id !== event.documentId),
    }),

    setDeletingDocumentId: assign({
      deletingDocumentId: ({ event }: { event: any }) => event.documentId,
    }),

    clearDeletingDocumentId: assign({
      deletingDocumentId: null,
    }),

    removeUrl: assign({
      discoveredUrls: ({ context, event }: { context: UrlSitemapContext; event: any }) =>
        context.discoveredUrls.filter((url) => url.url !== event.url),
    }),
    removeReScrapedUrl: assign({
      discoveredUrls: ({ context }: { context: UrlSitemapContext }) => {
        return context.discoveredUrls.filter((url) => url.url !== context.reScrapingUrl);
      },
      reScrapingUrl: null,
    }),
    cancelCurrentJob: assign({
      currentJobId: null,
      isLoading: false,
    }),
  },
}).createMachine({
  id: 'urlSitemap',
  initial: 'idle',
  context: ({ input }) => {
    console.log('urlSitemapMachine - input.initialDocuments:', input.initialDocuments);
    return {
      tenantId: input.tenantId,
      chatbotId: input.chatbotId,
      accessToken: input.accessToken,
      serverUrl: input.serverUrl,
      sitemapUrl: '',
      mode: 'URL',
      searchQuery: '',
      scrapedUrlsSearchQuery: '',
      selectedUrlForModal: null,
      selectedUrls: new Set(),
      discoveredUrls: [],
      scrapedDocuments: input.initialDocuments.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || b.metadata?.scrapedAt || 0).getTime() - new Date(a.createdAt || a.metadata?.scrapedAt || 0).getTime()
      ),
      currentJobId: null,
      scrapingProgress: null,
      isLoading: false,
      error: null,
      deletingDocumentId: null,
      reScrapingUrl: null,
    };
  },
  states: {
    idle: {
      on: {
        SET_SITEMAP_URL: {
          actions: 'setSitemapUrl',
        },
        SET_MODE: {
          actions: 'setMode',
        },
        SET_SEARCH_QUERY: {
          actions: 'setSearchQuery',
        },
        SET_SCRAPED_URLS_SEARCH_QUERY: {
          actions: 'setScrapedUrlsSearchQuery',
        },
        SET_SELECTED_URL_FOR_MODAL: {
          actions: 'setSelectedUrlForModal',
        },
        TOGGLE_URL_SELECTION: {
          actions: 'toggleUrlSelection',
        },
        SELECT_ALL_URLS: {
          actions: 'selectAllUrls',
        },
        DESELECT_ALL_URLS: {
          actions: 'deselectAllUrls',
        },
        SCRAPE_DATA: [
          {
            guard: 'isSitemapMode',
            target: 'parsingSitemap',
            actions: 'setLoading',
          },
          {
            guard: 'isUrlMode',
            target: 'scrapingUrls',
            actions: 'setLoading',
          },
          {
            target: 'idle',
          },
        ],
        SCRAPE_SELECTED_URLS: [
          {
            guard: 'hasSelectedUrls',
            target: 'scrapingUrls',
            actions: 'setLoading',
          },
          {
            target: 'idle',
          },
        ],
        RE_SCRAPE_URL: {
          target: 'reScrapingUrl',
          actions: [
            'setLoading',
            assign({
              sitemapUrl: ({ event }: { event: any }) => event.url,
              reScrapingUrl: ({ event }: { event: any }) => event.url,
            }),
          ],
        },
        REMOVE_URL: {
          actions: 'removeUrl',
        },
        UPDATE_DOCUMENT: {
          target: 'updatingDocument',
          actions: 'setLoading',
        },
        DELETE_DOCUMENT: {
          target: 'deletingDocument',
          actions: [
            'setLoading',
            assign({
              deletingDocumentId: ({ event }: { event: any }) => event.documentId,
            }),
          ],
        },
        POST_TO_PINECONE: {
          target: 'postingToPinecone',
          actions: 'setLoading',
        },
        CANCEL_CURRENT_JOB: {
          target: 'cancellingJob',
          actions: 'setLoading',
        },
        ADD_RECENTLY_COMPLETED_DOCUMENTS: {
          actions: 'addRecentlyCompletedDocuments',
        },
        SSE_PROGRESS: {
          actions: 'setScrapingProgress',
        },
        SSE_JOB_COMPLETED: {
          actions: 'setScrapingProgress',
        },
        SSE_ERROR: {
          actions: 'setError',
        },
        SSE_CONNECTED: {
          actions: 'clearError',
        },
        SSE_DISCONNECTED: {
          actions: 'clearError',
        },
      },
    },
    parsingSitemap: {
      invoke: {
        src: 'parseSitemap',
        input: ({ context }) => ({
          sitemapUrl: context.sitemapUrl,
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            'setDiscoveredUrls',
            'clearError',
            assign({ isLoading: false }),
            assign({ currentJobId: ({ event }) => event.output?.jobId || null }),
          ],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    scrapingUrls: {
      invoke: {
        src: 'scrapeUrls',
        input: ({ context }) => {
          // For URL mode: use single URL from sitemapUrl
          // For Sitemap mode: use selected URLs
          const urls = context.mode === 'URL' ? [context.sitemapUrl] : Array.from(context.selectedUrls);

          return {
            urls,
            chatbotId: context.chatbotId,
            options: { chunkSize: 500, chunkOverlap: 50 },
            serverUrl: context.serverUrl,
            accessToken: context.accessToken,
          };
        },
        onDone: {
          target: 'idle',
          actions: [
            'setScrapedDocuments',
            'clearError',
            assign({ isLoading: false }),
            assign({ currentJobId: ({ event }) => event.output?.jobId || null }),
            // Clear URL input after successful scraping for URL mode
            assign(({ context }) => {
              if (context.mode === 'URL') {
                return { sitemapUrl: '' };
              }
              return {};
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    updatingDocument: {
      invoke: {
        src: 'updateDocument',
        input: ({ context, event }: { context: UrlSitemapContext; event: any }) => ({
          documentId: event.documentId || context.selectedUrlForModal || '',
          chatbotId: context.chatbotId,
          content: event.content || '',
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['updateDocument', 'clearError', assign({ isLoading: false })],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    deletingDocument: {
      invoke: {
        src: 'deleteDocument',
        input: ({ context }: { context: UrlSitemapContext }) => ({
          documentId: context.deletingDocumentId || '',
          chatbotId: context.chatbotId,
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['removeScrapedDocument', 'clearError', assign({ isLoading: false })],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    reScrapingUrl: {
      invoke: {
        src: 'scrapeUrls',
        input: ({ context, event }: { context: UrlSitemapContext; event: any }) => ({
          urls: [event.url],
          chatbotId: context.chatbotId,
          options: { chunkSize: 500, chunkOverlap: 50 },
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['setScrapedDocuments', 'removeReScrapedUrl', 'clearError', assign({ isLoading: false })],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    postingToPinecone: {
      invoke: {
        src: 'postToPinecone',
        input: ({ context, event }: { context: UrlSitemapContext; event: any }) => ({
          chatbotId: context.chatbotId,
          title: 'Sitemap',
          content: event.content || '',
          metadata: {
            lastUpdated: new Date().toISOString(),
          },
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['clearError', assign({ isLoading: false })],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
    cancellingJob: {
      invoke: {
        src: 'cancelScrapingJob',
        input: ({ context }) => ({
          jobId: context.currentJobId || '',
          chatbotId: context.chatbotId,
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['clearError', assign({ isLoading: false, currentJobId: null })],
        },
        onError: {
          target: 'idle',
          actions: ['setError', assign({ isLoading: false })],
        },
      },
    },
  },
});

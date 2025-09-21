import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface ProceedUrls {
  url: string;
  documentId: string;
}
export interface DataSourceDocument {
  id: string;
  chatbotId: string;
  tenantId: string;
  title: string;
  content: string;
  contentType: 'url' | 'text' | 'file' | 'qa';
  url: string;
  status?: 'pending' | 'error';
  metadata: {
    scrapedAt: string;
    contentLength: number;
    cleanContentLength: number;
    hasTitle: boolean;
    source: string;
    title: string;
    originalDatasourceId?: string;
    fileType?: string;
  };
  hash: string;
  vectorId?: string;
  createdAt: string;
  updatedAt: string;
}
export interface QuestionsAnswersMetadata {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  source: string;
  addedAt: string;
  addedBy: string;
}

export interface QuestionsAnswersDocument {
  chatbotId: string;
  tenantId: string;
  title: string;
  content: string;
  contentType: string;
  metadata: QuestionsAnswersMetadata;
  hash: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
interface ScrapState {
  sitemapParseUrls: string[];
  proceedUrls: ProceedUrls[];
  dataSourceDocument: DataSourceDocument | null;
  urlContent: {
    content: string | null;
    documentId: string | null;
  };
  jobId: string | null;
  allScrapedDocuments: DataSourceDocument[] | null;
  questionsAnswersDocuments: QuestionsAnswersDocument[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ScrapState = {
  sitemapParseUrls: [],
  proceedUrls: [],
  dataSourceDocument: null,
  questionsAnswersDocuments: null,
  urlContent: {
    content: null,
    documentId: null,
  },
  allScrapedDocuments: null,
  jobId: null,
  isLoading: false,
  error: null,
};

const scrapSlice = createSlice({
  name: 'scrap',
  initialState,
  reducers: {
    setJobId: (state, action: PayloadAction<string | null>) => {
      state.jobId = action.payload;
      state.error = null;
    },
    // Set sitemap parse URLs
    setSitemapParseUrls: (state, action: PayloadAction<string[]>) => {
      state.sitemapParseUrls = action.payload;
      state.error = null;
    },
    removeSitemapParseUrl: (state, action: PayloadAction<string>) => {
      state.sitemapParseUrls = state.sitemapParseUrls.filter((url) => url !== action.payload);
      state.error = null;
    },
    setUrlContent: (state, action: PayloadAction<{ content: string | null; documentId: string | null }>) => {
      state.urlContent.content = action.payload?.content;
      state.urlContent.documentId = action.payload?.documentId;
      state.error = null;
    },
    setDataSourceDocument: (state, action: PayloadAction<DataSourceDocument | null>) => {
      state.dataSourceDocument = action.payload;
      state.error = null;
    },
    updateDataSourceDocumentContent: (state, action: PayloadAction<string>) => {
      if (state.dataSourceDocument) state.dataSourceDocument.content = action.payload;
      state.error = null;
    },
    setAllScrapedDocuments: (state, action: PayloadAction<DataSourceDocument[] | null>) => {
      state.allScrapedDocuments = action.payload;
      state.error = null;
    },
    setAllQuestionsAnswersDocuments: (state, action: PayloadAction<QuestionsAnswersDocument[] | null>) => {
      state.questionsAnswersDocuments = action.payload;
      state.error = null;
    },
    addQuestionsAnswersDocument: (state, action: PayloadAction<QuestionsAnswersDocument>) => {
      state.questionsAnswersDocuments?.push(action.payload);
      state.error = null;
    },
    deleteQuestionsAnswersDocument: (state, action: PayloadAction<string>) => {
      state.questionsAnswersDocuments = state.questionsAnswersDocuments?.filter((doc) => doc.id !== action.payload) ?? null;
      state.error = null;
    },
    updateQuestionsAnswersDocument: (state, action: PayloadAction<QuestionsAnswersDocument>) => {
      if (state.questionsAnswersDocuments) {
        const updatedDocument = action.payload;
        const index = state.questionsAnswersDocuments.findIndex((doc) => doc.id === updatedDocument.id);
        if (index !== -1) {
          state.questionsAnswersDocuments[index] = updatedDocument;
        }
      }
      state.error = null;
    },
    updateSingleDocumentContent: (state, action: PayloadAction<{ documentId: string; content: string }>) => {
      const { documentId, content } = action.payload;
      if (state.allScrapedDocuments) {
        const documentIndex = state.allScrapedDocuments.findIndex((doc) => doc.id === documentId);
        if (documentIndex !== -1) {
          state.allScrapedDocuments[documentIndex].content = content;
          state.allScrapedDocuments[documentIndex].metadata.contentLength = content.length;
        }
      }
      state.error = null;
    },
    deleteScrapedDocument: (state, action: PayloadAction<string>) => {
      if (state.allScrapedDocuments) {
        state.allScrapedDocuments = state.allScrapedDocuments.filter((doc) => doc.id !== action.payload);
      }
      state.error = null;
    },
    getAllScrapedDocuments: (state) => {
      state.allScrapedDocuments = state.allScrapedDocuments;
      state.error = null;
    },

    setProceedUrls: (state, action: PayloadAction<ProceedUrls[]>) => {
      // Add new URLs to existing array, avoiding duplicates
      const newUrls = action.payload;
      const existingUrls = state.proceedUrls;

      // Create a Set of existing URLs for quick lookup
      const existingUrlSet = new Set(existingUrls.map((item) => item.url));

      // Filter out URLs that already exist and add new ones
      const uniqueNewUrls = newUrls.filter((item) => !existingUrlSet.has(item.url));

      // Append new unique URLs to existing array
      state.proceedUrls = [...existingUrls, ...uniqueNewUrls];
      state.error = null;
    },
    clearProceedUrls: (state) => {
      state.proceedUrls = [];
      state.error = null;
    },
    updateUrlContent: (state, action: PayloadAction<string>) => {
      state.urlContent.content = action.payload;
      state.error = null;
    },
    clearUrlContent: (state) => {
      state.urlContent.content = '';
      state.error = null;
    },
    // Clear all sitemap parse URLs
    clearSitemapParseUrls: (state) => {
      state.sitemapParseUrls = [];
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset to initial state
    resetScrap: () => initialState,
  },
});

export const {
  setJobId,
  setSitemapParseUrls,
  clearSitemapParseUrls,
  setUrlContent,
  updateUrlContent,
  setProceedUrls,
  setLoading,
  setError,
  clearError,
  resetScrap,
  clearUrlContent,
  clearProceedUrls,
  setDataSourceDocument,
  updateDataSourceDocumentContent,
  setAllScrapedDocuments,
  getAllScrapedDocuments,
  updateSingleDocumentContent,
  deleteScrapedDocument,
  removeSitemapParseUrl,
  setAllQuestionsAnswersDocuments,
  addQuestionsAnswersDocument,
  deleteQuestionsAnswersDocument,
  updateQuestionsAnswersDocument,
} = scrapSlice.actions;

export default scrapSlice.reducer;

// Selectors
export const selectSitemapParseUrls = (state: { scrap: ScrapState }) => state.scrap.sitemapParseUrls;
export const selectJobId = (state: { scrap: ScrapState }) => state.scrap.jobId;
export const selectScrapLoading = (state: { scrap: ScrapState }) => state.scrap.isLoading;
export const selectScrapError = (state: { scrap: ScrapState }) => state.scrap.error;
export const selectUrlContent = (state: { scrap: ScrapState }) => state.scrap.urlContent;
export const selectProceedUrls = (state: { scrap: ScrapState }) => state.scrap.proceedUrls;
export const selectDataSourceDocument = (state: { scrap: ScrapState }) => state.scrap.dataSourceDocument;
export const selectAllScrapedDocuments = (state: { scrap: ScrapState }) => state.scrap.allScrapedDocuments;
export const selectAllQuestionsAnswersDocuments = (state: { scrap: ScrapState }) => state.scrap.questionsAnswersDocuments;

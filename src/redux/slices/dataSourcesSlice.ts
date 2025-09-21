import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataSource, Document, DocumentStats, ContentTypeBreakdown } from '@/machines/dataSources/types';

interface DataSourcesState {
  // Legacy DataSource support
  dataSources: DataSource[];
  selectedDataSource: DataSource | null;

  // New Document management
  documents: Document[];
  selectedDocument: Document | null;
  searchResults: Document[];
  stats: DocumentStats | null;
  contentTypes: ContentTypeBreakdown[];
  searchQuery: string;
  filters: {
    contentType?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };

  // Common state
  isLoading: boolean;
  error: string | null;
}

const initialState: DataSourcesState = {
  // Legacy DataSource support
  dataSources: [],
  selectedDataSource: null,

  // New Document management
  documents: [],
  selectedDocument: null,
  searchResults: [],
  stats: null,
  contentTypes: [],
  searchQuery: '',
  filters: {},

  // Common state
  isLoading: false,
  error: null,
};

const dataSourcesSlice = createSlice({
  name: 'dataSources',
  initialState,
  reducers: {
    // Add a new data source to the array
    addDataSource: (state, action: PayloadAction<DataSource>) => {
      state.dataSources.push(action.payload);
      state.error = null;
    },

    // Update an existing data source
    updateDataSource: (state, action: PayloadAction<DataSource>) => {
      const index = state.dataSources.findIndex((ds) => ds.id === action.payload.id);
      if (index !== -1) {
        state.dataSources[index] = action.payload;
      }
      state.error = null;
    },

    // Remove a data source from the array
    removeDataSource: (state, action: PayloadAction<string>) => {
      state.dataSources = state.dataSources.filter((ds) => ds.id !== action.payload);
      state.error = null;
    },

    // Set all data sources (useful for initial load)
    setDataSources: (state, action: PayloadAction<DataSource[]>) => {
      state.dataSources = action.payload;
      state.error = null;
    },

    // Set selected data source
    setSelectedDataSource: (state, action: PayloadAction<DataSource | null>) => {
      state.selectedDataSource = action.payload;
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
    resetDataSources: () => initialState,

    // Document Management Reducers
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
      state.error = null;
    },

    updateDocument: (state, action: PayloadAction<Document>) => {
      const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
      state.error = null;
    },

    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload);
      state.error = null;
    },

    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
      state.error = null;
    },

    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },

    setSearchResults: (state, action: PayloadAction<Document[]>) => {
      state.searchResults = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setFilters: (state, action: PayloadAction<DataSourcesState['filters']>) => {
      state.filters = action.payload;
    },

    setDocumentStats: (state, action: PayloadAction<DocumentStats | null>) => {
      state.stats = action.payload;
    },

    setContentTypes: (state, action: PayloadAction<ContentTypeBreakdown[]>) => {
      state.contentTypes = action.payload;
    },

    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.filters = {};
    },
  },
});

export const {
  // Legacy DataSource actions
  addDataSource,
  updateDataSource,
  removeDataSource,
  setDataSources,
  setSelectedDataSource,

  // Document management actions
  addDocument,
  updateDocument,
  removeDocument,
  setDocuments,
  setSelectedDocument,
  setSearchResults,
  setSearchQuery,
  setFilters,
  setDocumentStats,
  setContentTypes,
  clearSearch,

  // Common actions
  setLoading,
  setError,
  clearError,
  resetDataSources,
} = dataSourcesSlice.actions;

export default dataSourcesSlice.reducer;

// Selectors
// Legacy DataSource selectors
export const selectDataSources = (state: { dataSources: DataSourcesState }) => state.dataSources.dataSources;
export const selectSelectedDataSource = (state: { dataSources: DataSourcesState }) => state.dataSources.selectedDataSource;
export const selectDataSourceById = (id: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.dataSources.find((ds) => ds.id === id);
export const selectDataSourcesByType = (type: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.dataSources.filter((ds) => ds.type === type);

// Document management selectors
export const selectDocuments = (state: { dataSources: DataSourcesState }) => state.dataSources.documents;
export const selectSelectedDocument = (state: { dataSources: DataSourcesState }) => state.dataSources.selectedDocument;
export const selectSearchResults = (state: { dataSources: DataSourcesState }) => state.dataSources.searchResults;
export const selectDocumentStats = (state: { dataSources: DataSourcesState }) => state.dataSources.stats;
export const selectContentTypes = (state: { dataSources: DataSourcesState }) => state.dataSources.contentTypes;
export const selectSearchQuery = (state: { dataSources: DataSourcesState }) => state.dataSources.searchQuery;
export const selectFilters = (state: { dataSources: DataSourcesState }) => state.dataSources.filters;

export const selectDocumentById = (id: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.documents.find((doc) => doc.id === id);
export const selectDocumentsByContentType = (contentType: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.documents.filter((doc) => doc.contentType === contentType);
export const selectDocumentsByStatus = (status: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.documents.filter((doc) => doc.status === status);

// Common selectors
export const selectDataSourcesLoading = (state: { dataSources: DataSourcesState }) => state.dataSources.isLoading;
export const selectDataSourcesError = (state: { dataSources: DataSourcesState }) => state.dataSources.error;

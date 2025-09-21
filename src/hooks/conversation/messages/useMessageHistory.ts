'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { API_VERSION } from '@/utils/constants';
import { BaseMessage } from './useMessages';

export interface MessageHistoryState {
  messages: BaseMessage[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  currentPage: number;
  totalPages: number;
  totalMessages: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UseMessageHistoryOptions {
  conversationId: string;
  initialPage?: number;
  pageSize?: number;
  autoLoad?: boolean;
  enableInfiniteScroll?: boolean;
}

export interface UseMessageHistoryReturn extends MessageHistoryState {
  // Pagination operations
  loadMessages: (page?: number) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  loadInitialMessages: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  
  // State management
  reset: () => void;
  setMessages: (messages: BaseMessage[]) => void;
  prependMessages: (messages: BaseMessage[]) => void;
  appendMessages: (messages: BaseMessage[]) => void;
  
  // Utilities
  canLoadMore: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  getPageInfo: () => PaginationInfo;
}

/**
 * Hook for managing message history with pagination support.
 * Handles loading historical messages, infinite scroll, and pagination state.
 */
export function useMessageHistory({
  conversationId,
  initialPage = 1,
  pageSize = 50,
  autoLoad = true,
  enableInfiniteScroll = true,
}: UseMessageHistoryOptions): UseMessageHistoryReturn {

  const [state, setState] = useState<MessageHistoryState>({
    messages: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMoreMessages: true,
    currentPage: initialPage,
    totalPages: 1,
    totalMessages: 0,
  });

  // Refs for request management
  const loadingRef = useRef(false);
  const lastConversationIdRef = useRef<string>('');

  const updateState = useCallback((updates: Partial<MessageHistoryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Deduplicate messages by ID
  const deduplicateMessages = useCallback((messages: BaseMessage[]): BaseMessage[] => {
    const seen = new Set<string>();
    return messages.filter(msg => {
      const id = msg._id || msg.messageId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, []);

  // Transform API response to BaseMessage format
  const transformApiMessage = useCallback((apiMessage: any): BaseMessage => {
    return {
      _id: apiMessage._id || apiMessage.messageId,
      messageId: apiMessage.messageId || apiMessage._id,
      conversationId: apiMessage.conversationId || conversationId,
      type: apiMessage.sender === 'user' ? 'user' : apiMessage.sender === 'agent' ? 'agent' : 'bot',
      sender: apiMessage.sender || 'bot',
      senderName: apiMessage.senderName,
      text: apiMessage.content || apiMessage.text || '',
      content: apiMessage.content || apiMessage.text || '',
      time: new Date(apiMessage.timestamp || Date.now()).toLocaleTimeString(),
      timestamp: apiMessage.timestamp || new Date().toISOString(),
      color: apiMessage.color,
      status: apiMessage.status || { sent: true, delivered: true, read: false },
      isOptimistic: false,
      isStreaming: false,
    };
  }, [conversationId]);

  // Load messages for a specific page
  const loadMessages = useCallback(async (page = 1): Promise<void> => {
    if (!conversationId || loadingRef.current) return;

    try {
      loadingRef.current = true;
      updateState({ 
        loading: page === 1,
        loadingMore: page > 1,
        error: null 
      });

      console.log(`📋 Loading messages for conversation ${conversationId}, page ${page}`);

      const response = await axiosInstance.get(
        `/api/${API_VERSION}/ai-support/conversations/${conversationId}/messages?page=${page}&limit=${pageSize}`
      );

      let messages: BaseMessage[] = [];
      let pagination: PaginationInfo = {
        currentPage: page,
        totalPages: 1,
        totalMessages: 0,
        limit: pageSize,
        hasNextPage: false,
        hasPrevPage: false,
      };

      // Handle different API response structures
      if (response.data?.success && response.data?.data) {
        messages = (response.data.data.messages || []).map(transformApiMessage);
        pagination = {
          currentPage: response.data.data.pagination?.currentPage || page,
          totalPages: response.data.data.pagination?.totalPages || 1,
          totalMessages: response.data.data.pagination?.totalMessages || messages.length,
          limit: response.data.data.pagination?.limit || pageSize,
          hasNextPage: response.data.data.pagination?.hasNextPage || false,
          hasPrevPage: response.data.data.pagination?.hasPrevPage || false,
        };
      } else if (Array.isArray(response.data)) {
        messages = response.data.map(transformApiMessage);
      } else if (Array.isArray(response.data.data)) {
        messages = response.data.data.map(transformApiMessage);
      } else {
        console.warn('Unexpected API response structure:', response.data);
      }

      updateState({
        loading: false,
        loadingMore: false,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalMessages: pagination.totalMessages,
        hasMoreMessages: pagination.hasNextPage,
        messages: page === 1 ? messages : deduplicateMessages([...messages, ...state.messages]),
      });

      console.log(`✅ Loaded ${messages.length} messages for page ${page}`);

    } catch (error: any) {
      console.error('❌ Failed to load messages:', error);
      updateState({
        loading: false,
        loadingMore: false,
        error: error.response?.data?.message || error.message || 'Failed to load messages',
      });
    } finally {
      loadingRef.current = false;
    }
  }, [conversationId, pageSize, updateState, transformApiMessage, deduplicateMessages, state.messages]);

  // Load more messages (infinite scroll)
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!state.hasMoreMessages || state.loadingMore) return;
    await loadMessages(state.currentPage + 1);
  }, [state.hasMoreMessages, state.loadingMore, state.currentPage, loadMessages]);

  // Load initial messages
  const loadInitialMessages = useCallback(async (): Promise<void> => {
    await loadMessages(1);
  }, [loadMessages]);

  // Refresh current page
  const refreshMessages = useCallback(async (): Promise<void> => {
    await loadMessages(state.currentPage);
  }, [loadMessages, state.currentPage]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      messages: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasMoreMessages: true,
      currentPage: initialPage,
      totalPages: 1,
      totalMessages: 0,
    });
  }, [initialPage]);

  // Set messages manually
  const setMessages = useCallback((messages: BaseMessage[]) => {
    updateState({ messages: deduplicateMessages(messages) });
  }, [updateState, deduplicateMessages]);

  // Prepend messages (for loading older messages)
  const prependMessages = useCallback((messages: BaseMessage[]) => {
    setState(prev => ({
      ...prev,
      messages: deduplicateMessages([...messages, ...prev.messages]),
    }));
  }, [deduplicateMessages]);

  // Append messages (for loading newer messages)
  const appendMessages = useCallback((messages: BaseMessage[]) => {
    setState(prev => ({
      ...prev,
      messages: deduplicateMessages([...prev.messages, ...messages]),
    }));
  }, [deduplicateMessages]);

  // Get pagination info
  const getPageInfo = useCallback((): PaginationInfo => {
    return {
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      totalMessages: state.totalMessages,
      limit: pageSize,
      hasNextPage: state.hasMoreMessages,
      hasPrevPage: state.currentPage > 1,
    };
  }, [state.currentPage, state.totalPages, state.totalMessages, state.hasMoreMessages, pageSize]);

  // Auto-load on conversation change
  useEffect(() => {
    if (conversationId && conversationId !== lastConversationIdRef.current && autoLoad) {
      lastConversationIdRef.current = conversationId;
      reset();
      loadInitialMessages();
    }
  }, [conversationId, autoLoad, reset, loadInitialMessages]);

  // Infinite scroll detection
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-messages-container]');
      if (!scrollContainer || state.loadingMore || !state.hasMoreMessages) return;

      const { scrollTop } = scrollContainer;
      
      // Load more when scrolled to top
      if (scrollTop <= 50) {
        loadMoreMessages();
      }
    };

    const scrollContainer = document.querySelector('[data-messages-container]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [enableInfiniteScroll, state.loadingMore, state.hasMoreMessages, loadMoreMessages]);

  return {
    ...state,
    loadMessages,
    loadMoreMessages,
    loadInitialMessages,
    refreshMessages,
    reset,
    setMessages,
    prependMessages,
    appendMessages,
    canLoadMore: state.hasMoreMessages && !state.loadingMore,
    isFirstPage: state.currentPage === 1,
    isLastPage: state.currentPage >= state.totalPages,
    getPageInfo,
  };
}
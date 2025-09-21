'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';

export interface BaseMessage {
  _id?: string;
  messageId?: string;
  conversationId: string;
  type: 'user' | 'bot' | 'agent' | 'system';
  sender: 'user' | 'ai' | 'agent' | 'system';
  senderName?: string;
  text: string;
  content: string;
  time: string;
  timestamp: string;
  color?: string;
  status?: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
  isOptimistic?: boolean;
  isStreaming?: boolean;
}

export interface MessageState {
  messages: BaseMessage[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  lastMessageId: string | null;
}

export interface UseMessagesOptions {
  conversationId: string;
  socket: Socket | null;
  isConnected: boolean;
  initialMessages?: BaseMessage[];
  maxMessages?: number;
  enableOptimisticUpdates?: boolean;
  enableCrossSyncSync?: boolean;
}

export interface UseMessagesReturn extends MessageState {
  // Core message operations
  sendMessage: (content: string) => Promise<boolean>;
  addMessage: (message: BaseMessage) => void;
  updateMessage: (messageId: string, updates: Partial<BaseMessage>) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;

  // Message queries
  getMessageById: (messageId: string) => BaseMessage | undefined;
  getMessagesAfter: (timestamp: string) => BaseMessage[];
  getMessagesByType: (type: BaseMessage['type']) => BaseMessage[];
  getLatestMessage: () => BaseMessage | undefined;

  // Utility methods
  canSendMessage: boolean;
  messageCount: number;
  hasMessages: boolean;
  isNearLimit: boolean;
}

/**
 * Core message management hook that handles message CRUD operations,
 * optimistic updates, and real-time synchronization.
 */
export function useMessages({
  conversationId,
  socket,
  isConnected,
  initialMessages = [],
  maxMessages = 1000,
  enableOptimisticUpdates = true,
  enableCrossSyncSync = true,
}: UseMessagesOptions): UseMessagesReturn {
  const [state, setState] = useState<MessageState>({
    messages: initialMessages,
    loading: false,
    error: null,
    sending: false,
    lastMessageId: null,
  });

  // Refs for managing state
  const lastMessageRef = useRef<string>('');
  const optimisticMessagesRef = useRef<Set<string>>(new Set());

  const updateState = useCallback((updates: Partial<MessageState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Generate unique message ID - stable function
  const generateMessageId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Message deduplication
  // const isDuplicateMessage = useCallback((newMessage: BaseMessage, existingMessages: BaseMessage[]) => {
  //   return existingMessages.some(msg => {
  //     // Same ID
  //     if (newMessage._id && msg._id && newMessage._id === msg._id) return true;
  //     if (newMessage.messageId && msg.messageId && newMessage.messageId === msg.messageId) return true;

  //     // Same content and timestamp within 1 second
  //     if (
  //       msg.content === newMessage.content &&
  //       msg.sender === newMessage.sender &&
  //       Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 1000
  //     ) {
  //       return true;
  //     }

  //     return false;
  //   });
  // }, []);

  // Add message to state
  const addMessage = useCallback(
    (message: BaseMessage) => {
      setState((prev) => {
        // Check for duplicates by ID first
        const existingMessage = prev.messages.find(
          (msg) => (message._id && msg._id === message._id) || (message.messageId && msg.messageId === message.messageId)
        );

        if (existingMessage) {
          // console.log('🔄 Duplicate message detected by ID, skipping...', message);
          return prev;
        }

        // Ensure message has required IDs
        const enhancedMessage: BaseMessage = {
          ...message,
          _id: message._id || message.messageId || generateMessageId(),
          messageId: message.messageId || message._id || generateMessageId(),
          conversationId: message.conversationId || conversationId,
        };

        // This block checks if a new, non-optimistic message matches an existing optimistic message (by content).
        // If so, it replaces the optimistic message with the new confirmed message, removes the optimistic message from tracking,
        // and updates the lastMessageId. This ensures that once a message is confirmed by the server, it replaces the placeholder.
        if (!message.isOptimistic && prev.messages.some((m) => m.isOptimistic && m.content === message.content)) {
          const updatedMessages = prev.messages.map((m) => (m.isOptimistic && m.content === message.content ? enhancedMessage : m));

          // Remove the optimistic message from the tracking set, since it's now confirmed
          if (enhancedMessage._id) {
            optimisticMessagesRef.current.delete(enhancedMessage._id);
          }

          return {
            ...prev,
            messages: updatedMessages,
            lastMessageId: enhancedMessage._id || null,
          };
        }

        // Add new message
        const newMessages = [...prev.messages, enhancedMessage];

        // Enforce message limit
        const limitedMessages = maxMessages > 0 && newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;

        // Track optimistic messages
        if (enhancedMessage.isOptimistic && enhancedMessage._id) {
          optimisticMessagesRef.current.add(enhancedMessage._id);
        }

        return {
          ...prev,
          messages: limitedMessages,
          lastMessageId: enhancedMessage._id || null,
        };
      });
    },
    [conversationId, maxMessages]
  );

  // Update existing message
  const updateMessage = useCallback((messageId: string, updates: Partial<BaseMessage>) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => (msg._id === messageId || msg.messageId === messageId ? { ...msg, ...updates } : msg)),
    }));
  }, []);

  // Remove message
  const removeMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg._id !== messageId && msg.messageId !== messageId),
    }));

    // Remove from optimistic tracking
    optimisticMessagesRef.current.delete(messageId);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      lastMessageId: null,
    }));
    optimisticMessagesRef.current.clear();
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!content.trim() || !socket || !isConnected || state.sending) {
        return false;
      }

      // Prevent duplicate messages
      if (lastMessageRef.current === content.trim()) {
        console.log('🔄 Duplicate message submission prevented');
        return false;
      }

      try {
        updateState({ sending: true, error: null });
        lastMessageRef.current = content.trim();

        // Create optimistic message if enabled
        if (enableOptimisticUpdates) {
          const optimisticMessage: BaseMessage = {
            _id: `optimistic-${Date.now()}`,
            messageId: `optimistic-${Date.now()}`,
            conversationId,
            type: 'user',
            sender: 'user',
            senderName: 'You',
            text: content,
            content,
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            status: { sent: false, delivered: false, read: false },
            isOptimistic: true,
          };

          addMessage(optimisticMessage);
        }

        // Send to server
        socket.emit('send-message', { content, conversationId });

        updateState({ sending: false });
        return true;
      } catch (error: any) {
        console.error('❌ Failed to send message:', error);
        updateState({
          sending: false,
          error: error.message || 'Failed to send message',
        });
        return false;
      }
    },
    [socket, isConnected, conversationId, state.sending, addMessage, updateState, enableOptimisticUpdates]
  );

  // Query methods
  const getMessageById = useCallback(
    (messageId: string): BaseMessage | undefined => {
      return state.messages.find((msg) => msg._id === messageId || msg.messageId === messageId);
    },
    [state.messages]
  );

  const getMessagesAfter = useCallback(
    (timestamp: string): BaseMessage[] => {
      const targetTime = new Date(timestamp).getTime();
      return state.messages.filter((msg) => new Date(msg.timestamp).getTime() > targetTime);
    },
    [state.messages]
  );

  const getMessagesByType = useCallback(
    (type: BaseMessage['type']): BaseMessage[] => {
      return state.messages.filter((msg) => msg.type === type);
    },
    [state.messages]
  );

  const getLatestMessage = useCallback((): BaseMessage | undefined => {
    return state.messages[state.messages.length - 1];
  }, [state.messages]);

  // Handle socket message events
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: any) => {
      const { message, conversationId: msgConversationId } = data;

      // Only handle messages for this conversation
      if (msgConversationId !== conversationId) return;

      if (message) {
        const enhancedMessage: BaseMessage = {
          _id: message._id || message.messageId || generateMessageId(),
          messageId: message.messageId || message._id || generateMessageId(),
          conversationId: msgConversationId,
          type: message.sender === 'user' ? 'user' : message.sender === 'agent' ? 'agent' : 'bot',
          sender: message.sender,
          senderName: message.senderName,
          text: message.content || message.text,
          content: message.content || message.text,
          time: new Date(message.timestamp || Date.now()).toLocaleTimeString(),
          timestamp: message.timestamp || new Date().toISOString(),
          status: message.status || { sent: true, delivered: true, read: false },
        };

        addMessage(enhancedMessage);
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, conversationId]);

  // Cross-tab synchronization
  useEffect(() => {
    if (!enableCrossSyncSync) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'conversation-sync' && e.newValue) {
        const data = JSON.parse(e.newValue);
        if (data.type === 'message' && data.conversationId === conversationId) {
          addMessage(data.message);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [conversationId, enableCrossSyncSync]);

  // Cleanup optimistic messages on unmount
  useEffect(() => {
    return () => {
      optimisticMessagesRef.current.clear();
    };
  }, []);

  return {
    ...state,
    sendMessage,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    getMessageById,
    getMessagesAfter,
    getMessagesByType,
    getLatestMessage,
    canSendMessage: isConnected && !state.sending && conversationId !== '',
    messageCount: state.messages.length,
    hasMessages: state.messages.length > 0,
    isNearLimit: maxMessages > 0 && state.messages.length >= maxMessages * 0.9,
  };
}

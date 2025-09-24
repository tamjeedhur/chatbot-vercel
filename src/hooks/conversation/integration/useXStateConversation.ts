'use client';

import { useCallback, useMemo, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { conversationMachine, Conversation } from '@/machines/conversation-machine';
import { useSocket } from '../core/useSocket';
import { useMessages } from '../messages/useMessages';
import { useMessageHistory } from '../messages/useMessageHistory';
import { useTypingIndicators } from '../realtime/useTypingIndicators';
import { usePresence } from '../realtime/usePresence';
import { useConversationSync } from '../realtime/useConversationSync';

export interface XStateConversationConfig {
  tenantId: string;
  chatbotId: string;
  initialConversations?: Conversation[];
  selectedConversation?: Conversation | null;
  socketConfig?: Parameters<typeof useSocket>[0];
  enableRealTime?: boolean;
  enableSync?: boolean;
  autoJoinConversations?: boolean;
}

export interface UseXStateConversationReturn {
  // XState machine state and actions
  state: any;
  send: any;
  conversationService: any;

  // Socket connection
  socket: ReturnType<typeof useSocket>['socket'];
  isConnected: boolean;
  connectionStatus: string;

  // Messages
  messages: ReturnType<typeof useMessages>;
  messageHistory: ReturnType<typeof useMessageHistory>;

  // Real-time features
  typingIndicators: ReturnType<typeof useTypingIndicators>;
  presence: ReturnType<typeof usePresence>;
  sync: ReturnType<typeof useConversationSync>;

  // Conversation state
  selectedConversation: Conversation | null;
  conversations: Conversation[];
  filteredConversations: Conversation[];

  // Actions
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => Promise<boolean>;
  joinConversation: (conversationId: string) => void;
  loadMoreMessages: () => Promise<void>;

  // Utilities
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
}

/**
 * Hook that integrates all conversation hooks with the existing XState machine
 * to provide a unified interface for conversation management.
 */
export function useXStateConversation({
  tenantId,
  chatbotId,
  initialConversations = [],
  selectedConversation = null,
  socketConfig = {},
  enableRealTime = true,
  enableSync = true,
  autoJoinConversations = true,
}: XStateConversationConfig): UseXStateConversationReturn {
  // Socket connection
  const socketConnection = useSocket({
    tenantId,
    chatbotId,
    autoConnect: true,
    ...socketConfig,
  });

  const { socket, isConnected, connectionError } = socketConnection;

  // Initialize XState machine with socket configuration
  const [state, send, conversationService] = useMachine(conversationMachine, {
    input: {
      initialConversations,
      selectedConversation,
      socket,
      isConnected,
      enableRealTime,
      enableSync,
      autoJoinConversations,
      tenantId,
      chatbotId,
    },
  });


  // Update XState machine when socket connection changes
  useEffect(() => {
    send({
      type: 'UPDATE_SOCKET_CONFIG',
      socket,
      isConnected,
    });
  }, [socket, isConnected, send]);

  // Direct socket message handling (like typing events)
  useEffect(() => {
    if (!socket || !enableRealTime) {
      return;
    }

    const handleMessage = (data: any) => {
      // Send the message to XState machine for processing
      send({ type: 'SOCKET_MESSAGE', data });
    };

    const handleNewConversation = (data: any) => {
      console.log('🔌 Received new_conversation event:', data);
      // Send the new conversation event to XState machine for processing
      send({ type: 'SOCKET_NEW_CONVERSATION', data });
    };

    // Bind the event listeners
    socket.on('message', handleMessage);
    socket.on('new_conversation', handleNewConversation);

    // Cleanup function
    return () => {
      socket.off('message', handleMessage);
      socket.off('new_conversation', handleNewConversation);
    };
  }, [socket, enableRealTime, send]);

  // Current conversation
  const currentConversation = state.context.selectedConversation;
  
  
  let conversationId = currentConversation?.conversationId || 
                      currentConversation?._id || 
                  
                      '';
  

  

  // Message management hooks (still needed for UI components)
  // Disable socket handling in useMessages since XState machine handles it
  const messages = useMessages({
    conversationId,
    socket: null, // Disable socket to prevent dual handling
    isConnected: false, // Disable socket to prevent dual handling
    enableOptimisticUpdates: true,
    enableCrossSyncSync: enableSync,
  });

  const messageHistory = useMessageHistory({
    conversationId,
    autoLoad: !!conversationId,
    enableInfiniteScroll: true,
  });

  // Real-time features
  const typingIndicators = useTypingIndicators({
    socket,
    conversationId,
    enableSelfTyping: true, // Enable self-typing to show user's own typing
  });

  const presence = usePresence({
    socket,
    conversationId,
    currentUserId: 'user', // This would come from session
    enableHeartbeat: enableRealTime,
  });

  const sync = useConversationSync({
    conversationId,
    enabled: enableSync,
    onMessageSync: (message) => {
      messages.addMessage(message);
    },
    onConversationSync: (conversation) => {
      send({ type: 'UPDATE_CONVERSATION', conversation });
    },
  });

  // Actions
  const selectConversation = useCallback(
    (conversation: Conversation) => {
      send({ type: 'SELECT_CONVERSATION', conversation });
    },
    [send]
  );

  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!conversationId) return false;

      // Send via messages hook (handles optimistic updates)
      const success = await messages.sendMessage(content);

      if (success && enableSync) {
        // Sync to other tabs
        sync.syncMessage({
          _id: `user-${Date.now()}`,
          messageId: `user-${Date.now()}`,
          conversationId,
          type: 'user',
          sender: 'user',
          senderName: 'You',
          text: content,
          content,
          time: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          status: { sent: true, delivered: false, read: false },
        });
      }

      return success;
    },
    [conversationId, messages, enableSync, sync]
  );

  const joinConversation = useCallback(
    (conversationId: string) => {
      // Send to XState machine instead of directly to socket
      send({ type: 'JOIN_CONVERSATION', conversationId });

      // Join presence
      if (enableRealTime) {
        presence.joinPresence();
      }
    },
    [send, enableRealTime, presence]
  );

  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!conversationId) return;

    // Use message history hook for pagination
    await messageHistory.loadMoreMessages();

    // Update XState with loaded messages
    if (messageHistory.messages.length > 0) {
      messageHistory.messages.forEach((message) => {
        send({
          type: 'ADD_MESSAGE',
          conversationId,
          message,
        });
      });
    }
  }, [conversationId, messageHistory, send]);

  // Memoized values
  const computedValues = useMemo(() => {
    return {
      isLoading: state.context.loading || messages.loading || messageHistory.loading,
      hasError: !!(state.context.error || messages.error || messageHistory.error || connectionError),
      error: state.context.error || messages.error || messageHistory.error || connectionError,
      selectedConversation: state.context.selectedConversation,
      conversations: state.context.conversations || [],
      filteredConversations: state.context.filteredConversations || [],
    };
  }, [state.context, messages.loading, messages.error, messageHistory.loading, messageHistory.error, connectionError]);

  return {
    // XState
    state,
    send,
    conversationService,

    // Socket
    socket,
    isConnected,
    connectionStatus: connectionError ? 'error' : isConnected ? 'connected' : 'disconnected',

    // Hooks
    messages,
    messageHistory,
    typingIndicators,
    presence,
    sync,

    // Actions
    selectConversation,
    sendMessage,
    joinConversation,
    loadMoreMessages,

    // Computed values
    ...computedValues,
  };
}

import { setup, assign, fromPromise, fromCallback } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';
import { API_VERSION } from '@/utils/constants';
import { Socket } from 'socket.io-client';

// Types for conversation interface
export interface Conversation {
  _id?: string;
  conversationId: string;
  name: string;
  message: string;
  time: string;
  color: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  summary: {
    Tone: string;
    TotalMessages: string;
  };
  messages: Message[];
  hasNotification?: boolean;
  // Pagination metadata
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Message {
  type: 'user' | 'bot' | 'agent' | 'system';
  text: string;
  time: string;
  // API message structure
  _id?: string;
  messageId?: string;
  conversationId: string;
  sender?: string;
  senderName?: string;
  content?: string;
  timestamp?: string;
  color?: string;
  status?: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
  isOptimistic?: boolean;
  isStreaming?: boolean;
}

// Machine input type
export interface ConversationMachineInput {
  initialConversations?: Conversation[];
  selectedConversation?: Conversation | null;
  socket?: Socket | null;
  isConnected?: boolean;
  enableRealTime?: boolean;
  enableSync?: boolean;
  autoJoinConversations?: boolean;
  tenantId?: string;
  chatbotId?: string;
}

// Machine context type
export interface ConversationMachineContext {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredConversations: Conversation[];
  loadingMoreMessages: boolean;
  hasMoreMessages: boolean;
  currentPage: number;
  // Socket and real-time state
  socket: Socket | null;
  isConnected: boolean;
  enableRealTime: boolean;
  enableSync: boolean;
  autoJoinConversations: boolean;
  tenantId: string;
  chatbotId: string;
  // Message sync state
  messagesToSync: Message[];
  lastSyncTimestamp: number;
  // Streaming state
  isStreaming: boolean;
}

// Machine events
export type ConversationMachineEvent =
  | { type: 'SELECT_CONVERSATION'; conversation: Conversation }
  | { type: 'SEARCH_CONVERSATIONS'; query: string }
  | { type: 'SET_CONVERSATIONS'; conversations: Conversation[] }
  | { type: 'LOAD_MORE_MESSAGES'; conversationId: string; page?: number }
  | { type: 'ADD_CONVERSATION'; conversation: Conversation }
  | { type: 'UPDATE_CONVERSATION'; conversation: Conversation }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: Message }
  | { type: 'UPDATE_CONVERSATION_STATUS'; conversationId: string; status: string; agentName?: string; agentId?: string }
  | { type: 'APPEND_STREAM_CHUNK'; conversationId: string; chunk: string }
  | { type: 'COMPLETE_STREAM'; conversationId: string }
  // Socket and real-time events
  | { type: 'SOCKET_CONNECTED'; socket: Socket }
  | { type: 'SOCKET_DISCONNECTED' }
  | { type: 'SOCKET_MESSAGE'; data: any }
  | { type: 'SOCKET_CONVERSATION_LIST'; data: any }
  | { type: 'SOCKET_CONVERSATION_UPDATE'; data: any }
  | { type: 'SOCKET_STREAM_CHUNK'; data: any }
  | { type: 'SOCKET_STREAM_COMPLETE'; data: any }
  | { type: 'SOCKET_NEW_CONVERSATION'; data: any }
  | { type: 'JOIN_CONVERSATION'; conversationId: string }
  | { type: 'SYNC_MESSAGES'; messages: Message[] }
  | { type: 'UPDATE_SOCKET_CONFIG'; socket: Socket | null; isConnected: boolean };

const fetchConversationDetails = fromPromise(async ({ input }: { input: { conversationId: string; page?: number } }) => {
  const page = input.page || 1;
  const response = await axiosInstance.get(`/api/${API_VERSION}/ai-support/conversations/${input.conversationId}/messages?page=${page}&limit=50`);

  // Handle the API response structure with pagination
  if (response.data && response.data.success && response.data.data) {
    return {
      messages: response.data.data.messages || [],
      pagination: response.data.data.pagination || {},
    };
  } else if (Array.isArray(response.data)) {
    return {
      messages: response.data,
      pagination: {},
    };
  } else if (Array.isArray(response.data.data)) {
    return {
      messages: response.data.data,
      pagination: {},
    };
  } else {
    console.warn('Unexpected API response structure:', response.data);
    return {
      messages: [],
      pagination: {},
    };
  }
});

// Socket event handler actor
const createSocketEventHandlers = fromCallback(
  ({ input, sendBack }: { input: { socket: Socket; enableRealTime: boolean; enableSync: boolean }; sendBack: any }) => {
    const { socket, enableRealTime, enableSync } = input;

    if (!socket) {
      return () => {}; // No cleanup needed
    }

    if (!enableRealTime) {
      return () => {}; // No cleanup needed
    }

    const handleConversationList = (data: any) => {
      sendBack({ type: 'SOCKET_CONVERSATION_LIST', data });
    };

    const handleConversationUpdate = (data: any) => {
      sendBack({ type: 'SOCKET_CONVERSATION_UPDATE', data });
    };

    const handleMessage = (data: any) => {
      sendBack({ type: 'SOCKET_MESSAGE', data });
    };

    const handleStreamChunk = (data: any) => {
      sendBack({ type: 'SOCKET_STREAM_CHUNK', data });
    };

    const handleStreamComplete = (data: any) => {
      sendBack({ type: 'SOCKET_STREAM_COMPLETE', data });
    };

    const handleNewConversation = (data: any) => {
      sendBack({ type: 'SOCKET_NEW_CONVERSATION', data });
    };

    socket.on('conversation-list', handleConversationList);
    socket.on('conversation-update', handleConversationUpdate);
    socket.on('message', handleMessage);
    socket.on('rag-stream-chunk', handleStreamChunk);
    socket.on('rag-stream-complete', handleStreamComplete);
    socket.on('new_conversation', handleNewConversation);

    // Cleanup function
    return () => {
      socket.off('conversation-list', handleConversationList);
      socket.off('conversation-update', handleConversationUpdate);
      socket.off('message', handleMessage);
      socket.off('rag-stream-chunk', handleStreamChunk);
      socket.off('rag-stream-complete', handleStreamComplete);
      socket.off('new_conversation', handleNewConversation);
    };
  }
);

// Create the conversation machine
export const conversationMachine = setup({
  types: {
    input: {} as ConversationMachineInput,
    context: {} as ConversationMachineContext,
    events: {} as ConversationMachineEvent,
  },
  actors: {
    fetchConversationDetails,
    createSocketEventHandlers,
  },
  actions: {
    selectConversation: assign({
      selectedConversation: ({ event, context }) => {
        const selectedConv = (event as any).conversation;
        // Find the conversation in the conversations array to get the latest data including messages
        const latestConv = context.conversations.find((conv) => conv.conversationId === selectedConv.conversationId);
        const result = latestConv || selectedConv;
        return result;
      },
      // Reset pagination state when selecting a new conversation
      currentPage: 1,
      hasMoreMessages: true,
      loadingMoreMessages: false,
    }),
    searchConversations: assign({
      searchQuery: ({ event }) => (event as any).query,
      filteredConversations: ({ context, event }) => {
        const query = (event as any).query.toLowerCase();
        if (!query.trim()) return context.conversations;

        return context.conversations.filter(
          (conversation) =>
            conversation.name?.toLowerCase().includes(query) ||
            conversation.email?.toLowerCase().includes(query) ||
            conversation.lastMessage?.toLowerCase().includes(query)
        );
      },
    }),
    setConversations: assign({
      conversations: ({ event }) => (event as any).conversations,
      filteredConversations: ({ event }) => (event as any).conversations,
      selectedConversation: ({ event, context }) => {
        // Auto-select the first conversation if no conversation is currently selected
        if (!context.selectedConversation && (event as any).conversations.length > 0) {
          return (event as any).conversations[0];
        }
        return context.selectedConversation;
      },
    }),
    setLoading: assign({
      loading: true,
      error: null,
    }),
    setLoadingMore: assign({
      loadingMoreMessages: true,
      error: null,
    }),
    setError: assign({
      loading: false,
      loadingMoreMessages: false,
      error: ({ event }) => (event as any).error?.message || 'Failed to fetch conversation details',
    }),
    updateConversationDetails: assign({
      loading: false,
      error: null,
      selectedConversation: ({ context, event }) => {
        const { messages, pagination } = (event as any).output;
        if (context.selectedConversation) {
          return {
            ...context.selectedConversation,
            messages: messages,
            pagination: pagination,
          };
        }
        return context.selectedConversation;
      },
    }),
    appendMoreMessages: assign({
      loadingMoreMessages: false,
      error: null,
      currentPage: ({ context, event }) => {
        const { pagination } = (event as any).output;
        return pagination?.currentPage || context.currentPage;
      },
      hasMoreMessages: ({ event }) => {
        const { pagination } = (event as any).output;
        return pagination?.hasNextPage || false;
      },
      selectedConversation: ({ context, event }) => {
        const { messages, pagination } = (event as any).output;
        if (context.selectedConversation) {
          // Append new messages to existing ones (prepend for older messages)
          const existingMessages = context.selectedConversation.messages || [];
          const newMessages = messages || [];

          // Combine and deduplicate messages
          const allMessages = [...newMessages, ...existingMessages];
          const uniqueMessages = allMessages.filter(
            (message, index, self) => index === self.findIndex((m) => m._id === message._id || m.messageId === message.messageId)
          );

          return {
            ...context.selectedConversation,
            messages: uniqueMessages,
            pagination: pagination,
          };
        }
        return context.selectedConversation;
      },
    }),
    addConversation: assign({
      conversations: ({ context, event }) => {
        const newConversation = (event as any).conversation;
        // Check if conversation already exists
        const exists = context.conversations.some((conv) => conv.conversationId === newConversation.conversationId);
        if (exists) return context.conversations;
        return [newConversation, ...context.conversations];
      },
      filteredConversations: ({ context, event }) => {
        const newConversation = (event as any).conversation;
        const exists = context.filteredConversations.some((conv) => conv.conversationId === newConversation.conversationId);
        if (exists) return context.filteredConversations;
        return [newConversation, ...context.filteredConversations];
      },
    }),
    updateConversation: assign({
      conversations: ({ context, event }) => {
        const updatedConversation = (event as any).conversation;
        return context.conversations.map((conv) => (conv.conversationId === updatedConversation.conversationId ? { ...conv, ...updatedConversation } : conv));
      },
      filteredConversations: ({ context, event }) => {
        const updatedConversation = (event as any).conversation;
        return context.filteredConversations.map((conv) => (conv.conversationId === updatedConversation.conversationId ? { ...conv, ...updatedConversation } : conv));
      },
    }),
    addMessage: assign({
      selectedConversation: ({ context, event }) => {
        const { conversationId, message } = event as any;
        if (
          context.selectedConversation &&
          context.selectedConversation.conversationId === conversationId
        ) {
          const currentMessages = context.selectedConversation.messages || [];
          // Check if message already exists to prevent duplicates
          const exists = currentMessages.some(
            (msg) => (msg._id && msg._id === message._id) || (msg.messageId && msg.messageId === message.messageId)
          );
          if (!exists) {
            return {
              ...context.selectedConversation,
              messages: [...currentMessages, message],
            };
          }
        }
        return context.selectedConversation;
      },
    }),
    updateConversationStatus: assign({
      conversations: ({ context, event }) => {
        const { conversationId, status, agentName } = event as any;
        return context.conversations.map((conv) =>
          conv.conversationId === conversationId ? { ...conv, status, agentName } : conv
        );
      },
    }),
    appendStreamChunk: assign({
      selectedConversation: ({ context, event }) => {
        // ✅ Extract data from the correct structure
        const eventData = (event as any).data || event;
        const { conversationId, chunk } = eventData;
       
        
        if (
          context.selectedConversation &&
          context.selectedConversation.conversationId === conversationId
        ) {
          const currentMessages = context.selectedConversation.messages || [];
          const lastMessage = currentMessages[currentMessages.length - 1];

          // If the last message is streaming, append to it
          if (lastMessage && lastMessage.isStreaming) {
            const updatedMessages = [...currentMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: (lastMessage.text || '') + chunk,
              content: (lastMessage.content || '') + chunk,
            };
            return {
              ...context.selectedConversation,
              messages: updatedMessages,
            };
          } else {
            // ✅ Create new streaming message if none exists (like embed widget)
            const streamingMessage = {
              _id: `streaming-${Date.now()}-${Math.random()}`,
              messageId: `streaming-${Date.now()}-${Math.random()}`,
              conversationId: conversationId,
              type: 'bot' as const,
              sender: 'ai' as const,
              text: chunk, // Start with the first chunk
              content: chunk, // Start with the first chunk
              time: new Date().toLocaleTimeString(),
              timestamp: new Date().toISOString(),
              isStreaming: true, // ✅ Mark as streaming
            };
            
            return {
              ...context.selectedConversation,
              messages: [...currentMessages, streamingMessage],
            };
          }
        }
        return context.selectedConversation;
      },
      isStreaming: true, // ✅ Re-enable streaming state to prevent duplicates
    }),
    completeStream: assign({
      selectedConversation: ({ context, event }) => {
        // ✅ Extract data from the correct structure
        const eventData = (event as any).data || event;
        const { conversationId } = eventData;
   
        if (
          context.selectedConversation &&
          context.selectedConversation.conversationId === conversationId
        ) {
          const currentMessages = context.selectedConversation.messages || [];
          const lastMessage = currentMessages[currentMessages.length - 1];

          // Mark the last message as no longer streaming
          if (lastMessage && lastMessage.isStreaming) {
            const updatedMessages = [...currentMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              isStreaming: false,
            };
            return {
              ...context.selectedConversation,
              messages: updatedMessages,
            };
          }
        }
        return context.selectedConversation;
      },
      isStreaming: false, // ✅ Clear streaming state when complete
    }),


    // Socket and real-time actions
    updateSocketConfig: assign({
      socket: ({ event }) => (event as any).socket,
      isConnected: ({ event }) => (event as any).isConnected,
    }),

    logSocketUpdate: ({ context, event }) => {
      // Socket config updated
    },

    logJoinConversationEvent: ({ context, event }) => {
      // Join conversation event received
    },

    handleSocketMessage: assign({
      selectedConversation: ({ context, event }) => {
      
        const { data } = event as any;
        const { message, conversationId: msgConversationId } = data;

      
       
        
     
      

       
        const hasMessage = !!message;
        const hasConversationId = !!msgConversationId;
        const hasSelectedConversation = !!context.selectedConversation;
        const conversationIdMatch = context.selectedConversation?.conversationId === msgConversationId;

     

        if (hasMessage && hasConversationId && hasSelectedConversation && conversationIdMatch && context.selectedConversation) {
          // ✅ Block assistant messages during streaming to prevent duplicates
          if (message.sender === 'ai' && context.isStreaming) {
          
            return context.selectedConversation;
          }

          const currentMessages = context.selectedConversation.messages || [];

          const newMessage: Message = {
            _id: message._id || message.messageId,
            messageId: message.messageId || message._id,
            conversationId: msgConversationId,
            type: (message.sender === 'user' ? 'user' : 'bot') as 'user' | 'bot' | 'agent' | 'system',
            sender: message.sender,
            senderName: message.senderName,
            text: message.content || message.text,
            content: message.content || message.text,
            time: new Date(message.timestamp || Date.now()).toLocaleTimeString(),
            timestamp: message.timestamp || new Date().toISOString(),
            status: message.status || { sent: true, delivered: true, read: false },
          };

       

          // Check if message already exists to prevent duplicates
          const exists = currentMessages.some(
            (msg) => (msg._id && msg._id === newMessage._id) || (msg.messageId && msg.messageId === newMessage.messageId)
          );

        

          if (!exists) {
            const updatedConversation = {
              ...context.selectedConversation,
              messages: [...currentMessages, newMessage],
            };
        
            return updatedConversation;
          } else {
            console.log('⚠️ XState: Message already exists, not adding');
            
          }
        } else {
        
          console.log('🚨 ===== XSTATE MESSAGE PROCESSING COMPLETE (SKIPPED) =====');
        }
        return context.selectedConversation;
      },
      conversations: ({ context, event }) => {
      
        const { data } = event as any;
        const { message, conversationId: msgConversationId } = data;

        // Also update the conversation in the conversations list
        if (message && msgConversationId) {
          const updatedConversations = context.conversations.map(conv => {
           
            
            if (conv.conversationId === msgConversationId) {
              const currentMessages = conv.messages || [];
              const newMessage: Message = {
                _id: message._id || message.messageId,
                messageId: message.messageId || message._id,
                conversationId: msgConversationId,
                type: (message.sender === 'user' ? 'user' : 'bot') as 'user' | 'bot' | 'agent' | 'system',
                sender: message.sender,
                senderName: message.senderName,
                text: message.content || message.text,
                content: message.content || message.text,
                time: new Date(message.timestamp || Date.now()).toLocaleTimeString(),
                timestamp: message.timestamp || new Date().toISOString(),
                status: message.status || { sent: true, delivered: true, read: false },
              };

              // Check if message already exists to prevent duplicates
              const exists = currentMessages.some(
                (msg) => (msg._id && msg._id === newMessage._id) || (msg.messageId && msg.messageId === newMessage.messageId)
              );

              if (!exists) {
                const updatedConv = {
                  ...conv,
                  messages: [...currentMessages, newMessage],
                };
              
                return updatedConv;
              } else {
               
              }
            }
            return conv;
          });
          
        
          
          return updatedConversations;
        }
        return context.conversations;
      },
    }),

    handleSocketConversationList: assign({
      conversations: ({ event }) => {
        const { data } = event as any;
        if (data.success && data.data) {
          return data.data;
        }
        return [];
      },
      filteredConversations: ({ event }) => {
        const { data } = event as any;
        if (data.success && data.data) {
          return data.data;
        }
        return [];
      },
    }),

    handleSocketConversationUpdate: assign({
      conversations: ({ context, event }) => {
        const { data } = event as any;
        const { type, conversation } = data;

        if (type === 'created') {
          const exists = context.conversations.some((conv) => conv.conversationId === conversation.conversationId);
          if (exists) return context.conversations;
          return [conversation, ...context.conversations];
        } else if (type === 'updated') {
          return context.conversations.map((conv) => (conv.conversationId === conversation.conversationId ? { ...conv, ...conversation } : conv));
        }
        return context.conversations;
      },
      filteredConversations: ({ context, event }) => {
        const { data } = event as any;
        const { type, conversation } = data;

        if (type === 'created') {
          const exists = context.filteredConversations.some((conv) => conv.conversationId === conversation.conversationId);
          if (exists) return context.filteredConversations;
          return [conversation, ...context.filteredConversations];
        } else if (type === 'updated') {
          return context.filteredConversations.map((conv) => (conv.conversationId === conversation.conversationId ? { ...conv, ...conversation } : conv));
        }
        return context.filteredConversations;
      },
    }),

    handleSocketNewConversation: assign({
      conversations: ({ context, event }) => {
        const { data } = event as any;
        const { conversation } = data;

     
        // Check if conversation already exists to prevent duplicates
        const exists = context.conversations.some((conv) => conv.conversationId === conversation.conversationId);
        if (exists) {
          
          return context.conversations;
        }
        
  
        // Add new conversation to the beginning of the list
        return [conversation, ...context.conversations];
      },
      filteredConversations: ({ context, event }) => {
        const { data } = event as any;
        const { conversation } = data;

        // Check if conversation already exists to prevent duplicates
        const exists = context.filteredConversations.some((conv) => conv.conversationId === conversation.conversationId);
        if (exists) return context.filteredConversations;
        
        // Add new conversation to the beginning of the filtered list
        return [conversation, ...context.filteredConversations];
      },
    }),

    emitJoinConversation: ({ context, event }) => {
      const { conversationId } = event as any;
     

      if (context.socket?.connected) {
       
       

        try {
          context.socket.emit('join-conversation', { conversationId });
          
        } catch (error) {
          console.error('❌ Error emitting join-conversation from emitJoinConversation:', error);
        }
      } else {
        console.warn('⚠️ Cannot emit join-conversation: socket not connected');
      }
    },

    syncMessages: assign({
      messagesToSync: ({ event }) => (event as any).messages,
      lastSyncTimestamp: () => Date.now(),
    }),

    // Auto-join action that checks conditions and emits join if needed
    checkAndAutoJoin: ({ context }) => {
      const shouldJoin =
        context.autoJoinConversations &&
        context.isConnected &&
        context.selectedConversation &&
        (context.selectedConversation.conversationId);

   

      if (shouldJoin && context.socket?.connected && context.selectedConversation) {
        const conversationId = context.selectedConversation.conversationId;
     

        try {
          context.socket.emit('join-conversation', { conversationId });
        } catch (error) {
          console.error('❌ Error emitting join-conversation:', error);
        }
      } else {
      
      }
    },
  },

  guards: {
    shouldAutoJoin: ({ context }) => {
      const shouldJoin =
        context.autoJoinConversations &&
        context.isConnected &&
        context.selectedConversation &&
        (context.selectedConversation.conversationId);

  

      return !!shouldJoin;
    },
  },
}).createMachine({
  id: 'conversation',
  initial: 'idle',
  context: ({ input }) => {
    const context = {
      conversations: input.initialConversations || [],
      selectedConversation: input.selectedConversation || input.initialConversations?.[0] || null,
      loading: false,
      error: null,
      searchQuery: '',
      filteredConversations: input.initialConversations || [],
      // Pagination state
      loadingMoreMessages: false,
      hasMoreMessages: true,
      currentPage: 1,
      // Socket and real-time state
      socket: input.socket || null,
      isConnected: input.isConnected || false,
      enableRealTime: input.enableRealTime || true,
      enableSync: input.enableSync || true,
      autoJoinConversations: input.autoJoinConversations || true,
      tenantId: input.tenantId || '',
      chatbotId: input.chatbotId || '',
      // Message sync state
      messagesToSync: [],
      lastSyncTimestamp: 0,
      // Streaming state
      isStreaming: false,
    };


    return context;
  },
  states: {
    idle: {
      // Set up socket event handlers if socket is available
      invoke: {
        src: 'createSocketEventHandlers',
        input: ({ context }) => {
         
         
          return {
            socket: context.socket!,
            enableRealTime: context.enableRealTime,
            enableSync: context.enableSync,
          };
        },
      },
      on: {
        SELECT_CONVERSATION: {
          actions: ['selectConversation', 'checkAndAutoJoin'],
        },
        SEARCH_CONVERSATIONS: {
          actions: 'searchConversations',
        },
        SET_CONVERSATIONS: {
          actions: 'setConversations',
        },
        LOAD_MORE_MESSAGES: {
          guard: ({ context }) => context.hasMoreMessages && !context.loadingMoreMessages,
          target: 'loadingMoreMessages',
        },
        ADD_CONVERSATION: {
          actions: 'addConversation',
        },
        UPDATE_CONVERSATION: {
          actions: 'updateConversation',
        },
        ADD_MESSAGE: {
          actions: 'addMessage',
        },
        UPDATE_CONVERSATION_STATUS: {
          actions: 'updateConversationStatus',
        },
        APPEND_STREAM_CHUNK: {
          actions: 'appendStreamChunk',
        },
        COMPLETE_STREAM: {
          actions: 'completeStream',
        },
        // Socket events
        UPDATE_SOCKET_CONFIG: {
          actions: ['logSocketUpdate', 'updateSocketConfig', 'checkAndAutoJoin'],
          target: 'idle', 
        },
        SOCKET_MESSAGE: {
          actions: 'handleSocketMessage',
        },
        SOCKET_CONVERSATION_LIST: {
          actions: 'handleSocketConversationList',
        },
        SOCKET_CONVERSATION_UPDATE: {
          actions: 'handleSocketConversationUpdate',
        },
        SOCKET_NEW_CONVERSATION: {
          actions: 'handleSocketNewConversation',
        },
        SOCKET_STREAM_CHUNK: {
          actions: 'appendStreamChunk',
        },
        SOCKET_STREAM_COMPLETE: {
          actions: 'completeStream',
        },
        JOIN_CONVERSATION: {
          actions: ['logJoinConversationEvent', 'emitJoinConversation'],
        },
        SYNC_MESSAGES: {
          actions: 'syncMessages',
        },
      },
    },
    fetchingConversationDetails: {
      entry: 'setLoading',
      invoke: {
        src: 'fetchConversationDetails',
        input: ({ event }) => ({
          conversationId: (event as any).conversationId,
          page: 1,
        }),
        onDone: {
          target: 'idle',
          actions: 'updateConversationDetails',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    loadingMoreMessages: {
      entry: 'setLoadingMore',
      invoke: {
        src: 'fetchConversationDetails',
        input: ({ event, context }) => ({
          conversationId: (event as any).conversationId,
          page: (event as any).page || context.currentPage + 1,
        }),
        onDone: {
          target: 'idle',
          actions: 'appendMoreMessages',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },

    managingSocketEvents: {
      invoke: {
        src: 'createSocketEventHandlers',
        input: ({ context }) => ({
          socket: context.socket!,
          enableRealTime: context.enableRealTime,
          enableSync: context.enableSync,
        }),
      },
      on: {
        // All the same events as idle state
        SELECT_CONVERSATION: {
          actions: 'selectConversation',
        },
        SEARCH_CONVERSATIONS: {
          actions: 'searchConversations',
        },
        SET_CONVERSATIONS: {
          actions: 'setConversations',
        },
        LOAD_MORE_MESSAGES: {
          guard: ({ context }) => context.hasMoreMessages && !context.loadingMoreMessages,
          target: 'loadingMoreMessages',
        },
        ADD_CONVERSATION: {
          actions: 'addConversation',
        },
        UPDATE_CONVERSATION: {
          actions: 'updateConversation',
        },
        ADD_MESSAGE: {
          actions: 'addMessage',
        },
        UPDATE_CONVERSATION_STATUS: {
          actions: 'updateConversationStatus',
        },
        APPEND_STREAM_CHUNK: {
          actions: 'appendStreamChunk',
        },
        COMPLETE_STREAM: {
          actions: 'completeStream',
        },
        // Socket events
        UPDATE_SOCKET_CONFIG: {
          actions: ['logSocketUpdate', 'updateSocketConfig', 'checkAndAutoJoin'],
          target: 'idle', // Force transition to idle to re-invoke socket event handler
        },
        SOCKET_MESSAGE: {
          actions: 'handleSocketMessage',
        },
        SOCKET_CONVERSATION_LIST: {
          actions: 'handleSocketConversationList',
        },
        SOCKET_CONVERSATION_UPDATE: {
          actions: 'handleSocketConversationUpdate',
        },
        SOCKET_NEW_CONVERSATION: {
          actions: 'handleSocketNewConversation',
        },
        SOCKET_STREAM_CHUNK: {
          actions: 'appendStreamChunk',
        },
        SOCKET_STREAM_COMPLETE: {
          actions: 'completeStream',
        },
        JOIN_CONVERSATION: {
          actions: ['logJoinConversationEvent', 'emitJoinConversation'],
        },
        SYNC_MESSAGES: {
          actions: 'syncMessages',
        },
      },
    },
  },
});

// Export the machine type for use with React hooks
export type ConversationMachine = typeof conversationMachine;

'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useXStateConversation } from '@/hooks/conversation';
import type { 
  UseXStateConversationReturn,
  XStateConversationConfig
} from '@/hooks/conversation';
import type { Conversation } from '@/machines/conversation-machine';

interface ModernConversationContextType extends UseXStateConversationReturn {
  // Additional context-specific methods or state can go here
}

const ModernConversationContext = createContext<ModernConversationContextType | null>(null);

interface ModernConversationProviderProps {
  children: React.ReactNode;
  initialConversations: Conversation[];
  tenantId: string;
  chatbotId: string;
  selectedConversation?: Conversation | null;
}

/**
 * Modern conversation provider that uses our new hook-based architecture
 * to replace the old monolithic ConversationProvider.
 */
export function ModernConversationProvider({
  children,
  initialConversations,
  tenantId,
  chatbotId,
  selectedConversation = null,
}: ModernConversationProviderProps) {

  // Configuration for the XState conversation hook
  const config: XStateConversationConfig = {
    tenantId,
    chatbotId,
    initialConversations,
    selectedConversation,
    socketConfig: {
      tenantId,
      chatbotId,
      autoConnect: true, 
      reconnectAttempts: 5,
      timeout: 10000,
    },
    enableRealTime: true, // Re-enable real-time features
    enableSync: true, // Re-enable cross-tab sync
    autoJoinConversations: true, // Re-enable auto-join conversations
  };

  // Use the integrated XState conversation hook
  const conversationState = useXStateConversation(config);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue: ModernConversationContextType = useMemo(() => ({
    ...conversationState,
  }), [conversationState]);

  return (
    <ModernConversationContext.Provider value={contextValue}>
      {children}
    </ModernConversationContext.Provider>
  );
}

/**
 * Hook to access the modern conversation context
 * Provides backward compatibility with the old useConversation hook
 */
export function useModernConversation(): ModernConversationContextType {
  const context = useContext(ModernConversationContext);
  
  if (!context) {
    throw new Error('useModernConversation must be used within ModernConversationProvider');
  }
  
  return context;
}

/**
 * Backward compatibility hook that mimics the old useConversation API
 * This allows existing components to work with minimal changes
 */
export function useConversation() {
  const context = useModernConversation();
  
  // Return the same interface as the old useConversation hook
  return [
    context.state,           // XState machine state
    context.send,            // XState send function  
    context.conversationService, // XState service
  ] as const;
}

/**
 * Enhanced hook that provides access to all modern features
 * while maintaining backward compatibility
 */
export function useConversationFeatures() {
  const context = useModernConversation();
  
  return {
    // Backward compatibility
    state: context.state,
    send: context.send,
    conversationService: context.conversationService,
    
    // Socket connection
    socket: context.socket,
    isConnected: context.isConnected,
    connectionStatus: context.connectionStatus,
    
    // Messages
    messages: context.messages,
    messageHistory: context.messageHistory,
    
    // Real-time features
    typingIndicators: context.typingIndicators,
    presence: context.presence,
    sync: context.sync,
    
    // Conversation management
    selectedConversation: context.selectedConversation,
    conversations: context.conversations,
    filteredConversations: context.filteredConversations,
    
    // Actions
    selectConversation: context.selectConversation,
    sendMessage: context.sendMessage,
    joinConversation: context.joinConversation,
    loadMoreMessages: context.loadMoreMessages,
    
    // Status
    isLoading: context.isLoading,
    hasError: context.hasError,
    error: context.error,
  };
}

/**
 * Hook for accessing socket connection specifically
 */
export function useConversationSocket() {
  const context = useModernConversation();
  
  return {
    socket: context.socket,
    isConnected: context.isConnected,
    connectionStatus: context.connectionStatus,
    emit: context.socket?.emit.bind(context.socket),
  };
}

/**
 * Hook for accessing typing indicators specifically
 */
export function useTypingState() {
  const context = useModernConversation();
  
  return {
    isTyping: context.typingIndicators.isTyping,
    participants: context.typingIndicators.participants,
    getTypingDisplayText: context.typingIndicators.getTypingDisplayText,
    sendTypingEvent: context.typingIndicators.sendTypingEvent,
    handleTypingChange: context.typingIndicators.handleTypingChange,
  };
}

/**
 * Hook for accessing conversation list functionality
 */
export function useConversationList() {
  const context = useModernConversation();
  
  return {
    conversations: context.conversations,
    filteredConversations: context.filteredConversations,
    selectedConversation: context.selectedConversation,
    selectConversation: context.selectConversation,
    isLoading: context.isLoading,
    error: context.error,
  };
}

export default ModernConversationProvider;
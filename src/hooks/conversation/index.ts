// Core infrastructure hooks
export * from './core';

// Message management hooks
export * from './messages';

// Real-time feature hooks
export * from './realtime';

// Conversation management hooks
// export * from './conversation';

// UI state hooks
export * from './ui';

// Integration hooks
export { useXStateConversation } from './integration/useXStateConversation';
export type { 
  XStateConversationConfig, 
  UseXStateConversationReturn 
} from './integration/useXStateConversation';

// Convenience re-exports for common combinations
export {
  useSocket
  // useSocketEvents, useConnectionStatus
} from './core';
export { useMessages, useMessageHistory
  // useOptimisticMessages, useMessageStreaming
} from './messages';
export { 
  // useTypingIndicators, usePresence,
   useConversationSync } from './realtime';
// export { useConversation, useConversationList, useConversationActions } from './conversation';
export {
  // useMessageInput, useMessageSearch,
  useConversationUI
} from './ui';
# Conversation Hooks Architecture

A comprehensive, hook-based architecture for managing real-time conversations with clean separation of concerns and excellent TypeScript support.

## Overview

This refactored conversation system replaces the monolithic `ConversationProvider` with a modular, composable hook-based approach that follows React best practices and provides better testability, reusability, and maintainability.

## Architecture

```
src/hooks/conversation/
├── core/                 # Socket management and connection
├── messages/            # Message handling and history
├── realtime/           # Real-time features (typing, presence)
├── conversation/       # Conversation management
├── ui/                 # UI state and preferences
├── integration/        # XState integration
└── examples/          # Usage examples
```

## Core Features

### ✅ **Completed Features**

- **🔌 Socket Management**: Unified socket connection with authentication and retry logic
- **💬 Message Handling**: CRUD operations, optimistic updates, and streaming
- **📜 Message History**: Pagination and infinite scroll
- **⌨️ Typing Indicators**: Multi-participant typing with debouncing
- **👥 Presence Management**: Online/offline status and heartbeat
- **🔄 Cross-tab Sync**: Synchronization across browser tabs
- **🎨 UI State Management**: Preferences, layout, and scroll state
- **🔍 Message Search**: Full-text search with highlighting and filtering
- **⚙️ XState Integration**: Backward compatibility with existing machine

## Quick Start

### Basic Usage

```tsx
import { useSocket, useMessages, useTypingIndicators } from '@/hooks/conversation';

function ChatComponent() {
  // Socket connection
  const { socket, isConnected } = useSocket({
    tenantId: 'your-tenant',
    chatbotId: 'your-chatbot',
  });

  // Message management
  const messages = useMessages({
    conversationId: 'conv-123',
    socket,
    isConnected,
  });

  // Typing indicators
  const typing = useTypingIndicators({
    socket,
    conversationId: 'conv-123',
  });

  return (
    <div>
      {/* Messages */}
      {messages.messages.map(msg => (
        <div key={msg._id}>{msg.content}</div>
      ))}
      
      {/* Typing indicator */}
      {typing.isTyping && <div>{typing.getTypingDisplayText()}</div>}
      
      {/* Input */}
      <input 
        onChange={(e) => typing.handleTypingChange(e.target.value.length > 0)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            messages.sendMessage(e.target.value);
          }
        }}
      />
    </div>
  );
}
```

### Advanced Usage with XState Integration

```tsx
import { useXStateConversation } from '@/hooks/conversation';

function AdvancedChat() {
  const conversation = useXStateConversation({
    tenantId: 'your-tenant',
    chatbotId: 'your-chatbot',
    enableRealTime: true,
    enableSync: true,
  });

  // All functionality in one integrated hook
  return (
    <div>
      <div className="messages">
        {conversation.messages.messages.map(msg => (
          <div key={msg._id}>{msg.content}</div>
        ))}
      </div>
      
      <input 
        onChange={(e) => conversation.typingIndicators.handleTypingChange(e.target.value.length > 0)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            conversation.sendMessage(e.target.value);
          }
        }}
      />
    </div>
  );
}
```

## Hook Categories

### 🔌 Core Infrastructure

#### `useSocket(config)`
Manages WebSocket connections with authentication and retry logic.

```tsx
const { socket, isConnected, reconnect, emit } = useSocket({
  tenantId: 'tenant-123',
  chatbotId: 'chatbot-456',
  autoConnect: true,
});
```

#### `useConnectionStatus(socket)`
Monitors connection health with latency tracking.

```tsx
const { status, latency, getStatusDisplay } = useConnectionStatus({
  socket,
  enableLatencyCheck: true,
});
```

### 💬 Message Management

#### `useMessages(options)`
Core message CRUD operations with optimistic updates.

```tsx
const {
  messages,
  sendMessage,
  addMessage,
  canSendMessage,
  messageCount,
} = useMessages({
  conversationId: 'conv-123',
  socket,
  isConnected,
});
```

#### `useMessageHistory(options)`
Handles message pagination and infinite scroll.

```tsx
const {
  loadMoreMessages,
  hasMoreMessages,
  loading,
} = useMessageHistory({
  conversationId: 'conv-123',
  pageSize: 50,
});
```

#### `useOptimisticMessages()`
Manages temporary message states before server confirmation.

```tsx
const {
  addOptimisticMessage,
  confirmMessage,
  getPendingMessages,
} = useOptimisticMessages({
  timeout: 30000,
  maxRetries: 3,
});
```

#### `useMessageStreaming(options)`
Handles real-time AI response streaming.

```tsx
const {
  startStream,
  appendToStream,
  completeStream,
  isStreaming,
} = useMessageStreaming({
  socket,
  conversationId: 'conv-123',
});
```

### ⚡ Real-time Features

#### `useTypingIndicators(options)`
Multi-participant typing indicators with debouncing.

```tsx
const {
  isTyping,
  participants,
  startTyping,
  stopTyping,
  getTypingDisplayText,
} = useTypingIndicators({
  socket,
  conversationId: 'conv-123',
});
```

#### `usePresence(options)`
Online/offline status management with heartbeat.

```tsx
const {
  users,
  onlineCount,
  joinPresence,
  getOnlineUsers,
} = usePresence({
  socket,
  conversationId: 'conv-123',
  enableHeartbeat: true,
});
```

#### `useConversationSync(options)`
Cross-tab synchronization for consistent state.

```tsx
const {
  syncMessage,
  syncConversation,
  isEnabled,
} = useConversationSync({
  conversationId: 'conv-123',
  onMessageSync: handleMessageSync,
});
```

### 🗂️ Conversation Management

#### `useConversation(options)`
Single conversation management with real-time updates.

```tsx
const {
  conversation,
  loadConversation,
  updateConversation,
  escalateConversation,
  participants,
} = useConversation({
  conversationId: 'conv-123',
  socket,
  isConnected,
});
```

#### `useConversationList(options)`
Conversation list with filtering and search.

```tsx
const {
  conversations,
  setSearchQuery,
  setFilters,
  getStats,
  markAsRead,
} = useConversationList({
  socket,
  isConnected,
  tenantId: 'tenant-123',
});
```

#### `useConversationActions(options)`
Conversation actions like join, escalate, assign agents.

```tsx
const {
  joinConversation,
  escalateConversation,
  assignAgent,
  isActionLoading,
} = useConversationActions({
  socket,
  isConnected,
});
```

### 🎨 UI State Management

#### `useMessageInput(options)`
Input state with validation and typing events.

```tsx
const {
  value,
  setValue,
  submit,
  canSubmit,
  handleInputChange,
  handleKeyDown,
} = useMessageInput({
  onSubmit: sendMessage,
  onTypingChange: handleTyping,
  maxLength: 1000,
});
```

#### `useMessageSearch(options)`
Full-text message search with highlighting.

```tsx
const {
  search,
  results,
  highlightText,
  goToNext,
  setFilters,
} = useMessageSearch({
  messages,
  onNavigate: scrollToMessage,
});
```

#### `useConversationUI(options)`
UI preferences and layout management.

```tsx
const {
  preferences,
  layout,
  updatePreferences,
  toggleSidebar,
  scrollToBottom,
} = useConversationUI({
  enablePersistence: true,
});
```

## Migration Guide

### From ConversationProvider

**Old Pattern:**
```tsx
// Old monolithic provider
<ConversationProvider>
  <ChatInterface />
</ConversationProvider>
```

**New Pattern:**
```tsx
// Composable hooks
function ChatInterface() {
  const conversation = useXStateConversation({
    tenantId: 'tenant-123',
    chatbotId: 'chatbot-456',
  });
  
  // Use conversation.messages, conversation.typing, etc.
}
```

### Key Benefits of Migration

1. **Better Performance**: Granular re-rendering instead of entire provider updates
2. **Improved Testing**: Individual hooks can be tested in isolation
3. **Enhanced Reusability**: Hooks can be composed in different ways
4. **Type Safety**: Better TypeScript support with focused interfaces
5. **Easier Debugging**: Clear separation of concerns

## Performance Optimizations

### Implemented Optimizations

- **React.memo**: Prevent unnecessary re-renders in typing indicators
- **useCallback/useMemo**: Optimize function and object references
- **Debouncing**: Reduce API calls for typing events
- **Virtual Scrolling**: Handle large message lists efficiently
- **Connection Pooling**: Reuse socket connections across components

### Best Practices

1. **Use appropriate hooks**: Don't use `useConversationList` if you only need single conversation
2. **Memoize callbacks**: Use `useCallback` for event handlers passed to hooks
3. **Batch updates**: Group related state changes together
4. **Lazy loading**: Load message history on demand
5. **Cleanup**: Hooks automatically handle cleanup, but be mindful of custom effects

## Testing

### Unit Testing Individual Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useMessages } from '@/hooks/conversation';

test('useMessages should send message', async () => {
  const { result } = renderHook(() => useMessages({
    conversationId: 'test-conv',
    socket: mockSocket,
    isConnected: true,
  }));

  await act(async () => {
    const success = await result.current.sendMessage('Hello');
    expect(success).toBe(true);
  });
});
```

### Integration Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ConversationComponent } from './ConversationComponent';

test('conversation component should display messages', () => {
  render(<ConversationComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Contributing

When adding new hooks:

1. **Follow naming conventions**: `use[Feature][Aspect]` (e.g., `useMessageSearch`)
2. **Include TypeScript types**: Export interfaces for options and return values
3. **Add JSDoc comments**: Document parameters and return values
4. **Write tests**: Include unit tests for new functionality
5. **Update examples**: Add usage examples to the examples directory

## Troubleshooting

### Common Issues

**Socket not connecting:**
- Check `tenantId` and `chatbotId` are correct
- Verify authentication token is valid
- Check network connectivity

**Messages not syncing:**
- Ensure `conversationId` is consistent across hooks
- Check if `enableSync` is set to true
- Verify socket events are being emitted correctly

**Performance issues:**
- Use `React.memo` for message components
- Implement virtual scrolling for large message lists
- Check for unnecessary re-renders in DevTools

### Debug Tools

Enable debug logging:
```tsx
// Enable debug mode in development
const conversation = useXStateConversation({
  tenantId: 'tenant-123',
  chatbotId: 'chatbot-456',
  debug: process.env.NODE_ENV === 'development',
});
```

## Future Enhancements

- [ ] Voice message support
- [ ] File upload handling
- [ ] Message reactions
- [ ] Thread support
- [ ] AI assistant integration
- [ ] Analytics hooks
- [ ] Accessibility improvements
- [ ] Performance monitoring

---

For more examples and detailed API documentation, see the `examples/` directory and individual hook files.
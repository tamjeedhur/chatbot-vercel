# 📡 Socket Events & Payloads Documentation

This document provides a comprehensive list of all socket events and their expected payloads for the Chatbot Backend system.

## 🔌 Connection Events

### **Server → Client Events**

#### `connected`
**Purpose**: Welcome message sent when client successfully connects
```typescript
{
  message: string;           // "Connected to AI Support WebSocket"
  userId: string;
  tenantId: string;
  timestamp: Date;
}
```

#### `error`
**Purpose**: Error notifications sent to client
```typescript
{
  message: string;           // Error description
  code: string;             // Error code (e.g., 'AUTH_ERROR', 'WIDGET_VALIDATION_ERROR')
  details?: string;         // Additional error details
  conversationId?: string;  // Optional conversation context
}
```

#### `pong`
**Purpose**: Response to ping for connectivity testing
```typescript
{
  timestamp: Date;
}
```

---

## 💬 Conversation Events

### **Client → Server Events**

#### `join-conversation`
**Purpose**: Join a specific conversation
```typescript
{
  sessionId: string;        // Required session identifier
  conversationId?: string;  // Optional existing conversation ID
}
```

#### `send-message`
**Purpose**: Send a message in a conversation
```typescript
{
  content: string;          // Message content
  conversationId: string;   // Target conversation
}
```

#### `typing`
**Purpose**: Send typing indicator
```typescript
{
  conversationId: string;   // Target conversation
  isTyping: boolean;        // Typing state
}
```

#### `escalate`
**Purpose**: Escalate conversation to human agent
```typescript
{
  conversationId: string;   // Target conversation
  reason?: string;          // Optional escalation reason
}
```

#### `end-conversation`
**Purpose**: End a conversation
```typescript
{
  conversationId: string;   // Target conversation
}
```

#### `rate`
**Purpose**: Rate a conversation
```typescript
{
  conversationId: string;   // Target conversation
  rating: 'good' | 'bad';   // Rating value
  comment?: string;         // Optional rating comment
}
```

### **Server → Client Events**

#### `conversation-started`
**Purpose**: Notify when conversation is created/started
```typescript
{
  conversationId: string;
  messages: IMessage[];     // Initial messages
  status: ConversationStatus;
  sessionId: string;
}
```

#### `message`
**Purpose**: New message received
```typescript
{
  message: IMessage;        // Message object
  conversationId: string;   // Source conversation
}
```

#### `typing`
**Purpose**: Typing indicator from other participants
```typescript
{
  sender: 'user' | 'ai' | 'agent' | 'system';
  senderName?: string;
  isTyping: boolean;
  conversationId: string;
}
```

#### `status-change`
**Purpose**: Conversation status changed
```typescript
{
  status: ConversationStatus;
  conversationId: string;
  agentName?: string;       // If assigned to agent
  agentId?: string;         // Agent identifier
}
```

#### `queue-update`
**Purpose**: Queue position update
```typescript
{
  position: number;         // Queue position
  estimatedWait: number;    // Estimated wait time in seconds
  conversationId: string;
}
```

#### `agent-joined`
**Purpose**: Agent joined the conversation
```typescript
{
  agentName: string;
  agentId: string;
  conversationId: string;
}
```

#### `conversation-ended`
**Purpose**: Conversation ended
```typescript
{
  conversationId: string;
  reason: 'user_ended' | 'agent_ended' | 'timeout' | 'resolved';
}
```

---

## 🧠 AI & Knowledge Base Events

### **Client → Server Events**

#### `join-knowledge-room`
**Purpose**: Join knowledge base room for RAG operations
```typescript
{
  tenantId: string;         // Tenant identifier
}
```

#### `search-knowledge`
**Purpose**: Search knowledge base
```typescript
{
  query: string;            // Search query
  category?: string;        // Optional category filter
  tags?: string[];          // Optional tag filters
}
```

#### `request-rag-response`
**Purpose**: Request RAG-based response
```typescript
{
  query: string;            // Query for RAG
  context?: any;            // Optional context
}
```

#### `request-rag-response-stream`
**Purpose**: Request streaming RAG response
```typescript
{
  query: string;            // Query for RAG
  context?: any;            // Optional context
}
```

#### `request-ai-analysis`
**Purpose**: Request AI analysis of message
```typescript
{
  message: string;          // Message to analyze
  analysisType: 'intent' | 'sentiment' | 'pii' | 'language';
}
```

#### `request-conversation-summary`
**Purpose**: Request conversation summary
```typescript
// No payload required
```

### **Server → Client Events**

#### `knowledge-room-joined`
**Purpose**: Confirmation of joining knowledge room
```typescript
{
  tenantId: string;
}
```

#### `knowledge-search-results`
**Purpose**: Knowledge search results
```typescript
{
  query: string;            // Original query
  results: any[];           // Search results
  totalResults: number;     // Total result count
}
```

#### `rag-response`
**Purpose**: RAG response
```typescript
{
  query: string;            // Original query
  response: string;         // RAG response
}
```

#### `ai-analysis-result`
**Purpose**: AI analysis result
```typescript
{
  analysisType: string;     // Type of analysis performed
  result: any;              // Analysis result
  confidence?: number;      // Confidence score
}
```

#### `conversation-summary`
**Purpose**: Conversation summary
```typescript
{
  summary: string;          // Generated summary
  keyPoints: string[];      // Key conversation points
  sentiment: string;        // Overall sentiment
}
```

---

## 📋 Conversation Management Events

### **Client → Server Events**

#### `join-conversation-list`
**Purpose**: Join conversation list room
```typescript
{
  tenantId: string;         // Tenant identifier
}
```

#### `request-conversation-list`
**Purpose**: Request conversation list
```typescript
{
  page?: number;            // Page number for pagination
  limit?: number;           // Items per page
  status?: ConversationStatus; // Filter by status
  agentId?: string;         // Filter by agent
  startDate?: string;       // Filter by date range
  endDate?: string;         // Filter by date range
}
```

#### `update-conversation-metadata`
**Purpose**: Update conversation metadata
```typescript
{
  metadata: Record<string, any>; // Metadata to update
}
```

### **Server → Client Events**

#### `joined-conversation-list`
**Purpose**: Confirmation of joining conversation list
```typescript
{
  tenantId: string;
}
```

#### `conversation-list`
**Purpose**: Conversation list data
```typescript
{
  success: boolean;
  data: {
    conversations: IConversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  timestamp: Date;
}
```

---

## 🔔 Notification Events

### **Client → Server Events**

#### `join-org`
**Purpose**: Join organization notification room
```typescript
{
  orgId: string;            // Organization ID
  userId?: string;          // Optional user ID
}
```

#### `leave-org`
**Purpose**: Leave organization notification room
```typescript
{
  orgId: string;            // Organization ID
}
```

### **Server → Client Events**

#### `org-joined`
**Purpose**: Confirmation of joining organization
```typescript
{
  orgId: string;
  roomName: string;         // Room name joined
  timestamp: Date;
}
```

#### `org-left`
**Purpose**: Confirmation of leaving organization
```typescript
{
  orgId: string;
  timestamp: Date;
}
```

#### `notification`
**Purpose**: General notification
```typescript
{
  type: string;             // Notification type
  title: string;            // Notification title
  message: string;          // Notification message
  data?: any;               // Additional data
  timestamp: Date;
}
```

---

## 📊 Analytics & Tracking Events

### **Client → Server Events**

#### `track-activity`
**Purpose**: Track user activity
```typescript
{
  activity: string;         // Activity type
  data?: any;               // Optional activity data
}
```

#### `subscribe-dashboard`
**Purpose**: Subscribe to dashboard updates
```typescript
{
  dashboardId: string;      // Dashboard identifier
}
```

#### `page-view`
**Purpose**: Track page view
```typescript
{
  page: string;             // Page URL/path
  referrer?: string;        // Optional referrer
}
```

### **Server → Client Events**

#### `dashboard-subscribed`
**Purpose**: Confirmation of dashboard subscription
```typescript
{
  dashboardId: string;
  timestamp: Date;
}
```

---

## 🔧 Utility Events

### **Client → Server Events**

#### `ping`
**Purpose**: Test connectivity
```typescript
// No payload required
```

#### `disconnect`
**Purpose**: Handle disconnection
```typescript
// No payload required
```

#### `error`
**Purpose**: Handle client-side errors
```typescript
{
  error: Error;             // Error object
}
```

---

## 📝 Common Interfaces

### Message Interface
All messages use this common interface:

```typescript
interface IMessage {
  messageId: string;
  conversationId: string;
  userId?: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  senderName?: string;
  content: string;
  timestamp: Date;
  color?: string;           // For visual differentiation
  metadata?: {
    aiConfidence?: number;
    intent?: string;
  };
  status: {
    sent: boolean;
    delivered: boolean;
    read?: boolean;
  };
}
```

### Conversation Interface
```typescript
interface IConversation {
  conversationId: string;
  tenantId: string;
  chatbotId?: string;
  sessionId: string;
  userId?: string;
  status: ConversationStatus;
  assignedAgentId?: string;
  messages: IMessage[];
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer?: string;
  };
  timestamps: {
    created: Date;
    lastActivity: Date;
    queuedAt?: Date;
    agentAssignedAt?: Date;
    endedAt?: Date;
  };
  metrics: {
    messageCount: number;
    aiMessageCount: number;
    agentMessageCount: number;
    queueTimeSeconds?: number;
    handleTimeSeconds?: number;
  };
  rating?: 'good' | 'bad';
  ratingComment?: string;
}
```

### Conversation Status Types
```typescript
type ConversationStatus = 'new' | 'active' | 'ai' | 'queued' | 'agent' | 'escalated' | 'ended' | 'closed';
```

### Message Sender Types
```typescript
type MessageSender = 'user' | 'ai' | 'agent' | 'system';
```

### Rating Types
```typescript
type ConversationRating = 'good' | 'bad';
```

---

## 🎯 Authentication

All socket connections require authentication via:

### JWT Token Authentication
```typescript
// For authenticated users
socket.handshake.auth.token = 'your-jwt-token';
// OR
socket.handshake.headers.authorization = 'Bearer your-jwt-token';
```

### Widget Key Authentication
```typescript
// For anonymous widget users
socket.handshake.auth = {
  widgetKey: 'your-widget-key',
  chatbotId: 'your-chatbot-id'
};
```

---

## 🚀 Usage Examples

### Basic Connection
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token' // For authenticated users
    // OR
    // widgetKey: 'your-widget-key',
    // chatbotId: 'your-chatbot-id'
  }
});

// Listen for connection confirmation
socket.on('connected', (data) => {
  console.log('Connected:', data);
});

// Listen for errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

### Join Conversation
```javascript
// Join a conversation
socket.emit('join-conversation', {
  sessionId: 'session-123',
  conversationId: 'conv-456' // Optional
});

// Listen for conversation started
socket.on('conversation-started', (data) => {
  console.log('Conversation started:', data);
});
```

### Send Message
```javascript
// Send a message
socket.emit('send-message', {
  content: 'Hello, I need help!',
  conversationId: 'conv-456'
});

// Listen for new messages
socket.on('message', (data) => {
  console.log('New message:', data.message);
});
```

### Typing Indicator
```javascript
// Send typing indicator
socket.emit('typing', {
  conversationId: 'conv-456',
  isTyping: true
});

// Listen for typing indicators
socket.on('typing', (data) => {
  console.log(`${data.senderName} is typing:`, data.isTyping);
});
```

### AI Analysis
```javascript
// Request AI analysis
socket.emit('request-ai-analysis', {
  message: 'I am frustrated with this service',
  analysisType: 'sentiment'
});

// Listen for analysis results
socket.on('ai-analysis-result', (data) => {
  console.log('Analysis result:', data);
});
```

### Knowledge Base Search
```javascript
// Join knowledge room
socket.emit('join-knowledge-room', {
  tenantId: 'tenant-123'
});

// Search knowledge base
socket.emit('search-knowledge', {
  query: 'How to reset password?',
  category: 'support',
  tags: ['password', 'reset']
});

// Listen for search results
socket.on('knowledge-search-results', (data) => {
  console.log('Search results:', data.results);
});
```

---

## 📋 Event Summary

### Total Events: 35

**Client → Server Events (18):**
- `join-conversation`
- `send-message`
- `typing`
- `escalate`
- `end-conversation`
- `rate`
- `join-knowledge-room`
- `search-knowledge`
- `request-rag-response`
- `request-rag-response-stream`
- `request-ai-analysis`
- `request-conversation-summary`
- `join-conversation-list`
- `request-conversation-list`
- `update-conversation-metadata`
- `join-org`
- `leave-org`
- `track-activity`
- `subscribe-dashboard`
- `page-view`
- `ping`
- `disconnect`
- `error`

**Server → Client Events (17):**
- `connected`
- `error`
- `pong`
- `conversation-started`
- `message`
- `typing`
- `status-change`
- `queue-update`
- `agent-joined`
- `conversation-ended`
- `knowledge-room-joined`
- `knowledge-search-results`
- `rag-response`
- `ai-analysis-result`
- `conversation-summary`
- `joined-conversation-list`
- `conversation-list`
- `org-joined`
- `org-left`
- `notification`
- `dashboard-subscribed`

---

## 🔧 Error Codes

Common error codes you might encounter:

- `AUTH_ERROR` - Authentication failed
- `WIDGET_VALIDATION_ERROR` - Widget validation failed
- `NO_AUTH` - No authentication provided
- `JOIN_KNOWLEDGE_ERROR` - Failed to join knowledge room
- `JOIN_ORG_FAILED` - Failed to join organization room

---

*This documentation covers all socket events available in the Chatbot Backend system as of the current implementation.*

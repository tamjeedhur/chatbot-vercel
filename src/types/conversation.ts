// Data models matching the PRD specifications

export interface Conversation {
  _id: string;
  conversationId: string;
  tenantId: string;
  chatbotId: string;
  sessionId: string;
  userId: string;
  status: 'active' | 'queued' | 'resolved' | 'closed';
  assignedAgentId?: string;
  messages: Message[];
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer?: string;
  };
  timestamps: {
    created: string;
    lastActivity: string;
    queuedAt?: string;
    agentAssignedAt?: string;
    endedAt?: string;
  };
  metrics: {
    messageCount: number;
    aiMessageCount: number;
    agentMessageCount: number;
    queueTimeSeconds?: number;
    handleTimeSeconds?: number;
  };
  rating?: number;
  ratingComment?: string;
}

export interface Message {
  _id: string;
  messageId: string;
  conversationId: string;
  sender: 'user' | 'ai' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
  color: string;
  metadata: {
    aiConfidence?: number;
    intent?: string;
  };
  status: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
}

export interface ConversationListResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MessageListResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface RoomResponse {
  success: boolean;
  data: {
    id: string;
    names: string[];
    conversationId: string;
  };
}

// Legacy User interface for backward compatibility
export interface User {
  _id: string;
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
  // Add conversationId for compatibility
  conversationId?: string;
}

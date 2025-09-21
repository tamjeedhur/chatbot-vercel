export interface Message {
  type: 'user' | 'bot' | 'agent' | 'system';
  text: string;
  time: string;
  // Enhanced message properties
  _id?: string;
  messageId?: string;
  conversationId?: string;
  sender?: 'user' | 'ai' | 'agent' | 'system';
  senderName?: string;
  content?: string;
  timestamp?: string;
  color?: string;
  status?: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
  isOptimistic?: boolean; // For optimistic updates
  isStreaming?: boolean; // For AI streaming responses
}

export interface Conversation {
  _id: string;
  conversationId?: string;
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
  // Enhanced conversation properties
  status?: 'active' | 'queued' | 'ended' | 'escalated';
  participants?: {
    id: string;
    name: string;
    type: 'user' | 'ai' | 'agent' | 'system';
    avatar?: string;
    isOnline?: boolean;
  }[];
  queuePosition?: number;
  estimatedWait?: number;
}

export interface TypingState {
  isTyping: boolean;
  participants: {
    id: string;
    name: string;
    type: 'user' | 'ai' | 'agent';
  }[];
  lastActivity: number;
}

export interface ConversationStatus {
  status: 'active' | 'queued' | 'ended' | 'escalated';
  agentName?: string;
  agentId?: string;
  queuePosition?: number;
  estimatedWait?: number;
} 
// Type for JSON-serializable data
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: Date;
  sender?: 'user' | 'ai' | 'agent';
  conversationId?: string;
  reasoning?: string;
  isClientOriginated?: boolean; // Flag to identify client-originated messages
  isStreaming?: boolean; // Flag to indicate if message is currently streaming
  tools?: Array<{
    type: string;
    state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
    name: string;
    input?: JsonValue;
    output?: JsonValue;
  }>;
}

export interface TypingState {
  isTyping: boolean;
  sender?: string;
  agentName?: string;
}

export interface ConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  conversationId: string | null;
  agentPresent: boolean;
  queuePosition?: number;
}

export interface ChatbotData {
  id: string;
  name: string;
  status: string;
  key: string;
  widget: {
    enabled: boolean;
    widgetKey: string;
    allowAnonymous: boolean;
    allowedOrigins: string[];
    autoShowDelay: number;
    aiChatEnabled: boolean;
    keyExpiry: string;
    keyPermissions: string[];
    keyUsageCount: number;
    lastKeyGenerated: string;
  };
}

export interface ChatbotConfig {
  ui: {
    theme: string;
    primaryColor: string;
    botColor: string;
    position: string;
    customCss: string;
    displayName: string;
    messagePlaceholder: string;
    suggestedMessages: string[];
    botMessage: string;
    logoUrl: string;
    welcomeMessage: string;
  };
  settings: {
    welcomeMessage: string;
    aiChat: boolean;
    popupMessage: {
      message: string;
      status: boolean;
    };
    fallbackResponse: {
      message: string;
      status: boolean;
    };
    maxMessagesPerConversation: number;
    collectFeedback: boolean;
    allowRegenerate: boolean;
    workingHours: {
      schedule: any[];
    };
  };
  model: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    topK: number;
  };
  tools: any[];
  escalationThreshold: number;
  behaviorPolicies: {
    bannedTopics: string[];
    requiredDisclaimers: string[];
    politenessLevel: string;
  };
  routing: {
    escalationEnabled: boolean;
    strategy: string;
    defaultPriority: string;
  };
  widget: {
    enabled: boolean;
    allowAnonymous: boolean;
    allowedOrigins: string[];
    autoShowDelay: number;
    aiChatEnabled: boolean;
    keyPermissions: string[];
  };
  defaults: {
    language: string;
  };
}

export interface ChatbotComponentProps {
  config: {
    chatbot: ChatbotData;
    config: ChatbotConfig;
    socketUrl?: string;
  };
  widgetKey: string;
  chatbotId: string;
}

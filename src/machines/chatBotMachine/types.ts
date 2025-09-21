// New interfaces for the updated chatbot structure
export interface ModelConfig {
  intentModel?: string;
  responseModel?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface BehaviorPolicies {
  bannedTopics?: string[];
  requiredDisclaimers?: string[];
  politenessLevel?: string;
  brandVoice?: string;
}

export interface WorkingHours {
  enabled?: boolean;
  timezone?: string;
  schedule?: Array<{
    day: number;
    start: string;
    end: string;
  }>;
}

export interface ChatbotUI {
  theme?: string;
  primaryColor?: string;
  botColor?: string;
  botMessageColor?: string;
  userMessageColor?: string;
  welcomeMessage?: string;
  logoUrl?: string;
  position?: string;
  customCss?: string;
  displayName?: string;
  messagePlaceholder?: string;
  suggestedMessages?: string[];
}

export interface ChatbotConfig {
  systemPrompt?: string;
  model?: ModelConfig;
  tools?: string[];
  escalationThreshold?: number;
  behaviorPolicies?: BehaviorPolicies;
}

export interface ChatbotRouting {
  escalationEnabled?: boolean;
  strategy?: string;
  defaultPriority?: string;
}

export interface ChatbotWidget {
  enabled?: boolean;
  widgetKey?: string;
  allowAnonymous?: boolean;
  allowedOrigins?: string[];
  autoShowDelay?: number;
  aiChatEnabled?: boolean;
}

export interface ChatbotSettings {
  welcomeMessage?: string;
  aiModel?: string;
  popupMessage?: {
    message: string;
    status: boolean;
  };
  fallbackResponse?: {
    message: string;
    status: boolean;
  };
  aiChat?: boolean;
  maxMessagesPerConversation?: number;
  autoEscalateThreshold?: number;
  collectFeedback?: boolean;
  allowRegenerate?: boolean;
  workingHours?: WorkingHours;
}

export interface ChatbotDefaults {
  leadFormId?: string;
  language?: string;
}

export interface Chatbot {
  _id: string;
  tenantId?: string;
  name?: string;
  key?: string;
  description?: string;
  status?: string;
  ui?: ChatbotUI;
  config?: ChatbotConfig;
  routing?: ChatbotRouting;
  widget?: ChatbotWidget;
  settings?: ChatbotSettings;
  defaults?: ChatbotDefaults;
}
  
  export interface SecurityPreferences {
    twoFactorAuthentication?: boolean;
    IPWhitelisting?: boolean;
    sessionTimeout?: boolean;
    productionAPIKey?: string;
  }
  
  export interface Organization {
    id: string;
    name: string;
    owner: any;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MachineContext {
    tenantId: string | null;
    userId: string | null;
    accessToken: string | null;
    chatbots: Chatbot[] | null;
    defaultChatbots: Chatbot[] | null;
    selectedChatbot: Chatbot | null;
    chatbotData?: Chatbot;
    chatbotResponse?: any;
    chatbotToDelete?: string;
    error: string | null;
    isLoading: boolean;
  }
  export interface NotificationPreferences {
    emailNotifications: {
      newTeamMember: boolean;
      billingUpdates: boolean;
      securityAlerts: boolean;
      weeklyUsageReports: boolean;
    };
    inAppNotifications: {
      realTimeUpdates: boolean;
      soundNotifications: boolean;
    };
  }
  
  // Events
  export type MachineEvents =
    // Chatbot events
    | { type: 'CREATE_CHATBOT'; data: Chatbot }
    | { type: 'SET_SELECTED_CHATBOT'; chatbotId: string }
    | { type: 'SYNC_SELECTED_CHATBOT'; data: Chatbot }
    | { type: 'DELETE_CHATBOT'; chatbotId: string }

    | { type: 'UPDATE_CHATBOT'; data: { chatbotId: string; chatbotData: Chatbot } }
    | { type: 'UPDATE_FIELD'; path: string; value: any; base?: Chatbot }
    | { type: 'UPDATE_FIELD_AND_SAVE'; path: string; value: any; base?: Chatbot }
  
    // Common events
    | { type: 'RETRY'; accessToken?: string }
    | { type: 'RESET' };
  
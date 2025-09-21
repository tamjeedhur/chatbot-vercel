// Integration Types
export interface IntegrationTool {
  name: string;
  description: string;
  status: 'Connected' | 'Disconnected' | 'Pending';
  _id: string;
  icon?: string;
  category?: string;
  configUrl?: string;
  documentationUrl?: string;
  isPopular?: boolean;
  features?: string[];
}

export interface Webhook {
  name: string;
  url: string;
  status: 'Active' | 'Inactive' | 'Error';
  secret: string | null;
  _id: string;
  events?: string[];
  createdAt?: string;
  lastTriggered?: string;
  description?: string;
  headers?: Record<string, string>;
  retryPolicy?: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface IntegrationsData {
  tools: IntegrationTool[];
  webhooks: Webhook[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IntegrationApiResponse extends ApiResponse<IntegrationsData> {}

export interface ToolConnectionResponse extends ApiResponse<IntegrationTool> {}

export interface WebhookResponse extends ApiResponse<Webhook> {}

// Form Types
export interface CreateWebhookFormData {
  name: string;
  url: string;
  description?: string;
  events: string[];
  headers?: Record<string, string>;
}

export interface UpdateWebhookFormData extends Partial<CreateWebhookFormData> {
  _id: string;
}

// Machine Context Types
export interface IntegrationMachineContext {
  chatbotId: string;
  tools: IntegrationTool[];
  webhooks: Webhook[];
  loading: boolean;
  error: string | null;
  serverUrl: string;
  bearerToken: string;
  actionLoading: {
    connectTool: string | null;
    disconnectTool: string | null;
    createWebhook: boolean;
    updateWebhook: string | null;
    deleteWebhook: string | null;
  };
}

// Machine Event Types
export type IntegrationMachineEvents =
  | { type: 'LOAD_INTEGRATIONS' }
  | { type: 'CONNECT_TOOL'; toolId: string }
  | { type: 'DISCONNECT_TOOL'; toolId: string }
  | { type: 'CREATE_WEBHOOK'; webhookData: CreateWebhookFormData }
  | { type: 'UPDATE_WEBHOOK'; webhookId: string; updates: Partial<Webhook> }
  | { type: 'DELETE_WEBHOOK'; webhookId: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REFRESH_DATA' };

// Component Props Types
export interface IntegrationCardProps {
  integration: IntegrationTool;
  onConnect?: (toolId: string) => void;
  onDisconnect?: (toolId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export interface WebhookItemProps {
  webhook: Webhook;
  onEdit?: (webhookId: string) => void;
  onDelete?: (webhookId: string) => void;
  onCopyUrl?: (url: string) => void;
  onTest?: (webhookId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export interface EmptyIntegrationsProps {
  type: 'tools' | 'webhooks';
  onAdd?: () => void;
  className?: string;
}

// Error Types
export interface IntegrationError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export const INTEGRATION_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type IntegrationErrorCode = (typeof INTEGRATION_ERROR_CODES)[keyof typeof INTEGRATION_ERROR_CODES];

// Constants
export const INTEGRATION_CATEGORIES = {
  COMMUNICATION: 'Communication',
  PRODUCTIVITY: 'Productivity',
  DEVELOPMENT: 'Development',
  ANALYTICS: 'Analytics',
  MARKETING: 'Marketing',
  SUPPORT: 'Support',
} as const;

export const WEBHOOK_EVENTS = {
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_SENT: 'message.sent',
  CONVERSATION_STARTED: 'conversation.started',
  CONVERSATION_ENDED: 'conversation.ended',
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  CHATBOT_UPDATED: 'chatbot.updated',
  INTEGRATION_CONNECTED: 'integration.connected',
  INTEGRATION_DISCONNECTED: 'integration.disconnected',
} as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

// Utility Types
export type IntegrationStatus = IntegrationTool['status'];
export type WebhookStatus = Webhook['status'];
export type IntegrationCategory = (typeof INTEGRATION_CATEGORIES)[keyof typeof INTEGRATION_CATEGORIES];

// Chatbot Configuration Types
export interface ChatbotModel {
  intentModel: string;
  responseModel: string;
  temperature: number;
  maxTokens: number;
}

export interface BehaviorPolicies {
  brandVoice: string;
  politenessLevel: 'casual' | 'professional' | 'formal';
  bannedTopics: string[];
  requiredDisclaimers: string[];
}

export interface FallbackResponse {
  message: string;
  status: boolean;
}

export interface PopupMessage {
  message: string;
  status: boolean;
}

export interface WorkingDay {
  day: number;
  start: string;
  end: string;
}

export interface WorkingHours {
  enabled: boolean;
  timezone: string;
  schedule: WorkingDay[];
}

export interface WidgetSettings {
  enabled: boolean;
  autoShowDelay: number;
  aiChatEnabled: boolean;
  allowedOrigins: string[];
}

export interface RoutingSettings {
  escalationEnabled: boolean;
  strategy: 'round_robin' | 'least_busy' | 'skills_based' | 'priority';
  defaultPriority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ChatbotSettings {
  welcomeMessage: string;
  maxMessagesPerConversation: number;
  fallbackResponse: FallbackResponse;
  popupMessage: PopupMessage;
  workingHours: WorkingHours;
  collectFeedback: boolean;
  allowRegenerate: boolean;
}

export interface ChatbotConfig {
  systemPrompt: string;
  model: ChatbotModel;
  behaviorPolicies: BehaviorPolicies;
  escalationThreshold: number;
  tools: string[];
}

export interface Chatbot {
  _id: string;
  key: string;
  name: string;
  status?: string;
  config: ChatbotConfig;
  settings: ChatbotSettings;
  widget: WidgetSettings;
  routing: RoutingSettings;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Configuration Machine Types
export interface ChatbotConfigurationContext {
  selectedChatbot: Chatbot | null;
  serverUrl: string;
  accessToken: string;
  hasUnsavedChanges: boolean;
  activeTab: string;
  showPreview: boolean;
  copiedField: string | null;
  editingSystemPrompt: boolean;
  editingWelcomeMessage: boolean;
  tempSystemPrompt: string;
  tempWelcomeMessage: string;
  newBannedTopic: string;
  newDisclaimer: string;
  newBrandVoice: string;
  error: string | null;
  isLoading: boolean;
}

export type ChatbotConfigurationEvent =
  | { type: 'UPDATE_FIELD'; path: string; value: any }
  | { type: 'SET_ACTIVE_TAB'; tab: string }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'COPY_TO_CLIPBOARD'; text: string; fieldName: string }
  | { type: 'START_EDITING_SYSTEM_PROMPT' }
  | { type: 'CANCEL_EDITING_SYSTEM_PROMPT' }
  | { type: 'SAVE_SYSTEM_PROMPT' }
  | { type: 'START_EDITING_WELCOME_MESSAGE' }
  | { type: 'CANCEL_EDITING_WELCOME_MESSAGE' }
  | { type: 'SAVE_WELCOME_MESSAGE' }
  | { type: 'ADD_BANNED_TOPIC' }
  | { type: 'REMOVE_BANNED_TOPIC'; topic: string }
  | { type: 'ADD_DISCLAIMER' }
  | { type: 'REMOVE_DISCLAIMER'; disclaimer: string }
  | { type: 'ADD_BRAND_VOICE' }
  | { type: 'REMOVE_BRAND_VOICE' }
  | { type: 'SAVE_CONFIGURATION' }
  | { type: 'RESET_CONFIGURATION' }
  | { type: 'SET_TEMP_SYSTEM_PROMPT'; value: string }
  | { type: 'SET_TEMP_WELCOME_MESSAGE'; value: string }
  | { type: 'SET_NEW_BANNED_TOPIC'; value: string }
  | { type: 'SET_NEW_DISCLAIMER'; value: string }
  | { type: 'SET_NEW_BRAND_VOICE'; value: string }
  | { type: 'CHATBOT_UPDATED'; chatbot: Chatbot }
  | { type: 'NOTIFY_PARENT_UPDATE'; onChatbotUpdate?: (chatbot: Chatbot) => void };

// Component Props Types
export interface EditableTextAreaProps {
  value: string;
  onSave: (value: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface DynamicListManagerProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
  label?: string;
  addButtonText?: string;
  itemClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
}

export interface ToolSelectorProps {
  selectedTools: string[];
  onToolToggle: (tool: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface WorkingHoursEditorProps {
  schedule: WorkingDay[];
  onScheduleChange: (schedule: WorkingDay[]) => void;
  disabled?: boolean;
  className?: string;
}

export interface ConfigurationHeaderProps {
  title: string;
  description: string;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  showPreview: boolean;
  onSave: () => void;
  onReset: () => void;
  onTogglePreview: () => void;
  className?: string;
}

export interface ConfigurationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export interface TabComponentProps {
  selectedChatbot: Chatbot | null;
  onFieldChange: (path: string, value: any) => void;
  disabled?: boolean;
}

export interface GeneralSettingsTabProps extends TabComponentProps {
  copiedField: string | null;
  onCopyToClipboard: (text: string, fieldName: string) => void;
}

export interface BehaviorSettingsTabProps extends TabComponentProps {
  newBrandVoice: string;
  onNewBrandVoiceChange: (value: string) => void;
  onAddBrandVoice: () => void;
  onRemoveBrandVoice: () => void;
}

export interface ToolsSettingsTabProps extends TabComponentProps {}

export interface WorkingHoursTabProps extends TabComponentProps {}

export interface ChatbotConfigurationFormProps {
  selectedChatbot: Chatbot | null;
  serverUrl: string;
  accessToken: string;
  onChatbotUpdate?: (chatbot: Chatbot) => void;
}

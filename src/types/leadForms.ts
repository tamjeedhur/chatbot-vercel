// Backend API Types
export interface BackendLeadForm {
  _id: string;
  tenantId: string;
  chatbotId?: string;
  name: string;
  description?: string;
  fields: BackendFormField[];
  active: boolean;
  version: number;
  trigger: {
    condition: 'keywords' | 'always' | 'after_time';
    keywords?: string[];
    timeDelay?: number;
    priority?: number;
  };
  fieldsDisplay: 'all-at-once' | 'one-by-one';
  settings?: {
    title?: string;
    successMessage?: string;
    redirectUrl?: string;
    notificationEmail?: string;
    autoResponse?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BackendFormField {
  id?: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'hidden';
  required?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    regex?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface BackendLeadFormPayload {
  name: string;
  description?: string;
  chatbotId?: string;
  trigger: {
    condition: 'keywords' | 'always' | 'after_time';
    keywords?: string[];
    timeDelay?: number;
    priority?: number;
  };
  fieldsDisplay: 'all-at-once' | 'one-by-one';
  fields: BackendFormField[];
  settings?: {
    title?: string;
    successMessage?: string;
    redirectUrl?: string;
    notificationEmail?: string;
    autoResponse?: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// XState Machine Types
export interface LeadFormsContext {
  savedLogics: LeadFormConfig[];
  currentConfig: Omit<LeadFormConfig, 'id' | 'createdAt'>;
  editingLogicId: string | null;
  deletingLogicId: string | null;
  validationError: string | null;
  showCreateForm: boolean;
  status: 'idle' | 'loading' | 'creating' | 'updating' | 'deleting' | 'triggeringLeadForm' | 'submittingLeadForm' | 'success' | 'error';
  error: string | null;
  fieldErrors: Record<string, string[]>; // Field-specific validation errors
  serverUrl: string;
  accessToken: string;
  chatbotId: string;
  triggeredForm: LeadFormConfig | null;
}

export type LeadFormsEvent = 
  | { type: 'LOAD_FORMS' }
  | { type: 'CREATE_FORM'; config: Omit<LeadFormConfig, 'id' | 'createdAt'> }
  | { type: 'UPDATE_FORM'; id: string; config: Partial<LeadFormConfig> }
  | { type: 'DELETE_FORM'; id: string }
  | { type: 'SET_EDITING'; id: string | null }
  | { type: 'SET_CONFIG'; config: Partial<Omit<LeadFormConfig, 'id' | 'createdAt'>> }
  | { type: 'TRIGGER_LEAD_FORM'; formId: string; context?: Record<string, any> }
  | { type: 'SUBMIT_LEAD_FORM'; formId: string; data: Record<string, any>; metadata?: Record<string, any> }
  | { type: 'RESET_FORM' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_FIELD_ERRORS' }
  | { type: 'SHOW_CREATE_FORM' };

// Update existing interfaces to match backend schema
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  autoFocus?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
}

export interface LeadFormConfig {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  fields: FormField[];
  collectCondition: 'keywords' | 'always' | 'after_time';
  timeDelay?: number;
  fieldsDisplay: 'all-at-once' | 'one-by-one';
  createdAt?: Date;
}

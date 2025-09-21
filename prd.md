# Product Requirements Document (PRD)
## Lead Forms Frontend-Backend Integration

### 1. Executive Summary

This PRD outlines the requirements for integrating the existing Lead Forms frontend component with the backend API services. The Lead Forms feature enables chatbots to automatically collect user information based on configurable triggers, enhancing lead generation and user data collection capabilities.

### 2. Problem Statement

**Current State:**
- A fully functional Lead Forms UI component exists in the frontend
- Backend APIs for lead form management are available and tested
- No integration exists between frontend and backend
- Users cannot persist or manage lead forms across sessions
- Lead form configurations are lost on page refresh

**Business Impact:**
- Lost opportunity for lead generation
- Manual data collection processes remain inefficient
- Customer engagement potential is not fully realized
- Sales teams lack automated lead qualification tools

### 3. Goals & Success Metrics

**Primary Goals:**
1. Enable persistent storage and management of lead forms
2. Allow real-time lead collection based on conversation triggers
3. Provide seamless user experience for form configuration
4. Ensure data integrity and validation

**Success Metrics:**
- 100% of created lead forms persist across sessions
- < 2 second response time for all API operations
- Zero data loss during form submissions
- 95% successful form submission rate
- < 1% error rate in trigger detection

### 4. User Stories

**As an Admin/Manager, I want to:**
1. Create lead forms with custom fields and trigger conditions
2. View all existing lead forms for my organization
3. Edit lead form configurations without losing data
4. Delete lead forms that are no longer needed
5. Test lead forms in a preview environment before activation
6. See which keywords are already in use to avoid conflicts

**As an End User (Chat Visitor), I want to:**
1. See lead forms appear naturally in conversation flow
2. Submit information easily without leaving the chat
3. Receive confirmation after successful submission
4. Have my data validated in real-time

### 5. Functional Requirements

#### 5.1 API Integration Layer

**Requirement ID: API-001**
- Create a dedicated API service module for lead forms
- Implement all CRUD operations (Create, Read, Update, Delete)
- Handle authentication token management
- Provide proper error handling and retry logic

**API Endpoints to Integrate:**

##### 5.1.1 GET /api/v1/ai-support/lead-forms
**Purpose:** Fetch all lead forms for the tenant  
**Integration Point:** Component mount (`useEffect`)  
**Request:**
```typescript
// Headers
Authorization: Bearer <jwt_token>

// Query Parameters (optional)
{
  page?: number = 1,
  limit?: number = 20,
  active?: boolean
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    data: Array<{
      _id: string,
      tenantId: string,
      chatbotId?: string,
      name: string,
      description?: string,
      fields: Array<{
        id?: string,
        name: string,
        label: string,
        type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'hidden',
        required?: boolean,
        placeholder?: string,
        options?: Array<{ label: string, value: string }>,
        validation?: {
          regex?: string,
          minLength?: number,
          maxLength?: number,
          pattern?: string
        }
      }>,
      active: boolean,
      version: number,
      trigger: {
        condition: 'keywords' | 'always' | 'after_time',
        keywords?: string[],
        timeDelay?: number,
        priority?: number
      },
      fieldsDisplay: 'all-at-once' | 'one-by-one',
      settings?: {
        title?: string,
        successMessage?: string,
        redirectUrl?: string,
        notificationEmail?: string,
        autoResponse?: string
      },
      createdAt: string,
      updatedAt: string
    }>,
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

##### 5.1.2 POST /api/v1/ai-support/lead-forms
**Purpose:** Create new lead form  
**Integration Point:** `createLogic()` function  
**Request:**
```typescript
// Headers
Authorization: Bearer <jwt_token>
Content-Type: application/json

// Body
{
  name: string,                    // From frontend 'title'
  description?: string,            // From frontend 'description'
  chatbotId?: string,             // Optional, from context
  trigger: {
    condition: 'keywords' | 'always' | 'after_time',  // From 'collectCondition'
    keywords?: string[],           // From 'keywords' array
    timeDelay?: number,           // From 'timeDelay' if after_time
    priority?: number             // Default: 0
  },
  fieldsDisplay: 'all-at-once' | 'one-by-one',  // From 'fieldsDisplay'
  fields: Array<{
    id?: string,                  // Generate UUID if not present
    name: string,                 // Generate from label (slugify)
    label: string,                // From frontend field.label
    type: 'text' | 'email' | 'phone' | 'textarea' | 'select',
    required?: boolean,           // From frontend field.required
    placeholder?: string,         // From frontend field.placeholder
    options?: Array<{ label: string, value: string }>,
    validation?: {
      regex?: string,
      minLength?: number,
      maxLength?: number,
      pattern?: string
    }
  }>,
  settings?: {
    title?: string,
    successMessage?: string,
    redirectUrl?: string,
    notificationEmail?: string,
    autoResponse?: string
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    _id: string,
    // ... same structure as GET response item
  },
  message: string
}
```

##### 5.1.3 PUT /api/v1/ai-support/lead-forms/{formId}
**Purpose:** Update existing lead form  
**Integration Point:** `createLogic()` function when `editingLogicId` exists  
**Request:** Same as POST but all fields optional except those being updated

**Response:** Same as POST

##### 5.1.4 DELETE /api/v1/ai-support/lead-forms/{formId}
**Purpose:** Delete lead form  
**Integration Point:** `deleteLogic()` function  
**Request:**
```typescript
// Headers
Authorization: Bearer <jwt_token>

// URL Parameter
formId: string
```

**Response:**
```typescript
{
  success: boolean,
  message: string
}
```

##### 5.1.5 POST /api/v1/ai-support/lead-forms/check-triggers
**Purpose:** Check if message triggers any forms (for chat preview)  
**Integration Point:** `checkAllLogicsForTrigger()` function  
**Request:**
```typescript
// Headers
Authorization: Bearer <jwt_token>
Content-Type: application/json

// Body
{
  message: string,              // User input from chat
  conversationId?: string,      // Optional context
  sessionId?: string,           // Optional context
  metadata?: {
    userAgent?: string,
    ipAddress?: string,
    referrer?: string
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    triggered: boolean,
    forms: Array<{
      formId: string,
      form: {
        // Complete form object structure
      },
      trigger: {
        matchedKeywords?: string[],
        condition: string,
        priority: number
      }
    }>
  }
}
```

#### 5.2 Data Transformation & Integration Flow

**Requirement ID: DATA-001**

##### 5.2.1 Frontend to Backend Transformation
```typescript
// Frontend LeadFormConfig Interface (existing)
interface LeadFormConfig {
  id?: string;
  title: string;
  description: string;
  keywords: string[];
  fields: FormField[];
  collectCondition: 'keywords' | 'always' | 'after_time';
  timeDelay?: number;
  fieldsDisplay: 'all-at-once' | 'one-by-one';
  createdAt?: Date;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
}

// Transformation Function (to be implemented)
function transformToBackendPayload(config: LeadFormConfig): BackendLeadFormPayload {
  return {
    name: config.title,
    description: config.description || '',
    trigger: {
      condition: config.collectCondition,
      keywords: config.collectCondition === 'keywords' ? config.keywords : undefined,
      timeDelay: config.collectCondition === 'after_time' ? config.timeDelay : undefined,
      priority: 0
    },
    fieldsDisplay: config.fieldsDisplay,
    fields: config.fields.map(field => ({
      id: field.id,
      name: slugify(field.label), // Convert "Full Name" to "full_name"
      label: field.label,
      type: field.type,
      required: field.required || false,
      placeholder: field.placeholder || '',
      validation: generateValidation(field) // Based on type
    })),
    active: true
  };
}

// Slugify utility function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^-+|-+$/g, '');
}
```

##### 5.2.2 Backend to Frontend Transformation
```typescript
function transformFromBackendResponse(backendForm: BackendLeadForm): LeadFormConfig {
  return {
    id: backendForm._id,
    title: backendForm.name,
    description: backendForm.description || '',
    keywords: backendForm.trigger.keywords || [],
    collectCondition: backendForm.trigger.condition,
    timeDelay: backendForm.trigger.timeDelay,
    fieldsDisplay: backendForm.fieldsDisplay,
    fields: backendForm.fields.map(field => ({
      id: field.id || generateId(),
      type: field.type,
      label: field.label,
      placeholder: field.placeholder || '',
      required: field.required || false
    })),
    createdAt: new Date(backendForm.createdAt)
  };
}
```

##### 5.2.3 Integration Points in LeadForms Component

**Component Mount (Data Loading):**
```typescript
// In LeadForms.tsx - useEffect hook
useEffect(() => {
  const loadLeadForms = async () => {
    setLoading(true);
    try {
      const response = await leadFormsApi.fetchLeadForms();
      const transformedForms = response.data.data.map(transformFromBackendResponse);
      setSavedLogics(transformedForms);
    } catch (error) {
      setError('Failed to load lead forms');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  loadLeadForms();
}, []);
```

**Create Logic Function Integration:**
```typescript
// Replace existing createLogic function
const createLogic = async () => {
  setValidationError(null);
  
  // Client-side validation
  const error = validateLogic();
  if (error) {
    setValidationError(error);
    return;
  }

  setLoading(true);
  try {
    const payload = transformToBackendPayload(config);
    
    let response;
    if (editingLogicId) {
      // Update existing
      response = await leadFormsApi.updateLeadForm(editingLogicId, payload);
    } else {
      // Create new
      response = await leadFormsApi.createLeadForm(payload);
    }
    
    // Transform response back to frontend format
    const updatedForm = transformFromBackendResponse(response.data);
    
    if (editingLogicId) {
      setSavedLogics(prev => prev.map(logic => 
        logic.id === editingLogicId ? updatedForm : logic
      ));
      setEditingLogicId(null);
    } else {
      setSavedLogics(prev => [...prev, updatedForm]);
    }
    
    // Success feedback
    showSuccessToast(editingLogicId ? 'Form updated successfully' : 'Form created successfully');
    
    // Reset form
    resetForm();
    setShowCreateForm(false);
    
  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
};
```

**Delete Logic Function Integration:**
```typescript
const deleteLogic = async (logicId: string) => {
  if (!confirm('Are you sure you want to delete this lead form?')) {
    return;
  }

  setLoading(true);
  try {
    await leadFormsApi.deleteLeadForm(logicId);
    
    setSavedLogics(prev => prev.filter(logic => logic.id !== logicId));
    
    if (editingLogicId === logicId) {
      setEditingLogicId(null);
      setShowCreateForm(false);
      resetForm();
    }
    
    showSuccessToast('Form deleted successfully');
    
  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
};
```

**Chat Preview Integration:**
```typescript
// Replace checkAllLogicsForTrigger function
const checkAllLogicsForTrigger = async (userInput: string) => {
  try {
    const response = await leadFormsApi.checkTriggers({
      message: userInput.trim(),
      conversationId: 'preview-' + Date.now(), // Preview context
      metadata: {
        userAgent: navigator.userAgent,
        referrer: window.location.href
      }
    });
    
    if (response.data.triggered && response.data.forms.length > 0) {
      // Return the highest priority form
      const sortedForms = response.data.forms.sort((a, b) => 
        (b.trigger.priority || 0) - (a.trigger.priority || 0)
      );
      return transformFromBackendResponse(sortedForms[0].form);
    }
    
    return null;
  } catch (error) {
    console.error('Trigger check failed:', error);
    return null; // Fallback to no trigger
  }
};
```

#### 5.3 API Service Layer Implementation

**Requirement ID: API-SERVICE-001**

##### 5.3.1 Create leadFormsApi.ts
```typescript
// /utils/api/leadFormsApi.ts
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiError {
  status: number;
  message: string;
  details?: any;
}

class LeadFormsApiService {
  private baseUrl = '/api/v1/ai-support/lead-forms';
  
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          details: errorData
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error.status) {
        throw error; // Re-throw API errors
      }
      
      // Handle network/parsing errors
      throw {
        status: 0,
        message: 'Network error occurred. Please check your connection.',
        details: error
      } as ApiError;
    }
  }

  // GET /api/v1/ai-support/lead-forms
  async fetchLeadForms(params?: {
    page?: number;
    limit?: number;
    active?: boolean;
  }): Promise<ApiResponse<{
    data: BackendLeadForm[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return this.makeRequest<any>(url, { method: 'GET' });
  }

  // POST /api/v1/ai-support/lead-forms
  async createLeadForm(payload: BackendLeadFormPayload): Promise<ApiResponse<BackendLeadForm>> {
    return this.makeRequest<BackendLeadForm>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // PUT /api/v1/ai-support/lead-forms/{formId}
  async updateLeadForm(formId: string, payload: Partial<BackendLeadFormPayload>): Promise<ApiResponse<BackendLeadForm>> {
    return this.makeRequest<BackendLeadForm>(`${this.baseUrl}/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  // DELETE /api/v1/ai-support/lead-forms/{formId}
  async deleteLeadForm(formId: string): Promise<ApiResponse<{}>> {
    return this.makeRequest<{}>(`${this.baseUrl}/${formId}`, {
      method: 'DELETE'
    });
  }

  // POST /api/v1/ai-support/lead-forms/check-triggers
  async checkTriggers(payload: {
    message: string;
    conversationId?: string;
    sessionId?: string;
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
    };
  }): Promise<ApiResponse<{
    triggered: boolean;
    forms: Array<{
      formId: string;
      form: BackendLeadForm;
      trigger: {
        matchedKeywords?: string[];
        condition: string;
        priority: number;
      };
    }>;
  }>> {
    return this.makeRequest<any>(`${this.baseUrl}/check-triggers`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

export const leadFormsApi = new LeadFormsApiService();
```

##### 5.3.2 Error Handling Utilities
```typescript
// /utils/errorHandling.ts
export function handleApiError(error: ApiError): string {
  console.error('API Error:', error);
  
  switch (error.status) {
    case 400:
      return error.details?.validationErrors 
        ? `Validation failed: ${error.details.validationErrors.map(e => e.message).join(', ')}`
        : 'Invalid data provided. Please check your inputs.';
        
    case 401:
      // Redirect to login
      window.location.href = '/login';
      return 'Session expired. Redirecting to login...';
      
    case 403:
      return 'You don\'t have permission to perform this action.';
      
    case 404:
      return 'The requested resource was not found.';
      
    case 409:
      if (error.message.includes('keyword')) {
        return 'Some keywords are already used in another form. Please use different keywords.';
      }
      if (error.message.includes('always')) {
        return 'A form with "Ask for information all at once" trigger already exists.';
      }
      return error.message || 'A conflict occurred.';
      
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
      
    case 500:
    case 502:
    case 503:
      return 'Server error occurred. Please try again later.';
      
    case 0:
      return error.message; // Network error
      
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

export function showSuccessToast(message: string): void {
  // Implement toast notification (could use react-hot-toast, etc.)
  console.log('SUCCESS:', message);
  // TODO: Replace with actual toast implementation
}

export function showErrorToast(message: string): void {
  // Implement toast notification
  console.error('ERROR:', message);
  // TODO: Replace with actual toast implementation
}
```

#### 5.4 State Management

**Requirement ID: STATE-001**

##### 5.4.1 Component State Structure
```typescript
// Additional state to be added to LeadForms component
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [apiInProgress, setApiInProgress] = useState<{
  create: boolean;
  update: boolean;
  delete: string | null; // formId being deleted
  load: boolean;
}>({
  create: false,
  update: false,
  delete: null,
  load: false
});
```

##### 5.4.2 State Management Hooks
```typescript
// Custom hook for API operations
function useApiOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err as ApiError);
      setError(errorMessage);
      onError?.(errorMessage);
      showErrorToast(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}
```

##### 5.4.3 Form Validation Integration
```typescript
// Enhanced validation function
const validateLogic = (): string | null => {
  // Existing validation logic
  if (config.collectCondition === 'keywords' && config.keywords.length === 0) {
    return 'Please add at least one keyword for keyword-based triggers.';
  }
  
  if (config.collectCondition === 'after_time' && !config.timeDelay) {
    return 'Please specify time delay for time-based triggers.';
  }
  
  if (config.fields.length === 0) {
    return 'Please add at least one form field.';
  }
  
  // Validate field configurations
  for (const field of config.fields) {
    if (!field.label.trim()) {
      return 'All fields must have a label.';
    }
    
    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      return `Select field "${field.label}" must have at least one option.`;
    }
  }
  
  // Check for duplicate field labels
  const labels = config.fields.map(f => f.label.toLowerCase().trim());
  const duplicates = labels.filter((label, index) => labels.indexOf(label) !== index);
  if (duplicates.length > 0) {
    return `Duplicate field labels found: ${duplicates.join(', ')}`;
  }
  
  return null;
};
```

#### 5.4 User Interface Updates

**Requirement ID: UI-001**
- Add loading indicators during API operations
- Display success/error notifications
- Disable interactive elements during operations
- Add confirmation dialogs for destructive actions

**Requirement ID: UI-002**
- Show validation errors inline
- Highlight conflicting keywords or triggers
- Provide clear error messages for business rule violations

#### 5.5 Chat Preview Integration

**Requirement ID: PREVIEW-001**
- Implement real-time trigger checking against backend
- Simulate actual form behavior in preview
- Show form rendering as it would appear to users
- Test both "all-at-once" and "one-by-one" display modes

### 6. Technical Requirements

#### 6.1 Authentication & Authorization

**Requirement ID: AUTH-001**
- Include JWT token in all API requests
- Handle token refresh transparently
- Redirect to login on 401 errors
- Show appropriate message for 403 (insufficient permissions)

#### 6.2 Error Handling

**Requirement ID: ERROR-001**
- Implement comprehensive error handling for all API calls
- Show user-friendly error messages
- Log errors for debugging
- Handle specific error cases:
  - 409 Conflict: Duplicate keywords or multiple "always" triggers
  - 404 Not Found: Form doesn't exist
  - 400 Bad Request: Validation errors

#### 6.3 Performance

**Requirement ID: PERF-001**
- API response time < 2 seconds
- Debounce trigger checking in preview (300ms)
- Implement request cancellation for superseded operations
- Cache form list for 5 minutes

### 7. Non-Functional Requirements

#### 7.1 Security
- All API communications over HTTPS
- No sensitive data in frontend logs
- Validate all inputs before API submission
- Sanitize user inputs to prevent XSS

#### 7.2 Reliability
- Implement retry logic for failed requests
- Graceful degradation if backend is unavailable
- Prevent data loss during network issues

#### 7.3 Usability
- Maintain current UI/UX design
- Preserve all existing functionality
- Ensure responsive design works with API integration
- Provide clear feedback for all user actions

### 8. Complete File Structure & Components

#### 8.1 New Files to Create
```
/utils/
  /api/
    leadFormsApi.ts              - API service layer
  /leadForms/
    leadFormsTypes.ts            - TypeScript interfaces
    leadFormsTransform.ts        - Data transformation utilities
    leadFormsValidation.ts       - Enhanced validation functions
  errorHandling.ts               - Error handling utilities
  
/components/
  /leadforms/
    LeadForms.tsx               - Main component (existing, to be updated)
    /hooks/
      useLeadFormsApi.ts        - Custom hooks for API operations
    /components/
      LoadingSpinner.tsx        - Loading indicator component
      ConfirmDialog.tsx         - Confirmation dialog component
      ErrorBoundary.tsx         - Error boundary wrapper
```

#### 8.2 Required Interface Definitions
```typescript
// /utils/leadForms/leadFormsTypes.ts
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
  active?: boolean;
  settings?: {
    title?: string;
    successMessage?: string;
    redirectUrl?: string;
    notificationEmail?: string;
    autoResponse?: string;
  };
}
```

#### 8.3 UI Component Updates
```typescript
// Loading states integration in LeadForms.tsx
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Error display component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-medium">!</span>
        </div>
        <div>
          <p className="text-sm font-medium text-red-700 mb-1">Error</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="text-red-700 border-red-300 hover:bg-red-100"
      >
        Retry
      </Button>
    </div>
  </div>
);

// Button states with loading
const CreateButton = ({ loading, isEdit }: { loading: boolean; isEdit: boolean }) => (
  <Button 
    className='bg-blue-500 hover:bg-blue-600 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black'
    onClick={createLogic}
    disabled={loading}
  >
    {loading ? (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        {isEdit ? 'Updating...' : 'Creating...'}
      </>
    ) : (
      isEdit ? 'Update Logic' : 'Create Logic'
    )}
  </Button>
);
```

### 9. Implementation Phases

**Phase 1: Foundation Setup (Days 1-2)**
- Create all new files and interfaces
- Implement API service layer
- Add authentication handling
- Create error handling utilities

**Phase 2: Data Integration (Days 3-4)**
- Implement data transformation functions
- Update component mount to load from API
- Add state management for API operations
- Implement create/update operations

**Phase 3: CRUD Operations (Days 5-6)**
- Complete delete functionality
- Add proper validation integration
- Implement chat preview API integration
- Add loading states and error handling

**Phase 4: UI Polish & Testing (Days 7-8)**
- Add all loading indicators and error displays
- Implement success/error notifications
- Add confirmation dialogs
- Conduct comprehensive testing
- Handle edge cases and error scenarios

**Phase 5: Optimization & Documentation (Day 9-10)**
- Performance optimization
- Code review and refactoring
- Update documentation
- Final testing and deployment preparation

### 9. Dependencies

- Backend APIs must be deployed and accessible
- Authentication system must provide valid JWT tokens
- User must have Admin or Manager role
- TenantId must be available in user context

### 10. Out of Scope

- Lead form submission handling by end users
- Analytics and reporting on submissions
- Email notifications for submissions
- Integration with third-party CRM systems
- Multi-language support

### 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API changes | High | Version API endpoints, maintain backwards compatibility |
| Network latency | Medium | Implement optimistic updates, show loading states |
| Data conflicts | Medium | Implement proper conflict resolution UI |
| Token expiration | Low | Implement automatic token refresh |

### 12. Acceptance Criteria

1. **Lead Form Creation**
   - User can create a new lead form
   - Form persists after page refresh
   - Appropriate error shown for duplicate keywords

2. **Lead Form Management**
   - All existing forms load on page load
   - Edit functionality updates backend
   - Delete removes form from backend

3. **Preview Functionality**
   - Preview accurately simulates trigger behavior
   - Forms render correctly in chat preview
   - Both display modes work as expected

4. **Error Handling**
   - All API errors show user-friendly messages
   - No console errors in normal operation
   - Failed operations can be retried

5. **Performance**
   - Page loads in < 3 seconds
   - API operations complete in < 2 seconds
   - UI remains responsive during operations

### 13. Integration Summary & Quick Reference

#### 13.1 Key Integration Points
1. **Component Mount**: `useEffect` → `leadFormsApi.fetchLeadForms()` → Transform data → Set state
2. **Create Form**: `createLogic()` → Transform config → `leadFormsApi.createLeadForm()` → Update state
3. **Update Form**: `createLogic()` with `editingLogicId` → `leadFormsApi.updateLeadForm()` → Update state
4. **Delete Form**: `deleteLogic()` → `leadFormsApi.deleteLeadForm()` → Remove from state
5. **Chat Preview**: `checkAllLogicsForTrigger()` → `leadFormsApi.checkTriggers()` → Return triggered form

#### 13.2 Data Flow Diagram
```
Frontend LeadFormConfig
         ↓ (transformToBackendPayload)
Backend API Payload
         ↓ (API Call)
Backend Response
         ↓ (transformFromBackendResponse)
Frontend LeadFormConfig
         ↓ (setState)
Component Re-render
```

#### 13.3 Error Handling Matrix
| Error Code | Scenario | User Message | Action |
|------------|----------|--------------|--------|
| 400 | Validation failed | "Invalid data provided. Please check your inputs." | Show validation errors |
| 401 | Unauthorized | "Session expired. Redirecting to login..." | Redirect to login |
| 403 | Forbidden | "You don't have permission to perform this action." | Show error message |
| 404 | Not found | "The requested resource was not found." | Show error message |
| 409 | Conflict | "Keywords already used in another form." | Show specific conflict message |
| 500 | Server error | "Server error occurred. Please try again later." | Show retry option |

#### 13.4 Testing Checklist
- [ ] Forms load correctly on page mount
- [ ] Create new form saves to backend
- [ ] Edit existing form updates backend
- [ ] Delete form removes from backend
- [ ] Keyword conflict validation works
- [ ] "Always" trigger conflict prevention works
- [ ] Chat preview triggers correctly
- [ ] Loading states display properly
- [ ] Error messages are user-friendly
- [ ] Success notifications appear
- [ ] Form persists after page refresh
- [ ] Authentication errors handled
- [ ] Network errors handled gracefully


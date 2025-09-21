import { ApiError } from '@/types/leadForms';

// Handle API errors and return user-friendly messages
export function handleApiError(error: ApiError): string {
  console.error('API Error:', error);
  
  switch (error.status) {
    case 400:
      return error.details?.validationErrors 
        ? `Validation failed: ${error.details.validationErrors.map((e: any) => e.message).join(', ')}`
        : 'Invalid data provided. Please check your inputs.';
        
    case 401:
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
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

// Show success toast notification
export function showSuccessToast(message: string): void {
  // Use existing toast system if available
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast.success(message);
  } else {
    console.log('SUCCESS:', message);
    // Fallback to browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Success', { body: message });
    }
  }
}

// Show error toast notification
export function showErrorToast(message: string): void {
  // Use existing toast system if available
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast.error(message);
  } else {
    console.error('ERROR:', message);
    // Fallback to browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Error', { body: message });
    }
  }
}

// Show warning toast notification
export function showWarningToast(message: string): void {
  // Use existing toast system if available
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast.warning(message);
  } else {
    console.warn('WARNING:', message);
  }
}

// Show info toast notification
export function showInfoToast(message: string): void {
  // Use existing toast system if available
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast.info(message);
  } else {
    console.info('INFO:', message);
  }
}

// Validate form configuration
export function validateLeadFormConfig(config: any): string | null {
  // Check for required fields
  if (!config.title?.trim()) {
    return 'Form title is required.';
  }
  
  if (!config.description?.trim()) {
    return 'Form description is required.';
  }
  
  // Check for trigger configuration
  if (config.collectCondition === 'keywords' && (!config.keywords || config.keywords.length === 0)) {
    return 'Please add at least one keyword for keyword-based triggers.';
  }
  
  if (config.collectCondition === 'after_time' && !config.timeDelay) {
    return 'Please specify time delay for time-based triggers.';
  }
  
  // Check for form fields
  if (!config.fields || config.fields.length === 0) {
    return 'Please add at least one form field.';
  }
  
  // Validate field configurations
  for (const field of config.fields) {
    if (!field.label?.trim()) {
      return 'All fields must have a label.';
    }
    
    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      return `Select field "${field.label}" must have at least one option.`;
    }
  }
  
  // Check for duplicate field labels
  const labels = config.fields.map((f: any) => f.label.toLowerCase().trim());
  const duplicates = labels.filter((label: string, index: number) => labels.indexOf(label) !== index);
  if (duplicates.length > 0) {
    return `Duplicate field labels found: ${duplicates.join(', ')}`;
  }
  
  return null;
}

// Check for business rule conflicts
export function checkBusinessRuleConflicts(
  config: any, 
  existingForms: any[], 
  editingId?: string
): string | null {
  // Check for "always" trigger conflict
  if (config.collectCondition === 'always') {
    const existingAlwaysForm = existingForms.find(form => 
      form.collectCondition === 'always' && form.id !== editingId
    );
    if (existingAlwaysForm) {
      return 'A form with "Ask for information all at once" trigger already exists. You can only have one form with this trigger.';
    }
  }

  // Check for keyword conflicts
  if (config.collectCondition === 'keywords' && config.keywords?.length > 0) {
    for (const keyword of config.keywords) {
      const conflictingForm = existingForms.find(form => 
        form.collectCondition === 'keywords' && 
        form.keywords?.includes(keyword) && 
        form.id !== editingId
      );
      if (conflictingForm) {
        return `The keyword "${keyword}" is already used in another form. Please use different keywords.`;
      }
    }
  }

  return null;
}


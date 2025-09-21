import { 
  LeadFormConfig, 
  FormField, 
  BackendLeadForm, 
  BackendLeadFormPayload, 
  BackendFormField 
} from '@/types/leadForms';

// Utility function to convert text to slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^-+|-+$/g, '');
}

// Generate validation rules based on field type and preserve existing validation
export function generateValidation(field: FormField) {
  const validation: any = {};
  
  // Preserve existing validation from the field
  if (field.validation) {
    if (field.validation.minLength !== undefined && field.validation.minLength !== null) {
      validation.minLength = field.validation.minLength;
    }
    if (field.validation.maxLength !== undefined && field.validation.maxLength !== null) {
      validation.maxLength = field.validation.maxLength;
    }
    if (field.validation.pattern && field.validation.pattern.trim() !== '') {
      validation.pattern = field.validation.pattern;
    }
  }
  
  // Add default validation based on field type if no custom validation exists
  if (!field.validation || Object.keys(field.validation).length === 0) {
    switch (field.type) {
      case 'email':
        validation.pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        break;
      case 'phone':
        validation.pattern = '^[+]?[0-9\\s\\-\\(\\)]{10,}$';
        break;
      case 'text':
        if (field.required) {
          validation.minLength = 1;
          validation.maxLength = 255;
        }
        break;
      case 'textarea':
        if (field.required) {
          validation.minLength = 1;
          validation.maxLength = 1000;
        }
        break;
    }
  }
  
  return Object.keys(validation).length > 0 ? validation : undefined;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Transform frontend config to backend payload for CREATE
export function transformToBackendPayload(config: Omit<LeadFormConfig, 'id' | 'createdAt'>, chatbotId: string): BackendLeadFormPayload {
  const payload = {
    name: config.title,
    description: config.description || '',
    chatbotId: chatbotId,
    trigger: {
      condition: config.collectCondition,
      keywords: config.collectCondition === 'keywords' ? config.keywords : undefined,
      timeDelay: config.collectCondition === 'after_time' ? config.timeDelay : undefined,
      priority: 0
    },
    fieldsDisplay: config.fieldsDisplay,
    fields: config.fields.map(field => {
      const backendField: BackendFormField = {
        id: field.id,
        name: slugify(field.label),
        label: field.label,
        type: field.type,
        required: field.required || false,
        placeholder: field.placeholder || '',
        autoFocus: field.autoFocus || false
      };
      
      // Only add options if they exist
      if (field.options && field.options.length > 0) {
        backendField.options = field.options;
      }
      
      // Only add validation if it exists
      const validation = generateValidation(field);
      console.log('Field validation for', field.label, ':', field.validation);
      console.log('Generated validation:', validation);
      if (validation) {
        backendField.validation = validation;
      }
      
      return backendField;
    })
  };
  
  // Debug the payload structure
  console.log('Create payload:', payload);
  
  return payload;
}

// Transform frontend config to backend payload for UPDATE (excludes fields not accepted by backend)
export function transformToBackendUpdatePayload(config: Omit<LeadFormConfig, 'id' | 'createdAt'>): Partial<BackendLeadFormPayload> {
  const payload: Partial<BackendLeadFormPayload> = {
    name: config.title,
    description: config.description || '',
    fields: config.fields.map(field => {
      const backendField: BackendFormField = {
        id: field.id,
        name: slugify(field.label),
        label: field.label,
        type: field.type,
        required: field.required || false,
        placeholder: field.placeholder || '',
        autoFocus: field.autoFocus || false
      };
      
      // Only add options if they exist
      if (field.options && field.options.length > 0) {
        backendField.options = field.options;
      }
      
      // Only add validation if it exists
      const validation = generateValidation(field);
      if (validation) {
        backendField.validation = validation;
      }
      
      return backendField;
    })
  };
  
  // Debug the payload structure
  debugPayload(payload);
  
  return payload;
}

// Transform backend response to frontend config
export function transformFromBackendResponse(backendForm: BackendLeadForm): LeadFormConfig {
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
      type: field.type as FormField['type'],
      label: field.label,
      placeholder: field.placeholder || '',
      required: field.required || false,
      autoFocus: field.autoFocus || false,
      options: field.options,
      validation: field.validation ? {
        minLength: field.validation.minLength,
        maxLength: field.validation.maxLength,
        pattern: field.validation.pattern
      } : undefined
    })),
    createdAt: new Date(backendForm.createdAt)
  };
}

// Debug function to log payload structure
export function debugPayload(payload: Partial<BackendLeadFormPayload>): void {
  console.log('Lead Form Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
}

// Default configuration for new forms
export const defaultLeadFormConfig: Omit<LeadFormConfig, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  keywords: [],
  fields: [],
  collectCondition: 'keywords',
  fieldsDisplay: 'all-at-once'
};

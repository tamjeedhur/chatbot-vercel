import { FormField } from '@/types/leadForms';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationError {
  fieldId: string;
  fieldLabel: string;
  errors: string[];
}

export function validateField(field: FormField, value: string): ValidationResult {
  const errors: string[] = [];

  // Check if field is required
  if (field.required && (!value || value.trim() === '')) {
    errors.push(field.validation?.customMessage || `${field.label} is required`);
    return { isValid: false, errors };
  }

  // Skip validation if value is empty and field is not required
  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] };
  }

  const trimmedValue = value.trim();

  // Length validation
  if (field.validation?.minLength && trimmedValue.length < field.validation.minLength) {
    errors.push(
      field.validation.customMessage || 
      `${field.label} must be at least ${field.validation.minLength} characters long`
    );
  }

  if (field.validation?.maxLength && trimmedValue.length > field.validation.maxLength) {
    errors.push(
      field.validation.customMessage || 
      `${field.label} must be no more than ${field.validation.maxLength} characters long`
    );
  }

  // Pattern validation
  if (field.validation?.pattern) {
    try {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(trimmedValue)) {
        errors.push(
          field.validation.customMessage || 
          `${field.label} format is invalid`
        );
      }
    } catch (error) {
      console.error('Invalid regex pattern:', field.validation.pattern);
      errors.push('Invalid validation pattern');
    }
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedValue)) {
        errors.push(
          field.validation?.customMessage || 
          `${field.label} must be a valid email address`
        );
      }
      break;

    case 'phone':
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(trimmedValue)) {
        errors.push(
          field.validation?.customMessage || 
          `${field.label} must be a valid phone number`
        );
      }
      break;

    case 'select':
      if (field.options && !field.options.some(option => option.value === trimmedValue)) {
        errors.push(
          field.validation?.customMessage || 
          `${field.label} must be one of the available options`
        );
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateForm(fields: FormField[], formData: Record<string, string>): FieldValidationError[] {
  const errors: FieldValidationError[] = [];

  fields.forEach(field => {
    const value = formData[field.label] || formData[field.id] || '';
    const validation = validateField(field, value);

    if (!validation.isValid) {
      errors.push({
        fieldId: field.id,
        fieldLabel: field.label,
        errors: validation.errors
      });
    }
  });

  return errors;
}

export function getFieldValidationSummary(field: FormField): string[] {
  const summary: string[] = [];

  if (field.required) {
    summary.push('Required');
  }

  if (field.validation?.minLength) {
    summary.push(`Min: ${field.validation.minLength} chars`);
  }

  if (field.validation?.maxLength) {
    summary.push(`Max: ${field.validation.maxLength} chars`);
  }

  if (field.validation?.pattern) {
    summary.push('Custom pattern');
  }

  return summary;
}

'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/types/leadForms';

interface FieldValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FormField | null;
  onSave: (fieldId: string, validation: FormField['validation'], required: boolean, autoFocus: boolean) => void;
}

export function FieldValidationModal(props: FieldValidationModalProps) {
  const [validation, setValidation] = useState<FormField['validation']>({
    minLength: undefined,
    maxLength: undefined,
    pattern: ''
  });

  const [isRequired, setIsRequired] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);

  useEffect(() => {
    if (props.field) {
      setValidation(props.field.validation || {
        minLength: undefined,
        maxLength: undefined,
        pattern: ''
      });
      setIsRequired(props.field.required || false);
      setAutoFocus(props.field.autoFocus || false);
    }
  }, [props.field]);

  const handleSave = () => {
    if (props.field) {
      props.onSave(props.field.id, validation, isRequired, autoFocus);
      props.onClose();
    }
  };

  const handleReset = () => {
    if (props.field) {
      setValidation(props.field.validation || {
        minLength: undefined,
        maxLength: undefined,
        pattern: ''
      });
      setIsRequired(props.field.required || false);
      setAutoFocus(props.field.autoFocus || false);
    }
  };

  if (!props.isOpen || !props.field) {
    return null;
  }

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
  }, 
    React.createElement('div', {
      className: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col'
    },
      React.createElement('div', {
        className: 'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          React.createElement(Settings, { className: 'h-5 w-5 text-blue-600' }),
          React.createElement('h2', {
            className: 'text-lg font-semibold text-gray-900 dark:text-white'
          }, 'Field Validation Settings')
        ),
        React.createElement('button', {
          onClick: props.onClose,
          className: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
        },
          React.createElement(X, { className: 'h-5 w-5' })
        )
      ),
      React.createElement('div', {
        className: 'p-6 space-y-6 overflow-y-auto flex-1'
      },
        React.createElement('div', {
          className: 'bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'
        },
          React.createElement('h4', {
            className: 'font-medium text-sm mb-2 text-gray-900 dark:text-white'
          }, 'Field Information'),
          React.createElement('div', {
            className: 'space-y-1 text-sm text-gray-600 dark:text-gray-300'
          },
            React.createElement('div', {}, 
              React.createElement('span', { className: 'font-medium' }, 'Label: '),
              props.field.label
            ),
            React.createElement('div', {},
              React.createElement('span', { className: 'font-medium' }, 'Type: '),
              props.field.type
            ),
            React.createElement('div', {},
              React.createElement('span', { className: 'font-medium' }, 'Required: '),
              props.field.required ? 'Yes' : 'No'
            )
          )
        ),
        React.createElement('div', {
          className: 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
        },
          React.createElement('div', {
            className: 'space-y-0.5 flex-1'
          },
            React.createElement(Label, {
              className: 'text-base font-medium text-gray-900 dark:text-white'
            }, 'Required Field'),
            React.createElement('p', {
              className: 'text-sm text-gray-600 dark:text-gray-300'
            }, 'Make this field mandatory for form submission')
          ),
          React.createElement(Switch, {
            checked: isRequired,
            onCheckedChange: setIsRequired
          })
        ),
        React.createElement('div', {
          className: 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
        },
          React.createElement('div', {
            className: 'space-y-0.5 flex-1'
          },
            React.createElement(Label, {
              className: 'text-base font-medium text-gray-900 dark:text-white'
            }, 'Auto Focus'),
            React.createElement('p', {
              className: 'text-sm text-gray-600 dark:text-gray-300'
            }, 'Automatically focus this field when the form loads')
          ),
          React.createElement(Switch, {
            checked: autoFocus,
            onCheckedChange: setAutoFocus
          })
        ),
        React.createElement('div', {
          className: 'space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
        },
          React.createElement('h4', {
            className: 'font-medium text-sm text-gray-900 dark:text-white'
          }, 'Length Validation'),
          React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
          },
            React.createElement('div', {
              className: 'space-y-2'
            },
              React.createElement(Label, {
                htmlFor: 'minLength',
                className: 'text-sm text-gray-700 dark:text-gray-300'
              }, 'Minimum Length'),
              React.createElement(Input, {
                id: 'minLength',
                type: 'number',
                min: '0',
                placeholder: '0',
                value: validation?.minLength || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValidation(prev => ({
                  ...prev,
                  minLength: e.target.value ? parseInt(e.target.value) : undefined
                })),
                className: 'w-full'
              })
            ),
            React.createElement('div', {
              className: 'space-y-2'
            },
              React.createElement(Label, {
                htmlFor: 'maxLength',
                className: 'text-sm text-gray-700 dark:text-gray-300'
              }, 'Maximum Length'),
              React.createElement(Input, {
                id: 'maxLength',
                type: 'number',
                min: '0',
                placeholder: 'No limit',
                value: validation?.maxLength || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValidation(prev => ({
                  ...prev,
                  maxLength: e.target.value ? parseInt(e.target.value) : undefined
                })),
                className: 'w-full'
              })
            )
          )
        ),
        React.createElement('div', {
          className: 'space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
        },
          React.createElement('h4', {
            className: 'font-medium text-sm text-gray-900 dark:text-white'
          }, 'Pattern Validation'),
          React.createElement('div', {
            className: 'space-y-2'
          },
            React.createElement(Label, {
              htmlFor: 'pattern',
              className: 'text-sm text-gray-700 dark:text-gray-300'
            }, 'Regular Expression Pattern'),
            React.createElement(Input, {
              id: 'pattern',
              placeholder: 'e.g., ^[A-Za-z]+$ for letters only',
              value: validation?.pattern || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValidation(prev => ({
                ...prev,
                pattern: e.target.value
              })),
              className: 'w-full'
            }),
            React.createElement('p', {
              className: 'text-xs text-gray-500 dark:text-gray-400'
            }, 'Leave empty for no pattern validation. Use regex patterns like ^[A-Za-z]+$ for letters only.')
          )
        )
      ),
      React.createElement('div', {
        className: 'flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0'
      },
        React.createElement(Button, {
          variant: 'outline',
          onClick: handleReset,
          className: 'flex-1'
        }, 'Reset'),
        React.createElement(Button, {
          variant: 'outline',
          onClick: props.onClose,
          className: 'flex-1'
        }, 'Cancel'),
        React.createElement(Button, {
          onClick: handleSave,
          className: 'flex-1'
        }, 'Save Validation Rules')
      )
    )
  );
}

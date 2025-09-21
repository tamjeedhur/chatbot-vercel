import { setup, assign, fromPromise } from 'xstate';
import { 
  LeadFormsContext, 
  LeadFormsEvent, 
  BackendLeadForm, 
  BackendLeadFormPayload,
  ApiResponse,
  ApiError,
  LeadFormConfig
} from '@/types/leadForms';
import { 
  transformToBackendPayload, 
  transformToBackendUpdatePayload,
  transformFromBackendResponse, 
  defaultLeadFormConfig 
} from '@/utils/leadForms/leadFormsTransform';
import { 
  handleApiError, 
  validateLeadFormConfig, 
  checkBusinessRuleConflicts 
} from '@/utils/errorHandling';
import axiosInstance from '@/lib/axiosInstance';

// API Actors
const leadFormsActors = {
  fetchLeadForms: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; chatbotId: string } }) => {
    const { chatbotId } = input;
    
    const response = await axiosInstance.get(`/api/v1/ai-support/lead-forms?chatbotId=${chatbotId}`);
    const data: ApiResponse<BackendLeadForm[]> = response.data;
    return data.data.map(transformFromBackendResponse);
  }),

  createLeadForm: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; payload: BackendLeadFormPayload } }) => {
    const { payload } = input;
    
    const response = await axiosInstance.post('/api/v1/ai-support/lead-forms', payload);
    const data: ApiResponse<BackendLeadForm> = response.data;
    return transformFromBackendResponse(data.data);
  }),

  updateLeadForm: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; id: string; payload: Partial<BackendLeadFormPayload> } }) => {
    const { id, payload } = input;
    
    const response = await axiosInstance.put(`/api/v1/ai-support/lead-forms/${id}`, payload);
    const data: ApiResponse<BackendLeadForm> = response.data;
    return transformFromBackendResponse(data.data);
  }),

  deleteLeadForm: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; id: string } }) => {
    const { id } = input;
    
    await axiosInstance.delete(`/api/v1/ai-support/lead-forms/${id}`);
    return { success: true };
  }),

  triggerLeadForm: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; formId: string; context?: Record<string, any>; savedForms?: LeadFormConfig[] } }) => {
    const { formId, savedForms = [] } = input;
    
    // For now, trigger form locally by finding it in saved forms
    const form = savedForms.find(f => f.id === formId);
    
    if (!form) {
      throw {
        status: 404,
        message: `Lead form with ID ${formId} not found`,
        details: {}
      } as ApiError;
    }
    
    // Return the form data for local triggering
    return {
      form: form,
      triggered: true,
      message: `Lead form "${form.title}" triggered successfully`
    };
  }),

  submitLeadForm: fromPromise(async ({ input }: { input: { serverUrl: string; accessToken: string; formId: string; data: Record<string, any>; metadata?: Record<string, any> } }) => {
    const { formId, data, metadata = {} } = input;
    
    // Use hardcoded conversation ID for now
    const conversationId = "conv_1756466895422_fh2fzufxb";
    
    const response = await axiosInstance.post(`/api/v1/ai-support/conversations/${conversationId}/submit-lead-form`, {
      formId: formId,
      data: data,
      metadata: {
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
        source: 'chat_interface',
        ...metadata
      }
    });
    
    // Dummy response for testing
    const responsedata = {
      "success": false,
      "error": {
        "message": "Form validation failed: zohaib is required, email is required, phone is required",
        "code": "VALIDATION_ERROR",
        "details": [
          {
            "field": "zohaib",
            "message": "zohaib is required",
            "code": "REQUIRED_FIELD_MISSING"
          },
          {
            "field": "email",
            "message": "email is required", 
            "code": "REQUIRED_FIELD_MISSING"
          },
          {
            "field": "phone",
            "message": "phone is required",
            "code": "REQUIRED_FIELD_MISSING"
          }
        ]
      },
      "requestId": "req_1234567890"
    };
    
    // Parse the response and handle success/error properly
    if (!responsedata.success) {
      // Throw the error so XState can catch it in onError
      throw {
        status: 400,
        message: responsedata.error.message,
        details: responsedata.error.details,
        code: responsedata.error.code
      };
    }
    
    // Return success data if successful
    return responsedata;
  })
};

// Guards
const guards = {
  hasValidationError: ({ context }: { context: LeadFormsContext }) => {
    return Boolean(context.validationError);
  },
  
  isConfigValid: ({ context }: { context: LeadFormsContext }) => {
    const validationError = validateLeadFormConfig(context.currentConfig);
    return !validationError;
  },
  
  hasBusinessRuleConflicts: ({ context }: { context: LeadFormsContext }) => {
    const conflictError = checkBusinessRuleConflicts(
      context.currentConfig, 
      context.savedLogics, 
      context.editingLogicId || undefined
    );
    return Boolean(conflictError);
  },
  
  isEditing: ({ context }: { context: LeadFormsContext }) => {
    return Boolean(context.editingLogicId);
  }
};



// Lead Forms XState Machine
export const leadFormsMachine = setup({
  types: {} as {
    context: LeadFormsContext;
    events: LeadFormsEvent;
    input: { serverUrl: string; accessToken: string; chatbotId: string; initialForms?: LeadFormConfig[] };
  },
  actors: leadFormsActors,
  guards,
  actions: {
    setValidationError: assign({
      validationError: ({ event }: { event: any }) => event.error || null
    }),
    
    clearValidationError: assign({
      validationError: null
    }),
    
    setError: assign({
      error: ({ event }: { event: any }) => handleApiError(event.error),
      status: 'error',
      fieldErrors: ({ event, context }: { event: any; context: any }) => {
        // Parse field-specific validation errors from server response
        if (event.error?.details && Array.isArray(event.error.details)) {
          const fieldErrors: Record<string, string[]> = {};
          
          event.error.details.forEach((detail: any) => {
            if (detail.field && detail.message) {
              // Map field name to field ID for display
              // First try to find by label (since server sends field names like "email", "phone")
              let fieldId = detail.field;
              
              // If we have a triggered form, try to map the field name to field ID
              if (context.triggeredForm) {
                const field = context.triggeredForm.fields.find((f: any) => 
                  f.label.toLowerCase() === detail.field.toLowerCase() || 
                  f.id === detail.field
                );
                if (field) {
                  fieldId = field.id;
                }
              }
              
              if (!fieldErrors[fieldId]) {
                fieldErrors[fieldId] = [];
              }
              fieldErrors[fieldId].push(detail.message);
            }
          });
          
          return fieldErrors;
        }
        return {};
      }
    }),
    
    clearError: assign({
      error: null,
      fieldErrors: {}
    }),
    
    setEditing: assign({
      editingLogicId: ({ event }: { event: any }) => event.id,
      showCreateForm: true
    }),
    
    clearEditing: assign({
      editingLogicId: null,
      showCreateForm: false
    }),
    
    setConfig: assign({
      currentConfig: ({ context, event }: { context: LeadFormsContext; event: any }) => ({
        ...context.currentConfig,
        ...event.config
      }),
      validationError: null
    }),
    
    resetConfig: assign({
      currentConfig: defaultLeadFormConfig,
      validationError: null,
      editingLogicId: null,
      showCreateForm: false
    }),
    
    showCreateForm: assign({
      showCreateForm: true,
      editingLogicId: null,
      validationError: null
    }),
    
    setTriggeredForm: assign({
      triggeredForm: ({ event }: { event: any }) => event.output
    }),
    
    clearTriggeredForm: assign({
      triggeredForm: null
    }),
    
    setFieldErrors: assign({
      fieldErrors: ({ event }: { event: any }) => event.fieldErrors || {}
    }),
    
    clearFieldErrors: assign({
      fieldErrors: {}
    })
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswEMIDED2AnAtrAHQCWEqAxADIDyAggCID6mNASgLIDKA2gAwBdRKAAO2WCQAuJbADthIAB6IALACYVRAIwaAnLoDMADgN8VR3SoA0IAJ6ItKgGxOiKlXzVOA7N5XetMxUAX2CbVAwcAmIySgBhNgBROgAVRJZ2Dn4hJBAxCWk5BWUEdU0dFX1jU3NLG3sENV1XAFZPFscXSrUmp1Dw9Cw8QlJyMAoE5LSMzh4tHNFxKRl5XJL1Nyc+QwNvE28DJwMW+odzbyILbbUjFraXXX6QCKHo0coAVQAFBlT01lmggU+WWRTWqg02j0hhMZgs1jsiDaRkuTi0RiMATU6PcagMTxeURGsXG31+0wBWXmwKWhVWoHWalOCC0Bl0WiIhl85mMTha3j4+LCz0GRJiYwoDESVESFMy2RpBRWxQh5Wh1ThdURCCM5iIPhULScGK0LhaBjUBNFw3FlC4sqYiQYAEkUs6AHIAcQVuRBdJVLL4rgtgp0nl0AW87OZOl0LU5uqNRh6GgCfWFhJt73G9pSTDiNHdmGd3qBvtpyvBgYuJhahn86h8TjxMbUfD4RFDxiMfBa+xuVsiWZJFBSbBLnsSbCYMsYMyyZcWSrBDNVUMqMJq8OZUZRWj85i07O8LjRg9exIlXA+ACEOK6Z8lmJSfUvQfSlGuKlVYbUEQ1AmaBMBR8CxuyMc8xWzCgklzedXzyCsV0-QN4xuCo9jaQ51BjQJND4PY2z2Sw1D8SDhwlOJZ2nKc2HYBC-UrVdAw7W4uUFW50XZIwY3bPc1DaUiDj4fcWhCDNrTeEcuAACRoAB1fMkj+eDF0Q5cPxKbw1DcfR9BaNtdCDUTmXZHT9xxbwjS2E90wGIcpIlGTnSlJSpn+eU1MY5CtJRc0jLrXQ8WafcnGZIxTSIbEjBcPwRIjKNyLeZBsAwEhZCgCgIDkMBSFkAA3bAAGtcszZLUogdKoAQdLCoAYzQOlsgYpDNKRI99Q8NErM8LZWRjXYDDcTEtCNNp-DApKRhStKMooMBcFwPAiBEZBGoAM2GIgyumiqqpqgrsAaprBBajSA2aTQ4wMWMmlNIMY3UC5nF2DwDNNXY7JFByRjq3B0GkObstkXLauK0rJN+-7Gv2sHjpWZqvNai6nCu81bvZLYwu1fdNENG6bgOT6oyFeyL2IP6Aaq+bFuW1aNq2naKehwHqrhmG5ERhZ1PfFG0YJoLMYe7UmiGtjjj4DFBUsR4JJ+4gAFcRAgGGgZyvLCpK7bIcV5XVbZw74c506kfOqtLs5dGmjurHmV5S4KmbHRSMCRwpt1lXWZppbcBWtbJE2ghtfloglc92HDY52QucVXnzdRy2BZt4WGnuKL0WNRsdgCUnvvJogIDAVAveB0HDq1pmC6LsBWYO+qo5j8szeYi3rox+7sYaE8dP5CL+RPLctHdqvi+phafb9hmg8rwvR4yuujobk3ue8tqEFbq3BY78K7iIdGDAtLZ4RUIe5fzyRcBIKAYEvjKqEhrL1bBiudaIC+r5vqr75+hejej5fY7+irB0C42xBqGFZEFbYzJQJEBPBFEKBo+yWjPlBd+18FpfwfuPOm-tA74GDufS+GDb5QG-heX+S8BBnTjsxDoKIVCvSCqaJw7JBTMjuLoIghwjxxTbCYVkw9YAKwAEb4CkKzchRJH4gw1uDQhUFhFiIkVgn+7MTrUNNrQlCG8k5C07ogCMV1PoIObAcAcqCsxKPEZISR2Daa+3pgHRmr9rEqLvpDShGiaFAJbgnNu1t9G8UsNwxhRkT5gLrBBSxbxhF1TqnAWAFBFCwEkI1XKaB1qSAWgACjbO2AAlBQSucSEmwFgD4piKFAi72NH4c0aIur9W1BFPe7Z2yjQCvyc0w8cG4AmNRR0bA6JsEqT5Bw7YuFGlTKyUChMYx9g5DnKyztsT+V6Q45JqT0lEEydk3AOS2iFOKa-PpYy141PjHyNEWMDKkXcK2G6e9AhbEliYI4+5QjClkNgQu8BchM0AVUkoABaAxCAQXxj0tCmFlhc6VxJEC8ZLIT6dmbJUbkAkLSOAWRiS47hAgjX8KBYeM1KoZSRWvbSKJmFS22AKJMj0dD6iMgJbYEVjAnmHpTfWlKAzaS4boXUuwxJWWOC4ZkXgOyCQ6E0c0fFolkygmHXlTdtFaRuJyaKPZ6W9mNMyfwOkYr5K8KyGKaZh6zxrlVPlVZhLcIIndW4aIbpaHCscNwIktCsgOAK8ww90Gfw8T9W1zFqVavRDqiMeqeLah8Fw7SjhvWSzaOyFoQjRE2LsSGtVviULhtpVGhl+qcZBg7EKkCaIEFkRiSMUpiTQ3VOipyOpGgnqGCFQa9scC+T8m9T2A+BkvqVz6Y2koOh0QtsxG20iHbY0AUlhcfkZh+6OGTLLUIQA */
  id: 'leadForms',
  initial: 'idle',
  context: ({ input }) => ({
    savedLogics: input.initialForms || [],
    currentConfig: defaultLeadFormConfig,
    editingLogicId: null,
    deletingLogicId: null,
    validationError: null,
    showCreateForm: false,
    status: 'idle',
    error: null,
    fieldErrors: {},
    serverUrl: input.serverUrl,
    accessToken: input.accessToken,
    chatbotId: input.chatbotId,
    triggeredForm: null
  }),
  states: {
    idle: {
      on: {
        LOAD_FORMS: 'loading',
        CREATE_FORM: [
          {
            guard: 'isConfigValid',
            target: 'creating'
          },
          {
            actions: assign({
              validationError: ({ event }) => (event as any).error || null
            })
          }
        ],
        UPDATE_FORM: [
          {
            guard: 'isConfigValid',
            target: 'updating'
          },
          {
            actions: assign({
              validationError: ({ event }) => (event as any).error || null
            })
          }
        ],
        DELETE_FORM: {
          target: 'deleting',
          actions: assign({
            deletingLogicId: ({ event }) => event.id
          })
        },
        SET_EDITING: {
          actions: assign({
            editingLogicId: ({ event }) => (event as Extract<LeadFormsEvent, { type: 'SET_EDITING' }>).id,
            showCreateForm: true
          })
        },
        SET_CONFIG: {
          actions: assign({
            currentConfig: ({ context, event }) => ({
              ...context.currentConfig,
              ...(event as Extract<LeadFormsEvent, { type: 'SET_CONFIG' }>).config
            }),
            validationError: null
          })
        },
        TRIGGER_LEAD_FORM: 'triggeringLeadForm',
        SUBMIT_LEAD_FORM: 'submittingLeadForm',
        RESET_FORM: {
          actions: assign({
            currentConfig: defaultLeadFormConfig,
            validationError: null,
            editingLogicId: null,
            showCreateForm: false
          })
        },
        CLEAR_ERROR: {
          actions: assign({
            error: null
          })
        },
        CLEAR_FIELD_ERRORS: {
          actions: 'clearFieldErrors'
        },
        SHOW_CREATE_FORM: {
          actions: 'showCreateForm'
        }
      }
    },
    
    loading: {
      entry: assign({ status: 'loading', error: null }),
      invoke: {
        src: 'fetchLeadForms',
        input: ({ context }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          chatbotId: context.chatbotId
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({ 
              savedLogics: ({ event }) => event.output,
              status: 'idle'
            })
          ]
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => handleApiError((event as any).error),
            status: 'error' as const
          })
        }
      }
    },
    
    creating: {
      entry: assign({ status: 'creating', error: null }),
      invoke: {
        src: 'createLeadForm',
        input: ({ context }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          payload: transformToBackendPayload(context.currentConfig, context.chatbotId)
        }),
        onDone: {
          target: 'success',
          actions: [
            assign({ 
              savedLogics: ({ context, event }) => [...context.savedLogics, event.output],
              status: 'success' as const
            }),
            assign({
              currentConfig: defaultLeadFormConfig,
              validationError: null,
              editingLogicId: null,
              showCreateForm: false
            })
          ]
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => handleApiError((event as any).error),
            status: 'error' as const
          })
        }
      }
    },
    
    updating: {
      entry: assign({ status: 'updating', error: null }),
      invoke: {
        src: 'updateLeadForm',
        input: ({ context }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          id: context.editingLogicId!,
          payload: transformToBackendUpdatePayload(context.currentConfig)
        }),
        onDone: {
          target: 'success',
          actions: [
            assign({ 
              savedLogics: ({ context, event }) => 
                context.savedLogics.map(logic => 
                  logic.id === context.editingLogicId ? event.output : logic
                ),
              status: 'success' as const
            }),
            assign({
              currentConfig: defaultLeadFormConfig,
              validationError: null,
              editingLogicId: null,
              showCreateForm: false
            })
          ]
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => handleApiError((event as any).error),
            status: 'error' as const
          })
        }
      }
    },
    
    deleting: {
      entry: assign({ status: 'deleting', error: null }),
      invoke: {
        src: 'deleteLeadForm',
        input: ({ context }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          id: context.deletingLogicId!
        }),
        onDone: {
          target: 'success',
          actions: [
            assign({ 
              savedLogics: ({ context }) => 
                context.savedLogics.filter(logic => logic.id !== context.deletingLogicId),
              deletingLogicId: null,
              status: 'success'
            })
          ]
        },
        onError: {
          target: 'error',
          actions: [
            assign({ deletingLogicId: null }),
            assign({
              error: ({ event }) => handleApiError((event as any).error),
              status: 'error' as const
            })
          ]
        }
      }
    },
    
    triggeringLeadForm: {
      entry: assign({ status: 'triggeringLeadForm', error: null }),
      invoke: {
        src: 'triggerLeadForm',
        input: ({ context, event }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          formId: (event as any).formId,
          context: (event as any).context,
          savedForms: context.savedLogics
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({ status: 'idle' }),
            assign({
              triggeredForm: ({ event }) => event.output.form
            })
          ]
        },
        onError: {
          target: 'idle',
          actions: [
            assign({ status: 'idle' as const }),
            assign({
              triggeredForm: null
            })
          ]
        }
      }
        },

    submittingLeadForm: {
      entry: assign({ status: 'submittingLeadForm', error: null }),
      invoke: {
        src: 'submitLeadForm',
        input: ({ context, event }) => ({ 
          serverUrl: context.serverUrl, 
          accessToken: context.accessToken,
          formId: (event as any).formId,
          data: (event as any).data,
          metadata: (event as any).metadata
        }),
        onDone: {
          target: 'success',
          actions: [
            assign({ status: 'success' }),
            assign({
              triggeredForm: null, // Clear the triggered form after successful submission
              fieldErrors: {} // Clear field errors on success
            })
          ]
        },
        onError: {
          target: 'error',
          actions: 'setError'
        }
      }
    },

    success: {
      entry: assign({ status: 'success' }),
      after: {
        2000: {
          target: 'idle',
          actions: assign({ status: 'idle' })
        }
      }
    },
    
    error: {
      entry: assign({ status: 'error' }),
      after: {
        5000: {
          target: 'idle',
          actions: assign({ status: 'idle', error: null })
        }
      },
      on: {
        CLEAR_ERROR: {
          target: 'idle',
          actions: assign({ status: 'idle', error: null, fieldErrors: {} })
        }
      }
    }
  }
});

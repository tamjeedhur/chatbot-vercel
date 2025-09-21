'use client';

import { useMachine } from '@xstate/react';
import { leadFormsMachine } from '@/machines/leadFormsMachine';
import type { LeadFormConfig, BackendLeadForm } from '@/types/leadForms';
import { transformFromBackendResponse } from '@/utils/leadForms/leadFormsTransform';
import  LeadFormsUI  from '@/components/client/LeadFormsUI';

interface LeadFormsClientProps {
  initialForms: BackendLeadForm[];
  serverUrl: string;
  accessToken: string;
  tenantId: string;
  chatbotId: string;
  serverError: string | null;
}

export function LeadFormsClient({
  initialForms,
  serverUrl,
  accessToken,
  tenantId,
  chatbotId,
  serverError
}: LeadFormsClientProps) {
  // Transform initial forms from backend format to frontend format
  const transformedInitialForms = initialForms.map(transformFromBackendResponse);
  

  // Initialize XState machine with server data
  const machineInput = { serverUrl, accessToken, chatbotId, initialForms: transformedInitialForms };
  console.log('LeadFormsClient - Machine input:', machineInput);
  
  const [state, send] = useMachine(leadFormsMachine, {
    input: machineInput
  });

  const { context } = state;
  
  console.log('LeadFormsClient - XState context:', context);
  console.log('LeadFormsClient - XState savedLogics length:', context.savedLogics.length);

  // Event handlers that send XState events
  const handleLoadForms = () => {
    send({ type: 'LOAD_FORMS' });
  };

  const handleCreateForm = () => {
    send({ type: 'CREATE_FORM', config: context.currentConfig });
  };

  const handleUpdateForm = () => {
    if (context.editingLogicId) {
      send({ type: 'UPDATE_FORM', id: context.editingLogicId, config: context.currentConfig });
    }
  };

  const handleDeleteForm = (id: string) => {
    if (confirm('Are you sure you want to delete this lead form?')) {
      send({ type: 'DELETE_FORM', id });
    }
  };

  const handleEditForm = (id: string) => {
    const formToEdit = context.savedLogics.find(logic => logic.id === id);
    if (formToEdit) {
      send({ type: 'SET_EDITING', id });
      send({ 
        type: 'SET_CONFIG', 
        config: {
          title: formToEdit.title,
          description: formToEdit.description,
          keywords: formToEdit.keywords,
          fields: formToEdit.fields,
          collectCondition: formToEdit.collectCondition,
          timeDelay: formToEdit.timeDelay,
          fieldsDisplay: formToEdit.fieldsDisplay
        }
      });
    }
  };

  const handleConfigChange = (updates: Partial<LeadFormConfig>) => {
    send({ type: 'SET_CONFIG', config: updates });
  };

  const handleTriggerLeadForm = (formIdOrMessage: string, context?: Record<string, any>) => {
    // If it's a form ID (starts with a number or letter), trigger the form
    if (/^[a-zA-Z0-9]/.test(formIdOrMessage)) {
      send({ type: 'TRIGGER_LEAD_FORM', formId: formIdOrMessage, context });
    } else {
      // If it's a message, we can handle it later for keyword-based triggering
      console.log('Message received for keyword checking:', formIdOrMessage);
    }
  };

  const handleSubmitLeadForm = (formId: string, data: Record<string, any>, metadata?: Record<string, any>) => {
    send({ type: 'SUBMIT_LEAD_FORM', formId, data, metadata });
  };

  const handleResetForm = () => {
    send({ type: 'RESET_FORM' });
  };

  const handleClearError = () => {
    send({ type: 'CLEAR_ERROR' });
  };

  const handleShowCreateForm = () => {
    send({ type: 'SHOW_CREATE_FORM' });
  };

  const handleCancelEdit = () => {
    send({ type: 'RESET_FORM' });
  };

  // Loading states
  const isLoading = (state as any).matches('loading');
  const isCreating = (state as any).matches('creating');
  const isUpdating = (state as any).matches('updating');
  const isDeleting = (state as any).matches('deleting');
  const isCheckingTriggers = (state as any).matches('checkingTriggers');
  const isSuccess = (state as any).matches('success');
  const isError = (state as any).matches('error');

  return (
    <LeadFormsUI
      // State
      savedLogics={context.savedLogics}
      currentConfig={context.currentConfig}
      editingLogicId={context.editingLogicId}
      validationError={context.validationError}
      showCreateForm={context.showCreateForm}
      triggeredForm={context.triggeredForm}
      error={context.error}
      fieldErrors={context.fieldErrors}
      
      // Loading states
      isLoading={isLoading}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      isCheckingTriggers={isCheckingTriggers}
      isSuccess={isSuccess}
      isError={isError}
      
      // Event handlers
      onLoadForms={handleLoadForms}
      onCreateForm={handleCreateForm}
      onUpdateForm={handleUpdateForm}
      onDeleteForm={handleDeleteForm}
      onEditForm={handleEditForm}
      onConfigChange={handleConfigChange}
      onCheckTriggers={handleTriggerLeadForm}
      onSubmitLeadForm={handleSubmitLeadForm}
      onResetForm={handleResetForm}
      onClearError={handleClearError}
      onShowCreateForm={handleShowCreateForm}
      onCancelEdit={handleCancelEdit}
    />
  );
}

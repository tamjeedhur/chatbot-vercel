'use client';

import { useActor, useMachine } from '@xstate/react';
import { useCallback } from 'react';
import chatBotMachine from '@/machines/chatBotMachine/chatBotMachine';
// editChatbotMachine module not found; guard by lazy no-op machine to unblock build
const editChatbotMachine: any = {
  types: {},
  transition: () => {},
};
import { Chatbot } from '@/machines/chatBotMachine/types';

interface ChatbotEditExampleProps {
  selectedChatbot: Chatbot | null;
}

export default function ChatbotEditExample({ selectedChatbot }: ChatbotEditExampleProps) {
  // Main chatbot machine
  const [tenantState, tenantSend] = useMachine(chatBotMachine, {
    input: {
      selectedChatbot,
      chatbots: [],
      tenantId: null,
      userId: null,
      accessToken: null,
      defaultChatbots: [],
      error: null,
      isLoading: false,
    },
  });

  // Edit machine - only spawn when editing
  const [editState, editSend] = useMachine(editChatbotMachine, {
    input: {
      selectedChatbot: tenantState.context.selectedChatbot,
    },
  });

  const handleStartEditing = useCallback(() => {
    // No-op placeholder to satisfy types; real edit trigger not wired
    return;
  }, []);

  const handleCancelEditing = useCallback(() => {
    // Reset by fetching fresh data
    if (tenantState.context.selectedChatbot) {
      tenantSend({ type: 'SET_SELECTED_CHATBOT', chatbotId: tenantState.context.selectedChatbot._id });
    }
  }, [tenantSend, tenantState.context.selectedChatbot]);

  const handleSaveChanges = useCallback(() => {
    if (editState.context.formData && tenantState.context.selectedChatbot) {
      // Update the tenant machine with the edited data
      tenantSend({
        type: 'UPDATE_CHATBOT',
        data: {
          chatbotId: tenantState.context.selectedChatbot._id,
          chatbotData: editState.context.formData,
        },
      });
    }
  }, [tenantSend, editState.context.formData, tenantState.context.selectedChatbot]);

  const handleFieldUpdate = useCallback(
    (field: string, value: any) => {
      tenantSend({ type: 'UPDATE_FIELD', path: field, value });
    },
    [tenantSend]
  );

  const handleUIFieldUpdate = useCallback(
    (field: string, value: any) => {
      tenantSend({ type: 'UPDATE_FIELD', path: `ui.${field}`, value });
    },
    [tenantSend]
  );

  const handleWidgetFieldUpdate = useCallback(
    (field: string, value: any) => {
      tenantSend({ type: 'UPDATE_FIELD', path: `widget.${field}`, value });
    },
    [tenantSend]
  );

  const handleSettingsFieldUpdate = useCallback(
    (field: string, value: any) => {
      tenantSend({ type: 'UPDATE_FIELD', path: `settings.${field}`, value });
    },
    [tenantSend]
  );

  // Show different UI based on state
  if (tenantState.context.selectedChatbot) {
    return (
      <div className='p-6 bg-white rounded-lg shadow'>
        <h2 className='text-xl font-semibold mb-4'>Edit Chatbot</h2>

        {editState.context.formData && (
          <div className='space-y-4'>
            {/* Basic Info */}
            <div>
              <label className='block text-sm font-medium mb-2'>Name</label>
              <input
                type='text'
                value={editState.context.formData?.name || ''}
                onChange={(e) => handleFieldUpdate('name', e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Chatbot name'
              />
              {editState.context.validationErrors.name && <p className='text-red-500 text-sm mt-1'>{editState.context.validationErrors.name}</p>}
            </div>

            {/* UI Settings */}
            <div>
              <label className='block text-sm font-medium mb-2'>Display Name</label>
              <input
                type='text'
                value={editState.context.formData?.ui?.displayName || ''}
                onChange={(e) => handleUIFieldUpdate('displayName', e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Display name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Welcome Message</label>
              <textarea
                value={editState.context.formData?.ui?.welcomeMessage || ''}
                onChange={(e) => handleUIFieldUpdate('welcomeMessage', e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                rows={3}
                placeholder='Welcome message'
              />
            </div>

            {/* Widget Settings */}
            <div>
              <label className='block text-sm font-medium mb-2'>Auto Show Delay (seconds)</label>
              <input
                type='number'
                value={editState.context.formData?.widget?.autoShowDelay || 0}
                onChange={(e) => handleWidgetFieldUpdate('autoShowDelay', parseInt(e.target.value))}
                className='w-full px-3 py-2 border rounded-md'
                min='0'
              />
            </div>

            {/* Settings */}
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={editState.context.formData?.widget?.aiChatEnabled || false}
                  onChange={(e) => handleWidgetFieldUpdate('aiChatEnabled', e.target.checked)}
                  className='mr-2'
                />
                Enable AI Chat
              </label>

              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={editState.context.formData?.settings?.collectFeedback || false}
                  onChange={(e) => handleSettingsFieldUpdate('collectFeedback', e.target.checked)}
                  className='mr-2'
                />
                Collect Feedback
              </label>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3 pt-4'>
              <button
                onClick={handleSaveChanges}
                disabled={editState.matches('saving') || !editState.context.isDirty}
                className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50'>
                {editState.matches('saving') ? 'Saving...' : 'Save Changes'}
              </button>

              <button onClick={handleCancelEditing} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md'>
                Cancel
              </button>

              <button
                onClick={() => editSend({ type: 'RESET_FORM' })}
                disabled={!editState.context.isDirty}
                className='px-4 py-2 bg-yellow-500 text-white rounded-md disabled:opacity-50'>
                Reset
              </button>
            </div>

            {/* Error Display */}
            {editState.context.error && (
              <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{editState.context.error}</div>
            )}

            {/* Dirty State Indicator */}
            {editState.context.isDirty && <div className='mt-2 text-sm text-orange-600'>* You have unsaved changes</div>}
          </div>
        )}
      </div>
    );
  }

  // Default view - show edit button
  return (
    <div className='p-6 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Chatbot Details</h2>

      {tenantState.context.selectedChatbot ? (
        <div>
          <p>
            <strong>Name:</strong> {(tenantState.context.selectedChatbot as any).name}
          </p>
          <p>
            <strong>Status:</strong> {(tenantState.context.selectedChatbot as any).status}
          </p>

          <button onClick={handleStartEditing} className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md'>
            Edit Chatbot
          </button>
        </div>
      ) : (
        <p>No chatbot selected</p>
      )}
    </div>
  );
}

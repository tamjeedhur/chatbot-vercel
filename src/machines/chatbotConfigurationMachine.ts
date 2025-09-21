import { setup, assign, fromPromise } from 'xstate';
import { toast } from 'sonner';
import { ChatbotConfigurationContext, ChatbotConfigurationEvent } from '@/types/chatbotConfiguration';

// Service for updating chatbot configuration
const updateChatbotConfigurationService = fromPromise(
  async ({ input }: { input: { chatbotId: string; chatbotData: any; serverUrl: string; accessToken: string } }) => {
    // API call with proper authentication and server URL
    const response = await fetch(`${input.serverUrl}/api/chatbots/${input.chatbotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.accessToken}`,
      },
      body: JSON.stringify(input.chatbotData),
    });

    if (!response.ok) {
      throw new Error('Failed to update chatbot configuration');
    }

    return await response.json();
  }
);

export const chatbotConfigurationMachine = setup({
  types: {} as {
    context: ChatbotConfigurationContext;
    events: ChatbotConfigurationEvent;
    input: { selectedChatbot: any; serverUrl: string; accessToken: string };
  },
  actors: {
    updateConfiguration: updateChatbotConfigurationService,
  },
}).createMachine({
  id: 'chatbotConfiguration',
  initial: 'idle',
  context: ({ input }) => {
    // Ensure workingHours structure is properly initialized
    let selectedChatbot = input.selectedChatbot;
    if (selectedChatbot && (!selectedChatbot.settings || !selectedChatbot.settings.workingHours)) {
      selectedChatbot = {
        ...selectedChatbot,
        settings: {
          ...selectedChatbot.settings,
          workingHours: {
            enabled: false,
            timezone: 'America/New_York',
            schedule: [
              { day: 0, start: '09:00', end: '17:00' },
              { day: 1, start: '09:00', end: '17:00' },
              { day: 2, start: '09:00', end: '17:00' },
              { day: 3, start: '09:00', end: '17:00' },
              { day: 4, start: '09:00', end: '17:00' },
              { day: 5, start: '09:00', end: '17:00' },
              { day: 6, start: '09:00', end: '17:00' },
            ]
          }
        }
      };
    }
    
    return {
      selectedChatbot,
      serverUrl: input.serverUrl,
      accessToken: input.accessToken,
      hasUnsavedChanges: false,
      activeTab: 'general',
      showPreview: false,
      copiedField: null,
      editingSystemPrompt: false,
      editingWelcomeMessage: false,
      tempSystemPrompt: '',
      tempWelcomeMessage: '',
      newBannedTopic: '',
      newDisclaimer: '',
      newBrandVoice: '',
      error: null,
      isLoading: false,
    };
  },
  states: {
    idle: {
      on: {
        UPDATE_FIELD: {
          actions: assign({
            selectedChatbot: ({ context, event }) => {
              if (!context.selectedChatbot) return null;
              
              // Deep clone the chatbot object to avoid read-only property issues
              const updatedChatbot = { ...context.selectedChatbot };
              const pathParts = event.path.split('.');
              let current: any = updatedChatbot;

              for (let i = 0; i < pathParts.length - 1; i++) {
                if (!current[pathParts[i]]) {
                  current[pathParts[i]] = {};
                } else {
                  // Clone the nested object to ensure it's mutable
                  if (Array.isArray(current[pathParts[i]])) {
                    current[pathParts[i]] = [...current[pathParts[i]]];
                  } else {
                    current[pathParts[i]] = { ...current[pathParts[i]] };
                  }
                }
                current = current[pathParts[i]];
              }

              current[pathParts[pathParts.length - 1]] = event.value;
              return updatedChatbot;
            },
            hasUnsavedChanges: true,
            error: null,
          }),
        },
        SET_ACTIVE_TAB: {
          actions: assign({
            activeTab: ({ event }) => event.tab,
          }),
        },
        TOGGLE_PREVIEW: {
          actions: assign({
            showPreview: ({ context }) => !context.showPreview,
          }),
        },
        COPY_TO_CLIPBOARD: {
          actions: [
            assign({
              copiedField: ({ event }) => event.fieldName,
            }),
            ({ event }) => {
              navigator.clipboard.writeText(event.text);
              setTimeout(() => {
                // Reset copied field after 2 seconds
              }, 2000);
            },
          ],
        },
        START_EDITING_SYSTEM_PROMPT: {
          actions: assign({
            editingSystemPrompt: true,
            tempSystemPrompt: ({ context }) => context.selectedChatbot?.config?.systemPrompt || '',
          }),
        },
        CANCEL_EDITING_SYSTEM_PROMPT: {
          actions: assign({
            editingSystemPrompt: false,
            tempSystemPrompt: '',
          }),
        },
        SAVE_SYSTEM_PROMPT: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot) return null;
              const updatedChatbot = { ...context.selectedChatbot };
              if (!updatedChatbot.config) {
                updatedChatbot.config = {
                  systemPrompt: '',
                  model: { intentModel: '', responseModel: '', temperature: 0.7, maxTokens: 4000 },
                  behaviorPolicies: { brandVoice: '', politenessLevel: 'professional', bannedTopics: [], requiredDisclaimers: [] },
                  escalationThreshold: 0.7,
                  tools: [],
                };
              } else {
                updatedChatbot.config = { ...updatedChatbot.config };
              }
              updatedChatbot.config.systemPrompt = context.tempSystemPrompt;
              return updatedChatbot;
            },
            editingSystemPrompt: false,
            tempSystemPrompt: '',
            hasUnsavedChanges: true,
          }),
        },
        START_EDITING_WELCOME_MESSAGE: {
          actions: assign({
            editingWelcomeMessage: true,
            tempWelcomeMessage: ({ context }) => context.selectedChatbot?.settings?.welcomeMessage || '',
          }),
        },
        CANCEL_EDITING_WELCOME_MESSAGE: {
          actions: assign({
            editingWelcomeMessage: false,
            tempWelcomeMessage: '',
          }),
        },
        SAVE_WELCOME_MESSAGE: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot) return null;
              const updatedChatbot = { ...context.selectedChatbot };
              if (!updatedChatbot.settings) {
                updatedChatbot.settings = {
                  welcomeMessage: '',
                  maxMessagesPerConversation: 50,
                  fallbackResponse: { message: '', status: false },
                  popupMessage: { message: '', status: false },
                  workingHours: { 
                    enabled: false, 
                    timezone: 'America/New_York', 
                    schedule: [
                      { day: 0, start: '09:00', end: '17:00' },
                      { day: 1, start: '09:00', end: '17:00' },
                      { day: 2, start: '09:00', end: '17:00' },
                      { day: 3, start: '09:00', end: '17:00' },
                      { day: 4, start: '09:00', end: '17:00' },
                      { day: 5, start: '09:00', end: '17:00' },
                      { day: 6, start: '09:00', end: '17:00' },
                    ] 
                  },
                  collectFeedback: false,
                  allowRegenerate: false,
                };
              } else {
                updatedChatbot.settings = { ...updatedChatbot.settings };
              }
              updatedChatbot.settings.welcomeMessage = context.tempWelcomeMessage;
              return updatedChatbot;
            },
            editingWelcomeMessage: false,
            tempWelcomeMessage: '',
            hasUnsavedChanges: true,
          }),
        },
        ADD_BANNED_TOPIC: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot || !context.newBannedTopic.trim()) return context.selectedChatbot;

              const updatedChatbot = { ...context.selectedChatbot };
              if (!updatedChatbot.config) {
                updatedChatbot.config = {
                  systemPrompt: '',
                  model: { intentModel: '', responseModel: '', temperature: 0.7, maxTokens: 4000 },
                  behaviorPolicies: { brandVoice: '', politenessLevel: 'professional', bannedTopics: [], requiredDisclaimers: [] },
                  escalationThreshold: 0.7,
                  tools: [],
                };
              } else {
                updatedChatbot.config = { ...updatedChatbot.config };
              }
              if (!updatedChatbot.config.behaviorPolicies) {
                updatedChatbot.config.behaviorPolicies = {
                  brandVoice: '',
                  politenessLevel: 'professional',
                  bannedTopics: [],
                  requiredDisclaimers: [],
                };
              } else {
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
              }
              if (!updatedChatbot.config.behaviorPolicies.bannedTopics) {
                updatedChatbot.config.behaviorPolicies.bannedTopics = [];
              } else {
                updatedChatbot.config.behaviorPolicies.bannedTopics = [...updatedChatbot.config.behaviorPolicies.bannedTopics];
              }

              if (!updatedChatbot.config.behaviorPolicies.bannedTopics.includes(context.newBannedTopic.trim())) {
                updatedChatbot.config.behaviorPolicies.bannedTopics.push(context.newBannedTopic.trim());
              }

              return updatedChatbot;
            },
            newBannedTopic: '',
            hasUnsavedChanges: true,
          }),
        },
        REMOVE_BANNED_TOPIC: {
          actions: assign({
            selectedChatbot: ({ context, event }) => {
              if (!context.selectedChatbot) return null;

              const updatedChatbot = { ...context.selectedChatbot };
              if (updatedChatbot.config?.behaviorPolicies?.bannedTopics) {
                updatedChatbot.config = { ...updatedChatbot.config };
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
                updatedChatbot.config.behaviorPolicies.bannedTopics = updatedChatbot.config.behaviorPolicies.bannedTopics.filter(
                  (topic: string) => topic !== event.topic
                );
              }

              return updatedChatbot;
            },
            hasUnsavedChanges: true,
          }),
        },
        ADD_DISCLAIMER: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot || !context.newDisclaimer.trim()) return context.selectedChatbot;

              const updatedChatbot = { ...context.selectedChatbot };
              if (!updatedChatbot.config) {
                updatedChatbot.config = {
                  systemPrompt: '',
                  model: { intentModel: '', responseModel: '', temperature: 0.7, maxTokens: 4000 },
                  behaviorPolicies: { brandVoice: '', politenessLevel: 'professional', bannedTopics: [], requiredDisclaimers: [] },
                  escalationThreshold: 0.7,
                  tools: [],
                };
              } else {
                updatedChatbot.config = { ...updatedChatbot.config };
              }
              if (!updatedChatbot.config.behaviorPolicies) {
                updatedChatbot.config.behaviorPolicies = {
                  brandVoice: '',
                  politenessLevel: 'professional',
                  bannedTopics: [],
                  requiredDisclaimers: [],
                };
              } else {
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
              }
              if (!updatedChatbot.config.behaviorPolicies.requiredDisclaimers) {
                updatedChatbot.config.behaviorPolicies.requiredDisclaimers = [];
              } else {
                updatedChatbot.config.behaviorPolicies.requiredDisclaimers = [...updatedChatbot.config.behaviorPolicies.requiredDisclaimers];
              }

              if (!updatedChatbot.config.behaviorPolicies.requiredDisclaimers.includes(context.newDisclaimer.trim())) {
                updatedChatbot.config.behaviorPolicies.requiredDisclaimers.push(context.newDisclaimer.trim());
              }

              return updatedChatbot;
            },
            newDisclaimer: '',
            hasUnsavedChanges: true,
          }),
        },
        REMOVE_DISCLAIMER: {
          actions: assign({
            selectedChatbot: ({ context, event }) => {
              if (!context.selectedChatbot) return null;

              const updatedChatbot = { ...context.selectedChatbot };
              if (updatedChatbot.config?.behaviorPolicies?.requiredDisclaimers) {
                updatedChatbot.config = { ...updatedChatbot.config };
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
                updatedChatbot.config.behaviorPolicies.requiredDisclaimers = updatedChatbot.config.behaviorPolicies.requiredDisclaimers.filter(
                  (disclaimer: string) => disclaimer !== event.disclaimer
                );
              }

              return updatedChatbot;
            },
            hasUnsavedChanges: true,
          }),
        },
        ADD_BRAND_VOICE: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot || !context.newBrandVoice.trim()) return context.selectedChatbot;

              const updatedChatbot = { ...context.selectedChatbot };
              if (!updatedChatbot.config) {
                updatedChatbot.config = {
                  systemPrompt: '',
                  model: { intentModel: '', responseModel: '', temperature: 0.7, maxTokens: 4000 },
                  behaviorPolicies: { brandVoice: '', politenessLevel: 'professional', bannedTopics: [], requiredDisclaimers: [] },
                  escalationThreshold: 0.7,
                  tools: [],
                };
              } else {
                updatedChatbot.config = { ...updatedChatbot.config };
              }
              if (!updatedChatbot.config.behaviorPolicies) {
                updatedChatbot.config.behaviorPolicies = {
                  brandVoice: '',
                  politenessLevel: 'professional',
                  bannedTopics: [],
                  requiredDisclaimers: [],
                };
              } else {
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
              }
              updatedChatbot.config.behaviorPolicies.brandVoice = context.newBrandVoice.trim();

              return updatedChatbot;
            },
            newBrandVoice: '',
            hasUnsavedChanges: true,
          }),
        },
        REMOVE_BRAND_VOICE: {
          actions: assign({
            selectedChatbot: ({ context }) => {
              if (!context.selectedChatbot) return null;

              const updatedChatbot = { ...context.selectedChatbot };
              if (updatedChatbot.config?.behaviorPolicies) {
                updatedChatbot.config = { ...updatedChatbot.config };
                updatedChatbot.config.behaviorPolicies = { ...updatedChatbot.config.behaviorPolicies };
                updatedChatbot.config.behaviorPolicies.brandVoice = '';
              }

              return updatedChatbot;
            },
            hasUnsavedChanges: true,
          }),
        },
        SET_TEMP_SYSTEM_PROMPT: {
          actions: assign({
            tempSystemPrompt: ({ event }) => event.value,
          }),
        },
        SET_TEMP_WELCOME_MESSAGE: {
          actions: assign({
            tempWelcomeMessage: ({ event }) => event.value,
          }),
        },
        SET_NEW_BANNED_TOPIC: {
          actions: assign({
            newBannedTopic: ({ event }) => event.value,
          }),
        },
        SET_NEW_DISCLAIMER: {
          actions: assign({
            newDisclaimer: ({ event }) => event.value,
          }),
        },
        SET_NEW_BRAND_VOICE: {
          actions: assign({
            newBrandVoice: ({ event }) => event.value,
          }),
        },
        SAVE_CONFIGURATION: {
          target: 'saving',
          guard: ({ context }) => context.hasUnsavedChanges && !!context.selectedChatbot,
        },
        RESET_CONFIGURATION: {
          actions: assign({
            hasUnsavedChanges: false,
            error: null,
          }),
        },
        // New events to handle chatbot updates without useEffect
        CHATBOT_UPDATED: {
          actions: assign({
            selectedChatbot: ({ event }) => event.chatbot,
            hasUnsavedChanges: false,
          }),
        },
        NOTIFY_PARENT_UPDATE: {
          actions: ({ context, event }) => {
            if (event.onChatbotUpdate && context.selectedChatbot) {
              event.onChatbotUpdate(context.selectedChatbot);
            }
          },
        },
      },
    },
    saving: {
      entry: assign({
        isLoading: true,
        error: null,
      }),
      invoke: {
        src: 'updateConfiguration',
        input: ({ context }) => ({
          chatbotId: context.selectedChatbot!._id,
          chatbotData: context.selectedChatbot!,
          serverUrl: context.serverUrl,
          accessToken: context.accessToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              isLoading: false,
              hasUnsavedChanges: false,
            }),
            () => toast.success('Chatbot configuration updated successfully!'),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            assign({
              isLoading: false,
              error: ({ event }) => (event.error as Error).message,
            }),
            ({ event }) => toast.error((event.error as Error).message || 'Failed to update configuration'),
          ],
        },
      },
    },
  },
});

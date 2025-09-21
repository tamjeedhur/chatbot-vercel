import { assign, createMachine } from 'xstate';

export interface ChatbotFormContext {
  name: string;
  ui: {
    theme: string;
    primaryColor: string;
    botColor: string;
    welcomeMessage: string;
    botMessageColor: string;
    userMessageColor: string;
    logoUrl: string;
    position: string;
    customCss: string;
    displayName: string;
    messagePlaceholder: string;
    suggestedMessages: string[];
  };
  widget: {
    autoShowDelay: number;
  };
  settings: {
    aiChat: boolean;
    collectFeedback: boolean;
    allowRegenerate: boolean;
  };
  error?: string;
}

export type UpdateFieldEvent = {
  type: 'UPDATE_FIELD';
  field: keyof ChatbotFormContext;
  value: any;
};

export type NextEvent = { type: 'NEXT' };
export type PrevEvent = { type: 'PREV' };

export type ChatbotFormEvent = UpdateFieldEvent | NextEvent | PrevEvent;

export const chatbotFormMachine = createMachine(
  {
    id: 'chatbotForm',
    initial: 'step1',
    types: {} as {
      context: ChatbotFormContext;
      events: ChatbotFormEvent;
    },
    context: {
      name: 'Website Support Bot',
      ui: {
        theme: 'light',
        primaryColor: '#3B82F6',
        botColor: '#6366F1',
        welcomeMessage: 'Hi! How can I help you today?',
        logoUrl: 'https://cdn.example.com/brand/logo.png',
        botMessageColor: '#FFFFFF',
        userMessageColor: '#FFFFFF',
        position: 'bottom-right',
        customCss: '',
        displayName: 'Support Assistant',
        messagePlaceholder: 'Type your message…',
        suggestedMessages: [
          'Track my order',
          'I need billing help',
          'Talk to a human'
        ],
      },
      widget:{
        autoShowDelay: 3,
      },
      settings: {
        aiChat: true,
        collectFeedback: true,
        allowRegenerate: false,
      }
    },
    states: {
      step1: {
        on: {
          UPDATE_FIELD: {
            actions: 'updateField',
          },
          NEXT: {
            target: 'step2',
            guard: 'isStep1Valid',
          },
        },
      },
      step2: {
        on: {
          UPDATE_FIELD: {
            actions: 'updateField',
          },
          PREV: {
            target: 'step1',
          },
          NEXT: {
            target: 'review',
            guard: 'isStep2Valid',
          },
        },
      },
      review: {
        on: {
          UPDATE_FIELD: {
            actions: 'updateField',
          },
          PREV: {
            target: 'step2',
          },
        },
      },
    },
  },
  {
    actions: {
      updateField: assign(({ context, event }) => {
        if (event && event.type === 'UPDATE_FIELD') {
          return { ...context, [event.field]: event.value };
        }
        return context;
      }),
      clearError: assign({
        error: () => undefined,
      }),
      setError: assign({
        error: ({ event }) => {
          if (event && 'error' in event && event.error) {
            return (event.error as Error).message || 'An error occurred';
          }
          return 'An error occurred';
        },
      }),
    },
    guards: {
      isStep1Valid: ({ context }) => {
        return (
          !!context.name &&
          !!context.ui.displayName &&
          !!context.ui.welcomeMessage &&
          !!context.ui.messagePlaceholder &&
          !!context.ui.botMessageColor &&
          !!context.ui.userMessageColor
        );
      },
      isStep2Valid: ({ context }) => {
        return (
          !!context.ui.position &&
          !!context.widget.autoShowDelay &&
          !!context.ui.primaryColor &&
          !!context.ui.botColor &&
          !!context.ui.botMessageColor &&
          !!context.ui.userMessageColor
        );
      },
    },
  }
); 
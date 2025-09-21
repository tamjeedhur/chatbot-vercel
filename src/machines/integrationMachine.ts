import { setup, assign, fromPromise } from 'xstate';
import type {
  IntegrationTool,
  Webhook,
  IntegrationsData,
  IntegrationMachineContext,
  IntegrationMachineEvents,
  CreateWebhookFormData,
} from '@/types/integrations';

// Types
interface IntegrationInput {
  chatbotId: string;
  initialData: IntegrationsData;
  serverUrl: string;
  bearerToken: string;
}

// Actions moved inline to machine setup

// Guards
const hasError = ({ context }: { context: IntegrationMachineContext }) => Boolean(context.error);
const isLoading = ({ context }: { context: IntegrationMachineContext }) => context.loading;
const isActionLoading = ({ context }: { context: IntegrationMachineContext }, action: string) =>
  Boolean(context.actionLoading[action as keyof typeof context.actionLoading]);

// Actors moved to machine setup

// Machine
export const integrationMachine = setup({
  types: {
    input: {} as IntegrationInput,
    context: {} as IntegrationMachineContext,
    events: {} as IntegrationMachineEvents,
  },
  actors: {
    loadIntegrations: fromPromise(async ({ input }: { input: { chatbotId: string; serverUrl: string; bearerToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${input.bearerToken}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Failed to load integrations: ${response.statusText}`);
      }

      return response.json();
    }),

    connectTool: fromPromise(async ({ input }: { input: { chatbotId: string; toolId: string; serverUrl: string; bearerToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}/tools/${input.toolId}/connect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to connect tool: ${response.statusText}`);
      }

      return response.json();
    }),

    disconnectTool: fromPromise(async ({ input }: { input: { chatbotId: string; toolId: string; serverUrl: string; bearerToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}/tools/${input.toolId}/disconnect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect tool: ${response.statusText}`);
      }

      return response.json();
    }),

    createWebhook: fromPromise(async ({ input }: { input: { chatbotId: string; webhookData: any; serverUrl: string; bearerToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}/webhooks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input.webhookData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create webhook: ${response.statusText}`);
      }

      return response.json();
    }),

    updateWebhook: fromPromise(
      async ({ input }: { input: { chatbotId: string; webhookId: string; updates: any; serverUrl: string; bearerToken: string } }) => {
        const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}/webhooks/${input.webhookId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${input.bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input.updates),
        });

        if (!response.ok) {
          throw new Error(`Failed to update webhook: ${response.statusText}`);
        }

        return response.json();
      }
    ),

    deleteWebhook: fromPromise(async ({ input }: { input: { chatbotId: string; webhookId: string; serverUrl: string; bearerToken: string } }) => {
      const response = await fetch(`${input.serverUrl}/api/integrations/${input.chatbotId}/webhooks/${input.webhookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${input.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete webhook: ${response.statusText}`);
      }

      return response.json();
    }),
  },
  actions: {
    setLoading: assign({
      loading: true,
      error: null,
    }),
    setError: assign({
      loading: false,
      error: ({ event }: { event: any }) => event.error || 'An error occurred',
    }),
    clearError: assign({
      error: null,
    }),
    setTools: assign({
      tools: ({ event }: { event: any }) => event.data || [],
      loading: false,
      error: null,
    }),
    setWebhooks: assign({
      webhooks: ({ event }: { event: any }) => event.data || [],
      loading: false,
      error: null,
    }),
    setIntegrationsData: assign({
      tools: ({ event }: { event: any }) => event.data.tools || [],
      webhooks: ({ event }: { event: any }) => event.data.webhooks || [],
      loading: false,
      error: null,
    }),
    updateToolStatus: assign({
      tools: ({ context, event }: { context: IntegrationMachineContext; event: any }) =>
        context.tools.map((tool) => (tool._id === event.toolId ? { ...tool, status: event.status } : tool)),
      actionLoading: ({ context }) => ({
        ...context.actionLoading,
        connectTool: null,
        disconnectTool: null,
      }),
    }),
    addWebhook: assign({
      webhooks: ({ context, event }: { context: IntegrationMachineContext; event: any }) => [...context.webhooks, event.webhook],
      actionLoading: ({ context }) => ({
        ...context.actionLoading,
        createWebhook: false,
      }),
    }),
    updateWebhookInList: assign({
      webhooks: ({ context, event }: { context: IntegrationMachineContext; event: any }) =>
        context.webhooks.map((webhook) => (webhook._id === event.webhookId ? { ...webhook, ...event.updates } : webhook)),
    }),
    removeWebhook: assign({
      webhooks: ({ context, event }: { context: IntegrationMachineContext; event: any }) =>
        context.webhooks.filter((webhook) => webhook._id !== event.webhookId),
    }),
    setActionLoading: assign({
      actionLoading: ({ context, event }: { context: IntegrationMachineContext; event: any }) => ({
        ...context.actionLoading,
        [event.action]: event.loading,
      }),
    }),
  },
  guards: {
    hasError,
    isLoading,
    isActionLoading,
  },
}).createMachine({
  id: 'integration',
  initial: 'idle',
  context: ({ input }) => ({
    chatbotId: input.chatbotId,
    tools: input.initialData.tools || [],
    webhooks: input.initialData.webhooks || [],
    loading: false,
    error: null,
    serverUrl: input.serverUrl,
    bearerToken: input.bearerToken,
    actionLoading: {
      connectTool: null,
      disconnectTool: null,
      createWebhook: false,
      updateWebhook: null,
      deleteWebhook: null,
    },
  }),
  states: {
    idle: {
      on: {
        LOAD_INTEGRATIONS: 'loading',
        CONNECT_TOOL: {
          guard: ({ context, event }) => !context.actionLoading.connectTool && !context.actionLoading.disconnectTool,
          actions: assign({
            actionLoading: ({ context }) => ({
              ...context.actionLoading,
              connectTool: (event as any).toolId,
            }),
          }),
          target: 'connectingTool',
        },
        DISCONNECT_TOOL: {
          guard: ({ context, event }) => !context.actionLoading.connectTool && !context.actionLoading.disconnectTool,
          actions: assign({
            actionLoading: ({ context }) => ({
              ...context.actionLoading,
              disconnectTool: (event as any).toolId,
            }),
          }),
          target: 'disconnectingTool',
        },
        CREATE_WEBHOOK: {
          actions: assign({
            actionLoading: ({ context }) => ({
              ...context.actionLoading,
              createWebhook: true,
            }),
          }),
          target: 'creatingWebhook',
        },
        UPDATE_WEBHOOK: {
          guard: ({ context, event }) => !context.actionLoading.updateWebhook,
          actions: assign({
            actionLoading: ({ context }) => ({
              ...context.actionLoading,
              updateWebhook: (event as any).webhookId,
            }),
          }),
          target: 'updatingWebhook',
        },
        DELETE_WEBHOOK: {
          guard: ({ context, event }) => !context.actionLoading.deleteWebhook,
          actions: assign({
            actionLoading: ({ context }) => ({
              ...context.actionLoading,
              deleteWebhook: (event as any).webhookId,
            }),
          }),
          target: 'deletingWebhook',
        },
        CLEAR_ERROR: {
          actions: 'clearError',
        },
      },
    },
    loading: {
      entry: 'setLoading',
      invoke: {
        src: 'loadIntegrations',
        input: ({ context }) => ({
          chatbotId: context.chatbotId,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: 'setIntegrationsData',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    connectingTool: {
      invoke: {
        src: 'connectTool',
        input: ({ context, event }) => ({
          chatbotId: context.chatbotId,
          toolId: (event as any).toolId,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              tools: ({ context, event }) =>
                context.tools.map((tool) => (tool._id === (event as any).toolId ? { ...tool, status: 'Connected' as const } : tool)),
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                connectTool: null,
              }),
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            'setError',
            assign({
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                connectTool: null,
              }),
            }),
          ],
        },
      },
    },
    disconnectingTool: {
      invoke: {
        src: 'disconnectTool',
        input: ({ context, event }) => ({
          chatbotId: context.chatbotId,
          toolId: (event as any).toolId,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              tools: ({ context, event }) =>
                context.tools.map((tool) => (tool._id === (event as any).toolId ? { ...tool, status: 'Disconnected' as const } : tool)),
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                disconnectTool: null,
              }),
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            'setError',
            assign({
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                disconnectTool: null,
              }),
            }),
          ],
        },
      },
    },
    creatingWebhook: {
      invoke: {
        src: 'createWebhook',
        input: ({ context, event }) => ({
          chatbotId: context.chatbotId,
          webhookData: (event as any).webhookData,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              webhooks: ({ context, event }) => [...context.webhooks, (event as any).output],
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                createWebhook: false,
              }),
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            'setError',
            assign({
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                createWebhook: false,
              }),
            }),
          ],
        },
      },
    },
    updatingWebhook: {
      invoke: {
        src: 'updateWebhook',
        input: ({ context, event }) => ({
          chatbotId: context.chatbotId,
          webhookId: (event as any).webhookId,
          updates: (event as any).updates,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              webhooks: ({ context, event }) =>
                context.webhooks.map((webhook) => (webhook._id === (event as any).webhookId ? { ...webhook, ...(event as any).output } : webhook)),
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                updateWebhook: null,
              }),
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            'setError',
            assign({
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                updateWebhook: null,
              }),
            }),
          ],
        },
      },
    },
    deletingWebhook: {
      invoke: {
        src: 'deleteWebhook',
        input: ({ context, event }) => ({
          chatbotId: context.chatbotId,
          webhookId: (event as any).webhookId,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: [
            assign({
              webhooks: ({ context, event }) => context.webhooks.filter((webhook) => webhook._id !== (event as any).webhookId),
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                deleteWebhook: null,
              }),
            }),
          ],
        },
        onError: {
          target: 'idle',
          actions: [
            'setError',
            assign({
              actionLoading: ({ context }) => ({
                ...context.actionLoading,
                deleteWebhook: null,
              }),
            }),
          ],
        },
      },
    },
  },
});

// Export actor factory
// Export removed - actors are now defined inline in the machine

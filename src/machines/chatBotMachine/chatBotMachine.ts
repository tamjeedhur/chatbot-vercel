import { assign, fromPromise, setup } from 'xstate';
import { setSelectedChatbot } from '@/redux/slices/chatbotSlice';


import axiosInstance from '@/lib/axiosInstance';
import { MachineContext, MachineEvents, Chatbot, Organization } from './types';
import { API_VERSION } from '@/utils/constants';
import { set, cloneDeep } from 'lodash';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';
import { store } from '@/redux/store';

const chatBotMachine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as MachineEvents,
    input: {} as MachineContext,
  },
  actors: {
    getSelectedChatbot: fromPromise(async ({ input }: { input: { chatbotId: string } }) => {
      try {
        const response = await axiosInstance.get(`/api/${API_VERSION}/ai-support/chatbots/${input.chatbotId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    createChatbot: fromPromise(async ({ input }: { input: Chatbot }) => {
      try {
        const { _id,...chatbotData } = input;
        const response = await axiosInstance.post(`/api/${API_VERSION}/ai-support/chatbots`, chatbotData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    updateChatbot: fromPromise(async ({ input }: { input: { chatbotId: string; data: Chatbot } }) => {
      try {
        const { chatbotId, data } = input;
        const { _id, key, defaults, createdAt, updatedAt, isDefault, tenantId, ...cleanData } = data as any;
       
        const response = await axiosInstance.put(`/api/${API_VERSION}/ai-support/chatbots/${chatbotId}`, cleanData);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),

    deleteChatbot: fromPromise(async ({ input }: { input: { chatbotId: string } }) => {
      try {
        const { chatbotId } = input;
        const response = await axiosInstance.delete(`/api/${API_VERSION}/ai-support/chatbots/${chatbotId}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Operation completed successfully';
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const message = event.error?.message || 'An error occurred';
      toast.error(message);
    },
    setErrorWithToast: assign({
      error: ({ event }: any) => {
        const errorMessage = event.error?.message || 'An error occurred';
        // Show toast notification for error
        toast.error(errorMessage);
        return errorMessage;
      },
      isLoading: () => false,
    }),
  },
}).createMachine({
  id: 'chatBotMachine',
  initial: 'idle',
  context: ({ input }) => ({
    tenantId: input?.tenantId || null,
    userId: input?.userId || null,
    accessToken: input?.accessToken || null,
    chatbots: input?.chatbots || null,
    defaultChatbots: input?.defaultChatbots || null,
    selectedChatbot: input?.selectedChatbot,
    chatbotData: undefined,
    error: null,
    isLoading: false,
  }),
  states: {
    idle: {
      on: {
        SYNC_SELECTED_CHATBOT: {
          actions: assign({
            selectedChatbot: ({ event }) => (event as any).data,
            error: () => null,
          }),
        },
        CREATE_CHATBOT: {
          target: 'creatingChatbot',
          actions: [
            assign({
              chatbotData: ({ event }) => event.data,
              error: () => null,
            }),
            ({ event }) => {
              if (event.data) {
                store.dispatch(setSelectedChatbot(event.data));
              }
            },
          ],
        },
        UPDATE_CHATBOT: {
          target: 'updatingChatbot',
        },
        DELETE_CHATBOT: {
          target: 'deletingChatbot',
          actions: assign({
            chatbotToDelete: ({ event }) => event.chatbotId,
            error: () => null,
          }),
        },
        SET_SELECTED_CHATBOT: {
          target: 'fetchingSelectedChatbot',
          actions: assign({
            error: () => null,
          }),
        },
        UPDATE_FIELD: {
          actions: [
            assign({
              selectedChatbot: ({ context, event }) => {
                const base = (event as any).base || context.selectedChatbot;
                if (!base) return null;
                const updatedChatbot = cloneDeep(base);
                set(updatedChatbot, event.path, event.value);
                
                return updatedChatbot;
              },
            }),
            ({ context }) => {
              if (context.selectedChatbot) {
                const updatedChatbot = context.selectedChatbot;
                
                store.dispatch(setSelectedChatbot(updatedChatbot));
              }
            },
          ],
        },
        UPDATE_FIELD_AND_SAVE: {
          target: 'updatingFieldAndSaving',
          actions: [
            assign({
              selectedChatbot: ({ context, event }) => {
                const base = (event as any).base || context.selectedChatbot;
                if (!base) return null;
                const updatedChatbot = cloneDeep(base);
                set(updatedChatbot, event.path, event.value);
                
                return updatedChatbot;
              },
              error: () => null,
            }),
            ({ context }) => {
              if (context.selectedChatbot) {
                const updatedChatbot = context.selectedChatbot;
                
                store.dispatch(setSelectedChatbot(updatedChatbot));
              }
            },
          ],
        },
      },
    },

    // Chatbot states
    creatingChatbot: {
      invoke: {
        src: 'createChatbot',
        input: ({ context }) => {
          if (!context.chatbotData) {
            throw new Error('No chatbot data provided');
          }
          return context.chatbotData;
        },
        onDone: {
          target: 'success',
          actions: [
            assign({
              chatbotResponse: ({ event }) => event.output,
              chatbots: ({ context, event }) => {
                const newChatbot = event.output.data;
                const currentChatbots = context.chatbots || [];
                return [...currentChatbots, newChatbot];
              },
              selectedChatbot: ({ event }) => event.output.data,
              isLoading: () => false,
              error: () => null,
            }),
            ({ event }) => {
              if (event.output?.data) {
                store.dispatch(setSelectedChatbot(event.output.data));
              }
            },
            'showSuccessToast'
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast'
        },
      },
    },
    updatingChatbot: {
      invoke: {
        src: 'updateChatbot',
        input: ({ context, event }) => {
          if (event.type === 'UPDATE_CHATBOT') {
            if (!context.selectedChatbot) {
              throw new Error('No selected chatbot provided');
            }
           
            return {
              chatbotId: context.selectedChatbot._id,
              data: event.data.chatbotData,
            };
          }
          throw new Error('Invalid event type for updatingChatbot');
        },
        onDone: {
          target: 'idle',
          actions: [
            assign({
              selectedChatbot: ({ event }) => event.output.data,
              chatbotData: () => undefined,
              isLoading: () => false,
              error: () => null,
            }),
            ({ event }) => {
              if (event.output?.data) {
                store.dispatch(setSelectedChatbot(event.output.data));
              }
            },
            'showSuccessToast'
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast'
        },
      },
    },

    updatingFieldAndSaving: {
      invoke: {
        src: 'updateChatbot',
        input: ({ context }) => {
          if (!context.selectedChatbot) {
            throw new Error('No selected chatbot provided');
          }
          return {
            chatbotId: context.selectedChatbot._id,
            data: context.selectedChatbot,
          };
        },
        onDone: {
          target: 'idle',
          actions: [
            assign({
              selectedChatbot: ({ event }) => event.output.data,
              chatbotData: () => undefined,
              isLoading: () => false,
              error: () => null,
            }),
            ({ event }) => {
              if (event.output?.data) {
                store.dispatch(setSelectedChatbot(event.output.data));
              }
            },
            'showSuccessToast'
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast'
        },
      },
    },

    deletingChatbot: {
      invoke: {
        src: 'deleteChatbot',
        input: ({ event }) => {
          if (event.type === 'DELETE_CHATBOT') {
            return { chatbotId: event.chatbotId };
          }
          throw new Error('Invalid event type for deletingChatbot');
        },
        onDone: {
          target: 'idle',
          actions: [
            assign({
              chatbots: ({ context, event, self }) => {
                // Use the chatbotId from the original event that triggered the deletion
                const deletedChatbotId = self.getSnapshot().context.chatbotToDelete || event.output?.deletedChatbotId || event.output?.chatbotId;
                const currentChatbots = context.chatbots || [];
                return currentChatbots.filter((chatbot) => chatbot._id !== deletedChatbotId);
              },
              selectedChatbot: ({ context, event, self }) => {
                const deletedChatbotId = self.getSnapshot().context.chatbotToDelete || event.output?.deletedChatbotId || event.output?.chatbotId;
                if (context.selectedChatbot && context.selectedChatbot._id === deletedChatbotId) {
                  return null;
                }
                return context.selectedChatbot;
              },
              chatbotToDelete: () => undefined,
              isLoading: () => false,
              error: () => null,
            }),
            'showSuccessToast'
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast'
        },
      },
    },

    fetchingSelectedChatbot: {
      invoke: {
        src: 'getSelectedChatbot',
        input: ({ event }) => {
          if (event.type === 'SET_SELECTED_CHATBOT') {
            return { chatbotId: event.chatbotId };
          }

          throw new Error('Invalid event type for fetchingSelectedChatbot');
        },
        onDone: {
          target: 'idle',
          actions: [
            assign({
              selectedChatbot: ({ event }) => event.output.data,
              error: () => null,
            }),
            ({ event }) => {
              if (event.output?.data) {
                store.dispatch(setSelectedChatbot(event.output.data));
              }
            },
            'showSuccessToast'
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast'
        },
      },
    },

    success: {
      after: {
        500: {
          target: 'idle',
          actions: assign({
            error: () => null,
          }),
        },
      },
    },

    error: {
      after: {
        500: {
          target: 'idle',
          actions: assign({
            error: () => null,
          }),
        },
      },
    },
  },
});

export default chatBotMachine;
export type { Chatbot, Organization, MachineContext, MachineEvents };

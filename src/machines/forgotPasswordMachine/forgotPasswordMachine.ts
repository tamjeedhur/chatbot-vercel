import { assign, fromPromise, setup } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';
import { ResetPasswordContext, ResetPasswordEvent } from './types';
import { API_VERSION } from '@/utils/constants';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

export const forgotPasswordMachine = setup({
  types: {} as {
    context: ResetPasswordContext;
    events: ResetPasswordEvent;
  },
  actors: {
    sendResetEmail: fromPromise(async ({ input }: { input: { email: string } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/auth/forgot-password`, {
          email: input.email,
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    updateField: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_FIELD') return context;
      const email = event.value;
      const isDisabled = email.trim().length === 0;
      return { ...context, email, isDisabled };
    }),
    resetForm: assign({
      email: '',
      isDisabled: true,
      isEmailSent: false,
    }),
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Reset email sent successfully';
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
    }),
  },
  guards: {
    hasEmail: ({ context }) => context.email.trim().length > 0,
  },
}).createMachine({
  id: 'resetPasswordForm',
  initial: 'editing',
  context: {
    email: '',
    isDisabled: true,
    isEmailSent: false,
    error: null,
  },
  states: {
    editing: {
      on: {
        UPDATE_FIELD: { actions: 'updateField' },
        SUBMIT: { guard: 'hasEmail', target: 'sending' },
      },
    },
    sending: {
      invoke: {
        src: 'sendResetEmail',
        input: ({ context }) => ({ email: context.email }),
        onDone: { 
          target: 'success',
          actions: [
            assign({
              isEmailSent: true,
              error: null,
            }),
            'showSuccessToast'
          ],
        },
        onError: { 
          target: 'editing',
          actions: 'setErrorWithToast'
        },
      },
    },
    success: {
      on: {
        RESEND: { target: 'sending' },
        RESET: { target: 'editing', actions: 'resetForm' },
      },
    },
  },
});

export default forgotPasswordMachine;


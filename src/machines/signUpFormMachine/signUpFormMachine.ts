import { assign, fromPromise ,setup} from 'xstate';
import { SignUpFormContext, SignUpFormEvent } from './types';
import axiosInstance from '@/lib/axiosInstance';
import { API_VERSION } from '@/utils/constants';
import { signIn } from 'next-auth/react';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

export const signUpFormMachine = setup({
  types: {} as {
    context: SignUpFormContext;
    events: SignUpFormEvent;
  },
  actors: {
    registerUser: fromPromise(async ({ input }: { input: { email: string; password: string; name: string; role: string } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/auth/register`, {
          email: input.email,
          password: input.password,
          name: input.name,
          role: input.role,
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    signInUser: fromPromise(async ({ input }: { input: { email?: string; password?: string; id?: string; accessToken?: string; refreshToken?: string; name?: string,user?:any } }) => {
      try {
        // Prefer token-based seeding when available (after registration)
        const result = await signIn('credentials', {
          redirect: true,
          callbackUrl: '/',
          email: input.email,
          password: input.password,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          id: input.id,
          name: input.name,
          user: input.user ? JSON.stringify(input.user) : undefined,
        } as any);
        if (result && (result as any).error) {
          throw new Error((result as any).error);
        }
        return result;
      } catch (error: any) {
        const errorMessage =  error?.message || 'Auto sign-in failed';
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    updateField: assign(({ context, event }) => {
      if (event && event.type === 'UPDATE_FIELD') {
        const updated = { ...context, [event.field]: event.value } as SignUpFormContext;
        const isComplete =
          updated.email.trim().length > 0 &&
          updated.name.trim().length > 0 &&
          updated.password.trim().length > 0;
        return { ...updated, isDisabled: !isComplete };
      }
      return context;
    }),
    setError: assign(({ context, event }) => ({ 
      ...context, 
      error: String((event as any)?.error?.message || 'Failed to register') 
    })),
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
    }),
  },
  guards: {
    isFormComplete: ({ context }) =>
      context.email.trim().length > 0 &&
      context.name.trim().length > 0 &&
      context.password.trim().length > 0,
  },
}).createMachine({
  id: 'signUpForm',
  initial: 'editing',
  context: {
    email: '',
    password: '',
    name: '',
    role: 'Admin',
    error: undefined,
    isDisabled: true,
    user: null,
    accessToken: undefined,
    refreshToken: undefined,
    userId: undefined,
  },
  states: {
    editing: {
      on: {
        UPDATE_FIELD: {
          actions: 'updateField',
        },
        SUBMIT: {
          guard: 'isFormComplete',
          target: 'submitting',
          actions: assign(({ context }) => ({ ...context, error: undefined })),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'registerUser',
        input: ({ context }) => ({
          email: context.email,
          password: context.password,
          name: context.name,
          role: context.role,
        }),
        onDone: {
          target: 'signingIn',
          actions: [
            assign(({ context, event }) => {
              const payload: any = event.output?.data || event.output;
              return {
                ...context,
                accessToken: payload?.accessToken || payload?.data?.accessToken,
                refreshToken: payload?.refreshToken || payload?.data?.refreshToken,
                userId: payload?.user?.id || payload?.data?.user?.id,
                user: payload?.user || payload?.data?.user,
              } as SignUpFormContext;
            }),
          ],
        },
        onError: {
          target: 'editing',
          actions: 'setErrorWithToast',
        },
      },
    },
    signingIn: {
      invoke: {
        src: 'signInUser',
        input: ({ context }) => ({
          // Prefer tokens; fallback to email/password for safety
          accessToken: context.accessToken,
          refreshToken: context.refreshToken,
          id: context.userId,
          name: context.name,
          email: context.email,
          password: context.password,
          user: context.user,
        }),
        onDone: {
          target: 'success',
          actions: 'showSuccessToast'
        },
        onError: {
          target: 'editing',
          actions: 'setErrorWithToast',
        },
      },
    },
    success: {
      type: 'final',
    },
  },
});

export default signUpFormMachine;



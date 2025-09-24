import { assign, fromPromise ,setup} from 'xstate';
import { SignInFormContext, SignInFormEvent } from './types';
import axiosInstance from '@/lib/axiosInstance';
import { API_VERSION } from '@/utils/constants';
import { signIn } from 'next-auth/react';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

export const signInMachine = setup({
  types: {} as {
    context: SignInFormContext;
    events: SignInFormEvent;
  },
  actors: {
    loginUser: fromPromise(async ({ input }: { input: { email: string; password: string; } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/auth/login`, {
          email: input.email,
          password: input.password
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    setingUserInSession: fromPromise(async ({ input }: { input: { userId?: string; accessToken?: string; refreshToken?: string; name?: string,user?:any } }) => {
      try {
        // Prefer token-based seeding when available (after registration)
        const result = await signIn('credentials', {
          redirect: true,
          callbackUrl: '/',
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          id: input.userId,
          user: input.user ? JSON.stringify(input.user) : undefined,
        } as any);
        if (result && (result as any).error) {
          throw new Error((result as any).error);
        }
        return result;
      } catch (error: any) {
        const errorMessage = error?.message || 'sign-in failed';
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    updateField: assign(({ context, event }) => {
      if (event && event.type === 'UPDATE_FIELD') {
        const updated = { ...context, [event.field]: event.value } as SignInFormContext;
        const isComplete =
          updated.email.trim().length > 0 &&
          updated.password.trim().length > 0;
        return { ...updated, isDisabled: !isComplete };
      }
      return context;
    }),
    setError: assign(({ context, event }) => ({ 
      ...context, 
      error: String((event as any)?.error?.message || 'Failed to sign in') 
    })),
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Signed in successfully';
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
      context.password.trim().length > 0,
  },
}).createMachine({
  id: 'signUpForm',
  initial: 'editing',
  context: {
    email: '',
    password: '',
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
        src: 'loginUser',
        input: ({ context }) => ({
          email: context.email,
          password: context.password,
        }),
        onDone: {
          target: 'settingUserInSession',
          actions: [
            assign(({ context, event }) => {
              const payload: any = event.output?.data || event.output;
              return {
                ...context,
                accessToken: payload?.accessToken || payload?.data?.accessToken,
                refreshToken: payload?.refreshToken || payload?.data?.refreshToken,
                userId: payload?.user?.id || payload?.data?.user?.id,
                user: payload?.user || payload?.data?.user,
              } as SignInFormContext;
            }),
          ],
        },
        onError: {
          target: 'editing',
          actions: 'setErrorWithToast',
        },
      },
    },
    settingUserInSession: {
      invoke: {
        src: 'setingUserInSession',
        input: ({ context }) => ({
          accessToken: context.accessToken,
          refreshToken: context.refreshToken,
          userId: context.userId,
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

export default signInMachine;



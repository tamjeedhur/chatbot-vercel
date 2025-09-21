import { assign, fromPromise, setup } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';
import { SignOutMachineContext, SignOutMachineEvent, SignOutApiResponse } from './types';
import { API_VERSION } from '@/utils/constants';
import { signOut } from 'next-auth/react';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

export const signOutMachine = setup({
  types: {} as {
    context: SignOutMachineContext;
    events: SignOutMachineEvent;
  },
  actors: {
    signOutUser: fromPromise(async ({ input }: { input: { refreshToken: string } }): Promise<SignOutApiResponse> => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/auth/logout`, {
          refreshToken: input.refreshToken
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
    signingOutSession: fromPromise(async ({ input }: { input: { userId?: string; accessToken?: string; refreshToken?: string; name?: string,user?:any } }) => {
      try {
        await signOut({
          callbackUrl: '/sign-in', 
          redirect: true 
        });
      } catch (error: any) {
        const errorMessage = error?.message || 'Auto sign-in failed';
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    resetContext: assign({
      error: () => null,
      isLoading: () => false,
    }),
    setLoading: assign({
      isLoading: () => true,
      error: () => null,
    }),
    setError: assign({
      error: ({ event }) => (event as any).error || 'Sign out failed',
      isLoading: () => false,
    }),
    clearError: assign({
      error: () => null,
    }),
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Signed out successfully';
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
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYHkCuAXAsgIYDGAFiumAHQoQA2YAxAMoCSA4gHID6mAqgBUA2gAYAuolAAHAPapcKGekkgAHogAsAZgAcVDQCYAnAHYR5gIwmdANhE2ANCACeiLTYCsVIx60XjHjY6fgYaAL5hTqgYOAQk5JQ09EwASgCizGnC4iqy8orKSGqIBjom+iaeZiImFjoeHhpOrggGJkZUOkZaBn5WNeYmEVFoWHhEZBTUdDKEEBRQjBBK1BQAbjIA1tTRY3GTiTNzCwjrMsSECkqiYje5cihXhaDqCDoaFlQGBp46Oha+Lr-ZqaLqdEQaGxGYz+DwWDTvYYgXaxCYJaazeboRZgABOuJkuKoUjolwAZoSALZUFHjeJTKhHLFQU7oDYXJ43O5FPKPAoqV7aPSGUzmERWWz2EFvT4eMXijRGOq2QJI2n7dE07DEYhwWCMdKZbISHkPJ4CxBlT49f5w9oif6haXfAxfH6BRomLQaDQNLRq0ao+mJPEE3EsDg8fjG+75JQWhAWdxUDy9H3igweeoiAzSuUdGztKHuGx+dqZgMxOkHaihwkGjJZbnSM38oqvJM2FNpjQZrNy3MuNxyqg2CymHwmAde-1I9AyCBwFTqtFTWN8+PtxAAWkcQ4Q268RmPJ9PJ-alb2q8StAY6-NW4QPU+BhEfi0ul9QW90t01shWgeN0djaNoHiXkGNaMpiCz3m2LyIKWWhUPC7yBCIco9KU0oInopSwr47giEqEHVpqsDarqsDwKacbPMUiY5uU+H4V6QRWHuLRyl247lj8GjtDopQ2KRGoMnWuJwZuCEIIYv61CmRilkBFh1A6AIRBEQA */
  id: 'signOutMachine',
  initial: 'idle',
  context: {
    error: null,
    isLoading: false,
  },
  states: {
    idle: {
      on: {
        SIGN_OUT: {
          target: 'loading',
          actions: 'setLoading',
        },
        RESET: {
          actions: 'resetContext',
        },
      },
    },
    loading: {
      invoke: {
        src: 'signOutUser',
        input: ({ event }) => ({ refreshToken: (event as any).refreshToken }),
        onDone: {
          target: 'signingOutSession',
          actions: [
            assign({
              isLoading: () => false,
            }),
          ],
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    signingOutSession: {
      invoke: {
        src: 'signingOutSession',
        input: {},
        onDone: {
          target: 'success',
          actions: 'showSuccessToast'
        },
        onError: {
          target: 'error',
          actions: 'setErrorWithToast',
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'idle',
          actions: 'resetContext',
        },
      },
    },
    error: {
      on: {
        SIGN_OUT: {
          target: 'loading',
          actions: 'setLoading',
        },
        RESET: {
          target: 'idle',
          actions: 'resetContext',
        },
      },
    },
  },
});

export default signOutMachine;

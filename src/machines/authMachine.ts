// @ts-nocheck
import { assign, fromPromise, setup } from 'xstate';
import { store } from '../redux/store';
import { setTokens, clearTokens } from '../redux/slices/authSlice';
import axiosInstance from '../lib/axiosInstance';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { ExtendedSession } from '@/types/interfaces';

const getTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
};

const saveTokenToLocalStorage = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

async function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  const callbackUrl = process.env.NEXT_SIGN_IN_URL || 'http://localhost:3000/sign-in';
  console.log('this is the callback url', process.env.NEXT_SIGN_IN_URL);
  await signOut({ redirect: true, callbackUrl });
}

export interface IAuthMachineContext {
  errorMsg: string | null;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const authMachine = setup({}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgJYQBswBiAZQFUAhAWQEkAVAbQAYBdRUABwHtZd1c3AHYcQAD0QBGAGzNsAVmZLmAdnkAWAMzrpATgBM+gDQgAnokNzJK3Xt2aVm5punSVAX3cm0WPIRIAagCCADK0ACJB9ACiAPr0APIA0tEAcizsSCA8fALCohIIMnKKympaOgbGZoi6kpLYakoumq3Mbuqe3hg4+ERkpAmxFDQMGaI5-IIiWYXFCsqqGtp6hibmCOr6JdL68vK6zJKKABya8l0gPjgE3MgQuEJQxBDCYHhCAG7cANbv19hbvdHlAEI9vgBjZB5IQZcZZSYwgpSSTqBpKFQqE5KbHybTydYWQzYdR4yTnFTMeR6dQqaSXAFAh5PYhgABObO4bOwnAI0IAZlyALbYRl3Zmg8HcKEwuFsCa8Kb5WYotHYDFYnFU-GEor6E7YXRGo3ySlU5gGBk9QHikGkQYvN4fb5-UXWpl2wZgr7S6HTOWZLiKpEqoqo9GqTXMXE6mqbFzYTSSPaaM71PH6XRW3wep72hKsjlcnl89CCtkisXAvNeqUy-1seFB3LTZFhtUa7HR7Wk3XafTYE4HTS6M7tbSObM4T7IAj4P0s15Cd5S10AmdziALyU++vCAMKlvK0CFaTaBTHWTMWknE4m3X2eSDprqE7qXQqazOKfYDfzgQsuynLcryArCm6vh-luAE7pCfr7o28oIsGrahme6gXtSSg3neugEnGbgDg4igGEcuhoj+1xgEIAgypAxAhAkADiCTkEwSHNkqMwnlIewYVoKivpoezoa0uqSFST7JoopI6PqhwXF4VzWlRNG4HREDEMEYSRDE8TJGkTbZChx7iCit4km+LgdG4I7qLqJzktguyKEmhz6Jihg-myYD8j5sCYCCjrLs6vz-NaPl+XAgVPN6cGyohgbGUe3Fme2EaYl2Ma9gRijYNYkjkRa1gOJI3m+f5MXPEBxagWW4EApFlUgnFvoJawRmIqhPHpeqkZZT2+EbPImaNNI1JYkmbiSG+P41WyxBiLA6DQv8-LoOyAAU2xKAAlMQALzZ1JmpXMewqI0zgSW4knvpoDkNKUSjWHo7S3ponhKUI3AQHAojXIeXFtgAtNIurA0+xpQ9Do70kpAJ9GAgMhj1Wzid26pYjIxwecoindDmtpPMj3VpYc0iJhN+iksV1i6pY+XUvosiOEab7Rj+uZQPmJOmYUt4GmaN6XjY91xlsJQjtYeJnEOgkePD1pQduvOnYg5wDka+gzUOo4HG4DkWU0zhvuSBxZorviqbRq0QKrbaotshp0homozQbcbYhd2ItA4BgOLe5VRQFIL26GJw2H1mKOGieFbLourSLSz7yOSBgR-HZWWzg81hz1jtyB+403kcJwexsLgDq+5tJqzScfp97hAA */
  id: 'auth',
  initial: 'idle',
  context: {
    errorMsg: null,
    isLoading: false,
    accessToken: getTokenFromLocalStorage()?.accessToken,
    refreshToken: getTokenFromLocalStorage()?.refreshToken,
  },
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'loading',
          actions: assign({
            isLoading: () => true,
            errorMsg: () => null,
          }),
        },
        VALIDATE_TOKEN: {
          target: 'validating',
          actions: assign(({ event }) => {
            return {
              accessToken: event.accessToken,
              refreshToken: event.refreshToken,
            };
          }),
        },
        SSO_SUBMIT: {
          target: 'loadingSSO',
          actions: assign({
            isLoading: () => true,
            errorMsg: () => null,
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: 'signInRequest',
        input: ({ event }: { event: { payload: { email: string; password: string } } }) => ({
          email: event.payload.email,
          password: event.payload.password,
        }),
        onDone: {
          target: 'authenticated',
          actions: [
            assign({
              isLoading: () => false,
              errorMsg: () => null,
            }),
            ({ event }: { event: { output: { accessToken: string; refreshToken: string } } }) => {
              store.dispatch(
                setTokens({
                  accessToken: event.output.accessToken ?? '',
                  refreshToken: event.output.refreshToken ?? '',
                })
              );
              saveTokenToLocalStorage(event.output.accessToken ?? '', event.output.refreshToken ?? '');
            },
          ],
        },
        onError: {
          target: 'error',
          actions: assign({
            isLoading: () => false,
            errorMsg: ({ event }) => event.error,
          }),
        },
      },
    },
    loadingSSO: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      invoke: {
        src: 'signInSSORequest',
        input: ({ event }: { event: { payload: { provider: string } } }) => ({
          provider: event.payload.provider,
        }),
        onDone: {
          target: 'authenticated',
          actions: [
            assign({
              isLoading: () => false,
              errorMsg: () => null,
            }),
          ],
        },
        onError: {
          target: 'error',
          actions: assign({
            isLoading: () => false,
            errorMsg: ({ event }) => event.error,
          }),
        },
      },
    },
    validating: {
      invoke: {
        src: 'validateTokenRequest',
        input: ({ context }: { context: IAuthMachineContext }) => ({
          ...context,
        }),
        onDone: {
          target: 'authenticated',
        },
        onError: {
          target: 'refreshing',
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: 'idle',
          actions: [
            assign({
              accessToken: () => null,
              refreshToken: () => null,
              user: () => null,
            }),
            () => {
              console.log('LOGOUT');
              store.dispatch(clearTokens());
              logoutUser();
            },
          ],
        },
        VALIDATE_TOKEN: {
          target: 'validating',

          actions: assign(({ event }) => {
            return {
              accessToken: event.accessToken,
              refreshToken: event.refreshToken,
            };
          }),
        },
      },
    },
    refreshing: {
      invoke: {
        src: 'refreshTokenRequest',
        input: ({ context }: { context: IAuthMachineContext }) => ({
          ...context,
        }),
        onDone: {
          target: 'authenticated',
          actions: [
            assign({
              accessToken: ({ event }: { event: { output: { accessToken: string } } }) => event.output.accessToken,
            }),
            ({ event }: { event: { output: { accessToken: string; refreshToken: string } } }) => {
              saveTokenToLocalStorage(event.output.accessToken, getTokenFromLocalStorage()?.refreshToken ?? event.output.refreshToken);
            },
          ],
        },
        onError: {
          target: 'error',
          actions: [
            assign({
              accessToken: () => null,
              refreshToken: () => null,
              user: () => null,
              errorMsg: () => 'Session expired. Please log in again.',
            }),
            () => {
              store.dispatch(clearTokens());
              logoutUser();
            },
          ],
        },
      },
    },
    error: {
      after: {
        2000: {
          target: 'idle',
        },
      },
    },
  },
});

export default authMachine;

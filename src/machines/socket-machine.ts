import { setup, assign, fromPromise, fromCallback } from 'xstate';
import { io, Socket } from 'socket.io-client';
import { getSession } from 'next-auth/react';
import { ExtendedSession } from '@/types/interfaces';

export interface SocketConfig {
  tenantId?: string;
  chatbotId?: string;
  widgetKey?: string;
  keyPermissions?: string[];
  allowAnonymous?: boolean;
  socketUrl?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  timeout?: number;
}

export interface SocketMachineContext {
  socket: Socket | null;
  config: SocketConfig;
  connectionError: string | null;
  reconnectAttempts: number;
  lastConnectedAt: Date | null;
  connectionId: string | null;
  session: any;
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
}

export type SocketMachineEvent =
  | { type: 'CONNECT' }
  | { type: 'DISCONNECT' }
  | { type: 'RECONNECT' }
  | { type: 'EMIT'; event: string; data?: any }
  | { type: 'CONNECTION_SUCCESS'; socket: Socket }
  | { type: 'CONNECTION_ERROR'; error: string }
  | { type: 'DISCONNECTION'; reason: string }
  | { type: 'UPDATE_CONFIG'; config: Partial<SocketConfig> }
  | { type: 'UPDATE_SESSION'; session: any; status: 'loading' | 'authenticated' | 'unauthenticated' };

const DEFAULT_CONFIG: SocketConfig = {
  autoConnect: true,
  reconnectAttempts: 5,
  timeout: 10000,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3004',
};

const buildAuthPayload = fromPromise(async ({ input }: { input: SocketConfig }) => {
  const config = input;

  if (config.widgetKey && config.chatbotId) {
    return {
      widgetKey: config.widgetKey,
      chatbotId: config.chatbotId,
      keyPermissions: config.keyPermissions || [],
      allowAnonymous: config.allowAnonymous || true,
    };
  } else {
    const currentSession = (await getSession()) as ExtendedSession | null;
    const accessToken = currentSession?.accessToken;

    // console.log('🔌 Building auth payload...', {
    //   tenantId: config.tenantId,
    //   chatbotId: config.chatbotId,
    //   hasToken: !!accessToken,
    //   tokenLength: accessToken?.length || 0,
    //   tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'null',
    // });

    if (!accessToken) {
      throw new Error('No access token available for socket authentication');
    }

    const authPayload = {
      token: accessToken,
    };

    console.log('🔑 Final auth payload being sent:', authPayload);
    return authPayload;
  }
});

const createSocketConnection = fromCallback(({ input, sendBack }: { input: { config: SocketConfig; authPayload: any }; sendBack: any }) => {
  const { config, authPayload } = input;

  // console.log('🚀 Creating socket with:', {
  //   url: config.socketUrl,
  //   auth: authPayload,
  //   timeout: config.timeout,
  // });

  const socket = io(config.socketUrl!, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false, // We'll handle reconnection ourselves
    timeout: config.timeout,
    auth: authPayload,
    query: authPayload,
  });

  let connectionSuccessful = false;

  // Connection success
  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket.id);
    connectionSuccessful = true;
    sendBack({ type: 'CONNECTION_SUCCESS', socket });
  });

  // Listen for successful authentication confirmation from server
  socket.on('connected', (data: any) => {
    console.log('✅ Authentication successful!', data);
  });

  // Listen for authentication errors
  socket.on('error', (error: any) => {
    console.error('❌ Socket Error:', error);
    sendBack({ type: 'CONNECTION_ERROR', error: error.message || 'Socket error' });
  });

  // Connection error
  socket.on('connect_error', (error: any) => {
    console.error('🔴 Socket connection error:', {
      error: error.message,
      description: error.description || 'No description',
    });

    let errorMessage = 'Connection failed';

    if (error.message?.includes('Authentication') || error.message?.includes('JWT') || error.message?.includes('token')) {
      errorMessage = 'Authentication failed - please refresh the page';
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      errorMessage = 'Access denied - invalid credentials';
    } else if (error.message?.includes('404')) {
      errorMessage = 'Service not found';
    } else if (error.message) {
      errorMessage = error.message;
    }

    sendBack({ type: 'CONNECTION_ERROR', error: errorMessage });
  });

  // Disconnection
  socket.on('disconnect', (reason: string) => {
    console.log('🔴 Socket disconnected:', reason);
    sendBack({ type: 'DISCONNECTION', reason });
  });

  return () => {
    console.log('🔌 Cleaning up socket connection...');
    // Only disconnect if connection was not successful
    if (!connectionSuccessful) {
      console.log('🔌 Connection was not successful, disconnecting...');
      socket.disconnect();
    } else {
      console.log('🔌 Connection was successful, keeping socket alive');
    }
  };
});

export const socketMachine = setup({
  types: {
    context: {} as SocketMachineContext,
    events: {} as SocketMachineEvent,
    input: {} as { config?: SocketConfig },
  },
  actors: {
    buildAuthPayload,
    createSocketConnection,
  },
  actions: {
    initializeConfig: assign({
      config: ({ context }) => ({ ...DEFAULT_CONFIG, ...context.config }),
    }),

    updateConfig: assign({
      config: ({ context, event }) => ({
        ...context.config,
        ...(event as any).config,
      }),
    }),

    updateSession: assign({
      session: ({ event }) => (event as any).session,
      sessionStatus: ({ event }) => (event as any).status,
    }),

    setSocket: assign({
      socket: ({ event }) => (event as any).socket,
      connectionId: ({ event }) => (event as any).socket?.id || null,
      lastConnectedAt: () => new Date(),
      connectionError: null,
      reconnectAttempts: 0,
    }),

    setConnectionError: assign({
      connectionError: ({ event }) => (event as any).error,
      socket: null,
      connectionId: null,
    }),

    incrementReconnectAttempts: assign({
      reconnectAttempts: ({ context }) => context.reconnectAttempts + 1,
    }),

    resetReconnectAttempts: assign({
      reconnectAttempts: 0,
    }),

    clearSocket: assign({
      socket: null,
      connectionId: null,
      connectionError: null,
    }),

    emitEvent: ({ context, event }) => {
      const { event: eventName, data } = event as any;
      if (context.socket?.connected) {
        context.socket.emit(eventName, data);
      } else {
        console.warn('⚠️ Attempted to emit event on disconnected socket:', eventName);
      }
    },
  },

  guards: {
    shouldReconnect: ({ context }) => context.reconnectAttempts < (context.config.reconnectAttempts || 5),

    isServerDisconnect: ({ event }) => (event as any).reason === 'io server disconnect',

    canConnect: ({ context }) => !context.socket?.connected,

    shouldAutoConnect: ({ context, event }) => {
      const hasUser = !!(context.session || (event as any)?.session);
      const isAuthenticated = context.sessionStatus === 'authenticated' || !!(event as any)?.session?.user;
      const autoConnectEnabled = context.config.autoConnect !== false;
      const shouldConnect = autoConnectEnabled && hasUser && isAuthenticated;

      console.log('🔌 Auto-connect check:', {
        autoConnect: context.config.autoConnect,
        hasUser,
        sessionStatus: context.sessionStatus,
        shouldConnect,
      });

      return !!shouldConnect;
    },
  },
})
  .createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SwPYGMDWYAuA6CAlrGigHalhraQDEAwgPIByTAonQCoDaADALqJQABxSwC2AmUEgAHogCMAZh4AWXAA51AJnWKVAVgBs+gJyGlAGhABPBTtwqTTk+pN6VigOy6Avj6uomDj4RCTklNQQNACqAAoAIgCCHKwA+oxMAGIAkgDivAJIICJiElJFcgjyqlq4PK4mPFqeekaaVrYIivq1Jo4uSvqKujx9fgHoWHiExGQUVLRxSSmpAMqsq6vZzAXSJeKSpNKVSqoa2roGxmaWNgreuM4ufcqe8ire4yCBUyGz4Qsoktkml1pttkwuPJCsJRAdyqBKgNcHphq4tG4ePJPJ4OogtEYHGZNDxDCZmt5DIovj9gmF5hJSFAaBAyGBcARSAA3FBYXC0vD0iKcqAITk8tAAQzKpAKuyK+xlx3xKixuB6ek8bmG8nkhjxVR4Q1wbwJSi0o0a6kMNMmdLmwqZNDAACcXSgXbghAAbaUAMw9AFt+XbBQ6qCKxdz0NLDnL+Hs4UqKiqmhpTDpPPpTN11AbPGTcDp5BaeIpMdVqf5vqHcJKAK7YAAWYFIEiljOZrIoHOjfIFdcbLbbBA7kfFMZl8ZhxSTh2VVVVJjqPBxFuGZdMBpUhkMDiGSnU8iMBJU8ltQTwDebrfbsadGTYnAha2idDoG1W8thpXnKcXWh7lo8jWvoIG7io6gqCoBqnLUGL6NanikkM6ieBevzXsOd6dvQzBPhwL6sAASsRDDEd+s6-gisgKCYxquLoWoGM8LgGuoiHqiehiONUhhNPoGH2gCkQ0PE2SrI+7DcAmCpzjRlSAfIJplkoBgfG4VIGooyi4CWmqqFqHHDCoQlhiJtCsAAstkMkzoqf6IoghYuBcniliSzSwTqKKKFowyGC05Igeh1YDkKgJiRJUnPjssk-vCRz-kpKmKGp+gaYoWl3AgKiAeqBb6G87yjKSBJmbgEWieJkn4dJEJQvZ8lJU5CApchaWtJl2WdLq3QOIF7kga4gX0RVVW0DVMWETsWhNdRLW0W15ipel3WKLBHy9FmRheC0xjnmFtYTUCCQgukzA5Pk8VUYlC4GBoxalvRerkjBOUllBGhav56hYllP3jeGonAisYJbHF813f+eUrjw8MI4jWLvb1w0OIB9TkpoSguBVLqUMDIpRbVLDSZRDkKYgWrLt4JjHiWjhgVqsH1HuGaeB4VIY+5eMEyJRPEewdWcOTzULtTJquPTWiM9iJgGohajrsBMu6Ee5a81VRMyLA2DSuykp+tQLoABT41V8RgL61gAJQ0AO5uE0yosLeLTiS3TYEyy9zMfSBih1AY6K5u8u4Va67ounhpMizdFOLYpqrKRqmU6nq7GGLULQeEY1QM-U4duh6NCC9NLvQ61MtqinWo6Ue6c5XTAf+R4fS7qWBiF5HxNl3HYvJaoAd06qaUEi4mfaVoWeAbtteQZ3R2XrgEfF6DaQZFd5fJpXFr6LgPFQaqxnVPo7FqqqmdZRimcc1WExLyvUdr2sn4NX3rvJRaynaE07lku4aF8xnHomlXQZITDIVcH4aspAUAQDgNIAUiYP6tQALR7yeJgp41oDSoL3EjAh8MOIVRmCdZBFclonzZvIMwrwNJkn1DldSDhVLKFXG4ZCplF6-C1kych28lqAUgiaao1ooL8WxuxPQekwKqCKhAjM6gKpYVvKOe8UB+GOUobuPeHgOb6RoY4M8LNjwmnomhHUZ4dJcPvjw4GkBNGUwQG8OoGV-4QOaNoAkm1tCSwyuWHSRUoKaydhouSKClpUmXAeQCt9VCjFxH7dy6N6iWMgu8O+NYH5FxdI4hO+IzSPBKiBGWWYCSJM6I0WoHE3AcSaCBQ80CfBAA */
    id: 'socket',
    initial: 'disconnected',

    context: ({ input }) => ({
      socket: null,
      config: { ...DEFAULT_CONFIG, ...(input.config || {}) },
      connectionError: null,
      reconnectAttempts: 0,
      lastConnectedAt: null,
      connectionId: null,
      session: null,
      sessionStatus: 'loading' as const,
    }),

    entry: 'initializeConfig',

    states: {
      disconnected: {
        on: {
          CONNECT: {
            guard: 'canConnect',
            target: 'connecting',
          },
          UPDATE_CONFIG: {
            actions: 'updateConfig',
          },
          UPDATE_SESSION: [
            {
              guard: 'shouldAutoConnect',
              target: 'connecting',
              actions: 'updateSession',
            },
            {
              actions: 'updateSession',
            },
          ],
        },
      },

      connecting: {
        invoke: [
          {
            src: 'buildAuthPayload',
            input: ({ context }) => context.config,
            onDone: {
              target: 'authenticating',
            },
            onError: {
              target: 'error',
              actions: assign({
                connectionError: ({ event }) => (event as any).error?.message || 'Authentication failed',
              }),
            },
          },
        ],
      },

      authenticating: {
        invoke: {
          src: 'createSocketConnection',
          input: ({ context, event }) => ({
            config: context.config,
            authPayload: (event as any).output,
          }),
          onDone: 'disconnected', // This won't be called, but required
        },
        on: {
          CONNECTION_SUCCESS: {
            target: 'connected',
            actions: ['setSocket', 'resetReconnectAttempts'],
          },
          CONNECTION_ERROR: {
            target: 'error',
            actions: ['setConnectionError', 'incrementReconnectAttempts'],
          },
        },
      },

      connected: {
        on: {
          DISCONNECT: {
            target: 'disconnected',
            actions: 'clearSocket',
          },
          EMIT: {
            actions: 'emitEvent',
          },
          DISCONNECTION: [
            {
              guard: 'isServerDisconnect',
              target: 'disconnected',
              actions: assign({
                socket: null,
                connectionId: null,
                connectionError: 'Server initiated disconnect',
              }),
            },
            {
              guard: 'shouldReconnect',
              target: 'reconnecting',
              actions: ['clearSocket', 'incrementReconnectAttempts'],
            },
            {
              target: 'error',
              actions: assign({
                socket: null,
                connectionId: null,
                connectionError: 'Max reconnection attempts reached',
              }),
            },
          ],
          UPDATE_CONFIG: {
            actions: 'updateConfig',
          },
          UPDATE_SESSION: {
            actions: 'updateSession',
          },
        },
      },

      reconnecting: {
        after: {
          // Exponential backoff: min(1000 * 2^attempts, 30000)
          reconnectDelay: {
            target: 'connecting',
          },
        },
        on: {
          DISCONNECT: {
            target: 'disconnected',
            actions: 'clearSocket',
          },
          RECONNECT: {
            target: 'connecting',
          },
        },
      },

      error: {
        on: {
          CONNECT: {
            target: 'connecting',
          },
          RECONNECT: {
            target: 'connecting',
          },
          DISCONNECT: {
            target: 'disconnected',
            actions: 'clearSocket',
          },
          UPDATE_CONFIG: {
            actions: 'updateConfig',
          },
          UPDATE_SESSION: {
            actions: 'updateSession',
          },
        },
      },
    },
  })
  .provide({
    delays: {
      reconnectDelay: ({ context }: { context: SocketMachineContext }) => {
        const delay = Math.min(1000 * Math.pow(2, context.reconnectAttempts), 30000);
        console.log(`🔄 Retrying connection in ${delay}ms...`);
        return delay;
      },
    },
  });

export type SocketMachine = typeof socketMachine;

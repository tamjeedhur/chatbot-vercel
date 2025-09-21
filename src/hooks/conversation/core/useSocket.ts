'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import { socketMachine, SocketConfig } from '@/machines/socket-machine';

export interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  reconnectAttempts: number;
  lastConnectedAt: Date | null;
}

export interface UseSocketReturn extends SocketState {
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  emit: (event: string, data?: any) => void;
  isReady: boolean;
}

export type { SocketConfig };

/**
 * Unified socket management hook that handles authentication, connection lifecycle,
 * and provides a clean interface for socket operations using XState.
 *
 * Supports both authenticated (dashboard) and anonymous (widget) connections.
 */
export function useSocket(config: SocketConfig = {}): UseSocketReturn {
  const { data: session, status } = useSession();

  // Initialize XState machine with config
  const [state, send] = useMachine(socketMachine, {
    input: { config },
  });

  // console.log('🔌 Socket state:', state);
  // Update session state in the machine whenever session changes
  useEffect(() => {
    // Map NextAuth status to socket machine sessionStatus
    const sessionStatus = status === 'authenticated' ? 'authenticated' : status === 'unauthenticated' ? 'unauthenticated' : 'loading';

    // console.log('🔌 Session update:', {
    //   nextAuthStatus: status,
    //   socketSessionStatus: sessionStatus,
    //   hasUser: session?.user,
    //   userEmail: session?.user?.email,
    // });

    send({
      type: 'UPDATE_SESSION',
      session,
      status: sessionStatus,
    });
  }, [session, status, send]);

  // Actions
  const connect = useCallback(() => {
    send({ type: 'CONNECT' });
  }, [send]);

  const disconnect = useCallback(() => {
    console.log('🔌 Manually disconnecting socket...');
    send({ type: 'DISCONNECT' });
  }, [send]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnection requested...');
    send({ type: 'RECONNECT' });
  }, [send]);

  const emit = useCallback(
    (event: string, data?: any) => {
      send({ type: 'EMIT', event, data });
    },
    [send]
  );

  // Computed state values
  const computedState = useMemo(
    (): SocketState => ({
      socket: state.context.socket,
      isConnected: state.matches('connected'),
      isConnecting: state.matches('connecting') || state.matches('authenticating'),
      connectionError: state.context.connectionError,
      reconnectAttempts: state.context.reconnectAttempts,
      lastConnectedAt: state.context.lastConnectedAt,
    }),
    [state]
  );

  const isReady = useMemo(() => computedState.isConnected && !computedState.isConnecting && !computedState.connectionError, [computedState]);

  return {
    ...computedState,
    connect,
    disconnect,
    reconnect,
    emit,
    isReady,
  };
}

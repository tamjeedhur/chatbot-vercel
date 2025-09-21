"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface ScrapingProgressData {
  jobId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  progress: number;
  currentUrl?: string;
  errorMessages?: string[];
  estimatedTimeRemaining?: number;
}

export interface SSEMessage {
  type: 'connected' | 'progress' | 'job_completed' | 'heartbeat' | 'error' | 'info' | 'test';
  data?: ScrapingProgressData | any;
  message?: string;
  timestamp?: string;
}

export interface UseScrapingSSEConfig {
  accessToken?: string;
  tenantId?: string;
  jobId?: string;
  baseUrl?: string;
  onProgress?: (data: ScrapingProgressData) => void;
  onJobCompleted?: (data: ScrapingProgressData) => void;
  onError?: (error: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  autoConnect?: boolean;
}

export interface UseScrapingSSEReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: SSEMessage | null;
  connect: (jobId?: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useScrapingSSE({
  accessToken,
  tenantId,
  jobId,
  baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005',
  onProgress,
  onJobCompleted,
  onError,
  onConnected,
  onDisconnected,
  autoConnect = false,
}: UseScrapingSSEConfig): UseScrapingSSEReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentJobIdRef = useRef<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (readerRef.current) {
      readerRef.current.cancel();
      readerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const handleMessage = useCallback((message: SSEMessage) => {
    console.log('🔄 SSE Message received:', message);
    setLastMessage(message);

    switch (message.type) {
      case 'connected':
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
        onConnected?.();
        break;

      case 'progress':
        if (message.data && onProgress) {
          onProgress(message.data as ScrapingProgressData);
        }
        break;

      case 'job_completed':
        if (message.data && onJobCompleted) {
          onJobCompleted(message.data as ScrapingProgressData);
        }
        // Auto-disconnect after job completion
        setTimeout(() => {
          disconnect();
        }, 1000);
        break;

      case 'error':
        const errorMsg = message.message || 'Unknown error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
        break;

      case 'heartbeat':
        // Keep connection alive
        break;

      default:
        console.log('📨 Unhandled SSE message type:', message.type);
    }
  }, [onProgress, onJobCompleted, onError, onConnected]);

  const connectWithFetch = useCallback(async (targetJobId?: string) => {
    console.log('🔌 connectWithFetch called with:', { 
      targetJobId, 
      isConnecting, 
      isConnected, 
      currentJobId: currentJobIdRef.current 
    });

    if (isConnecting) {
      console.log('🔄 SSE connection already in progress');
      return;
    }

    // If already connected to the same job, don't reconnect
    if (isConnected && targetJobId === currentJobIdRef.current) {
      console.log('🔄 Already connected to the same job');
      return;
    }

    // Disconnect existing connection before creating new one
    if (isConnected) {
      console.log('🔌 Disconnecting existing connection');
      cleanup();
    }

    if (!accessToken || !tenantId) {
      const errorMsg = 'Access token and tenant ID are required for SSE connection';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsConnecting(true);
    setError(null);
    currentJobIdRef.current = targetJobId || null;

    try {
      // Construct the SSE endpoint URL
      let sseUrl = `${baseUrl}/api/v1/datasources/scraping/stream`;
      if (targetJobId) {
        sseUrl += `/${targetJobId}`;
      }

      console.log('🔌 Connecting to SSE:', sseUrl);

      // Create abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const headers: Record<string, string> = {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Authorization': accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`,
        'X-Tenant-ID': tenantId,
      };

      const response = await fetch(sseUrl, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is not readable');
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      // Send connected message
      handleMessage({ type: 'connected', message: 'SSE connection established' });

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('📡 SSE stream ended');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim()) {
              try {
                const parsed = JSON.parse(data) as SSEMessage;
                handleMessage(parsed);
              } catch (error) {
                console.error('❌ Failed to parse SSE message:', error, data);
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🔌 SSE connection aborted');
        return;
      }

      console.error('❌ SSE connection error:', error);
      const errorMsg = error.message || 'Failed to connect to SSE stream';
      setError(errorMsg);
      setIsConnected(false);
      setIsConnecting(false);
      onError?.(errorMsg);

      // Attempt reconnection if not manually disconnected
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
        console.log(`🔄 Attempting reconnection ${reconnectAttempts.current}/${maxReconnectAttempts} in ${delay}ms`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWithFetch(targetJobId);
        }, delay);
      } else {
        console.error('❌ Max reconnection attempts reached');
        onError?.('Max reconnection attempts reached. Please refresh the page.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [accessToken, tenantId, baseUrl, handleMessage, onError]); // Removed isConnecting and isConnected to prevent loops

  const connect = useCallback((targetJobId?: string) => {
    const finalJobId = targetJobId || jobId;
    connectWithFetch(finalJobId);
  }, [connectWithFetch]); // Removed jobId from dependencies since targetJobId is passed explicitly

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting SSE...');
    cleanup();
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    reconnectAttempts.current = 0;
    currentJobIdRef.current = null;
    onDisconnected?.();
  }, [cleanup, onDisconnected]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnection requested...');
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // Auto-connect effect
  useEffect(() => {
    if (autoConnect && accessToken && tenantId && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, accessToken, tenantId, isConnected, isConnecting, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isConnected,
    isConnecting,
    error,
    lastMessage,
    connect,
    disconnect,
    reconnect,
  };
}

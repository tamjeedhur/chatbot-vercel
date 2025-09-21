'use client';

import { useEffect, useRef, useState } from 'react';

interface CrawlProgress {
  jobId: string;
  status: 'in_progress' | 'completed' | 'failed';
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  progress: number;
  currentUrl?: string;
  savedDocuments: number;
  duration?: number;
  recentlyCompletedDocuments?: Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    metadata: any;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface CrawlSSEState {
  isConnected: boolean;
  progress: CrawlProgress | null;
  error: string | null;
  jobId: string | null;
}

/**
 * Alternative SSE hook using fetch with streaming for better authentication support
 * This approach allows us to send custom headers including Authorization
 */
export function useCrawlSSEWithFetch(streamUrl: string | null, accessToken: string, onRecentlyCompleted?: (documents: any[]) => void) {
  const [state, setState] = useState<CrawlSSEState>({
    isConnected: false,
    progress: null,
    error: null,
    jobId: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!streamUrl || !accessToken) {
      console.log('🔌 useCrawlSSEWithFetch - Missing streamUrl or accessToken:', { streamUrl, accessToken: !!accessToken });
      return;
    }

    console.log('🔌 useCrawlSSEWithFetch - Connecting to new stream URL:', streamUrl);

    // Cancel existing request
    if (abortControllerRef.current) {
      console.log('🔄 useCrawlSSEWithFetch - Cancelling existing request');
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Use fetch with streaming
    const fetchStream = async () => {
      try {
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
            Authorization: `Bearer ${accessToken}`,
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setState((prev) => ({
          ...prev,
          isConnected: true,
          error: null,
        }));

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim() === '') continue;

            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix

              try {
                const parsed = JSON.parse(data);

                switch (parsed.type) {
                  case 'connected':
                    break;

                  case 'progress':
                    setState((prev) => ({
                      ...prev,
                      progress: parsed.data,
                      jobId: parsed.data.jobId,
                      error: null,
                    }));

                    // Handle recently completed documents
                    if (parsed.data.recentlyCompletedDocuments && onRecentlyCompleted) {
                      onRecentlyCompleted(parsed.data.recentlyCompletedDocuments);
                    }
                    break;

                  case 'complete':
                    setState((prev) => ({
                      ...prev,
                      progress: {
                        ...prev.progress!,
                        status: 'completed',
                        completedUrls: parsed.data.completedUrls,
                        totalUrls: parsed.data.totalUrls,
                        savedDocuments: parsed.data.savedDocuments,
                        duration: parsed.data.duration,
                      },
                    }));
                    break;

                  case 'error':
                    setState((prev) => ({
                      ...prev,
                      error: parsed.data.error || 'Unknown error occurred',
                      progress: prev.progress
                        ? {
                            ...prev.progress,
                            status: 'failed',
                          }
                        : null,
                    }));
                    break;

                  case 'heartbeat':
                    break;

                  default:
                    break;
                }
              } catch (parseError) {
                setState((prev) => ({
                  ...prev,
                  error: 'Failed to parse server message',
                }));
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;

        setState((prev) => ({
          ...prev,
          isConnected: false,
          error: error.message || 'Connection failed',
        }));
      }
    };

    fetchStream();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [streamUrl, accessToken]);

  // Manual close function
  const closeConnection = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState((prev) => ({
        ...prev,
        isConnected: false,
      }));
    }
  };

  return {
    ...state,
    closeConnection,
  };
}

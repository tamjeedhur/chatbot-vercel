'use client';

import { useCallback, useEffect, useRef } from 'react';
import { BaseMessage } from '../messages/useMessages';

export interface SyncEvent {
  id: string;
  type: 'message' | 'conversation' | 'presence' | 'typing' | 'status';
  conversationId: string;
  timestamp: number;
  data: any;
  tabId: string;
}

export interface UseConversationSyncOptions {
  conversationId: string;
  enabled?: boolean;
  tabId?: string;
  syncKey?: string;
  onMessageSync?: (message: BaseMessage) => void;
  onConversationSync?: (conversation: any) => void;
  onPresenceSync?: (presence: any) => void;
  onTypingSync?: (typing: any) => void;
  onStatusSync?: (status: any) => void;
}

export interface UseConversationSyncReturn {
  // Sync operations
  syncMessage: (message: BaseMessage) => void;
  syncConversation: (conversation: any) => void;
  syncPresence: (presence: any) => void;
  syncTyping: (typing: any) => void;
  syncStatus: (status: any) => void;

  // Generic sync
  syncEvent: (type: SyncEvent['type'], data: any) => void;

  // State
  isEnabled: boolean;
  currentTabId: string;

  // Utilities
  enableSync: () => void;
  disableSync: () => void;
  clearSyncStorage: () => void;
}

/**
 * Hook for synchronizing conversation state across browser tabs.
 * Uses localStorage events to maintain consistency across multiple instances.
 */
export function useConversationSync({
  conversationId,
  enabled = true,
  tabId,
  syncKey = 'conversation-sync',
  onMessageSync,
  onConversationSync,
  onPresenceSync,
  onTypingSync,
  onStatusSync,
}: UseConversationSyncOptions): UseConversationSyncReturn {
  const enabledRef = useRef(enabled);
  const currentTabId = useRef(tabId || generateTabId());
  const lastEventIdRef = useRef<string>('');

  // Generate unique tab ID
  function generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique event ID
  const generateEventId = useCallback((): string => {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Send sync event to other tabs
  const sendSyncEvent = useCallback(
    (type: SyncEvent['type'], data: any) => {
      if (!enabledRef.current || typeof window === 'undefined') return;

      const event: SyncEvent = {
        id: generateEventId(),
        type,
        conversationId,
        timestamp: Date.now(),
        data,
        tabId: currentTabId.current,
      };

      try {
        localStorage.setItem(syncKey, JSON.stringify(event));
        lastEventIdRef.current = event.id;

        console.log(`🔄 Synced ${type} event to other tabs:`, event.id);
      } catch (error) {
        console.error('❌ Failed to sync event:', error);
      }
    },
    [conversationId, generateEventId, syncKey]
  );

  // Sync specific event types
  const syncMessage = useCallback(
    (message: BaseMessage) => {
      sendSyncEvent('message', { message });
    },
    [sendSyncEvent]
  );

  const syncConversation = useCallback(
    (conversation: any) => {
      sendSyncEvent('conversation', { conversation });
    },
    [sendSyncEvent]
  );

  const syncPresence = useCallback(
    (presence: any) => {
      sendSyncEvent('presence', { presence });
    },
    [sendSyncEvent]
  );

  const syncTyping = useCallback(
    (typing: any) => {
      sendSyncEvent('typing', { typing });
    },
    [sendSyncEvent]
  );

  const syncStatus = useCallback(
    (status: any) => {
      sendSyncEvent('status', { status });
    },
    [sendSyncEvent]
  );

  const syncEvent = useCallback(
    (type: SyncEvent['type'], data: any) => {
      sendSyncEvent(type, data);
    },
    [sendSyncEvent]
  );

  // Enable/disable sync
  const enableSync = useCallback(() => {
    enabledRef.current = true;
  }, []);

  const disableSync = useCallback(() => {
    enabledRef.current = false;
  }, []);

  // Clear sync storage
  const clearSyncStorage = useCallback(() => {
    try {
      localStorage.removeItem(syncKey);
    } catch (error) {
      console.error('❌ Failed to clear sync storage:', error);
    }
  }, [syncKey]);

  // Handle incoming sync events from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== syncKey || !e.newValue || !enabledRef.current) return;

      try {
        const event: SyncEvent = JSON.parse(e.newValue);

        // Ignore events from this tab or for different conversations
        if (event.tabId === currentTabId.current || event.conversationId !== conversationId) {
          return;
        }

        // Ignore duplicate events
        if (event.id === lastEventIdRef.current) {
          return;
        }

        // Ignore old events (older than 5 seconds)
        if (Date.now() - event.timestamp > 5000) {
          return;
        }

        console.log(`📨 Received ${event.type} sync event from tab ${event.tabId}:`, event.id);

        // Route to appropriate handler
        switch (event.type) {
          case 'message':
            if (onMessageSync && event.data.message) {
              onMessageSync(event.data.message);
            }
            break;

          case 'conversation':
            if (onConversationSync && event.data.conversation) {
              onConversationSync(event.data.conversation);
            }
            break;

          case 'presence':
            if (onPresenceSync && event.data.presence) {
              onPresenceSync(event.data.presence);
            }
            break;

          case 'typing':
            if (onTypingSync && event.data.typing) {
              onTypingSync(event.data.typing);
            }
            break;

          case 'status':
            if (onStatusSync && event.data.status) {
              onStatusSync(event.data.status);
            }
            break;

          default:
            console.warn('⚠️ Unknown sync event type:', event.type);
        }

        lastEventIdRef.current = event.id;
      } catch (error) {
        console.error('❌ Failed to parse sync event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncKey, conversationId, onMessageSync, onConversationSync, onPresenceSync, onTypingSync, onStatusSync]);

  // Update enabled state
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Send a cleanup event to notify other tabs
      if (enabledRef.current) {
        sendSyncEvent('status', {
          type: 'tab-closing',
          tabId: currentTabId.current,
        });
      }
    };
  }, [sendSyncEvent]);

  return {
    syncMessage,
    syncConversation,
    syncPresence,
    syncTyping,
    syncStatus,
    syncEvent,
    isEnabled: enabledRef.current,
    currentTabId: currentTabId.current,
    enableSync,
    disableSync,
    clearSyncStorage,
  };
}

/**
 * Utility hook for listening to specific sync events
 */
export function useSyncEventListener(
  eventType: SyncEvent['type'],
  conversationId: string,
  callback: (data: any) => void,
  options: { enabled?: boolean; syncKey?: string } = {}
) {
  const { enabled = true, syncKey = 'conversation-sync' } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== syncKey || !e.newValue) return;

      try {
        const event: SyncEvent = JSON.parse(e.newValue);

        if (event.type === eventType && event.conversationId === conversationId) {
          callback(event.data);
        }
      } catch (error) {
        console.error('❌ Failed to parse sync event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [eventType, conversationId, callback, enabled, syncKey]);
}

/**
 * Utility function to create a sync-aware state updater
 */
export function createSyncAwareUpdater<T>(setState: (updater: (prev: T) => T) => void, syncFn: (data: any) => void, syncEnabled = true) {
  return (updater: (prev: T) => T, syncData?: any) => {
    setState(updater);

    if (syncEnabled && syncData) {
      syncFn(syncData);
    }
  };
}

/**
 * Utility function to merge sync data with local state
 */
export function mergeSyncData<T>(localData: T, syncData: T, mergeStrategy: 'replace' | 'merge' | 'timestamp' = 'timestamp'): T {
  switch (mergeStrategy) {
    case 'replace':
      return syncData;

    case 'merge':
      if (localData !== null && syncData !== null && typeof localData === 'object' && typeof syncData === 'object') {
        return { ...localData, ...syncData };
      }
      return syncData;

    case 'timestamp':
      if (
        localData !== null &&
        syncData !== null &&
        typeof localData === 'object' &&
        typeof syncData === 'object' &&
        'timestamp' in localData &&
        'timestamp' in syncData
      ) {
        const localTime = new Date((localData as any).timestamp).getTime();
        const syncTime = new Date((syncData as any).timestamp).getTime();
        return syncTime > localTime ? syncData : localData;
      }
      return syncData;

    default:
      return syncData;
  }
}

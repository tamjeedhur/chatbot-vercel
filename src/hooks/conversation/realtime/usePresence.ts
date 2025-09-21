'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';

export interface PresenceUser {
  id: string;
  name: string;
  type: 'user' | 'agent' | 'ai';
  isOnline: boolean;
  lastSeen: Date;
  joinedAt: Date;
  metadata?: {
    avatar?: string;
    role?: string;
    status?: 'active' | 'idle' | 'busy' | 'away';
    location?: string;
  };
}

export interface PresenceState {
  users: Map<string, PresenceUser>;
  onlineCount: number;
  userCount: number;
  agentCount: number;
  currentUser: PresenceUser | null;
}

export interface UsePresenceOptions {
  socket: Socket | null;
  conversationId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserType?: 'user' | 'agent' | 'ai';
  enableHeartbeat?: boolean;
  heartbeatInterval?: number;
  presenceTimeout?: number; // Time before marking user as offline
  enableCrossSyncSync?: boolean;
}

export interface UsePresenceReturn extends PresenceState {
  // Presence management
  joinPresence: (metadata?: PresenceUser['metadata']) => void;
  leavePresence: () => void;
  updatePresence: (metadata: Partial<PresenceUser['metadata']>) => void;
  sendHeartbeat: () => void;

  // User queries
  getOnlineUsers: () => PresenceUser[];
  getOfflineUsers: () => PresenceUser[];
  getUsersByType: (type: PresenceUser['type']) => PresenceUser[];
  getUserById: (userId: string) => PresenceUser | undefined;
  isUserOnline: (userId: string) => boolean;

  // Statistics
  getPresenceStats: () => {
    total: number;
    online: number;
    offline: number;
    users: number;
    agents: number;
    ai: number;
  };

  // Display helpers
  getOnlineUserNames: () => string[];
  getPresenceDisplayText: () => string;

  // State management
  clearPresence: () => void;
  removeUser: (userId: string) => void;
}

/**
 * Hook for managing user presence in conversations.
 * Tracks who's online, offline, and provides real-time presence updates.
 */
export function usePresence({
  socket,
  conversationId,
  currentUserId = 'user',
  currentUserName = 'You',
  currentUserType = 'user',
  enableHeartbeat = true,
  heartbeatInterval = 30000, // 30 seconds
  presenceTimeout = 60000, // 1 minute
  enableCrossSyncSync = true,
}: UsePresenceOptions): UsePresenceReturn {
  const [state, setState] = useState<PresenceState>({
    users: new Map(),
    onlineCount: 0,
    userCount: 0,
    agentCount: 0,
    currentUser: null,
  });

  // Refs for management
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const presenceTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const hasJoinedRef = useRef<boolean>(false);

  const updateState = useCallback((updater: (prev: PresenceState) => PresenceState) => {
    setState(updater);
  }, []);

  // Clear timeout for a user
  const clearUserTimeout = useCallback((userId: string) => {
    const timeout = presenceTimeoutsRef.current.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      presenceTimeoutsRef.current.delete(userId);
    }
  }, []);

  // Set timeout to mark user as offline
  const setUserTimeout = useCallback(
    (userId: string) => {
      clearUserTimeout(userId);

      const timeout = setTimeout(() => {
        updateState((prev) => {
          const user = prev.users.get(userId);
          if (user && user.isOnline) {
            const updatedUser: PresenceUser = {
              ...user,
              isOnline: false,
              lastSeen: new Date(),
            };

            const newUsers = new Map(prev.users);
            newUsers.set(userId, updatedUser);

            const onlineUsers = Array.from(newUsers.values()).filter((u) => u.isOnline);

            return {
              ...prev,
              users: newUsers,
              onlineCount: onlineUsers.length,
              userCount: onlineUsers.filter((u) => u.type === 'user').length,
              agentCount: onlineUsers.filter((u) => u.type === 'agent').length,
            };
          }
          return prev;
        });

        presenceTimeoutsRef.current.delete(userId);
      }, presenceTimeout);

      presenceTimeoutsRef.current.set(userId, timeout);
    },
    [presenceTimeout, updateState, clearUserTimeout]
  );

  // Add or update user presence
  const addOrUpdateUser = useCallback(
    (
      user: Omit<PresenceUser, 'joinedAt' | 'lastSeen'> & {
        joinedAt?: Date;
        lastSeen?: Date;
      }
    ) => {
      const now = new Date();

      updateState((prev) => {
        const existingUser = prev.users.get(user.id);

        const updatedUser: PresenceUser = {
          joinedAt: now,
          ...existingUser,
          ...user,
          lastSeen: user.isOnline ? now : user.lastSeen || existingUser?.lastSeen || now,
        };

        const newUsers = new Map(prev.users);
        newUsers.set(user.id, updatedUser);

        const onlineUsers = Array.from(newUsers.values()).filter((u) => u.isOnline);

        const newState = {
          ...prev,
          users: newUsers,
          onlineCount: onlineUsers.length,
          userCount: onlineUsers.filter((u) => u.type === 'user').length,
          agentCount: onlineUsers.filter((u) => u.type === 'agent').length,
          currentUser: user.id === currentUserId ? updatedUser : prev.currentUser,
        };

        return newState;
      });

      // Set timeout for online users
      if (user.isOnline) {
        setUserTimeout(user.id);
      } else {
        clearUserTimeout(user.id);
      }
    },
    [updateState, currentUserId, setUserTimeout, clearUserTimeout]
  );

  // Remove user from presence
  const removeUser = useCallback(
    (userId: string) => {
      clearUserTimeout(userId);

      updateState((prev) => {
        const newUsers = new Map(prev.users);
        newUsers.delete(userId);

        const onlineUsers = Array.from(newUsers.values()).filter((u) => u.isOnline);

        return {
          ...prev,
          users: newUsers,
          onlineCount: onlineUsers.length,
          userCount: onlineUsers.filter((u) => u.type === 'user').length,
          agentCount: onlineUsers.filter((u) => u.type === 'agent').length,
          currentUser: userId === currentUserId ? null : prev.currentUser,
        };
      });
    },
    [updateState, currentUserId, clearUserTimeout]
  );

  // Join presence
  const joinPresence = useCallback(
    (metadata?: PresenceUser['metadata']) => {
      if (!socket || hasJoinedRef.current) return;

      const presenceData = {
        conversationId,
        userId: currentUserId,
        userName: currentUserName,
        userType: currentUserType,
        metadata: metadata || {},
      };

      socket.emit('join-presence', presenceData);
      hasJoinedRef.current = true;

      // Add self to presence
      addOrUpdateUser({
        id: currentUserId,
        name: currentUserName,
        type: currentUserType,
        isOnline: true,
        metadata,
      });

      console.log('👋 Joined presence:', currentUserId);
    },
    [socket, conversationId, currentUserId, currentUserName, currentUserType, addOrUpdateUser]
  );

  // Leave presence
  const leavePresence = useCallback(() => {
    if (!socket || !hasJoinedRef.current) return;

    socket.emit('leave-presence', {
      conversationId,
      userId: currentUserId,
    });

    hasJoinedRef.current = false;

    // Mark self as offline
    addOrUpdateUser({
      id: currentUserId,
      name: currentUserName,
      type: currentUserType,
      isOnline: false,
    });

    console.log('👋 Left presence:', currentUserId);
  }, [socket, conversationId, currentUserId, currentUserName, currentUserType, addOrUpdateUser]);

  // Update presence metadata
  const updatePresence = useCallback(
    (metadata: Partial<PresenceUser['metadata']>) => {
      if (!socket || !hasJoinedRef.current) return;

      socket.emit('update-presence', {
        conversationId,
        userId: currentUserId,
        metadata,
      });

      // Update self
      updateState((prev) => {
        const currentUser = prev.users.get(currentUserId);
        if (currentUser) {
          const updatedUser: PresenceUser = {
            ...currentUser,
            metadata: { ...currentUser.metadata, ...metadata },
            lastSeen: new Date(),
          };

          const newUsers = new Map(prev.users);
          newUsers.set(currentUserId, updatedUser);

          return {
            ...prev,
            users: newUsers,
            currentUser: updatedUser,
          };
        }
        return prev;
      });
    },
    [socket, conversationId, currentUserId, updateState]
  );

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (!socket || !hasJoinedRef.current) return;

    socket.emit('presence-heartbeat', {
      conversationId,
      userId: currentUserId,
    });

    // Update own last seen
    addOrUpdateUser({
      id: currentUserId,
      name: currentUserName,
      type: currentUserType,
      isOnline: true,
    });
  }, [socket, conversationId, currentUserId, currentUserName, currentUserType, addOrUpdateUser]);

  // Query methods
  const getOnlineUsers = useCallback((): PresenceUser[] => {
    return Array.from(state.users.values())
      .filter((user) => user.isOnline)
      .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  }, [state.users]);

  const getOfflineUsers = useCallback((): PresenceUser[] => {
    return Array.from(state.users.values())
      .filter((user) => !user.isOnline)
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }, [state.users]);

  const getUsersByType = useCallback(
    (type: PresenceUser['type']): PresenceUser[] => {
      return Array.from(state.users.values())
        .filter((user) => user.type === type)
        .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
    },
    [state.users]
  );

  const getUserById = useCallback(
    (userId: string): PresenceUser | undefined => {
      return state.users.get(userId);
    },
    [state.users]
  );

  const isUserOnline = useCallback(
    (userId: string): boolean => {
      const user = state.users.get(userId);
      return user ? user.isOnline : false;
    },
    [state.users]
  );

  // Statistics
  const getPresenceStats = useCallback(() => {
    const users = Array.from(state.users.values());
    const onlineUsers = users.filter((u) => u.isOnline);

    return {
      total: users.length,
      online: onlineUsers.length,
      offline: users.filter((u) => !u.isOnline).length,
      users: users.filter((u) => u.type === 'user').length,
      agents: users.filter((u) => u.type === 'agent').length,
      ai: users.filter((u) => u.type === 'ai').length,
    };
  }, [state.users]);

  // Display helpers
  const getOnlineUserNames = useCallback((): string[] => {
    return getOnlineUsers().map((user) => user.name);
  }, [getOnlineUsers]);

  const getPresenceDisplayText = useCallback((): string => {
    const onlineUsers = getOnlineUsers();
    const count = onlineUsers.length;

    if (count === 0) return 'No one online';
    if (count === 1) return `${onlineUsers[0].name} is online`;
    if (count === 2) return `${onlineUsers[0].name} and ${onlineUsers[1].name} are online`;

    return `${count} people online`;
  }, [getOnlineUsers]);

  // Clear all presence
  const clearPresence = useCallback(() => {
    // Clear all timeouts
    presenceTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    presenceTimeoutsRef.current.clear();

    setState({
      users: new Map(),
      onlineCount: 0,
      userCount: 0,
      agentCount: 0,
      currentUser: null,
    });
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handlePresenceUpdate = (data: any) => {
      if (data.conversationId !== conversationId) return;

      const { users, userId, userUpdate } = data;

      if (users) {
        // Bulk presence update
        users.forEach((user: any) => {
          addOrUpdateUser({
            id: user.userId || user.id,
            name: user.userName || user.name,
            type: user.userType || user.type,
            isOnline: user.isOnline ?? true,
            metadata: user.metadata || {},
          });
        });
      } else if (userId && userUpdate) {
        // Single user update
        addOrUpdateUser({
          id: userId,
          name: userUpdate.userName || userUpdate.name,
          type: userUpdate.userType || userUpdate.type,
          isOnline: userUpdate.isOnline ?? true,
          metadata: userUpdate.metadata || {},
        });
      }
    };

    const handleUserJoined = (data: any) => {
      if (data.conversationId !== conversationId) return;

      addOrUpdateUser({
        id: data.userId,
        name: data.userName,
        type: data.userType,
        isOnline: true,
        metadata: data.metadata || {},
      });
    };

    const handleUserLeft = (data: any) => {
      if (data.conversationId !== conversationId) return;

      if (data.remove) {
        removeUser(data.userId);
      } else {
        addOrUpdateUser({
          id: data.userId,
          name: data.userName,
          type: data.userType,
          isOnline: false,
        });
      }
    };

    // Bind events
    socket.on('presence-update', handlePresenceUpdate);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('presence-update', handlePresenceUpdate);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket, conversationId, addOrUpdateUser, removeUser]);

  // Auto-join presence when socket connects
  useEffect(() => {
    if (socket?.connected && conversationId && !hasJoinedRef.current) {
      joinPresence();
    }
  }, [socket?.connected, conversationId, joinPresence]);

  // Heartbeat management
  useEffect(() => {
    if (!enableHeartbeat || !socket?.connected || !hasJoinedRef.current) return;

    heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [enableHeartbeat, socket?.connected, hasJoinedRef.current, sendHeartbeat, heartbeatInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leavePresence();
      clearPresence();

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [leavePresence, clearPresence]);

  // Cross-tab synchronization
  useEffect(() => {
    if (!enableCrossSyncSync) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'presence-sync' && e.newValue) {
        const data = JSON.parse(e.newValue);
        if (data.conversationId === conversationId) {
          if (data.type === 'join') {
            addOrUpdateUser(data.user);
          } else if (data.type === 'leave') {
            removeUser(data.userId);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [conversationId, addOrUpdateUser, removeUser, enableCrossSyncSync]);

  return {
    ...state,
    joinPresence,
    leavePresence,
    updatePresence,
    sendHeartbeat,
    getOnlineUsers,
    getOfflineUsers,
    getUsersByType,
    getUserById,
    isUserOnline,
    getPresenceStats,
    getOnlineUserNames,
    getPresenceDisplayText,
    clearPresence,
    removeUser,
  };
}

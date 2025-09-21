'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';

export interface TypingParticipant {
  id: string;
  name: string;
  type: 'user' | 'ai' | 'agent';
  startedAt: number;
  lastActivity: number;
}

export interface TypingState {
  isTyping: boolean;
  participants: TypingParticipant[];
  lastActivity: number;
}

export interface UseTypingIndicatorsOptions {
  socket: Socket | null;
  conversationId: string;
  currentUserId?: string;
  currentUserName?: string;
  typingTimeout?: number;
  debounceDelay?: number; // Debounce delay for user typing events
  maxParticipants?: number; // Maximum participants to track
  enableSelfTyping?: boolean; // Whether to show current user's typing
}

export interface UseTypingIndicatorsReturn extends TypingState {
  // User typing actions
  startTyping: () => void;
  stopTyping: () => void;
  sendTypingEvent: (isTyping: boolean) => void;
  handleTypingChange: (isTyping: boolean) => void;
  
  // Participant queries
  getTypingParticipants: () => TypingParticipant[];
  getUserTypingParticipants: () => TypingParticipant[];
  getAITypingParticipants: () => TypingParticipant[];
  getAgentTypingParticipants: () => TypingParticipant[];
  isParticipantTyping: (participantId: string) => boolean;
  
  // Display helpers
  getTypingDisplayText: () => string;
  getTypingCount: () => number;
  hasUserTyping: boolean;
  hasAITyping: boolean;
  hasAgentTyping: boolean;
  
  // State management
  clearTypingState: () => void;
  removeParticipant: (participantId: string) => void;
}

/**
 * Hook for managing typing indicators with multi-participant support.
 * Handles both sending and receiving typing events with automatic cleanup.
 */
export function useTypingIndicators({
  socket,
  conversationId,
  currentUserId = 'user',
  currentUserName = 'You',
  typingTimeout = 3000,
  debounceDelay = 500,
  maxParticipants = 10,
  enableSelfTyping = false,
}: UseTypingIndicatorsOptions): UseTypingIndicatorsReturn {


  const [state, setState] = useState<TypingState>({
    isTyping: false,
    participants: [],
    lastActivity: Date.now(),
  });

  // Refs for timeout management
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const userTypingRef = useRef(false);
  const participantTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const updateState = useCallback((updates: Partial<TypingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear timeout for a specific participant
  const clearParticipantTimeout = useCallback((participantId: string) => {
    const timeout = participantTimeoutsRef.current.get(participantId);
    if (timeout) {
      clearTimeout(timeout);
      participantTimeoutsRef.current.delete(participantId);
    }
  }, []);

  // Set timeout to remove participant after inactivity
  const setParticipantTimeout = useCallback((participantId: string) => {
    clearParticipantTimeout(participantId);
    
    const timeout = setTimeout(() => {
      setState(prev => {
        const newParticipants = prev.participants.filter(p => p.id !== participantId);
        return {
          ...prev,
          participants: newParticipants,
          isTyping: newParticipants.length > 0,
          lastActivity: Date.now(),
        };
      });
      participantTimeoutsRef.current.delete(participantId);
    }, typingTimeout);
    
    participantTimeoutsRef.current.set(participantId, timeout);
  }, [typingTimeout, clearParticipantTimeout]);

  // Add or update typing participant
  const addOrUpdateParticipant = useCallback((participant: Omit<TypingParticipant, 'startedAt' | 'lastActivity'>) => {
   
    const now = Date.now();
    
    setState(prev => {
      
      const existingIndex = prev.participants.findIndex(p => p.id === participant.id);
      
      if (existingIndex >= 0) {
        // Update existing participant
        console.log('🔤 Updating existing participant at index:', existingIndex);
        const newParticipants = [...prev.participants];
        newParticipants[existingIndex] = {
          ...newParticipants[existingIndex],
          ...participant,
          lastActivity: now,
        };
        
        const newState = {
          ...prev,
          participants: newParticipants,
          isTyping: true,
          lastActivity: now,
        };
        // console.log('🔤 Updated state:', newState);
        return newState;
      } else {
        // Add new participant
        // console.log('🔤 Adding new participant');
        const newParticipant: TypingParticipant = {
          ...participant,
          startedAt: now,
          lastActivity: now,
        };
        
        const newParticipants = [...prev.participants, newParticipant];
        
        // Enforce max participants limit
        const limitedParticipants = maxParticipants > 0 && newParticipants.length > maxParticipants
          ? newParticipants.slice(-maxParticipants)
          : newParticipants;
        
        const newState = {
          isTyping: true,
          participants: limitedParticipants,
          lastActivity: now,
        };
       
        return newState;
      }
    });

    // Set timeout for this participant
    setParticipantTimeout(participant.id);
  }, [maxParticipants, setParticipantTimeout]);

  // Remove typing participant
  const removeParticipant = useCallback((participantId: string) => {
    clearParticipantTimeout(participantId);
    
    setState(prev => {
      const newParticipants = prev.participants.filter(p => p.id !== participantId);
      
      // Only update if there's an actual change
      if (newParticipants.length === prev.participants.length) {
        return prev;
      }
      
      return {
        ...prev,
        participants: newParticipants,
        isTyping: newParticipants.length > 0,
        lastActivity: Date.now(),
      };
    });
  }, [clearParticipantTimeout]);

  // Send typing event to server
  const sendTypingEvent = useCallback((isTyping: boolean) => {
    // console.log('🔤 sendTypingEvent called:', {
    //   isTyping,
    //   conversationId,
    //   currentUserName,
    //   socketConnected: socket?.connected,
    //   socketExists: !!socket
    // });
    
    const typingData = { 
      conversationId, 
      isTyping,
      senderName: currentUserName,
    };
    
    // console.log('🔤 Emitting typing event:', typingData);
    socket?.emit('typing', typingData);
  }, [socket, conversationId, currentUserName]);

  // Start typing (called when user starts typing)
  const startTyping = useCallback(() => {
   
    
    if (!socket || userTypingRef.current) {
      console.warn('🔤 startTyping: Cannot start typing', {
        socket: !!socket,
        userTypingRef: userTypingRef.current
      });
      return;
    }
    
    userTypingRef.current = true;
    sendTypingEvent(true);
    
    // Add self to participants if enabled
    if (enableSelfTyping) {
      
      addOrUpdateParticipant({
        id: currentUserId,
        name: currentUserName,
        type: 'user',
      });
    }
  }, [socket, sendTypingEvent, enableSelfTyping, currentUserId, currentUserName, addOrUpdateParticipant]);

  // Stop typing (called when user stops typing)
  const stopTyping = useCallback(() => {
    // console.log('🔤 stopTyping called:', {
    //   socketConnected: socket?.connected,
    //   userTypingRef: userTypingRef.current,
    //   enableSelfTyping,
    //   currentUserId
    // });
    
    if (!socket || !userTypingRef.current) {
      console.warn('🔤 stopTyping: Cannot stop typing', {
        socket: !!socket,
        userTypingRef: userTypingRef.current
      });
      return;
    }
    
    userTypingRef.current = false;
    sendTypingEvent(false);
    
   
    if (enableSelfTyping) {
      removeParticipant(currentUserId);
    }
  }, [socket, sendTypingEvent, enableSelfTyping, currentUserId, removeParticipant]);

  // Debounced typing handler
  const handleTypingChange = useCallback((isTyping: boolean) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    if (isTyping) {
      // Start typing immediately
      if (!userTypingRef.current) {
        startTyping();
      }
      
      // Set timeout to stop typing after inactivity
      debounceTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, debounceDelay);
    } else {
      // Stop typing with debounce
      debounceTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 100);
    }
  }, [startTyping, stopTyping, debounceDelay]);

  // Query methods
  const getTypingParticipants = useCallback((): TypingParticipant[] => {
    return [...state.participants];
  }, [state.participants]);

  const getUserTypingParticipants = useCallback((): TypingParticipant[] => {
    return state.participants.filter(p => p.type === 'user');
  }, [state.participants]);

  const getAITypingParticipants = useCallback((): TypingParticipant[] => {
    return state.participants.filter(p => p.type === 'ai');
  }, [state.participants]);

  const getAgentTypingParticipants = useCallback((): TypingParticipant[] => {
    return state.participants.filter(p => p.type === 'agent');
  }, [state.participants]);

  const isParticipantTyping = useCallback((participantId: string): boolean => {
    return state.participants.some(p => p.id === participantId);
  }, [state.participants]);

  const getTypingCount = useCallback((): number => {
    return state.participants.length;
  }, [state.participants]);

  // Display helpers
  const getTypingDisplayText = useCallback((): string => {
    if (state.participants.length === 0) return '';
    
    // Group participants by type
    const userParticipants = getUserTypingParticipants();
    const aiParticipants = getAITypingParticipants();
    const agentParticipants = getAgentTypingParticipants();
    
    const displayParts: string[] = [];
    
    if (userParticipants.length > 0) {
      const userNames = userParticipants.map(p => p.name).join(', ');
      displayParts.push(userNames);
    }
    
    if (aiParticipants.length > 0) {
      const aiNames = aiParticipants.map(p => p.name).join(', ');
      displayParts.push(aiNames);
    }
    
    if (agentParticipants.length > 0) {
      const agentNames = agentParticipants.map(p => p.name).join(', ');
      displayParts.push(agentNames);
    }
    
    const displayText = displayParts.join(' and ');
    const isPlural = state.participants.length > 1;
    
    return `${displayText} ${isPlural ? 'are' : 'is'} typing...`;
  }, [state.participants, getUserTypingParticipants, getAITypingParticipants, getAgentTypingParticipants]);

  // Clear all typing state
  const clearTypingState = useCallback(() => {
    // Clear all timeouts
    participantTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    participantTimeoutsRef.current.clear();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Stop user typing if active
    if (userTypingRef.current) {
      stopTyping();
    }
    
    setState({
      isTyping: false,
      participants: [],
      lastActivity: Date.now(),
    });
  }, [stopTyping]);

  // Handle socket typing events
  useEffect(() => {
    // console.log('🔤 Setting up typing event listener:', {
    //   socketConnected: socket?.connected,
    //   conversationId,
    //   currentUserId,
    //   enableSelfTyping
    // });
    
    if (!socket) {
      console.warn('🔤 No socket available for typing events');
      return;
    }

    const handleTypingEvent = (data: any) => {
      const { sender, senderName, isTyping, conversationId: eventConversationId } = data;
      
      // Only handle events for this conversation
      if (eventConversationId !== conversationId) {
        return;
      }
      
      // Skip own typing events unless enableSelfTyping is true
      if (sender === currentUserId && !enableSelfTyping) {
        return;
      }

      if (isTyping) {
        addOrUpdateParticipant({
          id: sender,
          name: senderName || (sender === 'ai' ? 'AI Assistant' : sender === 'user' ? 'User' : 'Agent'),
          type: sender as 'user' | 'ai' | 'agent',
        });
      } else {
        removeParticipant(sender);
      }
    };

    socket.on('typing', handleTypingEvent);

    return () => {
      socket.off('typing', handleTypingEvent);
    };
  }, [socket, conversationId, currentUserId, enableSelfTyping, addOrUpdateParticipant, removeParticipant]);

  // Cleanup on unmount or conversation change
  useEffect(() => {
    return () => {
      clearTypingState();
    };
  }, [clearTypingState]);

  // Cleanup timeouts on conversation change
  useEffect(() => {
    clearTypingState();
  }, [conversationId, clearTypingState]);

  return {
    ...state,
    startTyping,
    stopTyping,
    sendTypingEvent,
    handleTypingChange,
    getTypingParticipants,
    getUserTypingParticipants,
    getAITypingParticipants,
    getAgentTypingParticipants,
    isParticipantTyping,
    getTypingDisplayText,
    getTypingCount,
    hasUserTyping: getUserTypingParticipants().length > 0,
    hasAITyping: getAITypingParticipants().length > 0,
    hasAgentTyping: getAgentTypingParticipants().length > 0,
    clearTypingState,
    removeParticipant,
  };
}
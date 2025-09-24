'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UIPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  messageSpacing: 'compact' | 'normal' | 'comfortable';
  showTimestamps: boolean;
  showAvatars: boolean;
  showTypingIndicators: boolean;
  showPresenceIndicators: boolean;
  autoScrollToBottom: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  markReadOnView: boolean;
}

export interface ConversationLayout {
  sidebarVisible: boolean;
  sidebarWidth: number;
  messageInputHeight: number;
  isFullscreen: boolean;
  isMobile: boolean;
  orientation: 'portrait' | 'landscape';
}

export interface ScrollState {
  isAtBottom: boolean;
  isNearBottom: boolean;
  hasScrolled: boolean;
  showScrollButton: boolean;
  unreadCount: number;
  lastScrollPosition: number;
}

export interface ConversationUIState {
  preferences: UIPreferences;
  layout: ConversationLayout;
  scroll: ScrollState;
  isVisible: boolean;
  isFocused: boolean;
  hasUnreadMessages: boolean;
  selectedMessageId: string | null;
  highlightedMessageId: string | null;
  contextMenuVisible: boolean;
  contextMenuPosition: { x: number; y: number } | null;
}

export interface UseConversationUIOptions {
  initialPreferences?: Partial<UIPreferences>;
  enablePersistence?: boolean;
  storageKey?: string;
  onPreferenceChange?: (preferences: UIPreferences) => void;
  onLayoutChange?: (layout: ConversationLayout) => void;
  onScrollChange?: (scroll: ScrollState) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export interface UseConversationUIReturn extends ConversationUIState {
  // Preferences management
  updatePreferences: (updates: Partial<UIPreferences>) => void;
  resetPreferences: () => void;
  togglePreference: (key: keyof UIPreferences) => void;

  // Layout management
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setMessageInputHeight: (height: number) => void;
  toggleFullscreen: () => void;
  updateLayout: (updates: Partial<ConversationLayout>) => void;

  // Scroll management
  scrollToBottom: () => void;
  scrollToTop: () => void;
  scrollToMessage: (messageId: string) => void;
  markAsRead: () => void;
  updateScrollState: (state: Partial<ScrollState>) => void;

  // Message selection
  selectMessage: (messageId: string | null) => void;
  highlightMessage: (messageId: string | null) => void;
  clearSelection: () => void;

  // Context menu
  showContextMenu: (position: { x: number; y: number }) => void;
  hideContextMenu: () => void;

  // Visibility and focus
  setVisible: (visible: boolean) => void;
  setFocused: (focused: boolean) => void;

  // Utilities
  getMessagePosition: (messageId: string) => number | null;
  isMessageVisible: (messageId: string) => boolean;
  getVisibleMessages: () => string[];
  reset: () => void;

  // Refs
  containerRef: React.RefObject<HTMLDivElement | null>;
  messagesRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for managing conversation UI state including preferences,
 * layout, scrolling, and message selection.
 */
export function useConversationUI({
  initialPreferences = {},
  enablePersistence = true,
  storageKey = 'conversation-ui-preferences',
  onPreferenceChange,
  onLayoutChange,
  onScrollChange,
  onVisibilityChange,
}: UseConversationUIOptions = {}): UseConversationUIReturn {
  // Default preferences
  const defaultPreferences: UIPreferences = {
    theme: 'auto',
    fontSize: 'medium',
    messageSpacing: 'normal',
    showTimestamps: true,
    showAvatars: true,
    showTypingIndicators: true,
    showPresenceIndicators: true,
    autoScrollToBottom: true,
    soundNotifications: true,
    desktopNotifications: false,
    markReadOnView: true,
    ...initialPreferences,
  };

  // Load preferences from storage
  const loadPreferences = useCallback((): UIPreferences => {
    if (!enablePersistence || typeof window === 'undefined') {
      return defaultPreferences;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load UI preferences:', error);
    }

    return defaultPreferences;
  }, [enablePersistence, storageKey, defaultPreferences]);

  // Save preferences to storage
  const savePreferences = useCallback(
    (preferences: UIPreferences) => {
      if (!enablePersistence || typeof window === 'undefined') return;

      try {
        localStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save UI preferences:', error);
      }
    },
    [enablePersistence, storageKey]
  );

  // Detect mobile and orientation
  const detectLayout = useCallback((): ConversationLayout => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const orientation = typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    return {
      sidebarVisible: !isMobile,
      sidebarWidth: isMobile ? 0 : 300,
      messageInputHeight: 60,
      isFullscreen: false,
      isMobile,
      orientation,
    };
  }, []);

  const [state, setState] = useState<ConversationUIState>({
    preferences: loadPreferences(),
    layout: detectLayout(),
    scroll: {
      isAtBottom: true,
      isNearBottom: true,
      hasScrolled: false,
      showScrollButton: false,
      unreadCount: 0,
      lastScrollPosition: 0,
    },
    isVisible: true,
    isFocused: false,
    hasUnreadMessages: false,
    selectedMessageId: null,
    highlightedMessageId: null,
    contextMenuVisible: false,
    contextMenuPosition: null,
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback((updates: Partial<ConversationUIState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update preferences
  const updatePreferences = useCallback(
    (updates: Partial<UIPreferences>) => {
      const newPreferences = { ...state.preferences, ...updates };

      setState((prev) => ({
        ...prev,
        preferences: newPreferences,
      }));

      savePreferences(newPreferences);
      onPreferenceChange?.(newPreferences);
    },
    [state.preferences, savePreferences, onPreferenceChange]
  );

  // Reset preferences
  const resetPreferences = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preferences: defaultPreferences,
    }));

    savePreferences(defaultPreferences);
    onPreferenceChange?.(defaultPreferences);
  }, [defaultPreferences, savePreferences, onPreferenceChange]);

  // Toggle preference
  const togglePreference = useCallback(
    (key: keyof UIPreferences) => {
      const currentValue = state.preferences[key];

      if (typeof currentValue === 'boolean') {
        updatePreferences({ [key]: !currentValue } as Partial<UIPreferences>);
      }
    },
    [state.preferences, updatePreferences]
  );

  // Layout management
  const toggleSidebar = useCallback(() => {
    const newLayout = {
      ...state.layout,
      sidebarVisible: !state.layout.sidebarVisible,
    };

    setState((prev) => ({ ...prev, layout: newLayout }));
    onLayoutChange?.(newLayout);
  }, [state.layout, onLayoutChange]);

  const setSidebarWidth = useCallback(
    (width: number) => {
      const newLayout = {
        ...state.layout,
        sidebarWidth: Math.max(200, Math.min(500, width)),
      };

      setState((prev) => ({ ...prev, layout: newLayout }));
      onLayoutChange?.(newLayout);
    },
    [state.layout, onLayoutChange]
  );

  const setMessageInputHeight = useCallback(
    (height: number) => {
      const newLayout = {
        ...state.layout,
        messageInputHeight: Math.max(40, Math.min(200, height)),
      };

      setState((prev) => ({ ...prev, layout: newLayout }));
      onLayoutChange?.(newLayout);
    },
    [state.layout, onLayoutChange]
  );

  const toggleFullscreen = useCallback(() => {
    const newLayout = {
      ...state.layout,
      isFullscreen: !state.layout.isFullscreen,
    };

    setState((prev) => ({ ...prev, layout: newLayout }));
    onLayoutChange?.(newLayout);
  }, [state.layout, onLayoutChange]);

  const updateLayout = useCallback(
    (updates: Partial<ConversationLayout>) => {
      const newLayout = { ...state.layout, ...updates };

      setState((prev) => ({ ...prev, layout: newLayout }));
      onLayoutChange?.(newLayout);
    },
    [state.layout, onLayoutChange]
  );

  // Scroll management
  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const markAsRead = useCallback(() => {
    if (state.hasUnreadMessages) {
      updateState({
        hasUnreadMessages: false,
        scroll: { ...state.scroll, unreadCount: 0 },
      });
    }
  }, [state.hasUnreadMessages, state.scroll, updateState]);

  const updateScrollState = useCallback(
    (scrollUpdates: Partial<ScrollState>) => {
      const newScrollState = { ...state.scroll, ...scrollUpdates };

      setState((prev) => ({
        ...prev,
        scroll: newScrollState,
      }));

      onScrollChange?.(newScrollState);
    },
    [state.scroll, onScrollChange]
  );

  // Message selection
  const selectMessage = useCallback(
    (messageId: string | null) => {
      updateState({ selectedMessageId: messageId });
    },
    [updateState]
  );

  const highlightMessage = useCallback(
    (messageId: string | null) => {
      updateState({ highlightedMessageId: messageId });

      if (messageId) {
        setTimeout(() => {
          updateState({ highlightedMessageId: null });
        }, 3000); // Clear highlight after 3 seconds
      }
    },
    [updateState]
  );

  const clearSelection = useCallback(() => {
    updateState({
      selectedMessageId: null,
      highlightedMessageId: null,
    });
  }, [updateState]);

  // Context menu
  const showContextMenu = useCallback(
    (position: { x: number; y: number }) => {
      updateState({
        contextMenuVisible: true,
        contextMenuPosition: position,
      });
    },
    [updateState]
  );

  const hideContextMenu = useCallback(() => {
    updateState({
      contextMenuVisible: false,
      contextMenuPosition: null,
    });
  }, [updateState]);

  // Visibility and focus
  const setVisible = useCallback(
    (visible: boolean) => {
      updateState({ isVisible: visible });
      onVisibilityChange?.(visible);

      if (visible && state.preferences.markReadOnView) {
        markAsRead();
      }
    },
    [updateState, onVisibilityChange, state.preferences.markReadOnView, markAsRead]
  );

  const setFocused = useCallback(
    (focused: boolean) => {
      updateState({ isFocused: focused });

      if (focused && state.preferences.markReadOnView) {
        markAsRead();
      }
    },
    [updateState, state.preferences.markReadOnView, markAsRead]
  );

  // Utilities
  const getMessagePosition = useCallback((messageId: string): number | null => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement && messagesRef.current) {
      const containerRect = messagesRef.current.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      return messageRect.top - containerRect.top;
    }
    return null;
  }, []);

  const isMessageVisible = useCallback((messageId: string): boolean => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement && messagesRef.current) {
      const containerRect = messagesRef.current.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();

      return messageRect.top >= containerRect.top && messageRect.bottom <= containerRect.bottom;
    }
    return false;
  }, []);

  const getVisibleMessages = useCallback((): string[] => {
    const visibleMessages: string[] = [];
    const messageElements = document.querySelectorAll('[data-message-id]');

    messageElements.forEach((element) => {
      const messageId = element.getAttribute('data-message-id');
      if (messageId && isMessageVisible(messageId)) {
        visibleMessages.push(messageId);
      }
    });

    return visibleMessages;
  }, [isMessageVisible]);

  const reset = useCallback(() => {
    setState({
      preferences: loadPreferences(),
      layout: detectLayout(),
      scroll: {
        isAtBottom: true,
        isNearBottom: true,
        hasScrolled: false,
        showScrollButton: false,
        unreadCount: 0,
        lastScrollPosition: 0,
      },
      isVisible: true,
      isFocused: false,
      hasUnreadMessages: false,
      selectedMessageId: null,
      highlightedMessageId: null,
      contextMenuVisible: false,
      contextMenuPosition: null,
    });
  }, [loadPreferences, detectLayout]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newLayout = detectLayout();
      setState((prev) => ({ ...prev, layout: newLayout }));
      onLayoutChange?.(newLayout);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [detectLayout, onLayoutChange]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setVisible]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      const isAtBottom = distanceFromBottom < 10;
      const isNearBottom = distanceFromBottom < 100;
      const showScrollButton = !isNearBottom && state.scroll.hasScrolled;

      updateScrollState({
        isAtBottom,
        isNearBottom,
        hasScrolled: scrollTop > 0,
        showScrollButton,
        lastScrollPosition: scrollTop,
      });
    };

    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, [state.scroll.hasScrolled, updateScrollState]);

  // Auto-scroll to bottom when preferences change
  useEffect(() => {
    if (state.preferences.autoScrollToBottom && state.scroll.isAtBottom) {
      scrollToBottom();
    }
  }, [state.preferences.autoScrollToBottom, state.scroll.isAtBottom, scrollToBottom]);

  // Hide context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (state.contextMenuVisible) {
        hideContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [state.contextMenuVisible, hideContextMenu]);

  return {
    ...state,
    updatePreferences,
    resetPreferences,
    togglePreference,
    toggleSidebar,
    setSidebarWidth,
    setMessageInputHeight,
    toggleFullscreen,
    updateLayout,
    scrollToBottom,
    scrollToTop,
    scrollToMessage,
    markAsRead,
    updateScrollState,
    selectMessage,
    highlightMessage,
    clearSelection,
    showContextMenu,
    hideContextMenu,
    setVisible,
    setFocused,
    getMessagePosition,
    isMessageVisible,
    getVisibleMessages,
    reset,
    containerRef,
    messagesRef,
  };
}

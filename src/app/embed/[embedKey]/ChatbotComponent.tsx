"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Plus as PlusIcon,
  Mic as MicIcon,
  MessageCircleIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Tool, ToolHeader, ToolContent } from "@/components/ai-elements/tool";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { Loader } from "@/components/ai-elements/loader";

// Types
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: "user" | "ai" | "agent";
  role: "user" | "agent" | "assistant";
  reasoning?: string;
  reactions?: {
    liked: boolean;
    disliked: boolean;
  };
  tools?: Array<{
    name: string;
    state: string;
    input?: any;
    output?: any;
  }>;
}

// Conversation persistence utilities
const CONVERSATION_STORAGE_KEY = "chatbot_conversation";

interface StoredConversation {
  conversationId: string;
  chatbotId: string;
  widgetKey: string;
  timestamp: number;
  displayName?: string;
}

const conversationStorage = {
  // Store conversation data
  store: (
    conversationId: string,
    chatbotId: string,
    widgetKey: string,
    displayName?: string
  ) => {
    try {
      const data: StoredConversation = {
        conversationId,
        chatbotId,
        widgetKey,
        timestamp: Date.now(),
        displayName,
      };
      localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(data));
      console.log("💾 [Storage] Conversation stored:", data);
    } catch (error) {
      console.error("❌ [Storage] Failed to store conversation:", error);
    }
  },

  // Retrieve conversation data
  retrieve: (
    chatbotId: string,
    widgetKey: string
  ): StoredConversation | null => {
    try {
      const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);
      if (!stored) return null;

      const data: StoredConversation = JSON.parse(stored);

      // Check if the stored conversation matches current chatbot/widget
      if (data.chatbotId === chatbotId && data.widgetKey === widgetKey) {
        // Check if conversation is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - data.timestamp < maxAge) {
          console.log("💾 [Storage] Conversation retrieved:", data);
          return data;
        } else {
          console.log("💾 [Storage] Conversation expired, removing...");
          conversationStorage.clear();
        }
      } else {
        console.log("💾 [Storage] Conversation mismatch, clearing...");
        conversationStorage.clear();
      }

      return null;
    } catch (error) {
      console.error("❌ [Storage] Failed to retrieve conversation:", error);
      return null;
    }
  },

  // Clear stored conversation
  clear: () => {
    try {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY);
      console.log("💾 [Storage] Conversation cleared");
    } catch (error) {
      console.error("❌ [Storage] Failed to clear conversation:", error);
    }
  },

  // Update display name in stored conversation
  updateDisplayName: (displayName: string) => {
    try {
      const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);
      if (stored) {
        const data: StoredConversation = JSON.parse(stored);
        data.displayName = displayName;
        localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(data));
        console.log("💾 [Storage] Display name updated:", displayName);
      }
    } catch (error) {
      console.error("❌ [Storage] Failed to update display name:", error);
    }
  },
};

interface TypingState {
  isTyping: boolean;
  sender?: string;
  agentName?: string;
}

interface ChatbotConfig {
  chatbotId: string;
  widgetKey: string;
  name: string;
  description: string;

  ui: {
    theme: string;
    primaryColor: string;
    botColor: string;
    position: string;
    botMessageColor: string;
    userMessageColor: string;
    displayName: string;
    messagePlaceholder: string;
    suggestedMessages: string[];
    logoUrl?: string;
    customCss?: string;
  };

  settings: {
    welcomeMessage: string;
    aiChat: boolean;
    popupMessage?: string;
    fallbackResponse: string;
    maxMessagesPerConversation: number;
    autoEscalateThreshold?: number;
    collectFeedback: boolean;
    allowRegenerate: boolean;
    workingHours?: any;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      fontFamily: string;
    };
  };

  model: {
    systemPrompt?: string;
    intentModel?: string;
    responseModel?: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    topK: number;
  };

  behaviorPolicies: {
    bannedTopics: string[];
    requiredDisclaimers: string[];
    politenessLevel: string;
  };

  tools: string[];
  escalationThreshold: number;

  routing: {
    escalationEnabled: boolean;
    strategy: string;
    defaultPriority: string;
  };

  widget: {
    enabled: boolean;
    allowAnonymous: boolean;
    allowedOrigins: string[];
    autoShowDelay: number;
    aiChatEnabled: boolean;
    keyPermissions: string[];
  };

  socketUrl: string;
}

interface ChatbotComponentProps {
  config: ChatbotConfig;
  widgetKey: string;
  chatbotId: string;
}

// UI Components
const Avatar = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div
    className={`w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center ${className}`}
  >
    <img src={src} alt={alt} className="w-4 h-4 rounded-full" />
  </div>
);

// MessageBubble removed in favor of rich UI components below

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isConnected,
  isLoading,
  config,
  chatbot,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isConnected: boolean;
  isLoading: boolean;
  config?: any;
  chatbot?: any;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && isConnected && !isLoading) {
      onSubmit();
    }
  };
  return (
    <div className="border-t bg-background p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        {chatbot?.routing?.escalationEnabled && (
          <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
            🎧 Talk to Human Agent
          </button>
        )}
        <button className="text-gray-500 hover:text-gray-700 transition-colors ml-auto">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </div>
      <PromptInput onSubmit={handleSubmit} className="relative">
        <PromptInputTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            !isConnected
              ? "Connecting to support..."
              : config?.ui?.messagePlaceholder || "Type your message here.."
          }
          disabled={!isConnected}
          className="min-h-[48px] max-h-[120px] text-black focus:outline-none !outline-none"
          style={{ outline: "none !important" }}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PlusIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <MicIcon size={16} />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!value.trim() || !isConnected}
            status={isLoading ? "streaming" : undefined}
            primaryColor={config.ui.primaryColor}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

// Main Chat Component
export default function ChatbotComponent({
  config,
  widgetKey,
  chatbotId,
}: ChatbotComponentProps) {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingState, setTypingState] = useState<TypingState>({
    isTyping: false,
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [conversationId, setConversationId] = useState<string | null>(null);
  console.log(config,
    "chatbot config"
  
  )
  // Keep conversationIdRef in sync with conversationId state
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  // Streaming state
  const [streamInFlight, setStreamInFlight] = useState(false);
  const streamBufferRef = useRef<string>("");
  const provisionalAssistantIdRef = useRef<string | null>(null);
  // Queue first user query until conversation is joined
  const pendingQueryRef = useRef<string | null>(null);
  // Typing timeout for debounce
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Flag to track when we're loading history
  const isLoadingHistoryRef = useRef(false);

  // Refs for preventing duplicate events
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);
  const conversationStartedRef = useRef(false);
  const lastMessageRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Apply theme styles from backend config
  useEffect(() => {
    if (config.ui && config.settings.theme) {
      const { primaryColor, backgroundColor, fontFamily } =
        config.settings.theme;
      document.documentElement.style.setProperty(
        "--primary-color",
        config.ui.primaryColor || primaryColor
      );
      document.documentElement.style.setProperty(
        "--bot-color",
        config.ui.botColor
      );
      document.documentElement.style.setProperty("--bg-color", backgroundColor);
      document.documentElement.style.setProperty("--font-family", fontFamily);

      // Apply custom CSS if provided
      if (config.ui.customCss) {
        const customStyleSheet = document.createElement("style");
        customStyleSheet.textContent = config.ui.customCss;
        document.head.appendChild(customStyleSheet);

        return () => {
          document.head.removeChild(customStyleSheet);
        };
      }
    }
  }, [config.ui, config.settings.theme]);

  // Helper function to ensure latest message is in viewport
  const ensureLatestMessageVisible = useCallback(() => {
    // Method 1: Try scrollIntoView
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }

    // Method 2: Try all possible containers
    const allContainers = [
      document.querySelector(".widget-messages"),
      document.querySelector(".conversation"),
      document.querySelector(".conversation-content"),
      document.querySelector(".widget-chatbot-container"),
      messagesEndRef.current?.parentElement,
      messagesEndRef.current?.parentElement?.parentElement,
    ];

    let scrolled = false;
    allContainers.forEach((element) => {
      if (element && element.scrollHeight > element.clientHeight) {
        element.scrollTop = element.scrollHeight;
        scrolled = true;
      }
    });

    // Method 3: Fallback - scroll to bottom of page
    if (!scrolled) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isLoadingHistoryRef.current) {
      // When loading history, use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ensureLatestMessageVisible();
          isLoadingHistoryRef.current = false;
        });
      });
    } else {
      // For new messages, use smooth scroll
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, ensureLatestMessageVisible]);

  // Initialize socket connection
  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    setConnectionStatus("connecting");

    const newSocket = io(config.socketUrl, {
      transports: ["websocket"],
      timeout: 10000,
      auth: {
        widgetKey: widgetKey,
        chatbotId: chatbotId,
        keyPermissions: config.widget.keyPermissions,
        allowAnonymous: config.widget.allowAnonymous,
      },
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("🟢 [Socket] Connected:", newSocket.id);
      setIsConnected(true);
      setConnectionStatus("connected");
      setError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔴 [Socket] Disconnected:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      isInitializedRef.current = false;
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔴 [Socket] Connection error:", error);
      const errorMessage =
        error.message.includes("401") || error.message.includes("403")
          ? "Widget key is invalid or expired"
          : error.message.includes("404")
          ? "Chatbot not found"
          : `Connection failed: ${error.message}`;
      setError(errorMessage);
      setConnectionStatus("error");
      isInitializedRef.current = false;
    });

    // Message events
    newSocket.on("message", (data) => {
      console.log("🟢 [Socket] Message received:", data);

      if (data.message) {
        const messageData: ChatMessage = {
          id: data.message.messageId || `msg-${Date.now()}-${Math.random()}`,
          content: data.message.content,
          reactions: data.message.reactions,
          timestamp: new Date(data.message.timestamp || Date.now()),
          sender: data.message.sender,
          role: data.message.sender === "user" ? "user" : "assistant",
        };

        setMessages((prev) => {
          // Check for duplicates using messageId if available, otherwise use content + timestamp
          const isDuplicate = prev.some((msg) => {
            if (data.message.messageId && msg.id === data.message.messageId) {
              return true; // Exact ID match
            }
            // Fallback: content + timestamp check (within 5 seconds)
            return (
              msg.content === messageData.content &&
              Math.abs(
                msg.timestamp.getTime() - messageData.timestamp.getTime()
              ) < 5000
            );
          });

          if (isDuplicate) {
            return prev;
          }

          return [...prev, messageData];
        });

        setIsLoading(false);
        // If a final assistant message arrives via this channel, finalize stream if applicable
        if (
          messageData.role === "assistant" &&
          provisionalAssistantIdRef.current
        ) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === provisionalAssistantIdRef.current
                ? { ...messageData, id: provisionalAssistantIdRef.current! }
                : m
            )
          );
          provisionalAssistantIdRef.current = null;
          streamBufferRef.current = "";
          setStreamInFlight(false);
          setTypingState({ isTyping: false });
        }
      }
    });

    // Typing events
    newSocket.on("typing", (data) => {
      console.log("🔴 [Socket] Typing event received:", data);

      if (data.sender === "ai" || data.senderName === "AI Assistant") {
        setTypingState({
          isTyping: data.isTyping,
          sender: data.sender,
        });
      }
    });

    // RAG Streaming events
    newSocket.on(
      "rag-stream-chunk",
      (data: { conversationId?: string; chunk: string }) => {
        console.log("[Widget][Stream] chunk:", data);
        if (!streamInFlight) {
          // Ignore late chunks
          return;
        }
        // Ensure provisional assistant message exists
        if (!provisionalAssistantIdRef.current) {
          provisionalAssistantIdRef.current = `assistant-provisional-${Date.now()}-${Math.random()}`;
          const provisional: ChatMessage = {
            id: provisionalAssistantIdRef.current,
            content: "",
            timestamp: new Date(),
            sender: "ai",
            role: "assistant",
          };
          setMessages((prev) => [...prev, provisional]);
        }
        // Append chunk
        streamBufferRef.current = `${streamBufferRef.current}${data.chunk}`;
        const currentId = provisionalAssistantIdRef.current;
        if (currentId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === currentId
                ? { ...m, content: streamBufferRef.current }
                : m
            )
          );
        }
      }
    );

    // Note: backend does not emit 'rag-final-message'; finalization happens on 'message' + 'rag-stream-complete'

    newSocket.on("rag-stream-complete", () => {
      console.log("[Widget][Stream] complete");
      setStreamInFlight(false);
      setIsLoading(false);
      setTypingState({ isTyping: false });
      streamBufferRef.current = "";
      provisionalAssistantIdRef.current = null;
    });

    newSocket.on("error", (e: any) => {
      // Stream errors may also arrive via a namespaced event. Handle generic error too.
      console.error("[Widget][Stream] error:", e);
      setStreamInFlight(false);
      setIsLoading(false);
      setTypingState({ isTyping: false });
    });

    // Conversation events
    newSocket.on("conversation-started", (data) => {
      // Always process conversation-started, even if already started (for resuming)
      setConversationStarted(true);
      setConversationId(data.conversationId);
      if (data.displayName) {
        setDisplayName(data.displayName);
      }
      conversationStartedRef.current = true;

      // Store conversation data in localStorage for persistence
      conversationStorage.store(
        data.conversationId,
        chatbotId,
        widgetKey,
        data.displayName
      );

      // Process message history from backend
      if (data.messages && Array.isArray(data.messages)) {
        const historyMessages: ChatMessage[] = data.messages.map(
          (msg: any, index: number) => {
            const convertedMsg = {
              id:
                msg.messageId ||
                `history-${msg._id || Date.now()}-${Math.random()}`,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              reactions: msg.reactions,
              sender: msg.sender === "user" ? "user" : "ai",
              role: msg.sender === "user" ? "user" : "assistant",
              reasoning: msg.reasoning,
              tools: msg.tools,
            };
            return convertedMsg;
          }
        );

        // Set the complete message history
        setMessages(historyMessages);

        // Set flag to indicate we're loading history - useEffect will handle scrolling
        isLoadingHistoryRef.current = true;
      } else {
        // Handle welcome message if provided (only for new conversations without history)
        const welcomeMsg =
          data.welcomeMessage || config.settings.welcomeMessage;
        if (welcomeMsg) {
          const welcomeMessage: ChatMessage = {
            id: `welcome-${Date.now()}-${Math.random()}`,
            content: welcomeMsg,
            timestamp: new Date(),
            sender: "ai",
            role: "assistant",
            reactions: data.reactions,
          };
          setMessages((prev) => [...prev, welcomeMessage]);
        }

        // If a user query was queued before join, start streaming now
        if (pendingQueryRef.current && socketRef.current) {
          const query = pendingQueryRef.current;
          pendingQueryRef.current = null;

          // Use the loaded message history for context
          const currentMessages =
            data.messages && Array.isArray(data.messages)
              ? data.messages.map((msg: any) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.content,
                }))
              : messages
                  .slice(-8)
                  .map((m) => ({ role: m.role, content: m.content }));

          const contextPayload: any = {
            chatbotId,
            widgetKey,
            conversationId: data.conversationId,
            history: currentMessages.slice(-8), // Last 8 messages for context
          };
          console.log("[Widget][Stream] deferred request start", {
            query,
            context: contextPayload,
          });
          socketRef.current.emit("request-rag-response-stream", {
            query,
            context: contextPayload,
          });
          setStreamInFlight(true);
        }
      }
    });

    newSocket.on("join", (data) => {
      console.log("[Socket] Join event received:", data);

      if (data.message) {
        const joinMessage: ChatMessage = {
          id: `join-${Date.now()}-${Math.random()}`,
          content: data.message,
          timestamp: new Date(),
          sender: "ai",
          role: "assistant",
          reactions: data.reactions,
        };
        setMessages((prev) => [...prev, joinMessage]);
      }

      // Update conversation info if provided
      if (data.conversationId) {
        setConversationId(data.conversationId);
        // Store conversation data when resuming
        conversationStorage.store(
          data.conversationId,
          chatbotId,
          widgetKey,
          data.displayName
        );
      }
      if (data.displayName) {
        setDisplayName(data.displayName);
        console.log("[Socket] Display name:", data.displayName);
        // Update display name in storage
        conversationStorage.updateDisplayName(data.displayName);
      }

      // If a user query was queued before join, start streaming now
      if (
        !conversationStartedRef.current &&
        pendingQueryRef.current &&
        socketRef.current
      ) {
        const query = pendingQueryRef.current;
        pendingQueryRef.current = null;
        const contextPayload: any = {
          chatbotId,
          widgetKey,
          conversationId: data.conversationId ?? conversationId,
          history: messages
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.content })),
          reactions: data.reactions,
        };
        console.log("[Widget][Stream] deferred request start (join)", {
          query,
          context: contextPayload,
        });
        socketRef.current.emit("request-rag-response-stream", {
          query,
          context: contextPayload,
        });
        setStreamInFlight(true);
      }
    });

    newSocket.on("conversation-ended", (data) => {
      console.log("[Socket] Conversation ended:", data);
      setConversationStarted(false);
      setDisplayName(null);
      conversationStartedRef.current = false;

      // Clear stored conversation data when conversation ends
      conversationStorage.clear();
    });

    // React message events
    newSocket.on("react-message", (data) => {
      console.log("👍 [Socket] React message event received:", data);

      if (data.messageId && data.conversationId === conversationIdRef.current) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === data.messageId
              ? {
                  ...message,
                  reactions: {
                    liked: data.liked || false,
                    disliked: data.disliked || false,
                  },
                }
              : message
          )
        );
      }
    });

    socketRef.current = newSocket;

    // Cleanup on unmount
    return () => {
      console.log("🔌 [Chat] Cleaning up socket connection...");
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("message");
        newSocket.off("typing");
        newSocket.off("conversation-started");
        newSocket.off("conversation-ended");
        newSocket.off("join");
        newSocket.off("rag-stream-chunk");
        // 'rag-final-message' not used by backend
        newSocket.off("rag-stream-complete");
        newSocket.off("error");
        newSocket.off("react-message");
        newSocket.disconnect();
      }
      isInitializedRef.current = false;
      conversationStartedRef.current = false;
    };
  }, [config, widgetKey, chatbotId]);

  // Auto-start or resume conversation when connected
  useEffect(() => {
    if (isConnected && socketRef.current && !conversationStartedRef.current) {
      // Check for existing conversation in localStorage
      const storedConversation = conversationStorage.retrieve(
        chatbotId,
        widgetKey
      );

      if (storedConversation) {
        // Resume existing conversation
        socketRef.current.emit("join-conversation", {
          conversationId: storedConversation.conversationId,
        });

        // Set the conversation ID and display name from storage
        setConversationId(storedConversation.conversationId);
        if (storedConversation.displayName) {
          setDisplayName(storedConversation.displayName);
        }

        // Mark conversation as started since we're resuming
        setConversationStarted(true);
        conversationStartedRef.current = true;
      } else {
        // Start new conversation
        socketRef.current.emit("join-conversation", {});
      }
    }
  }, [isConnected, chatbotId, widgetKey]);

  // Handlers
  const handleTypingChange = useCallback(
    (value: string) => {
      // Update input immediately for responsive UI
      setInput(value);

      // Early return for edge cases
      if (!conversationId || !socketRef.current || !isConnected) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.trim()) {
        // Emit typing event on every keypress
        socketRef.current.emit("typing", {
          conversationId,
          isTyping: true,
        });
        console.log("⌨️ [Chat] User typing");

        // Set timeout to stop typing after inactivity
        typingTimeoutRef.current = setTimeout(() => {
          socketRef.current?.emit("typing", {
            conversationId,
            isTyping: false,
          });
          console.log("⌨️ [Chat] User stopped typing (timeout)");
        }, 1500);
      } else {
        // Empty input - stop typing
        socketRef.current.emit("typing", {
          conversationId,
          isTyping: false,
        });
        console.log("⌨️ [Chat] User stopped typing (empty)");
      }
    },
    [conversationId, isConnected]
  );

  const handleSubmit = useCallback(() => {
    if (!input.trim() || !isConnected || !socketRef.current) return;

    if (lastMessageRef.current === input.trim()) {
      return;
    }

    // Check message limit from backend config
    const maxMessages = config.settings.maxMessagesPerConversation;
    if (maxMessages && messages.length >= maxMessages) {
      console.log(`🚫 [Chat] Message limit reached: ${maxMessages}`);
      // Could show a toast/alert here
      return;
    }

    // Stop typing when sending message
    if (socketRef.current && conversationId) {
      socketRef.current.emit("typing", { conversationId, isTyping: false });
      console.log("⌨️ [Chat] User stopped typing (message sent)");
    }
    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    console.log("📤 [Chat] Submitting message:", input);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      content: input,
      timestamp: new Date(),
      sender: "user",
      role: "user",
    };

    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) =>
          msg.content === userMessage.content &&
          msg.role === "user" &&
          Math.abs(msg.timestamp.getTime() - userMessage.timestamp.getTime()) <
            1000
      );

      if (isDuplicate) {
        return prev;
      }

      return [...prev, userMessage];
    });

    // Streaming path: if not yet in a joined conversation, queue request; else emit now
    if (config.settings.aiChat) {
      const query = input;
      if (!conversationStartedRef.current || !conversationId) {
        pendingQueryRef.current = query;
        console.log("[Widget][Stream] queued request until join", { query });
      } else {
        const contextPayload: any = {
          chatbotId,
          widgetKey,
          conversationId,
          // Minimal history: last 4 turns as plain text
          history: messages
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.content })),
        };
        console.log("[Widget][Stream] request start", {
          query,
          context: contextPayload,
        });
        socketRef.current.emit("request-rag-response-stream", {
          query,
          context: contextPayload,
        });
        setStreamInFlight(true);
      }
    }

    lastMessageRef.current = input.trim();
    setInput("");
    setIsLoading(true);
  }, [
    input,
    isConnected,
    messages.length,
    config.settings.maxMessagesPerConversation,
    conversationId,
  ]);

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log("📋 [Chat] Message copied to clipboard");
    } catch (error) {
      console.error("❌ [Chat] Failed to copy message:", error);
    }
  }, []);

  const handleThumbsUp = useCallback(
    (messageId: string) => {
      console.log("👍 [Chat] Thumbs up for message:", messageId);
      if (socketRef.current && conversationId) {
        socketRef.current.emit("react-message", {
          conversationId,
          messageId,
          // userId: user.id,
          reaction: "like",
        });
      }
    },
    [conversationId]
  );

  const handleThumbsDown = useCallback(
    (messageId: string) => {
      console.log("👎 [Chat] Thumbs down for message:", messageId);
      if (socketRef.current && conversationId) {
        socketRef.current.emit("react-message", {
          conversationId,
          messageId,
          reaction: "dislike",
        });
      }
    },
    [conversationId]
  );

  const handleRegenerate = useCallback((messageId: string) => {
    // Add regenerate logic here
  }, []);

  // handleDisconnect and handleReset available for future use
  const handleDisconnect = useCallback(() => {
    if (socketRef.current) {
      console.log("🔌 [Chat] Disconnecting...");
      socketRef.current.disconnect();
    }
  }, []);

  const handleReset = useCallback(() => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setTypingState({ isTyping: false });
    setConversationStarted(false);
    setConversationId(null);
    setError(null);
    setDisplayName(null);
    conversationStartedRef.current = false;
    lastMessageRef.current = "";

    // Clear stored conversation data
    conversationStorage.clear();
  }, []);

  // Expose handlers for potential external use
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).chatbotControls = {
        disconnect: handleDisconnect,
        reset: handleReset,
        // Conversation persistence utilities for debugging
        conversationStorage: {
          get: () => conversationStorage.retrieve(chatbotId, widgetKey),
          clear: () => conversationStorage.clear(),
          store: (conversationId: string, displayName?: string) =>
            conversationStorage.store(
              conversationId,
              chatbotId,
              widgetKey,
              displayName
            ),
        },
        // Current state for debugging
        getState: () => ({
          conversationId,
          conversationStarted,
          displayName,
          isConnected,
          messagesCount: messages.length,
          messages: messages.map((m) => ({
            id: m.id,
            content: m.content.substring(0, 50) + "...",
            reactions: m.reactions,
            sender: m.sender,
            role: m.role,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
        // Scroll utilities for debugging
        ensureLatestMessageVisible: ensureLatestMessageVisible,
      };
    }
  }, [
    handleDisconnect,
    handleReset,
    chatbotId,
    widgetKey,
    conversationId,
    conversationStarted,
    displayName,
    isConnected,
    messages.length,
  ]);

  // Cleanup typing state on unmount
  useEffect(() => {
    return () => {
      // Clean up timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send stop typing event on cleanup
      if (socketRef.current && conversationId) {
        socketRef.current.emit("typing", { conversationId, isTyping: false });
        console.log("⌨️ [Chat] Cleanup: stopped typing on unmount");
      }
    };
  }, [conversationId]);

  const primaryColor =
    config.ui?.primaryColor || config.settings.theme.primaryColor;
  const backgroundColor = config.settings.theme.backgroundColor;
  const fontFamily = config.settings.theme.fontFamily;

  return (
    <div
      className="widget-chatbot-container flex flex-col h-full w-full"
      style={{
        backgroundColor,
        fontFamily,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header removed - API widget provides its own header with displayName */}
      <div
        className="flex items-center justify-between p-4 border-b-0 rounded-t-2xl shadow-sm relative"
        style={{ backgroundColor: config?.ui?.primaryColor || "#0d1bd3" }}
      >
        {/* Background overlay for glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

        <div className="flex items-center gap-3 z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20"
            style={{ backgroundColor: config?.ui?.primaryColor || "#0d1bd3" }}
          >
            <img
              src={config?.ui?.logoUrl || "/ai-avatar.svg"}
              alt="Bot logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/ai-avatar.svg";
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-white text-base">
              {config?.ui?.displayName || "Customer Support"}
            </div>
            <div className="text-xs text-white/90 flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />

              {isConnected ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display - Compact */}
      {error && (
        <div className="px-3 py-2 bg-red-100 border-b border-red-200">
          <p className="text-red-700 text-xs">Error: {error}</p>
        </div>
      )}

      {/* Messages - Optimized for Widget */}
      <div className="widget-messages flex-1 overflow-y-auto px-3 py-2 space-y-2">
        <Conversation className="flex-1 overflow-hidden">
          <ConversationContent>
            {/* Welcome Screen with Suggestions */}
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircleIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {isConnected
                      ? "Start a conversation"
                      : "Connecting to support..."}
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    {isConnected
                      ? "Choose from the suggestions below or type your own question to get started"
                      : "Please wait while we connect you to our support system"}
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message: ChatMessage) => (
              <div key={message.id} className="w-full group">
                <Message
                  from={message.role === "agent" ? "assistant" : message.role}
                  className={
                    message.role === "user" ? "user-message" : "bot-message"
                  }
                >
                  {(message.role === "assistant" ||
                    message.role === "agent") && (
                    <MessageAvatar
                      src={config?.ui?.logoUrl || "/ai-avatar.svg"}
                      name="AI"
                    />
                  )}
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "user-message-content"
                        : "bot-message-content"
                    }
                    style={{
                      backgroundColor:
                        message.role === "user"
                          ? config?.ui?.primaryColor || "#0d1bd3"
                          : config?.ui?.botColor || "#f3f4f6",
                      color:
                        message.role === "user"
                          ? config?.ui?.userMessageColor || "white"
                          : config?.ui?.botMessageColor || "inherit",
                    }}
                  >
                    {message.role === "user" ? (
                      <div>{message.content}</div>
                    ) : (
                      <div className="space-y-4">
                        {/* Reasoning Section */}
                        {message.reasoning && (
                          <Reasoning defaultOpen={false}>
                            <ReasoningTrigger>
                              Thinking process
                            </ReasoningTrigger>
                            <ReasoningContent>
                              {message.reasoning}
                            </ReasoningContent>
                          </Reasoning>
                        )}

                        {/* Tool Usage */}
                        {message.tools?.map((tool, index) => (
                          <Tool key={index}>
                            <ToolHeader
                              type={`tool-${tool.name}` as any}
                              state={tool.state as any}
                            />
                            <ToolContent>
                              {tool.input && (
                                <div className="p-4">
                                  <h4 className="text-sm font-medium mb-2">
                                    Input:
                                  </h4>
                                  <CodeBlock
                                    code={JSON.stringify(tool.input, null, 2)}
                                    language="json"
                                  />
                                </div>
                              )}
                              {tool.output && (
                                <div className="p-4 border-t">
                                  <h4 className="text-sm font-medium mb-2">
                                    Output:
                                  </h4>
                                  <CodeBlock
                                    code={JSON.stringify(tool.output, null, 2)}
                                    language="json"
                                  />
                                </div>
                              )}
                            </ToolContent>
                          </Tool>
                        ))}

                        {/* Main Response */}
                        <Response>{message.content}</Response>
                      </div>
                    )}
                  </MessageContent>
                  {message.role === "user" && (
                    <MessageAvatar src="/user-avatar.svg" name="You" />
                  )}
                </Message>

                {/* Actions - Outside message and right-aligned for assistant/agent messages */}
                {(message.role === "assistant" || message.role === "agent") && (
                  <div className="flex justify-start -mt-2">
                    <Actions className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <Action
                        tooltip="Copy message"
                        onClick={() => handleCopy(message.content)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Action>
                      <Action
                        tooltip="Good response"
                        onClick={() => handleThumbsUp(message.id)}
                      >
                        <ThumbsUpIcon
                          className={`h-4 w-4 ${
                            message.reactions?.liked
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Action>
                      <Action
                        tooltip="Bad response"
                        onClick={() => handleThumbsDown(message.id)}
                      >
                        <ThumbsDownIcon
                          className={`h-4 w-4 ${
                            message.reactions?.disliked
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Action>
                      <Action
                        tooltip="Regenerate response"
                        onClick={() => handleRegenerate(message.id)}
                        disabled={isLoading}
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </Action>
                    </Actions>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicators */}
            {typingState.isTyping && (
              <Message from="assistant">
                <MessageAvatar
                  src={config?.ui?.logoUrl || "/ai-avatar.svg"}
                  name="AI"
                />
                <MessageContent
                  className="bot-message-content"
                  style={{
                    backgroundColor: config?.ui?.botColor || "#f3f4f6",
                    color: config?.ui?.botMessageColor || "inherit",
                  }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="h-4 w-4" />
                    <span className="text-sm">
                      {typingState.agentName
                        ? `${typingState.agentName} is typing...`
                        : typingState.sender === "agent"
                        ? "Agent is typing..."
                        : "AI is typing..."}
                    </span>
                  </div>
                </MessageContent>
              </Message>
            )}

            {/* Loading Indicator */}
            {isLoading && !typingState.isTyping && (
              <Message from="assistant">
                <MessageAvatar
                  src={config?.ui?.logoUrl || "/ai-avatar.svg"}
                  name="AI"
                />
                <MessageContent
                  className="bot-message-content"
                  style={{
                    backgroundColor: config?.ui?.botColor || "#f3f4f6",
                    color: config?.ui?.botMessageColor || "inherit",
                  }}
                >
                  <Loader className="h-4 w-4" />
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Compact Widget Style */}
      <ChatInput
        value={input}
        onChange={handleTypingChange}
        onSubmit={handleSubmit}
        isConnected={isConnected}
        isLoading={isLoading}
        config={config}
        chatbot={config}
      />
    </div>
  );
}

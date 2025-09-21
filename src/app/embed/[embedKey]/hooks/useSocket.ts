"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Configuration from environment variables
const SERVER_URL =
  process.env.SERVER_URL || "http://localhost:3001";

export interface SocketMessage {
  id?: string;
  content: string;
  timestamp?: Date;
  sender?: "user" | "ai" | "agent";
  conversationId?: string;
}

export interface ConversationMetadata {
  orderId?: string;
  source?: string;
  [key: string]: any;
}

export interface SocketEvents {
  // Connection events
  onConnected: (data: any) => void;
  onConversationStarted: (data: { conversationId: string }) => void;
  onDisconnect: (reason: string) => void;
  onError: (error: any) => void;

  // Message events
  onMessage: (message: SocketMessage) => void;
  onTyping: (data: { isTyping: boolean; sender?: string }) => void;
  onAgentTyping: (data: { isTyping: boolean; agentName?: string }) => void;

  // Status events
  onStatusChange: (status: any) => void;
  onQueueUpdate: (data: any) => void;
  onAgentJoined: (data: { agentName: string; agentId: string }) => void;
  onConversationEnded: (data: {
    conversationId: string;
    reason?: string;
  }) => void;
  onConversationTransferred: (data: any) => void;

  // AI events
  onAiAnalysisResult: (result: any) => void;
  onConversationSummary: (summary: any) => void;
  onConversationMetadataUpdated: (metadata: ConversationMetadata) => void;
}

export interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  conversationId: string | null;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";

  // Actions
  joinConversation: (sessionId?: string) => void;
  sendMessage: (content: string) => void;
  setTyping: (isTyping: boolean) => void;
  requestAiAnalysis: (message: string, analysisType?: string) => void;
  rateConversation: (rating: number, comment?: string) => void;
  endConversation: () => void;
  updateConversationMetadata: (metadata: ConversationMetadata) => void;
  requestConversationSummary: () => void;
  ping: () => void;

  // Utilities
  getSessionId: () => string | null;
  // Cleanup
  disconnect: () => void;
}

export const useSocket = (
  widgetKey: string,
  chatbotId: string,
  events: Partial<SocketEvents> = {}
): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const eventsRef = useRef(events);

  // Update events ref when events change
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  // Initialize socket connection
  useEffect(() => {
    if (socketRef.current) {
      console.log("[Embed Socket] Socket already exists, skipping initialization");
      return;
    }


    setConnectionStatus("connecting");
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      timeout: 10000,
      auth: {
        widgetKey: widgetKey,
        chatbotId: chatbotId,
      },
    });

   
    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ [Embed Socket] Connected successfully:", socket.id);
      setIsConnected(true);
      setConnectionStatus("connected");
    });

    socket.on("connected", (data) => {
      console.log("[Socket] Connected event (welcome message):", data);
      events.onConnected?.(data);

      socket.emit("join-conversation", {});
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 [Embed Socket] Disconnected:", reason);
      console.log("[Embed Socket] Disconnect reason:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setConversationId(null);

      events.onDisconnect?.(reason);
    });

    socket.on("connect_error", (error) => {
      console.error("🚨 [Embed Socket] ===== CONNECTION ERROR =====");
      console.error("[Embed Socket] Error object:", error);
      console.error("[Embed Socket] Error message:", error.message);
      console.error("[Embed Socket] Full error details:", {
        message: error.message,
        type: (error as any).type,
        description: (error as any).description,
        context: (error as any).context
      });
      setConnectionStatus("error");
      events.onError?.(error);
    });

    // Conversation events
    socket.on("conversation-started", (data) => {
      console.log("[Socket] Conversation started:", data);
      if (data?.conversationId) {
        setConversationId(data.conversationId);
      }

      // Store sessionId in localStorage if provided
      if (data?.sessionId) {
        try {
          localStorage.setItem("chat_session_id", data.sessionId);
         
          
          // Verify it was stored
          const stored = localStorage.getItem("chat_session_id");
          console.log("[Embed Socket] Verification - stored sessionId:", stored);
        } catch (error) {
          console.warn("❌ [Embed Socket] Failed to store sessionId in localStorage:", error);
        }
      } else {
        console.warn("⚠️ [Embed Socket] No sessionId in conversation-started data");
      }

      events.onConversationStarted?.(data);
    });

    socket.on("conversation-ended", (data) => {
      console.log("[Socket] Conversation ended:", data);
      setConversationId(null);

      // Clear sessionId from localStorage when conversation ends
      try {
        localStorage.removeItem("chat_session_id");
        console.log("[Socket] SessionId cleared from localStorage");
      } catch (error) {
        console.warn(
          "[Socket] Failed to clear sessionId from localStorage:",
          error
        );
      }

      events.onConversationEnded?.(data);
    });

    socket.on("conversation-transferred", (data) => {
      console.log("[Socket] Conversation transferred:", data);
      events.onConversationTransferred?.(data);
    });

    // Message events
    socket.on("message", (data) => {
      console.log("[Socket] Message received:", data);
      console.log("[Socket] Message data structure:", JSON.stringify(data));

      // Backend sends: { message: { content: "...", sender: "..." } }
      if (data.message) {
        const messageData = {
          id: `msg-${Date.now()}`,
          content: data.message.content,
          timestamp: new Date(),
          sender: data.message.sender,
          conversationId: conversationId || undefined,
        };
        events.onMessage?.(messageData);
      } else {
        // Fallback for different format
        events.onMessage?.(data);
      }
    });

    socket.on("typing", (data) => {
      console.log("[Socket] Typing:", data);
      events.onTyping?.(data);
    });

    socket.on("agent-typing", (data) => {
      console.log("[Socket] Agent typing:", data);
      events.onAgentTyping?.(data);
    });

    // Status events
    socket.on("status-change", (data) => {
      console.log("[Socket] Status change:", data);
      events.onStatusChange?.(data);
    });

    socket.on("queue-update", (data) => {
      console.log("[Socket] Queue update:", data);
      events.onQueueUpdate?.(data);
    });

    socket.on("agent-joined", (data) => {
      console.log("[Socket] Agent joined:", data);
      events.onAgentJoined?.(data);
    });

    // AI events
    socket.on("ai-analysis-result", (data) => {
      console.log("[Socket] AI analysis result:", data);
      events.onAiAnalysisResult?.(data);
    });

    socket.on("conversation-summary", (data) => {
      console.log("[Socket] Conversation summary:", data);
      events.onConversationSummary?.(data);
    });

    socket.on("conversation-metadata-updated", (data) => {
      console.log("[Socket] Conversation metadata updated:", data);
      events.onConversationMetadataUpdated?.(data);
    });

    // General events
    socket.on("pong", (data) => {
      console.log("[Socket] Pong:", data);
    });

    socket.on("error", (error) => {
      console.warn("[Socket] Error event:", error);
      events.onError?.(error);
    });

    return () => {
      console.log("🧹 [Embed Socket] ===== CLEANUP FUNCTION CALLED =====");
      console.log("[Embed Socket] Disconnecting socket:", socket.id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Action methods
  const joinConversation = useCallback((sessionId?: string) => {
    if (!socketRef.current?.connected) return;

    console.log(
      "[Socket] Emitting join-conversation with empty payload (matching working script)"
    );
    // Backend expects empty object, not sessionId
    socketRef.current.emit("join-conversation", {});
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected) return;

    console.log("[Socket] Emitting send-message:", content);
    socketRef.current.emit("send-message", { content });
  }, []);

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current?.connected) return;

      console.log(
        "[Socket] Emitting typing:",
        isTyping,
        "conversationId:",
        conversationId
      );
      // Try to send typing even without conversationId - some backends might handle it
      socketRef.current.emit("typing", {
        conversationId: conversationId || "pending",
        isTyping,
      });
    },
    [conversationId]
  );

  const requestAiAnalysis = useCallback(
    (message: string, analysisType: string = "intent") => {
      if (!socketRef.current?.connected) return;

      console.log("[Socket] Emitting request-ai-analysis:", {
        message,
        analysisType,
      });
      socketRef.current.emit("request-ai-analysis", { message, analysisType });
    },
    []
  );

  const rateConversation = useCallback(
    (rating: number, comment?: string) => {
      if (!socketRef.current?.connected || !conversationId) return;

      console.log("[Socket] Emitting rate:", { rating, comment });
      socketRef.current.emit("rate", { conversationId, rating, comment });
    },
    [conversationId]
  );

  const endConversation = useCallback(() => {
    if (!socketRef.current?.connected || !conversationId) return;

    console.log("[Socket] Emitting end-conversation");
    socketRef.current.emit("end-conversation", { conversationId });
  }, [conversationId]);

  const updateConversationMetadata = useCallback(
    (metadata: ConversationMetadata) => {
      if (!socketRef.current?.connected) return;

      console.log("[Socket] Emitting update-conversation-metadata:", metadata);
      socketRef.current.emit("update-conversation-metadata", { metadata });
    },
    []
  );

  const requestConversationSummary = useCallback(() => {
    if (!socketRef.current?.connected) return;

    console.log("[Socket] Emitting request-conversation-summary");
    socketRef.current.emit("request-conversation-summary");
  }, []);

  const ping = useCallback(() => {
    if (!socketRef.current?.connected) return;

    console.log("[Socket] Emitting ping");
    socketRef.current.emit("ping");
  }, []);

  // Utility function to get sessionId from localStorage
  const getSessionId = useCallback(() => {
    try {
      const sessionId = localStorage.getItem("chat_session_id");
      console.log("🔍 [Embed Socket] Retrieved sessionId from localStorage:", sessionId);
      return sessionId;
    } catch (error) {
      console.warn(
        "[Embed Socket] Failed to retrieve sessionId from localStorage:",
        error
      );
      return null;
    }
  }, []);



  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setConversationId(null);

     
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    conversationId,
    connectionStatus,
    joinConversation,
    sendMessage,
    setTyping,
    requestAiAnalysis,
    rateConversation,
    endConversation,
    updateConversationMetadata,
    requestConversationSummary,
    ping,
    getSessionId,
    disconnect,
  };
};

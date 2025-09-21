'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Send, RefreshCw, MoreHorizontal, X } from "lucide-react";
import AdminLayout from "@/components/adminlayout/AdminLayout";
import { ModelSettingsDropdown } from "./ModelSettingsDropdown";
import { ModelConfig } from "@/types/interfaces";

// Theme-aware chatbot configuration using Tailwind CSS approach
const useChatbotConfig = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Function to check current theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Initialize theme from localStorage on mount (same as themeToggleButton)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const createChatbotTheme = localStorage.getItem("vite-ui-theme") as "light" | "dark" | null;
    
    // Use the most recent theme preference
    const preferredTheme = savedTheme || createChatbotTheme;
    
    if (preferredTheme) {
      setTheme(preferredTheme);
      if (preferredTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      // Check current DOM state
      checkTheme();
    }

    // Listen for custom theme change events (dispatched by themeToggleButton)
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Theme change event received:', event.detail);
      setTheme(event.detail.theme);
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    
    // Also listen for class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log('Class mutation detected');
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
      observer.disconnect();
    };
  }, []);

  // Light mode configuration (original)
  const lightConfig = {
    displayName: "AI Assistant",
    userMessageColor: "#3B82F6",
    chatBubbleColor: "#F3F4F6", 
    backgroundColor: "#FFFFFF", 
    inputContainerColor: "#FFFFFF", 
    messagePlaceholder: "Type your message...",
    collectUserFeedback: true,
    regenerateMessages: true,
    humanEscalation: true,
    aiChat: true,
    botLogo: "", 
  };

  // Dark mode configuration (improved colors)
  const darkConfig = {
    displayName: "AI Assistant",
    userMessageColor: "#1A2234", 
    chatBubbleColor: "#374151", 
    backgroundColor: "#020817",
    inputContainerColor: "#020817", 
    messagePlaceholder: "Type your message...",
    collectUserFeedback: true,
    regenerateMessages: true,
    humanEscalation: true,
    aiChat: true,
    botLogo: "", 
  };

  // Return appropriate config based on theme
  return theme === 'dark' ? darkConfig : lightConfig;
};

interface ComparisonViewProps {
  setIsCompareMode: (enabled: boolean) => void;
}

export function ComparisonView({
  setIsCompareMode,
}: ComparisonViewProps) {
  const chatbotConfig = useChatbotConfig();
  // Get theme from chatbot config
  const theme = chatbotConfig.backgroundColor === "#020817" ? "dark" : "light";

  // Internal state management
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: "gpt-4",
      name: "GPT-4",
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }],
      isLoading: false,
      topK: 1
    },
    {
      id: "claude-3",
      name: "Claude 3",
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }],
      isLoading: false,
      topK: 1
    }
  ]);

  const [modelInputs, setModelInputs] = useState<string[]>(["", ""]);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);

  // Initialize model inputs when models change
  useEffect(() => {
    setModelInputs(new Array(models.length).fill(""));
  }, [models.length]);

  const handleSendMessage = async (modelIndex: number, message: string) => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: any = { role: "user", content: message, timestamp };

    // If sync is enabled, send to all models; otherwise, send to specific model
    if (isSyncEnabled) {
      setModels(prev => prev.map(model => ({
        ...model,
        messages: [...model.messages, userMessage],
        isLoading: true
      })));
    } else {
      setModels(prev => prev.map((model, idx) => 
        idx === modelIndex 
          ? { ...model, messages: [...model.messages, userMessage], isLoading: true }
          : model
      ));
    }

    // Simulate API response
    setTimeout(() => {
      const responses = [
        "I understand your question. Based on the context provided, I can help you with this task. Let me break down the solution step by step...",
        "Thank you for your question. I'd be happy to assist you with this. Here's my detailed response to your inquiry...",
        "That's an interesting question! Let me provide you with a comprehensive answer that addresses all aspects of your request..."
      ];
      
      // If sync is enabled, generate responses for all models; otherwise, just for the specific model
      if (isSyncEnabled) {
        setModels(prev => prev.map(model => {
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const assistantMessage: any = { 
            role: "assistant", 
            content: randomResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return { ...model, messages: [...model.messages, assistantMessage], isLoading: false };
        }));
      } else {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const assistantMessage: any = { 
          role: "assistant", 
          content: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setModels(prev => prev.map((model, idx) => 
          idx === modelIndex 
            ? { ...model, messages: [...model.messages, assistantMessage], isLoading: false }
            : model
        ));
      }
    }, 1500 + Math.random() * 1000);

    // Clear the input(s) after sending
    if (isSyncEnabled) {
      // Clear all inputs when sync is enabled
      setModelInputs(new Array(models.length).fill(""));
    } else {
      // Clear only the specific model input
      setModelInputs(prev => prev.map((input, idx) => idx === modelIndex ? "" : input));
    }
  };

  const updateModelInput = (modelIndex: number, value: string) => {
    // Always update only the specific model input when typing
    // Sync only affects message sending, not typing
    setModelInputs(prev => prev.map((input, idx) => idx === modelIndex ? value : input));
  };

  const updateModelConfig = (modelIndex: number, field: keyof ModelConfig, value: any) => {
    setModels(prev => prev.map((model, idx) => 
      idx === modelIndex ? { ...model, [field]: value } : model
    ));
  };

  const clearAllChats = () => {
    setModels(prev => prev.map(model => ({
      ...model,
      messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }]
    })));
  };

  const resetToDefault = () => {
    setModels([
      {
        id: "gpt-4",
        name: "GPT-4",
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1,
        messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }],
        isLoading: false,
        topK: 1
      },
      {
        id: "claude-3",
        name: "Claude 3",
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1,
        messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }],
        isLoading: false,
        topK: 1
      }
    ]);
    setModelInputs(["", ""]);
  };

  const addModel = () => {
    // Limit to maximum 3 chatbots
    if (models.length >= 3) return;
    
    // Available model types to add
    const availableModels = [
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", temperature: 0.7, topK: 1 },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", temperature: 0.7, topK: 1 },
      { id: "claude-3", name: "Claude 3", temperature: 0.7, topK: 1 }
    ];
    
    // Choose the next model type based on current count
    const modelType = availableModels[(models.length - 2) % availableModels.length];
    
    const newModel: ModelConfig = {
      id: `${modelType.id}-${Date.now()}`,
      name: modelType.name,
      temperature: modelType.temperature,
      topK: modelType.topK,
      maxTokens: 1000,
      topP: 1,
      messages: [{ role: "assistant", content: "Hi! What can I help you with?", timestamp: "10:30 AM" }],
      isLoading: false
    };
    setModels(prev => [...prev, newModel]);
  };

  const removeModel = (modelIndex: number) => {
    // Ensure we always keep at least 2 models
    if (models.length <= 2) return;
    
    setModels(prev => prev.filter((_, index) => index !== modelIndex));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Comparison</h2>
            <p className="text-muted-foreground">Compare responses across {models.length} AI agents</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setIsCompareMode(false)}
          >
            Configure & test agents
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCompareMode(true)}
          >
            Compare
          </Button>
        </div>

        <div className="flex items-center justify-start sm:justify-end">
          <div className="flex sm:items-center gap-4 sm:gap-2 flex-col sm:flex-row">
            <div className="flex items-center gap-2 sm:mr-4">
              <Switch 
                checked={isSyncEnabled} 
                onCheckedChange={setIsSyncEnabled}
                id="sync-toggle"
                
              />
              <Label htmlFor="sync-toggle" className="text-[12px] font-medium">
                Sync messages
              </Label>
            </div>
            <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAllChats}>
              Clear all chats
            </Button>
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={addModel}
              disabled={models.length >= 3}
            >
              Add an agent {models.length >= 3 && "(Max 3)"}
            </Button>
            </div>
          </div>
        </div>

        {/* Chat Comparison */}
        <div className="flex overflow-hidden gap-[15px] flex-wrap min-h-[600px]">
          {models.map((model, modelIndex) => (
            <div key={model.id} className="flex-1 flex flex-col border-0 shadow-sm bg-background/50 backdrop-blur-sm rounded-lg w-full min-w-[350px]">
              <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border border-border/30 flex-1 flex flex-col">
                {/* Chatbot Header */}
                <div 
                  className="flex items-center justify-between p-4 border-b-0 rounded-t-2xl shadow-sm relative"
                  style={{ backgroundColor: chatbotConfig.userMessageColor }}
                >
                  {/* Background overlay for glassmorphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
                  
                  <div className="flex items-center gap-3 z-10">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20"
                      style={{ backgroundColor: chatbotConfig.userMessageColor }}
                    >
                      {chatbotConfig.botLogo ? (
                        <img
                          src={chatbotConfig.botLogo}
                          alt="Bot logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="m2 17 10 5 10-5"></path>
                          <path d="m2 12 10 5 10-5"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-base">
                        {model.name}
                      </div>
                      <div className="text-xs text-white/90 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 z-10">
                    <ModelSettingsDropdown
                      model={model}
                      modelIndex={modelIndex}
                      updateModelConfig={updateModelConfig}
                    />
                    {models.length > 2 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeModel(modelIndex)}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Customer Info Panel */}
                <div className="bg-gray-50/80 dark:bg-[#020817] px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-400">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">Test User</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>Just now</span>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div 
                  className="flex-1 p-4 overflow-y-auto"
                  style={{ backgroundColor: chatbotConfig.backgroundColor }}
                >
                  <div className="space-y-4">
                    {model.messages.map((message, messageIndex) => (
                      <div key={messageIndex}>
                        {message.role === 'user' ? (
                          /* User Message */
                          <div className="flex items-start gap-2 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold" style={{ backgroundColor: chatbotConfig.userMessageColor }}>
                              T
                            </div>
                            <div className="flex flex-col max-w-[80%] items-end">
                              <div
                                className="p-3 rounded-2xl rounded-br-sm text-white text-sm"
                                style={{ backgroundColor: chatbotConfig.userMessageColor }}
                              >
                                {message.content}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {message.timestamp}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* Bot Message */
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: chatbotConfig.userMessageColor }}>
                              {chatbotConfig.botLogo ? (
                                <img
                                  src={chatbotConfig.botLogo}
                                  alt="Bot avatar"
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                  <path d="m2 17 10 5 10-5"></path>
                                  <path d="m2 12 10 5 10-5"></path>
                                </svg>
                              )}
                            </div>
                            <div className="flex flex-col max-w-[80%]">
                              <div 
                                className="p-3 rounded-2xl rounded-bl-sm text-sm"
                                style={{ 
                                  backgroundColor: chatbotConfig.chatBubbleColor,
                                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                                  border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB'
                                }}
                              >
                                {message.content}
                              </div>
                              <div className="flex items-center mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {message.timestamp}
                                </span>
                                <div className="ml-2 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                                  {/* Copy Button - Always shown for bot messages */}
                                  <button className="p-1.5 rounded-md hover:bg-background/80 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Copy message">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </button>
                                  {/* Feedback Buttons - Conditionally shown */}
                                  {chatbotConfig.collectUserFeedback && (
                                    <>
                                      <button className="p-1.5 rounded-md hover:bg-background/80 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Good response">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                        </svg>
                                      </button>
                                      <button className="p-1.5 rounded-md hover:bg-background/80 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Poor response">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                                        </svg>
                                      </button>
                                    </>
                                  )}
                                  {/* Regenerate Button - Conditionally shown */}
                                  {chatbotConfig.regenerateMessages && (
                                    <button className="p-1.5 rounded-md hover:bg-background/80 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Regenerate response">
                                      <RefreshCw className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Loading Indicator */}
                    {model.isLoading && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: chatbotConfig.userMessageColor }}>
                          {chatbotConfig.botLogo ? (
                            <img
                              src={chatbotConfig.botLogo}
                              alt="Bot avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="m2 17 10 5 10-5"></path>
                              <path d="m2 12 10 5 10-5"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[80%]">
                          <div 
                            className="p-3 rounded-2xl rounded-bl-sm"
                            style={{ 
                              backgroundColor: chatbotConfig.chatBubbleColor,
                              color: theme === 'dark' ? '#FFFFFF' : '#000000',
                              border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB'
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>AI is typing</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div 
                  className="border-t border-gray-200 dark:border-gray-700 px-4 py-3"
                  style={{ backgroundColor: chatbotConfig.inputContainerColor }}
                >
                  <div className="flex items-center justify-between mb-3">
                    {chatbotConfig.humanEscalation && (
                      <button className="text-blue-600 dark:text-white text-xs font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
                        🎧 Talk to Human Agent
                      </button>
                    )}
                    <button className="text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Input Section */}
                  <div className="flex items-end gap-2">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"></path>
                      </svg>
                    </button>
                    <div 
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg"
                      style={{ backgroundColor: chatbotConfig.inputContainerColor }}
                    >
                      <input
                        type="text"
                        placeholder={chatbotConfig.messagePlaceholder}
                        value={modelInputs[modelIndex] || ""}
                        onChange={(e) => updateModelInput(modelIndex, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage(modelIndex, modelInputs[modelIndex] || "");
                          }
                        }}
                        className="w-full px-3 py-2 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => handleSendMessage(modelIndex, modelInputs[modelIndex] || "")}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: chatbotConfig.userMessageColor }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
'use client';
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Send, Bot, Phone, Video, Info, MoreVertical, Star, Archive, Trash2, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { useConversation, useTypingState, useConversationSocket } from './ModernConversationProvider';
import {  formatRelativeTimeSSR } from '@/utils/dateUtils';
import { EmptyState } from '@/components/ui/empty-state';

const ChatInterface = memo(({ selectedChatbot }: { selectedChatbot: any }) => {
  const [state, send] = useConversation();
  const { isTyping, participants, getTypingDisplayText } = useTypingState();
  const { socket, emit } = useConversationSocket();
  const [isHydrated, setIsHydrated] = useState(false);
  // Extract selectedConversation from state context
  const selectedConversation = state.context.selectedConversation;
  // Local message state to prevent global re-renders
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get pagination state from XState machine
  const { loadingMoreMessages, hasMoreMessages } = state.context;

  // Helper functions for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const getAvatarColor = (name: string) => {
    const colors = ['bg-primary', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Format message timestamp with hydration-safe rendering
  const formatMessageTimestamp = (timestamp: Date | string | number) => {
    if (typeof timestamp === 'number') {
      return formatRelativeTimeSSR(new Date(timestamp), isHydrated);
    }
    return formatRelativeTimeSSR(timestamp, isHydrated);
  };

  // Set hydration state after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send stop typing event on cleanup
      if (socket && selectedConversation) {
        socket.emit('typing', {
          conversationId: selectedConversation.conversationId || selectedConversation._id,
          isTyping: false,
          sender: 'agent'
        });
      }
    };
  }, [socket, selectedConversation]);

  // Handle scroll up to load more messages
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || state.context.loading || loadingMoreMessages || !hasMoreMessages) return;
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop <= 50) {
      const conversationId = selectedConversation?.conversationId || selectedConversation?._id;
      if (conversationId) {
       
        send({
          type: 'LOAD_MORE_MESSAGES',
          conversationId: conversationId,
        });
      }
    }
  }, [send, selectedConversation?.conversationId, selectedConversation?._id, state.context.loading, loadingMoreMessages, hasMoreMessages]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSend = (msg?: string) => {
    const textToSend = msg || message;
    if (textToSend.trim() && socket && selectedConversation) {
      socket.emit('send-message', { 
        content: textToSend,
        sender: 'agent',
        conversationId: selectedConversation.conversationId || selectedConversation._id 
      });
      setMessage('');
      
      // Stop typing indicator when sending message
      if (socket && selectedConversation) {
        socket.emit('typing', {
          conversationId: selectedConversation.conversationId || selectedConversation._id,
          isTyping: false,
          sender: 'agent'
        });
      }
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Early return if no socket or conversation
    if (!socket || !selectedConversation) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      // Emit typing event with agent as sender
      socket.emit('typing', {
        conversationId: selectedConversation.conversationId || selectedConversation._id,
        isTyping: true,
        sender: 'agent'
      });

      // Set timeout to stop typing after inactivity (1.5 seconds)
      typingTimeoutRef.current = setTimeout(() => {
        if (socket && selectedConversation) {
          socket.emit('typing', {
            conversationId: selectedConversation.conversationId || selectedConversation._id,
            isTyping: false,
            sender: 'agent'
          });
        }
        typingTimeoutRef.current = null;
      }, 1500);
    } else {
      // Empty input - stop typing immediately
      socket.emit('typing', {
        conversationId: selectedConversation.conversationId || selectedConversation._id,
        isTyping: false,
        sender: 'agent'
      });
    }
  }, [socket, selectedConversation]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Safety check for conversation object
  if (!selectedConversation) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversation selected"
        description="Choose a conversation from the sidebar to start chatting and view messages."
        className="h-full"
      />
    );
  }

  // Conversation data for the new UI - handle raw API data structure
  const selectedConv = {
    userName: selectedConversation?.user?.name || selectedConversation?.userName || selectedConversation?.name || 'Support Assistant',
    isOnline: true,
    chatbotName: selectedChatbot?.name || 'AI Assistant',
    messages:
      selectedConversation?.messages?.length > 0
        ? selectedConversation.messages.map((msg: any) => ({
            id: msg.id || msg._id || msg.messageId || Math.random().toString(),
            content: msg.message || msg.content || msg.text || msg.body,
            isUser: msg.sender === 'user',
            isStreaming: msg.isStreaming || false, // ✅ Include streaming state
            timestamp:
              msg.date || msg.timestamp || msg.createdAt
                ? formatMessageTimestamp(new Date(msg.date || msg.timestamp || msg.createdAt).getTime())
                : 'now',
          }))
        : [],
  };

  // ✅ Local typing state - only set to false when rag-stream-chunk event occurs
  const [localTypingState, setLocalTypingState] = useState({ isTyping: false });
  const [localTypingText, setLocalTypingText] = useState('');
  const [provisionalMessage, setProvisionalMessage] = useState<any>(null);
  const hasStreamingMessage = selectedConv.messages.some((msg: any) => !msg.isUser && msg.isStreaming);
  
  useEffect(() => {
    if (isTyping) {
      setLocalTypingState({ isTyping: true });
      // Set the typing text based on who's typing
      const aiParticipants = participants.filter((p: any) => p.type === 'ai');
      const userParticipants = participants.filter((p: any) => p.type === 'user');
      const agentParticipants = participants.filter((p: any) => p.type === 'agent');
      
      if (aiParticipants.length > 0) {
        setLocalTypingText('AI assistant is typing...');
      } else {
        setLocalTypingText(getTypingDisplayText());
      }
    }
  }, [isTyping, participants, getTypingDisplayText]);
  
  // Listen for stream chunk events to create provisional message immediately
  useEffect(() => {
    if (!socket) return;
    
    const handleStreamChunk = (data: any) => {
      const { conversationId, chunk } = data;
      
      // Only handle events for current conversation
      if (selectedConversation?.conversationId !== conversationId) return;
      
      // If no streaming message exists yet, create provisional one immediately
      if (!hasStreamingMessage && !provisionalMessage) {
        const provisional = {
          id: `provisional-${Date.now()}`,
          content: chunk,
          isUser: false,
          isStreaming: true,
          timestamp: 'now',
        };
        setProvisionalMessage(provisional);
        // ✅ Clear typing indicator now that streaming content has started (exact same as embed widget)
        setLocalTypingState({ isTyping: false });
      } else if (provisionalMessage) {
        // Update provisional message content
        setProvisionalMessage((prev: any) => prev ? {
          ...prev,
          content: prev.content + chunk
        } : null);
      }
    };
    
    socket.on('rag-stream-chunk', handleStreamChunk);
    
    return () => {
      socket.off('rag-stream-chunk', handleStreamChunk);
    };
  }, [socket, selectedConversation?.conversationId, hasStreamingMessage, provisionalMessage]);
  
  // Clear provisional message when real streaming message appears
  useEffect(() => {
    if (hasStreamingMessage && provisionalMessage) {
      setProvisionalMessage(null);
    }
  }, [hasStreamingMessage, provisionalMessage]);
  

  return (
    <div className='flex-1 flex flex-col h-full'>
      {/* Chat Header */}
      {/* Chat Header */}
          <div className='bg-white border-b dark:bg-card border-gray-200 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(
                      selectedConv.userName
                    )}`}>
                    {getInitials(selectedConv.userName)}
                  </div>
                  {selectedConv.isOnline && <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>}
                </div>
                <div>
                  <div className='text-lg font-medium text-gray-900 dark:text-white'>{selectedConv.userName}</div>
                  <p className='text-sm text-gray-500'>
                    {selectedConv.isOnline ? 'Online' : 'Last seen 2 hours ago'} • via {selectedConv.chatbotName}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Phone className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Video className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Info className='w-5 h-5' />
                </button>
                <div className='relative'>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                    <MoreVertical className='w-5 h-5' />
                  </button>
                  {showDropdown && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10'>
                      <div className='py-1'>
                        <button className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                          <Star className='w-4 h-4' />
                          <span>Star Conversation</span>
                        </button>
                        <button className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                          <Archive className='w-4 h-4' />
                          <span>Archive</span>
                        </button>
                        <button className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
                          <Trash2 className='w-4 h-4' />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB] dark:bg-background'>
            {/* Loading indicator for initial load */}
            {state.context.loading && (
              <div className='flex justify-center py-2'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground'></div>
                  <span className='text-sm'>Loading conversation...</span>
                </div>
              </div>
            )}

            {/* Loading indicator for loading more messages */}
            {loadingMoreMessages && (
              <div className='flex justify-center py-2'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground'></div>
                  <span className='text-sm'>Loading more messages...</span>
                </div>
              </div>
            )}

            {/* Error message display */}
            {state.context.error && (
              <div className='flex justify-center py-2'>
                <div className='flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg'>
                  <span className='text-sm'>{state.context.error}</span>
                </div>
              </div>
            )}

            {/* No more messages indicator */}
            {!hasMoreMessages && selectedConv.messages && selectedConv.messages.length > 0 && (
              <div className='flex justify-center py-2'>
                <div className='text-muted-foreground text-sm'>No more messages to load</div>
              </div>
            )}

            {/* Messages */}
            {(selectedConv.messages.length > 0 || provisionalMessage) ? (
              [...selectedConv.messages, ...(provisionalMessage && !hasStreamingMessage ? [provisionalMessage] : [])].map((message: any) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                    <p className='text-sm'>
                      {message.content}
                      {/* Show streaming indicator for AI messages that are currently streaming */}
                      {!message.isUser && message.isStreaming && (
                        <span className='inline-block ml-1'>
                          <span className='inline-block w-1 h-1 bg-current rounded-full animate-pulse'></span>
                        </span>
                      )}
                    </p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp}
                      {!message.isUser && message.isStreaming && (
                        <span className='ml-2 text-xs opacity-70'>streaming...</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex-1 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Bot className='w-8 h-8 text-muted-foreground' />
                  </div>
                  <h3 className='text-lg font-medium text-foreground mb-2'>No messages yet</h3>
                  <p className='text-muted-foreground'>Start the conversation by sending a message below</p>
                </div>
              </div>
            )}

            {/* Typing Indicators */}
            {localTypingState.isTyping && (
              <div className='flex justify-start'>
                <div className='max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-secondary text-secondary-foreground'>
                  <p className='text-sm'>
                    <span className='flex items-center gap-2'>
                      <span className='inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce'></span>
                      <span
                        className='inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}></span>
                      <span
                        className='inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}></span>
                      <span className='text-muted-foreground'>
                        {localTypingText}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            )}
            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className='bg-card border-t border-border p-4 flex-shrink-0'>
            <div className='flex items-center space-x-3'>
              <button className='p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors'>
                <Paperclip className='w-5 h-5' />
              </button>
              <div className='flex-1 relative'>
                <input
                  type='text'
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder='Type a message...'
                  className='w-full px-4 py-2 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                />
                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground'>
                  <Smile className='w-5 h-5' />
                </button>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!message.trim()}
                className='p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                <Send className='w-5 h-5' />
              </button>
            </div>
          </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;

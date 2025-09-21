'use client';

import React, { useState } from 'react';
import Conversations from './Conversations';
import ChatInterface from './ChatInterface';
import Summary from './ConversationSummary';
import { useConversation } from './ModernConversationProvider';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useConversationUI } from '@/hooks/conversation';
import { Users, MessageCircle, FileText } from 'lucide-react';

const ConversationLayout = () => {
  // Keep backward compatibility with existing XState pattern
  const [conversationState] = useConversation();
  const selectedConversation = conversationState.context.selectedConversation;
  
  // UI state management
  const ui = useConversationUI({
    initialPreferences: {
      theme: 'auto',
      autoScrollToBottom: true,
      showTimestamps: true,
      showTypingIndicators: true,
    },
  });
  
  const [state] = useChatBotMachineState();
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'summary'>('chat');

  const selectedChatbot = state.context.selectedChatbot;
  
  // Handle mobile tab switching with UI state
  const handleTabChange = (tab: 'users' | 'chat' | 'summary') => {
    setActiveTab(tab);
    // Update UI state for better mobile experience
    if (tab === 'chat' && selectedConversation) {
      ui.scrollToBottom();
    }
  };
  return (
    <div className='h-[calc(100vh-60px)] bg-background flex flex-col'>
      {/* Mobile View - Buttons and Single Column */}
      <div className='lg:hidden bg-card border-b border-border'>
        <div className='flex'>
          <button
            onClick={() => handleTabChange('users')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            <div className='flex items-center justify-center space-x-2'>
              <Users className='w-4 h-4' />
              <span>Users</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            <div className='flex items-center justify-center space-x-2'>
              <MessageCircle className='w-4 h-4' />
              <span>Chat</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('summary')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            <div className='flex items-center justify-center space-x-2'>
              <FileText className='w-4 h-4' />
              <span>Summary</span>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Desktop Layout */}
        <div className='hidden lg:flex w-full h-full'>
          {/* Users Sidebar - 25% width with independent overflow */}
          <div className='w-1/4 min-w-0 h-full overflow-hidden'>
            <Conversations chatbot={selectedChatbot} />
          </div>

          {/* Chat Area - 50% width with independent overflow */}
          <div className='w-1/2 min-w-0 h-full overflow-hidden'>
            <ChatInterface selectedChatbot={selectedChatbot} />
          </div>

          {/* Summary Sidebar - 25% width with independent overflow */}
          <div className='w-1/4 min-w-0 h-full overflow-hidden'>
            <Summary chatbotName={selectedChatbot?.name || 'Test Chatbot'} />
          </div>
        </div>

        {/* Mobile Single Column View */}
        <div className='lg:hidden w-full h-full overflow-hidden flex flex-col'>
          {activeTab === 'users' && (
            <div className='flex-1 h-full overflow-hidden'>
              <Conversations chatbot={selectedChatbot} />
            </div>
          )}
          {activeTab === 'chat' && selectedConversation && selectedChatbot && (
            <div className='flex-1 h-full overflow-hidden'>
              <ChatInterface selectedChatbot={selectedChatbot} />
            </div>
          )}
          {activeTab === 'summary' && selectedConversation && (
            <div className='flex-1 h-full overflow-hidden'>
              <Summary chatbotName={selectedChatbot?.name || 'Test Chatbot'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationLayout;

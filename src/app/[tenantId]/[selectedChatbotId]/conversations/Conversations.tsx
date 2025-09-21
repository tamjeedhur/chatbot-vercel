import React, { useMemo, memo } from 'react';
import { Search, Wifi, WifiOff } from 'lucide-react';
import { Conversation } from '@/machines/conversation-machine';
import { useConversation, useModernConversation } from './ModernConversationProvider';

const Conversations = memo(({ chatbot }: { chatbot: any }) => {
  // Keep backward compatibility with existing XState pattern
  const [state, send] = useConversation();

  // Use modern socket hook for enhanced features
  const socket = useModernConversation();

  // Extract values from state context (maintaining backward compatibility)
  const filteredConversations = state.context.filteredConversations;
  const selectedConversation = state.context.selectedConversation;
  const searchQuery = state.context.searchQuery;

  const handleSearchChange = (query: string) => {
    send({ type: 'SEARCH_CONVERSATIONS', query });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    console.log('handleSelectConversation called with:', conversation);
    send({ type: 'SELECT_CONVERSATION', conversation });
  };

  const getAvatarColor = useMemo(() => {
    const colors = ['bg-primary', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-indigo-600', 'bg-pink-600', 'bg-gray-600'];

    return (userId: string) => {
      // Create a hash from the user ID to get a consistent index
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };
  }, []);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className='w-full h-full bg-card lg:border-r border-border flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b border-border flex-shrink-0'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-xl font-semibold text-foreground'>Conversations</h1>
          {/* Connection Status Indicator */}
          <div className='flex items-center space-x-2'>
            {socket && socket.isConnected ? (
              <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                <Wifi className='w-4 h-4' />
                <span className='text-xs font-medium'>Live</span>
              </div>
            ) : socket && socket.socket && !socket.isConnected ? (
              <div className='flex items-center space-x-1 text-red-600 dark:text-red-400'>
                <WifiOff className='w-4 h-4' />
                <span className='text-xs font-medium'>Connecting...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-1 text-yellow-600 dark:text-yellow-400'>
                <WifiOff className='w-4 h-4' />
                <span className='text-xs font-medium'>Static</span>
              </div>
            )}
          </div>
        </div>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search conversations...'
            className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        {filteredConversations.map((conversation: Conversation) => (
          <div
            key={conversation._id}
            onClick={() => handleSelectConversation(conversation)}
            className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
              selectedConversation?._id === conversation._id ? 'dark:bg-accent dark:border-primary bg-blue-50 border-blue-500' : ''
            }`}>
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    !conversation?.avatar ? getAvatarColor(conversation._id || '') : 'bg-red-500'
                  }`}>
                  {conversation?.avatar ? conversation.avatar : getInitials(conversation.name || 'Unknown')}
                </div>
                {conversation?.isOnline ||
                  (true && <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full'></div>)}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='text-sm font-medium text-foreground truncate'>{conversation.name || 'Unknown'}</h3>
                  <span className='text-xs text-muted-foreground'>2 min ago</span>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-black  dark:text-muted-foreground truncate'>Thank you for your feedback</p>
                  {/* Uncomment if you want to show unread count */}
                  {true && (
                    <span className='ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>{2}</span>
                  )}
                </div>
                <div className='text-xs text-muted-foreground mt-1'>via {chatbot?.name || 'Chatbot'}</div>
              </div>
            </div>
          </div>
        ))}

        {/* No results message */}
        {filteredConversations.length === 0 && searchQuery && (
          <div className='p-4 text-center text-muted-foreground'>
            <p className='text-sm'>No conversations found matching "{searchQuery}"</p>
          </div>
        )}

        {/* No conversations message */}
        {filteredConversations.length === 0 && !searchQuery && (
          <div className='p-4 text-center text-muted-foreground'>
            <p className='text-sm'>No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
});

Conversations.displayName = 'Users';

export default Conversations;

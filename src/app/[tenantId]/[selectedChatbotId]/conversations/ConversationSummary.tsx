import React, { useState } from 'react';
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Hash,
  Calendar,
  Zap,
  TrendingUp,
  User,
  Mail,
  Phone,
  Globe,
  Activity,
  Bot,
  Smile,
  Edit,
  MoreVertical,
  Wifi,
  WifiOff,
  FileText,
} from 'lucide-react';
import { useConversationFeatures, useModernConversation } from './ModernConversationProvider';
import { EmptyState } from '@/components/ui/empty-state';

const ConversationSummary = ({ chatbotName }: { chatbotName: string }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Use modern hooks for enhanced functionality
  const conversationFeatures = useConversationFeatures();
  const socket = useModernConversation();

  // Get current conversation data from hooks or fallback to dummy data
  const selectedConversation = conversationFeatures.selectedConversation;

  const selectedConv = selectedConversation
    ? {
        tone: (selectedConversation as any).tone || 'Very Friendly',
        totalMessages: selectedConversation.messages?.length || 24,
        positiveMessages: (selectedConversation as any).positiveMessages || 18,
        negativeMessages: (selectedConversation as any).negativeMessages || 2,
        id: selectedConversation._id || (selectedConversation as any).conversationId || 'conv_123456789',
        startedOn: (selectedConversation as any).createdAt
          ? new Date((selectedConversation as any).createdAt).toLocaleString()
          : 'Dec 15, 2024 at 2:30 PM',
        responseTime: (selectedConversation as any).responseTime || '1.2s',
        satisfaction: (selectedConversation as any).satisfaction || 4,
        userName: (selectedConversation as any).user?.name || (selectedConversation as any).userName || selectedConversation.name || 'Sarah Johnson',
        userEmail: (selectedConversation as any).user?.email || (selectedConversation as any).userEmail || 'sarah.johnson@email.com',
        userPhone: (selectedConversation as any).user?.phone || (selectedConversation as any).userPhone || '(555) 123-4567',
        location: (selectedConversation as any).user?.location || (selectedConversation as any).location || 'San Francisco, CA',
        source: (selectedConversation as any).source || 'Website Chat',
        tags: (selectedConversation as any).tags || ['Support', 'Product Inquiry', 'VIP Customer'],
        chatbotName: chatbotName,
        isOnline: socket && socket.isConnected && (selectedConversation as any).isOnline !== false,
      }
    : {
        // Fallback dummy data when no conversation is selected
        tone: 'Very Friendly',
        totalMessages: 24,
        positiveMessages: 18,
        negativeMessages: 2,
        id: 'conv_123456789',
        startedOn: 'Dec 15, 2024 at 2:30 PM',
        responseTime: '1.2s',
        satisfaction: 4,
        userName: 'Sarah Johnson',
        userEmail: 'sarah.johnson@email.com',
        userPhone: '(555) 123-4567',
        location: 'San Francisco, CA',
        source: 'Website Chat',
        tags: ['Support', 'Product Inquiry', 'VIP Customer'],
        chatbotName: chatbotName,
        isOnline: false,
      };

  const getToneColor = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'very friendly':
        return 'text-green-600 dark:text-green-400';
      case 'friendly':
        return 'text-green-500 dark:text-green-300';
      case 'neutral':
        return 'text-muted-foreground';
      case 'unfriendly':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-foreground';
    }
  };

  // Show placeholder when no conversation is selected
  if (!selectedConversation) {
    return (
      <div className='bg-card lg:border-l border-border h-full overflow-y-auto flex flex-col'>
        {/* Header with connection status */}
        <div className='border-b border-border'>
          <div className='flex items-center justify-between px-6 py-2 border-b border-border'>
            <h2 className='text-sm font-medium text-foreground'>Summary</h2>
            <div className='flex items-center space-x-1'>
              {socket && socket.isConnected ? (
                <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                  <Wifi className='w-3 h-3' />
                  <span className='text-xs font-medium'>Live</span>
                </div>
              ) : socket && socket.socket && !socket.isConnected ? (
                <div className='flex items-center space-x-1 text-red-600 dark:text-red-400'>
                  <WifiOff className='w-3 h-3' />
                  <span className='text-xs font-medium'>Connecting...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-1 text-yellow-600 dark:text-yellow-400'>
                  <WifiOff className='w-3 h-3' />
                  <span className='text-xs font-medium'>Static</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <EmptyState
          icon={FileText}
          title="No conversation selected"
          description="Select a conversation from the sidebar to view its summary, details, and AI-powered insights."
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div className='bg-card lg:border-l border-border h-full overflow-y-auto flex flex-col'>
      {/* Header with connection status */}
      <div className='border-b border-border'>
        <div className='flex items-center justify-between px-6 py-2 border-b border-border'>
          <h2 className='text-sm font-medium text-foreground'>Summary</h2>
          <div className='flex items-center space-x-1'>
            {socket && socket.isConnected ? (
              <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                <Wifi className='w-3 h-3' />
                <span className='text-xs font-medium'>Live</span>
              </div>
            ) : socket && socket.socket && !socket.isConnected ? (
              <div className='flex items-center space-x-1 text-red-600 dark:text-red-400'>
                <WifiOff className='w-3 h-3' />
                <span className='text-xs font-medium'>Connecting...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-1 text-yellow-600 dark:text-yellow-400'>
                <WifiOff className='w-3 h-3' />
                <span className='text-xs font-medium'>Static</span>
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <nav className='flex'>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}>
            Details
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'copilot'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}>
            Copilot
          </button>
        </nav>
      </div>

      <div className='flex-1 p-4 sm:p-8 lg:p-4 space-y-6 overflow-y-auto'>
        {activeTab === 'details' ? (
          <>
            {/* Summary Section */}
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>Summary</h3>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary min-w-max'>
                  <Bot className='w-3 h-3 mr-1' />
                  AI Generated
                </span>
              </div>

              <p className='text-sm text-foreground leading-relaxed'>
                Customer inquired about billing discrepancies and received assistance with account reconciliation. Issue resolved successfully.
              </p>
            </div>

            {/* Conversation Details */}
            <div>
              <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4'>Conversation Details</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Smile className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Tone</span>
                  </div>
                  <span className={`text-sm font-medium text-right break-words ${getToneColor(selectedConv.tone)}`}>{selectedConv.tone}</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <MessageCircle className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Total Messages</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.totalMessages}</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <ThumbsUp className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Positive</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>
                    {selectedConv.positiveMessages} (~{Math.round((selectedConv.positiveMessages / selectedConv.totalMessages) * 100)}%)
                  </span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <ThumbsDown className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Negative</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>
                    {selectedConv.negativeMessages} (~{Math.round((selectedConv.negativeMessages / selectedConv.totalMessages) * 100)}%)
                  </span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Hash className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>ID</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words break-all'>#{selectedConv.id}2345</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Started On</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.startedOn}</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Zap className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Response Time</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.responseTime}</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <TrendingUp className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Satisfaction</span>
                  </div>
                  <div className='flex items-center space-x-1 flex-shrink-0'>
                    <span className='text-sm font-medium text-foreground'>{selectedConv.satisfaction}</span>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-3 h-3 ${star <= selectedConv.satisfaction ? 'text-yellow-400' : 'text-muted-foreground/50'}`}>
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div>
              <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4'>User Details</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <User className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Name</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.userName}</span>
                </div>

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Mail className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Email</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words break-all'>{selectedConv.userEmail}</span>
                </div>

                {selectedConv.userPhone && (
                  <div className='flex items-center justify-between gap-1'>
                    <div className='flex items-center space-x-2'>
                      <Phone className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm font-medium text-muted-foreground'>Phone</span>
                    </div>
                    <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.userPhone}</span>
                  </div>
                )}

                {selectedConv.location && (
                  <div className='flex items-center justify-between gap-1'>
                    <div className='flex items-center space-x-2'>
                      <Globe className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm font-medium text-muted-foreground'>Location</span>
                    </div>
                    <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.location}</span>
                  </div>
                )}

                <div className='flex items-center justify-between gap-1'>
                  <div className='flex items-center space-x-2'>
                    <Activity className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>Source</span>
                  </div>
                  <span className='text-sm font-medium text-foreground text-right break-words'>{selectedConv.source}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {selectedConv.tags && selectedConv.tags.length > 0 && (
              <div>
                <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {selectedConv.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chatbot Info */}
            <div>
              <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3'>Chatbot Info</h3>
              <div className='flex items-center space-x-3 p-3 bg-accent rounded-lg'>
                <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                  <Bot className='w-4 h-4 text-primary-foreground' />
                </div>
                <div>
                  <div className='text-sm font-medium text-foreground'>{selectedConv.chatbotName}</div>
                  <div className='text-xs text-muted-foreground'>Active • Version 2.1</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Copilot Tab Content */
          <div className='space-y-6'>
            {/* Current Issue */}
            <div>
              <h3 className='text-lg font-medium text-foreground mb-3'>I'd like a refund, the sweater I received has a torn sleeve.</h3>
            </div>

            {/* AI Suggestions */}
            <div className='space-y-3'>
              <div className='bg-accent rounded-lg p-4'>
                <div className='flex items-start space-x-2 mb-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-xs font-bold text-primary'>1</span>
                  </div>
                  <p className='text-sm text-foreground'>
                    Hi &lt;firstname&gt;, thanks for waiting! Once you return the item, we'll issue a full refund within 5 business days.
                  </p>
                </div>
              </div>

              <div className='bg-accent rounded-lg p-4'>
                <div className='flex items-start space-x-2 mb-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-xs font-bold text-primary'>2</span>
                  </div>
                  <p className='text-sm text-foreground'>I've also sent you a discount voucher for the inconvenience</p>
                </div>
              </div>
            </div>

            {/* Add to Composer Button */}
            <div className='flex items-center justify-between'>
              <button className='flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
                <Edit className='w-4 h-4' />
                <span>Add to composer</span>
              </button>
              <button className='p-2 text-muted-foreground hover:text-foreground'>
                <MoreVertical className='w-4 h-4' />
              </button>
            </div>

            {/* Relevant Sources */}
            <div>
              <h4 className='text-sm font-medium text-foreground mb-3'>5 relevant sources found</h4>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2 p-2 hover:bg-accent rounded'>
                  <div className='w-4 h-4 bg-muted rounded'></div>
                  <span className='text-sm text-foreground'>Getting a refund</span>
                </div>
                <div className='flex items-center space-x-2 p-2 hover:bg-accent rounded'>
                  <div className='w-4 h-4 bg-muted rounded'></div>
                  <span className='text-sm text-foreground'>Loyalty refund macro</span>
                </div>
                <div className='flex items-center space-x-2 p-2 hover:bg-accent rounded'>
                  <div className='w-4 h-4 bg-primary/20 rounded'></div>
                  <span className='text-sm text-foreground'>Refund for an unwanted gift</span>
                </div>
                <button className='text-sm text-primary hover:text-primary/80 font-medium'>See all</button>
              </div>
            </div>

            {/* Ask Question Input */}
            <div className='border-t border-border pt-4'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Ask a question'
                  className='w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent pr-20 bg-background text-foreground'
                />
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1'>
                  <button className='p-1 text-muted-foreground hover:text-foreground'>
                    <Hash className='w-4 h-4' />
                  </button>
                  <button className='p-1 text-muted-foreground hover:text-foreground'>
                    <TrendingUp className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSummary;

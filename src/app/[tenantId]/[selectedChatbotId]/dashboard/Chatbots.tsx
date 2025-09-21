import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, MoreVertical, Edit, Copy, Trash2, Settings, MessageCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Chatbot {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
  lastUpdated: string;
  dataSources: number;
  conversations: number;
  avatar?: string;
}

interface ChatbotsProps {
  chatbots?: Chatbot[];
  useMachineState?: boolean;
  searchQuery?: string;
  statusFilter?: 'all' | 'active' | 'draft' | 'paused';
}

const Chatbots: React.FC<ChatbotsProps> = ({ chatbots: propChatbots, useMachineState = false, searchQuery = '', statusFilter = 'all' }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState<Chatbot | null>(null);
  const [state, send] = useChatBotMachineState();
  // Use machine state only if explicitly requested, otherwise use props
  const rawChatbots = useMachineState ? state.context.chatbots || [] : propChatbots || [];

  // Apply filtering if using machine state
  const chatbots = useMachineState
    ? (rawChatbots as Chatbot[]).filter((chatbot: Chatbot) => {
        const matchesSearch =
          chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) || chatbot.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || chatbot.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : rawChatbots;

  const handleDeleteClick = (chatbot: Chatbot) => {
    console.log('api hit');
    setChatbotToDelete(chatbot);
    setDeleteModalOpen(true);
    setShowDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (chatbotToDelete) {
      send({ type: 'DELETE_CHATBOT', chatbotId: chatbotToDelete._id });
      setDeleteModalOpen(false);
      setChatbotToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setChatbotToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paused':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className='w-2 h-2 bg-green-500 rounded-full'></div>;
      case 'draft':
        return <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>;
      case 'paused':
        return <div className='w-2 h-2 bg-muted-foreground rounded-full'></div>;
      default:
        return <div className='w-2 h-2 bg-muted-foreground rounded-full'></div>;
    }
  };

  if (!chatbots || chatbots.length === 0) {
    return (
      <div className='bg-card rounded-lg shadow-sm border border-border p-12 text-center'>
        <Bot className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
        <h3 className='text-lg font-medium text-foreground mb-2'>No chatbots found</h3>
        <p className='text-muted-foreground mb-6'>Get started by creating your first chatbot</p>
        <Link
          href={`/${state.context.tenantId}/create-chatbot`}
          className='inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
          <span>Create Chatbot</span>
        </Link>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {chatbots.map((chatbot: any) => (
        <div key={chatbot._id} className='bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow'>
          {/* Card Header */}
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
                <Bot className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h3 className='text-lg font-medium text-foreground'>{chatbot.name}</h3>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chatbot.status)}`}>
                  {getStatusIcon(chatbot.status)}
                  <span className='capitalize'>{chatbot.status}</span>
                </div>
              </div>
            </div>

            <div className='relative'>
              <button
                onClick={() => setShowDropdown(showDropdown === chatbot._id ? null : chatbot._id)}
                className='p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'>
                <MoreVertical className='w-4 h-4' />
              </button>

              {showDropdown === chatbot._id && (
                <div className='absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-10'>
                  <div className='py-1'>
                    <Link
                      href={`/chatbots/${chatbot._id}/edit`}
                      className='flex items-center space-x-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent'
                      onClick={() => setShowDropdown(null)}>
                      <Edit className='w-4 h-4' />
                      <span>Edit</span>
                    </Link>
                    <button
                      className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent'
                      onClick={() => setShowDropdown(null)}>
                      <Copy className='w-4 h-4' />
                      <span>Duplicate</span>
                    </button>
                    <button
                      className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      onClick={() => handleDeleteClick(chatbot)}>
                      <Trash2 className='w-4 h-4' />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className='mb-4'>
            <p className='text-muted-foreground text-sm mb-3'>{chatbot.description}</p>

            {/* Stats */}
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='text-center p-3 bg-muted rounded-lg'>
                <div className='text-lg font-semibold text-foreground'>{chatbot.dataSources || 0}</div>
                <div className='text-xs text-muted-foreground'>Data Sources</div>
              </div>
              <div className='text-center p-3 bg-muted rounded-lg'>
                <div className='text-lg font-semibold text-foreground'>{(chatbot.conversations || 0).toLocaleString()}</div>
                <div className='text-xs text-muted-foreground'>Conversations</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className='flex items-center text-xs text-muted-foreground'>
              <Calendar className='w-3 h-3 mr-1' />
              <span>Updated {chatbot.lastUpdated}</span>
            </div>
          </div>

          {/* Card Actions */}
          <div className='flex items-center justify-between pt-4 border-t border-border'>
            <Link
              href={`/chatbots/${chatbot._id}/settings`}
              className='flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'>
              <Settings className='w-4 h-4' />
              <span>Settings</span>
            </Link>

            <Link
              href={`/chatbots/${chatbot._id}/chat`}
              className='flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors'>
              <MessageCircle className='w-4 h-4' />
              <span>Chat</span>
            </Link>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center'>
                <AlertTriangle className='w-5 h-5 text-red-600' />
              </div>
              <div>
                <DialogTitle>Delete Chatbot</DialogTitle>
                <DialogDescription>Are you sure you want to delete "{chatbotToDelete?.name}"? This action cannot be undone.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className='flex space-x-2'>
            <Button variant='outline' onClick={handleCancelDelete} disabled={state.matches('deletingChatbot')}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleConfirmDelete} disabled={state.matches('deletingChatbot')}>
              {state.matches('deletingChatbot') ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chatbots;

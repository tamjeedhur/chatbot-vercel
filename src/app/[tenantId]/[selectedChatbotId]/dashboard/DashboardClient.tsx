'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Plus, Search, Globe, MessageCircle, ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import Chatbots from './Chatbots';
import type { Chatbot } from '@/machines/chatBotMachine/types';

const Dashboard: React.FC<{ totalDocuments: number, totalConversations: number }> = ({ totalDocuments, totalConversations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [state, send] = useChatBotMachineState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams?.get('success');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Payment successful! Your plan has been updated.');

      // Remove the success parameter from URL
      if (searchParams) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('success');
        const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : '';
        router.replace(window.location.pathname + newUrl);
      }
    }
  }, [success, searchParams, router]);
  // Mock data - in real app this would come from API/state management
  const defaultChatbots = state?.context?.defaultChatbots || [];

  const defaultFilteredChatbots = defaultChatbots.filter((chatbot: Chatbot) => {
    const matchesSearch =
      chatbot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      chatbot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesStatus = statusFilter === 'all' || chatbot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

 
 

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'all':
        return 'All Status';
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'paused':
        return 'Paused';
      default:
        return 'All Status';
    }
  };
  return (
    <AdminLayout>
      <div className='p-4 pb-10'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Chatbots</h1>
            <p className='text-muted-foreground'>Manage and monitor your chatbots</p>
          </div>
          <Link
            href={`/${state.context.tenantId}/create-chatbot`}
            className='flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
            <Plus className='w-4 h-4' />
            <span>Create Chatbot</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-muted-foreground'>Total Chatbots</h3>
              <Bot className='w-5 h-5 text-primary' />
            </div>
            <div className='text-2xl font-bold text-foreground'>{defaultFilteredChatbots.length}</div>
          </div>

          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-muted-foreground'>Active</h3>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            </div>
            <div className='text-2xl font-bold text-foreground'>
              {defaultFilteredChatbots.filter((c: Chatbot) => c.status === 'active').length }
            </div>
          </div>

          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-muted-foreground'>Total Conversations</h3>
              <MessageCircle className='w-5 h-5 text-green-600' />
            </div>
            <div className='text-2xl font-bold text-foreground'>
              {totalConversations}
            </div>
          </div>

          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-muted-foreground'>Data Sources</h3>
              <Globe className='w-5 h-5 text-purple-600' />
            </div>
            <div className='text-2xl font-bold text-foreground'>
              {totalDocuments}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-card rounded-lg shadow-sm border border-border p-6 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search chatbots...'
                className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
              />
            </div>

            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left'>
                  <span className='text-sm text-foreground'>{getStatusLabel(statusFilter)}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStatusDropdown && (
                  <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                    <div className='py-1'>
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                          statusFilter === 'all' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}>
                        All Status
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('active');
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                          statusFilter === 'active' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}>
                        Active
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('draft');
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                          statusFilter === 'draft' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}>
                        Draft
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('paused');
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                          statusFilter === 'paused' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}>
                        Paused
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-foreground'>Default Chatbots</h2>
        </div>

        {/* Chatbots Grid */}
        <Chatbots chatbots={defaultFilteredChatbots as any} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

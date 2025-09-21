'use client'
import React from 'react'
import AdminLayout from '@/components/adminlayout/AdminLayout'
import { Globe, FileText, HelpCircle, Plus, Upload } from 'lucide-react';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import Link from 'next/link';

const DetailsPage = ({ datasource }: { datasource: any }) => {
 
    const [state, send] = useChatBotMachineState();
    const dataSourceTypes = [
        {
          icon: Globe,
          title: 'Sitemap / Website URL',
          description: 'Crawl and index web pages from a sitemap or website',
          path: `/${state.context.tenantId}/${state.context.selectedChatbot?._id || ''}/data-sources/${datasource.id}/urlSitemap`,
          color: 'bg-blue-500',
        },
        {
          icon: Upload,
          title: 'File Upload',
          description: 'Upload documents, PDFs, or other files',
          path: `/${state.context.tenantId}/${state.context.selectedChatbot?._id || ''}/data-sources/${datasource.id}/file`,
          color: 'bg-green-500',
        },
        {
          icon: FileText,
          title: 'Text Content',
          description: 'Add custom text content directly',
          path: `/${state.context.tenantId}/${state.context.selectedChatbot?._id || ''}/data-sources/${datasource.id}/text`,
          color: 'bg-purple-500',
        },
        {
          icon: HelpCircle,
          title: 'Q&A Pairs',
          description: 'Create question and answer pairs',
          path: `/${state.context.tenantId}/${state.context.selectedChatbot?._id || ''}/data-sources/${datasource.id}/qa`,
          color: 'bg-orange-500',
        },
      ];
  return (
    <AdminLayout>
    <div className='p-4'>
    <div className='max-w-screen-2xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>{datasource.name}</h1>
        <p className='text-muted-foreground'>Manage your chatbot's data source</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-foreground'>Urls</h3>
            <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
              <Globe className='w-5 h-5 text-primary' />
            </div>
          </div>
          <div className='text-3xl font-bold text-foreground mb-2'>0</div>
          <p className='text-sm text-muted-foreground'>No URLs configured</p>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-foreground'>Total Files</h3>
            <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
              <FileText className='w-5 h-5 text-green-600' />
            </div>
          </div>
          <div className='text-3xl font-bold text-foreground mb-2'>0</div>
          <p className='text-sm text-muted-foreground'>Files indexed</p>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-foreground'>Q/A</h3>
            <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
              <HelpCircle className='w-5 h-5 text-purple-600' />
            </div>
          </div>
          <div className='text-3xl font-bold text-foreground mb-2'>0</div>
          <p className='text-sm text-muted-foreground'>No Q/A pairs configured</p>
        </div>
      </div>

      <div className='bg-card rounded-lg shadow-sm border border-border p-6'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {dataSourceTypes.map((source) => (
            <Link
              key={source.path}
              href={source.path}
              className='block p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent transition-colors'>
              <div className='flex items-start space-x-3'>
                <div className={`w-10 h-10 ${source.color} rounded-lg flex items-center justify-center`}>
                  <source.icon className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h3 className='font-medium text-foreground mb-1'>{source.title}</h3>
                  <p className='text-sm text-muted-foreground'>{source.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Data Source Details Section */}
      <div className='bg-card rounded-lg shadow-sm border border-border p-6 mt-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-foreground'>Data Source Details</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            datasource.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : datasource.status === 'inactive'
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            {datasource.status.charAt(0).toUpperCase() + datasource.status.slice(1)}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6'>
          {/* Basic Information Card */}
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Basic Information</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Name</span>
                <span className='text-sm text-foreground'>{datasource.name}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Type</span>
                <span className='text-sm text-foreground capitalize'>{datasource.type}</span>
              </div>
              <div className='flex justify-between items-start py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Description</span>
                <span className='text-sm text-foreground text-right max-w-xs'>{datasource.description}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Documents Count</span>
                <span className='text-sm text-foreground'>{datasource.documentsCount}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Vector Store</span>
                <span className='text-sm text-foreground capitalize'>{datasource.config.vectorStore.replace('_', ' ')}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm font-medium text-muted-foreground'>Namespace</span>
                <span className='text-sm text-foreground'>{datasource.config.namespace}</span>
              </div>
            </div>
          </div>

          {/* Processing Settings Card */}
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Processing Settings</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Chunk Size</span>
                <span className='text-sm text-foreground'>{datasource.config.settings.chunkSize} characters</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm font-medium text-muted-foreground'>Chunk Overlap</span>
                <span className='text-sm text-foreground'>{datasource.config.settings.chunkOverlap} characters</span>
              </div>
            </div>
          </div>

          {/* Sync Schedule Card */}
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Sync Schedule</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Auto Sync</span>
                <span className={`text-sm font-medium ${
                  datasource.config.syncSchedule.enabled 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }`}>
                  {datasource.config.syncSchedule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {datasource.config.syncSchedule.enabled && (
                <div className='flex justify-between items-center py-2'>
                  <span className='text-sm font-medium text-muted-foreground'>Frequency</span>
                  <span className='text-sm text-foreground capitalize'>{datasource.config.syncSchedule.frequency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Credentials Card */}
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Credentials</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Type</span>
                <span className='text-sm text-foreground capitalize'>{datasource.config.credentials.type}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm font-medium text-muted-foreground'>Encrypted</span>
                <span className={`text-sm font-medium ${
                  datasource.config.credentials.encrypted 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {datasource.config.credentials.encrypted ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps Card */}
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Timestamps</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Created</span>
                <span className='text-sm text-foreground'>
                  {new Date(datasource.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm font-medium text-muted-foreground'>Last Updated</span>
                <span className='text-sm text-foreground'>
                  {new Date(datasource.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </AdminLayout>
);
};

export default DetailsPage;

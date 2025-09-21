'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Database, MoreVertical, Edit, Trash2, Settings, Calendar, FileText, Globe, Upload, Zap, AlertTriangle } from 'lucide-react';
import { Document } from '@/machines/dataSources/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDataSources } from './providers/DataSourcesProvider';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';

const ListDataSources: React.FC = () => {
  const { state: dataSourcesState, send } = useDataSources();
  const [chatbotState] = useChatBotMachineState();

  // Get documents from XState context
  const datasources = dataSourcesState.context.documents;
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [datasourceToDelete, setDatasourceToDelete] = useState<Document | null>(null);

  const handleDeleteClick = (datasource: Document) => {
    setDatasourceToDelete(datasource);
    setDeleteModalOpen(true);
    setShowDropdown(null);
  };
  const handleConfirmDelete = () => {
    if (datasourceToDelete) {
      // TODO: Implement delete functionality
      console.log('Delete datasource:', datasourceToDelete.id);
      setDeleteModalOpen(false);
      setDatasourceToDelete(null);
      send({
        type: 'DELETE_DOCUMENT',
        documentId: datasourceToDelete.id,
        chatbotId: dataSourcesState.context.chatbotId,
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDatasourceToDelete(null);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';

    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <div className='w-2 h-2 bg-green-500 rounded-full'></div>;

    switch (status.toLowerCase()) {
      case 'pending':
        return <div className='w-2 h-2 bg-blue-500 rounded-full'></div>;
      case 'error':
        return <div className='w-2 h-2 bg-red-500 rounded-full'></div>;
      default:
        return <div className='w-2 h-2 bg-green-500 rounded-full'></div>;
    }
  };

  const getTypeIcon = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case 'url':
        return <Globe className='w-5 h-5 text-primary' />;
      case 'file':
        return <FileText className='w-5 h-5 text-primary' />;
      case 'text':
        return <FileText className='w-5 h-5 text-primary' />;
      case 'qa':
        return <Database className='w-5 h-5 text-primary' />;
      default:
        return <Upload className='w-5 h-5 text-primary' />;
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  if (!datasources || datasources.length === 0) {
    return (
      <div className='bg-card rounded-lg shadow-sm border border-border p-12 text-center'>
        <Database className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
        <h3 className='text-lg font-medium text-foreground mb-2'>No data sources found</h3>
        <p className='text-muted-foreground mb-6'>Get started by adding your first data source</p>
        <Link
          href={`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources/add`}
          className='inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
          <span>Add Data Source</span>
        </Link>
      </div>
    );
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {datasources.map((datasource: Document) => (
        <div key={datasource.id} className='bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow'>
          {/* Card Header */}
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>{getTypeIcon(datasource.contentType)}</div>
              <div>
                <h3 className='text-lg font-medium text-foreground'>{datasource.title || datasource.metadata?.url || 'Untitled Document'}</h3>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(datasource.status)}`}>
                  {getStatusIcon(datasource.status)}
                  <span className='capitalize'>{datasource.status || 'completed'}</span>
                </div>
              </div>
            </div>

            <div className='relative'>
              <button
                onClick={() => setShowDropdown(showDropdown === datasource.id ? null : datasource.id)}
                className='p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'>
                <MoreVertical className='w-4 h-4' />
              </button>

              {showDropdown === datasource.id && (
                <div className='absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-10'>
                  <div className='py-1'>
                    <Link
                      href={`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources/${datasource.id}/edit`}
                      className='flex items-center space-x-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent'
                      onClick={() => setShowDropdown(null)}>
                      <Edit className='w-4 h-4' />
                      <span>Edit</span>
                    </Link>
                    <button
                      className='flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      onClick={() => handleDeleteClick(datasource)}>
                      <Trash2 className='w-4 h-4' />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='mb-4'>
            <p className='text-muted-foreground text-sm mb-3'>{datasource.content?.substring(0, 100) || 'No content available'}...</p>

            {/* Stats */}
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='text-center p-3 bg-muted rounded-lg'>
                <div className='text-lg font-semibold text-foreground'>{datasource.metadata?.contentLength || 0}</div>
                <div className='text-xs text-muted-foreground'>Characters</div>
              </div>
              <div className='text-center p-3 bg-muted rounded-lg'>
                <div className='text-lg font-semibold text-foreground'>{datasource.contentType}</div>
                <div className='text-xs text-muted-foreground'>Type</div>
              </div>
            </div>

            {/* Configuration Info */}
            <div className='space-y-2 mb-4'>
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>Type:</span>
                <span className='capitalize'>{datasource.contentType}</span>
              </div>
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>URL:</span>
                <span className='truncate max-w-32'>{datasource.metadata?.url || 'N/A'}</span>
              </div>
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>Source:</span>
                <span className='truncate max-w-32'>{datasource.metadata?.source || 'N/A'}</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className='flex items-center text-xs text-muted-foreground'>
              <Calendar className='w-3 h-3 mr-1' />
              <span>Updated {formatDate(datasource.updatedAt)}</span>
            </div>
          </div>

          {/* Card Actions */}
          <div className='flex items-center justify-end pt-4 border-t border-border'>
            <Link
              href={`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources/${datasource.id}/details`}
              className='flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors'>
              <FileText className='w-4 h-4' />
              <span>Details</span>
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
                <DialogTitle>Delete Data Source</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{datasourceToDelete?.title || datasourceToDelete?.metadata?.url || 'this document'}"? This action
                  cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className='flex space-x-2'>
            <Button variant='outline' onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListDataSources;

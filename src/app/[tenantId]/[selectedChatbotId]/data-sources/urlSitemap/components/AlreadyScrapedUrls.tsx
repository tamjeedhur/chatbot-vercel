'use client';
import React, { useState } from 'react';
import { Search, Download, RotateCcw, Trash2, Eye } from 'lucide-react';
import ContentModal from '@/components/ui/content-modal';
import { DataSourceDocument } from '@/redux/slices/scrapSlice';

interface AlreadyScrapedUrlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  scrapedUrls: DataSourceDocument[];
  onUpdateDocument: (documentId: string, chatbotId: string, content: string) => void;
  onDeleteDocument: (documentId: string, chatbotId: string) => void;
  onReScrapeUrl: (url: string) => void;
  isLoading?: boolean;
  reScrapingUrl?: string | null;
}

export const AlreadyScrapedUrls: React.FC<AlreadyScrapedUrlsProps> = ({
  searchQuery,
  onSearchChange,
  scrapedUrls,
  onUpdateDocument,
  onDeleteDocument,
  onReScrapeUrl,
  isLoading = false,
  reScrapingUrl = null,
}) => {
  const [selectedUrlForModal, setSelectedUrlForModal] = useState<DataSourceDocument | null>(null);

  // Use scraped URLs passed as props instead of separate machine instance
  const allScrapedDocuments = scrapedUrls;
  const filteredDocuments: DataSourceDocument[] = allScrapedDocuments || [];

  // Get the updated document from machine context when it changes
  const updatedDocument = selectedUrlForModal ? allScrapedDocuments?.find((doc) => doc.id === selectedUrlForModal.id) || selectedUrlForModal : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // Machine is already initialized above

  return (
    <>
      <div className='border border-border rounded-lg p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium text-foreground'>Already Scraped URLs</h3>
          <div className='text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full'>{filteredDocuments?.length} URLs</div>
        </div>

        <p className='text-sm text-muted-foreground mb-4'>View and manage URLs that have already been scraped</p>

        {/* Search */}
        <div className='flex flex-col md:flex-row items-center gap-4 justify-between mb-4'>
          <div className='relative flex-1 w-full md:max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search URLs...'
              className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
            />
          </div>
        </div>

        {/* URLs List */}
        <div className='border border-border rounded-lg'>
          <div className='space-y-2'>
            {/* Desktop Header - Hidden on screens smaller than 850px */}
            <div className='hidden min-[850px]:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground bg-muted uppercase tracking-wider border-b border-border rounded-t py-4'>
              <div className='col-span-5 ml-4'>URL / Title</div>
              <div className='col-span-2'>Scraped At</div>
              <div className='col-span-2'>Content Length</div>
              <div className='col-span-3 text-right mr-8'>Actions</div>
            </div>

            {filteredDocuments?.map((document) => {
              return (
                <div key={document.id} className='border-b border-border hover:bg-accent'>
                  {/* Desktop Layout - Grid for screens >= 850px */}
                  <div className='hidden min-[850px]:grid grid-cols-12 gap-4 items-center py-3 px-4'>
                    <div className='col-span-5'>
                      <div className='text-sm font-medium text-foreground mr-2 break-words'>
                        {document.url || document.metadata?.source || 'No URL'}
                      </div>
                      {document.metadata?.title && <div className='text-xs text-muted-foreground mt-1 break-words'>{document.metadata.title}</div>}
                    </div>
                    <div className='col-span-2'>
                      <div className='text-xs text-muted-foreground'>{formatDate(document.metadata?.scrapedAt)}</div>
                      {document.status && (
                        <div
                          className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            document.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : document.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {document.status}
                        </div>
                      )}
                    </div>
                    <div className='col-span-2'>
                      <div className='text-xs text-muted-foreground'>{document.metadata.contentLength.toLocaleString()} chars</div>
                    </div>
                    <div className='col-span-3 flex items-center justify-end space-x-2'>
                      <button
                        className='p-1 text-muted-foreground hover:text-foreground'
                        onClick={(e) => {
                          e.stopPropagation();
                          //download content
                        }}
                        title='Download content'>
                        <Download className='w-4 h-4' />
                      </button>
                      <button
                        className='p-1 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={(e) => {
                          e.stopPropagation();
                          onReScrapeUrl(document.url);
                        }}
                        title='Re-scrape URL'
                        type='button'
                        disabled={isLoading || reScrapingUrl === document.url}
                        style={{ zIndex: 10 }}>
                        <RotateCcw className={`w-4 h-4 ${reScrapingUrl === document.url ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        className='p-1 text-muted-foreground hover:text-red-600'
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(document.id, document.chatbotId);
                        }}
                        title='Remove URL'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                      <button
                        className='p-1 text-blue-600 hover:text-blue-700'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUrlForModal(document);
                        }}
                        title='View content'>
                        <Eye className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout - Two rows for screens < 850px */}
                  <div className='min-[850px]:hidden p-4 space-y-3'>
                    {/* First Row: URL + Title */}
                    <div className='flex items-start gap-3'>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium text-foreground break-words'>{document.url || document.metadata?.source || 'No URL'}</div>
                        {document.metadata?.title && <div className='text-xs text-muted-foreground mt-1 break-words'>{document.metadata.title}</div>}
                      </div>
                    </div>

                    {/* Second Row: Metadata + Actions */}
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col gap-1'>
                        <div className='text-xs text-muted-foreground'>{formatDate(document.metadata?.scrapedAt)}</div>
                        <div className='text-xs text-muted-foreground'>{document.metadata?.contentLength?.toLocaleString() || '0'} chars</div>
                        {document.status && (
                          <div
                            className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                              document.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : document.status === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {document.status}
                          </div>
                        )}
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button
                          className='p-1 text-muted-foreground hover:text-foreground'
                          onClick={(e) => {
                            e.stopPropagation();
                            //download content
                          }}
                          title='Download content'>
                          <Download className='w-4 h-4' />
                        </button>
                        <button
                          className='p-1 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={(e) => {
                            e.stopPropagation();
                            onReScrapeUrl(document.url);
                          }}
                          title='Re-scrape URL'
                          type='button'
                          disabled={isLoading || reScrapingUrl === document.url}
                          style={{ zIndex: 10 }}>
                          <RotateCcw className={`w-4 h-4 ${reScrapingUrl === document.url ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          className='p-1 text-muted-foreground hover:text-red-600'
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(document.id, document.chatbotId);
                          }}
                          title='Remove URL'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                        <button
                          className='p-1 text-blue-600 hover:text-blue-700'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUrlForModal(document);
                          }}
                          title='View content'>
                          <Eye className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ContentModal
        key={selectedUrlForModal?.id || 'modal'}
        documentId={selectedUrlForModal?.id}
        onContentChange={(content) => {
          onUpdateDocument(selectedUrlForModal?.id || '', selectedUrlForModal?.chatbotId || '', content);
        }}
        isOpen={!!selectedUrlForModal}
        onClose={() => setSelectedUrlForModal(null)}
        content={
          updatedDocument
            ? [
                {
                  documentId: updatedDocument.id,
                  chatbotId: updatedDocument.chatbotId,
                  pageContent: updatedDocument.content,
                  metadata: {
                    ...updatedDocument.metadata,
                    url: updatedDocument.url,
                    loc: {
                      lines: {
                        from: 1,
                        to: updatedDocument.metadata.contentLength || 1,
                      },
                    },
                    hash: updatedDocument.hash || '',
                    text: updatedDocument.content || '',
                  },
                },
              ]
            : undefined
        }
      />
    </>
  );
};

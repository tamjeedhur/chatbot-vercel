'use client';

import React from 'react';
import { useUrlSitemap } from './providers/UrlSitemapProvider';
import { UrlInputForm } from './components/UrlInputForm';
import { UrlListManager } from './components/UrlListManager';
import { UrlModeDisplay } from './components/UrlModeDisplay';
import { ProcessingOptions } from './components/ProcessingOptions';
import { AlreadyScrapedUrls } from './components/AlreadyScrapedUrls';
import ContentModal from '@/components/ui/content-modal';

export default function UrlSitemapClient() {
  const { state, send } = useUrlSitemap();

  // Extract data from machine context
  const {
    sitemapUrl,
    mode,
    searchQuery,
    scrapedUrlsSearchQuery,
    selectedUrlForModal,
    discoveredUrls,
    scrapedDocuments,
    currentJobId,
    scrapingProgress,
    isLoading,
    reScrapingUrl,
    tenantId,
    chatbotId,
    serverUrl,
    accessToken,
  } = state.context;

  // Computed values
  const selectedCount = discoveredUrls.filter((url: any) => url.selected).length;
  const totalCount = discoveredUrls.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  // Event handlers
  const handleScrapeData = () => {
    send({ type: 'SCRAPE_DATA' });
  };

  const handleScrapeSelectedUrls = () => {
    send({ type: 'SCRAPE_SELECTED_URLS' });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      send({ type: 'DESELECT_ALL_URLS' });
    } else {
      send({ type: 'SELECT_ALL_URLS' });
    }
  };

  const handleToggleUrl = (index: number) => {
    const url = discoveredUrls[index];
    if (url) {
      send({ type: 'TOGGLE_URL_SELECTION', url: url.url });
    }
  };

  const handleReScrapeUrl = (url: string) => {
    send({ type: 'RE_SCRAPE_URL', url });
  };

  const handleRemoveUrl = (url: string) => {
    send({ type: 'REMOVE_URL', url });
  };

  const handleUpdateDocument = (documentId: string, content: string) => {
    send({ type: 'UPDATE_DOCUMENT', documentId, content });
  };

  const handleDeleteDocument = (documentId: string) => {
    send({ type: 'DELETE_DOCUMENT', documentId });
  };

  const handlePostToPinecone = () => {
    send({ type: 'POST_TO_PINECONE' });
  };

  const handleCancelScrape = () => {
    send({ type: 'CANCEL_CURRENT_JOB' });
  };

  return (
    <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
      <UrlInputForm
        mode={mode}
        onModeChange={(mode) => send({ type: 'SET_MODE', mode })}
        url={sitemapUrl}
        onUrlChange={(url) => send({ type: 'SET_SITEMAP_URL', url })}
        onScrape={handleScrapeData}
        isLoading={isLoading}
      />

      {/* URL Mode - Show URL status and actions only after request is sent */}
      {mode === 'URL' && currentJobId && (
        <div className='mt-6'>
          <UrlModeDisplay
            url={sitemapUrl}
            onReScrapeUrl={handleReScrapeUrl}
            onCancelScrape={handleCancelScrape}
            documentStatus={isLoading ? 'pending' : undefined}
          />
        </div>
      )}

      {/* Sitemap Mode - Show discovered URLs */}
      {mode === 'Sitemap' && (
        <UrlListManager
          urls={discoveredUrls}
          searchQuery={searchQuery}
          onSearchChange={(query) => send({ type: 'SET_SEARCH_QUERY', query })}
          selectedCount={selectedCount}
          totalCount={totalCount}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          onToggleUrl={handleToggleUrl}
          onScrapeSelected={handleScrapeSelectedUrls}
          onReScrapeUrl={handleReScrapeUrl}
          onRemoveUrl={handleRemoveUrl}
          onCrawlComplete={() => {
            // Refresh the scraped documents list
            send({ type: 'LOAD_MESSAGES' });
          }}
          onRecentlyCompleted={(documents) => {
            // Add recently completed documents to scraped documents
            send({ type: 'ADD_RECENTLY_COMPLETED_DOCUMENTS', documents });
          }}
          chatbotId={chatbotId}
          serverUrl={serverUrl}
          accessToken={accessToken}
        />
      )}

      <ProcessingOptions />

      {/* Cancel button - only visible when job is in progress */}
      {isLoading && (
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            onClick={() => send({ type: 'CANCEL_CURRENT_JOB' })}
            className='px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors'>
            Cancel Job
          </button>
        </div>
      )}

      {/* Already Scraped URLs Section */}
      <div className='mt-8'>
        <AlreadyScrapedUrls
          searchQuery={scrapedUrlsSearchQuery}
          onSearchChange={(query) => send({ type: 'SET_SCRAPED_URLS_SEARCH_QUERY', query })}
          scrapedUrls={scrapedDocuments}
          onUpdateDocument={handleUpdateDocument}
          onDeleteDocument={handleDeleteDocument}
          onReScrapeUrl={handleReScrapeUrl}
          isLoading={isLoading}
          reScrapingUrl={reScrapingUrl}
        />
      </div>

      {/* Content Modal */}
      <ContentModal
        onContentChange={(content) => {
          if (selectedUrlForModal) {
            handleUpdateDocument(selectedUrlForModal, content);
          }
        }}
        isOpen={!!selectedUrlForModal}
        onClose={() => send({ type: 'SET_SELECTED_URL_FOR_MODAL', url: null })}
        content={
          selectedUrlForModal
            ? [
                {
                  documentId: selectedUrlForModal,
                  chatbotId: chatbotId,
                  pageContent: scrapedDocuments.find((doc: any) => doc.id === selectedUrlForModal)?.content || '',
                  metadata: {
                    title: scrapedDocuments.find((doc: any) => doc.id === selectedUrlForModal)?.title || '',
                    url: scrapedDocuments.find((doc: any) => doc.id === selectedUrlForModal)?.url || '',
                    loc: {
                      lines: {
                        from: 1,
                        to: scrapedDocuments.find((doc: any) => doc.id === selectedUrlForModal)?.metadata?.contentLength || 1,
                      },
                    },
                    hash: scrapedDocuments.find((doc: any) => doc.id === selectedUrlForModal)?.hash || '',
                  } as any,
                },
              ]
            : undefined
        }
      />
    </div>
  );
}

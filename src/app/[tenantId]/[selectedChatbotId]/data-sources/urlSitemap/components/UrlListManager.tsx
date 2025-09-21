'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, RotateCcw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrawlSSEWithFetch } from '../hooks/useCrawlSSEWithFetch';
import { startCrawlJob, cancelCrawlJob } from '../utils/crawlApi';

interface DiscoveredUrl {
  name?: string;
  url: string;
  selected: boolean;
  status?: string;
  documentId?: string;
}

interface UrlListManagerProps {
  urls: DiscoveredUrl[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onToggleUrl: (index: number) => void;
  onScrapeSelected: () => void;
  onReScrapeUrl: (url: string) => void;
  onRemoveUrl?: (url: string) => void;
  onCrawlComplete?: (savedDocuments: number) => void; // Callback when crawl completes
  onRecentlyCompleted?: (documents: any[]) => void; // Callback for recently completed documents
  chatbotId: string;
  serverUrl: string;
  accessToken: string;
}

export const UrlListManager: React.FC<UrlListManagerProps> = ({
  urls,
  searchQuery,
  onSearchChange,
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onToggleUrl,
  onScrapeSelected,
  onReScrapeUrl,
  onRemoveUrl,
  onCrawlComplete,
  onRecentlyCompleted,
  chatbotId,
  serverUrl,
  accessToken,
}) => {
  // Crawl state
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlJobId, setCrawlJobId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailedUrls, setLastFailedUrls] = useState<string[]>([]);

  // Use SSE hook for crawl progress (with proper header authentication)
  const { isConnected, progress, error, closeConnection } = useCrawlSSEWithFetch(streamUrl, accessToken, onRecentlyCompleted);

  // Handle crawl completion
  useEffect(() => {
    if (progress?.status === 'completed' && onCrawlComplete) {
      console.log('✅ UrlListManager - Crawl completed successfully');
      onCrawlComplete(progress.savedDocuments);
      setIsCrawling(false);
      setCrawlJobId(null);
      setStreamUrl(null);
      closeConnection();

      // Clear retry state after successful completion
      setRetryCount(0);
      setLastFailedUrls([]);
    }
  }, [progress, onCrawlComplete, closeConnection]);

  // Handle crawl errors
  useEffect(() => {
    if (error) {
      setIsCrawling(false);
      setCrawlJobId(null);
      setStreamUrl(null);
      closeConnection();

      // Store the URLs that were being crawled for retry
      const selectedUrls = urls.filter((url) => url.selected);
      if (selectedUrls.length > 0) {
        setLastFailedUrls(selectedUrls.map((u) => u.url));
      }
    }
  }, [error, closeConnection, urls]);

  // Start crawl job
  const handleStartCrawl = async () => {
    const selectedUrls = urls.filter((url) => url.selected);
    console.log('🔍 UrlListManager - All URLs:', urls);
    console.log('🔍 UrlListManager - Selected URLs:', selectedUrls);

    if (selectedUrls.length === 0) {
      console.log('⚠️ UrlListManager - No URLs selected, cannot start crawl');
      return;
    }

    try {
      // Close any existing connection before starting new one
      if (isCrawling || streamUrl) {
        console.log('🔄 UrlListManager - Closing existing connection before starting new crawl');
        closeConnection();
        setIsCrawling(false);
        setCrawlJobId(null);
        setStreamUrl(null);

        // Small delay to ensure connection is fully closed
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setIsCrawling(true);
      setRetryCount(0); // Reset retry count on new crawl

      console.log(
        '🚀 UrlListManager - Starting crawl job for URLs:',
        selectedUrls.map((u) => u.url)
      );

      const crawlResponse = await startCrawlJob(
        selectedUrls.map((u) => u.url),
        chatbotId,
        { maxDepth: 2, chunkSize: 500, chunkOverlap: 50 },
        serverUrl,
        accessToken
      );

      console.log('✅ UrlListManager - Crawl job started successfully:', crawlResponse);

      setCrawlJobId(crawlResponse.jobId);
      setStreamUrl(`${serverUrl}${crawlResponse.streamUrl}`);

      console.log('🔌 UrlListManager - New stream URL set:', `${serverUrl}${crawlResponse.streamUrl}`);
    } catch (error) {
      console.error('❌ UrlListManager - Failed to start crawl job:', error);
      setIsCrawling(false);
    }
  };

  // Retry failed crawl job
  const handleRetryCrawl = async () => {
    if (lastFailedUrls.length === 0 || retryCount >= 3) return;

    try {
      // Close any existing connection before retrying
      if (isCrawling || streamUrl) {
        console.log('🔄 UrlListManager - Closing existing connection before retry');
        closeConnection();
        setIsCrawling(false);
        setCrawlJobId(null);
        setStreamUrl(null);

        // Small delay to ensure connection is fully closed
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setIsCrawling(true);
      setRetryCount((prev) => prev + 1);

      console.log('🔄 UrlListManager - Retrying crawl job for URLs:', lastFailedUrls);

      const crawlResponse = await startCrawlJob(lastFailedUrls, chatbotId, { maxDepth: 2, chunkSize: 500, chunkOverlap: 50 }, serverUrl, accessToken);

      console.log('✅ UrlListManager - Retry crawl job started successfully:', crawlResponse);

      setCrawlJobId(crawlResponse.jobId);
      setStreamUrl(`${serverUrl}${crawlResponse.streamUrl}`);

      console.log('🔌 UrlListManager - New retry stream URL set:', `${serverUrl}${crawlResponse.streamUrl}`);
    } catch (error) {
      console.error('❌ UrlListManager - Failed to retry crawl job:', error);
      setIsCrawling(false);
    }
  };

  // Cancel crawl job
  const handleCancelCrawl = async () => {
    if (!crawlJobId) return;

    try {
      await cancelCrawlJob(crawlJobId, chatbotId, serverUrl, accessToken);
      setIsCrawling(false);
      setCrawlJobId(null);
      setStreamUrl(null);
      closeConnection();
    } catch (error) {
      // Silently handle cancel errors
    }
  };

  const getStatusDisplay = (url: string, urlObj?: any) => {
    // Check if this URL is currently being crawled
    if (progress && progress.status === 'in_progress') {
      if (progress.currentUrl === url) {
        return {
          text: 'Crawling...',
          color: 'text-blue-800',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          icon: 'spinner',
        };
      }

      // Check if URL has been completed in this crawl session
      const completedCount = progress.completedUrls || 0;
      const selectedUrls = urls.filter((u) => u.selected);
      const urlIndex = selectedUrls.findIndex((u) => u.url === url);

      if (urlIndex >= 0 && urlIndex < completedCount) {
        return {
          text: 'Crawled',
          color: 'text-green-800',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          icon: null,
        };
      }

      // URL is selected but not yet processed
      if (selectedUrls.some((u) => u.url === url)) {
        return {
          text: 'Pending',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          icon: null,
        };
      }
    }

    // Check if crawl completed and this URL was processed
    if (progress && progress.status === 'completed') {
      const selectedUrls = urls.filter((u) => u.selected);
      if (selectedUrls.some((u) => u.url === url)) {
        return {
          text: 'Crawled',
          color: 'text-green-800',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          icon: null,
        };
      }
    }

    // Check if crawl failed - only show re-scrape option for failed URLs
    if (progress && progress.status === 'failed') {
      const selectedUrls = urls.filter((u) => u.selected);
      if (selectedUrls.some((u) => u.url === url)) {
        return {
          text: 'Failed',
          color: 'text-red-800',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          icon: null,
          canRetry: true,
        };
      }
    }

    // Default status - no action needed
    return {
      text: 'Ready',
      color: 'text-muted-foreground',
      bgColor: 'bg-secondary',
      icon: null,
      canRetry: false,
    };
  };

  const filteredUrls = urls.filter((url) => url.url.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='border border-border rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-medium text-foreground'>Discovered URLs</h3>
        <div className='text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full'>
          {selectedCount} of {totalCount} selected
        </div>
      </div>

      <p className='text-sm text-muted-foreground mb-4'>Select the URLs you want to include in your data source</p>

      {/* Crawl Progress */}
      {isCrawling && progress && (
        <div className='mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='text-sm font-medium text-blue-900 dark:text-blue-100'>Crawling in Progress</h4>
            <div className='flex items-center space-x-2'>
              <span className='text-xs text-blue-700 dark:text-blue-300'>
                {progress.completedUrls || 0} / {progress.totalUrls || 0} URLs
              </span>
              <button
                onClick={handleCancelCrawl}
                className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
                title='Cancel crawling'>
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
          <div className='w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2'>
            <div
              className='bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress.progress || 0}%` }}
            />
          </div>
          {progress.currentUrl && <p className='text-xs text-blue-700 dark:text-blue-300 truncate'>Currently crawling: {progress.currentUrl}</p>}
          {progress.savedDocuments > 0 && <p className='text-xs text-blue-700 dark:text-blue-300'>Documents saved: {progress.savedDocuments}</p>}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className='mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-red-800 dark:text-red-200 font-medium'>Crawl Failed</p>
              <p className='text-sm text-red-700 dark:text-red-300 mt-1'>Error: {error}</p>
              {retryCount > 0 && (
                <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                  Retry attempt: {retryCount}
                  {retryCount >= 3 && ' (Max retries reached)'}
                </p>
              )}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                onClick={handleRetryCrawl}
                disabled={isCrawling || lastFailedUrls.length === 0 || retryCount >= 3}
                variant='outline'
                size='sm'
                className='border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30'>
                {isCrawling ? 'Retrying...' : retryCount >= 3 ? 'Max Retries Reached' : 'Retry Crawl'}
              </Button>
              <Button
                onClick={() => {
                  setRetryCount(0);
                  setLastFailedUrls([]);
                }}
                variant='ghost'
                size='sm'
                className='text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30'>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Select All */}
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
        <div className='flex items-center md:space-x-2 md:ml-auto'>
          <Button
            onClick={isCrawling ? handleCancelCrawl : handleStartCrawl}
            disabled={selectedCount === 0 && !isCrawling}
            className='disabled:opacity-50 disabled:cursor-not-allowed'>
            {isCrawling ? 'Cancel Crawling' : `Crawl (${selectedCount} selected)`}
          </Button>
          <Button variant='outline' onClick={onSelectAll} className='ml-4' disabled={isCrawling}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      {/* URLs List */}
      <div className='border border-border rounded-lg'>
        <div className='space-y-2'>
          {/* Desktop Header - Hidden on screens smaller than 850px */}
          <div className='hidden min-[850px]:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground bg-muted uppercase tracking-wider border-b border-border rounded-t py-4'>
            <div className='col-span-1'></div>
            <div className='col-span-6 ml-4'>URL</div>
            <div className='col-span-2'>Status</div>
            <div className='col-span-3 text-right mr-8'>Actions</div>
          </div>

          {filteredUrls.map((url, index) => {
            const statusDisplay = getStatusDisplay(url.url, url);

            return (
              <div key={index} className='border-b border-border hover:bg-accent'>
                {/* Desktop Layout - Grid for screens >= 850px */}
                <div className='hidden min-[850px]:grid grid-cols-12 gap-4 items-center py-3 px-4'>
                  <div className='col-span-1'>
                    <input
                      type='checkbox'
                      checked={url.selected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleUrl(index);
                      }}
                      className='w-4 h-4 text-primary rounded focus:ring-primary'
                    />
                  </div>
                  <div className='col-span-6'>
                    <div className='text-sm font-medium text-foreground mr-2 break-words'>{url.url}</div>
                  </div>
                  <div className='col-span-2'>
                    <div className='flex flex-col gap-1'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.color} ${statusDisplay.bgColor}`}>
                        {statusDisplay.icon === 'spinner' && <span className='animate-spin rounded-full h-3 w-3 border-b border-current'></span>}
                        {statusDisplay.text}
                      </span>
                    </div>
                  </div>
                  <div className='col-span-3 flex items-center justify-end space-x-2'>
                    {statusDisplay.canRetry && (
                      <button
                        className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                        onClick={(e) => {
                          e.stopPropagation();
                          onReScrapeUrl(url.url);
                        }}
                        title='Re-scrape failed URL'>
                        <RotateCcw className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Layout - Two rows for screens < 850px */}
                <div className='min-[850px]:hidden p-4 space-y-3'>
                  {/* First Row: Checkbox + URL */}
                  <div className='flex items-start gap-3'>
                    <input
                      type='checkbox'
                      checked={url.selected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleUrl(index);
                      }}
                      className='w-4 h-4 text-primary rounded focus:ring-primary mt-0.5 flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-foreground break-words'>{url.url}</div>
                    </div>
                  </div>

                  {/* Second Row: Status + Actions */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.color} ${statusDisplay.bgColor}`}>
                        {statusDisplay.icon === 'spinner' && <span className='animate-spin rounded-full h-3 w-3 border-b border-current'></span>}
                        {statusDisplay.text}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {statusDisplay.canRetry && (
                        <button
                          className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                          onClick={(e) => {
                            e.stopPropagation();
                            onReScrapeUrl(url.url);
                          }}
                          title='Re-scrape failed URL'>
                          <RotateCcw className='w-4 h-4' />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

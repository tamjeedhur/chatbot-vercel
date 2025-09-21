'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download, RotateCcw, X } from 'lucide-react';
import { ScrapingProgressData } from '@/hooks/useScrapingSSE';

interface UrlModeDisplayProps {
  url: string;
  onReScrapeUrl: (url: string) => void;
  onCancelScrape?: () => void;
  documentStatus?: 'pending' | 'error';
}

interface UrlStatus {
  status: 'idle' | 'pending' | 'error';
}

export const UrlModeDisplay: React.FC<UrlModeDisplayProps> = ({ url, onReScrapeUrl, onCancelScrape, documentStatus }) => {
  const [urlStatus, setUrlStatus] = useState<UrlStatus>({
    status: 'idle',
  });

  // Update URL status based on document status
  useEffect(() => {
    if (documentStatus) {
      setUrlStatus({ status: documentStatus });
    } else {
      setUrlStatus({ status: 'idle' });
    }
  }, [documentStatus]);

  const getStatusDisplay = useCallback(() => {
    switch (urlStatus.status) {
      case 'idle':
        return {
          text: 'Not scraped',
          color: 'text-muted-foreground',
          bgColor: 'bg-secondary',
          icon: null,
        };
      case 'pending':
        return {
          text: 'Pending',
          color: 'text-yellow-800',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          icon: null,
        };
      case 'error':
        return {
          text: 'Error',
          color: 'text-red-800',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          icon: null,
        };
      default:
        return {
          text: 'Not scraped',
          color: 'text-muted-foreground',
          bgColor: 'bg-secondary',
          icon: null,
        };
    }
  }, [urlStatus]);

  const statusDisplay = getStatusDisplay();

  return (
    <div className='border border-border rounded-lg'>
      <div className='space-y-2'>
        {/* Desktop Header - Hidden on screens smaller than 768px */}
        <div className='hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground bg-muted uppercase tracking-wider border-b border-border rounded-t py-4'>
          <div className='col-span-6 ml-4'>URL</div>
          <div className='col-span-2'>Status</div>
          <div className='col-span-3 text-right mr-8'>Actions</div>
        </div>

        <div className='border-b border-border hover:bg-accent'>
          {/* Desktop Layout - Grid for screens >= 768px */}
          <div className='hidden md:grid grid-cols-12 gap-4 items-center py-3 px-4'>
            <div className='col-span-6'>
              <div className='text-sm font-medium text-foreground mr-2 break-words'>{url}</div>
            </div>
            <div className='col-span-3'>
              <div className='flex flex-col gap-1'>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.color} ${statusDisplay.bgColor}`}>
                  {statusDisplay.icon === 'spinner' && <span className='animate-spin rounded-full h-3 w-3 border-b border-current'></span>}
                  {statusDisplay.text}
                </span>
              </div>
            </div>
            <div className='col-span-3 flex items-center justify-end space-x-2'>
              {urlStatus.status === 'pending' && onCancelScrape && (
                <button
                  className='p-1 text-red-600 hover:text-red-700'
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelScrape();
                  }}
                  title='Cancel scraping'>
                  <X className='w-4 h-4' />
                </button>
              )}
              <button
                className='p-1 text-muted-foreground hover:text-foreground'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download - placeholder for future implementation
                }}
                title='Download content'>
                <Download className='w-4 h-4' />
              </button>
              <button
                className='p-1 text-muted-foreground hover:text-foreground'
                onClick={(e) => {
                  e.stopPropagation();
                  onReScrapeUrl(url);
                }}
                title='Re-scrape URL'>
                <RotateCcw className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Mobile Layout - Two rows for screens < 768px */}
          <div className='md:hidden p-4 space-y-3'>
            {/* First Row: URL */}
            <div className='flex items-start gap-3'>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium text-foreground break-words'>{url}</div>
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
                {urlStatus.status === 'pending' && onCancelScrape && (
                  <button
                    className='p-1 text-red-600 hover:text-red-700'
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelScrape();
                    }}
                    title='Cancel scraping'>
                    <X className='w-4 h-4' />
                  </button>
                )}
                <button
                  className='p-1 text-muted-foreground hover:text-foreground'
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle download - placeholder for future implementation
                  }}
                  title='Download content'>
                  <Download className='w-4 h-4' />
                </button>
                <button
                  className='p-1 text-muted-foreground hover:text-foreground'
                  onClick={(e) => {
                    e.stopPropagation();
                    onReScrapeUrl(url);
                  }}
                  title='Re-scrape URL'>
                  <RotateCcw className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

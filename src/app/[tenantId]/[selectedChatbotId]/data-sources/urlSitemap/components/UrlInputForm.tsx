'use client';

import React from 'react';
import { normalizeUrl } from '../utils/urlNormalizer';

interface UrlInputFormProps {
  mode: 'URL' | 'Sitemap';
  onModeChange: (mode: 'URL' | 'Sitemap') => void;
  url: string;
  onUrlChange: (url: string) => void;
  onScrape: () => void;
  isLoading?: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ mode, onModeChange, url, onUrlChange, onScrape, isLoading = false }) => {
  return (
    <div className='space-y-6'>
      {/* Mode Toggle */}
      <div>
        <label className='block text-sm font-medium text-foreground mb-3'>Data Source Type</label>
        <div className='flex space-x-1 p-1 bg-muted rounded-lg w-fit'>
          <button
            onClick={() => onModeChange('URL')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'URL' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            Website URL
          </button>
          <button
            onClick={() => onModeChange('Sitemap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'Sitemap' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            Sitemap URL
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>{mode === 'URL' ? 'Website URL' : 'Sitemap URL'}</label>
        <div className='flex space-x-2'>
          <div className='flex-1 flex'>
            <span className='inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm'>
              https://
            </span>
            <input
              type='text'
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onBlur={(e) => {
                const normalized = normalizeUrl(e.target.value);
                if (normalized !== e.target.value) {
                  onUrlChange(normalized);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const normalized = normalizeUrl(url);
                  if (normalized !== url) {
                    onUrlChange(normalized);
                  }
                  onScrape();
                }
              }}
              placeholder={mode === 'URL' ? 'example.com' : 'example.com/sitemap.xml'}
              className='flex-1 px-3 py-2 border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
            />
          </div>
          <button
            onClick={onScrape}
            disabled={!url.trim() || isLoading}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'>
            {isLoading && <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin'></div>}
            <span>{isLoading ? (mode === 'URL' ? 'Scraping...' : 'Loading...') : mode === 'URL' ? 'Scrape URLs' : 'Load Sitemap'}</span>
          </button>
        </div>
        <p className='text-xs text-muted-foreground mt-1'>
          {mode === 'URL'
            ? 'Enter a website URL to crawl that specific page and discover its links.'
            : 'Enter a sitemap URL to automatically discover all pages listed in the sitemap.'}
        </p>
      </div>
    </div>
  );
};

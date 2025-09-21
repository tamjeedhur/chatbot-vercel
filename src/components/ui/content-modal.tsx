'use client';

import React, { useState, useEffect } from 'react';
import { Copy, X, Check } from 'lucide-react';
import { useMachine } from '@xstate/react';
import { crawlerMachine } from '@/machines/crawlerMachine/crawlerMachine';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  onContentChange: (content: string) => any;
  documentId?: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, content, onContentChange, documentId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content || content.length === 0) return;

    const textToCopy = content.map((item: any) => item.pageContent).join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const [state, send] = useMachine(crawlerMachine);

  const handleSave = () => {
    if (!content || content.length === 0) return;

    send({
      type: 'UPDATE_DATA_SOURCE_DOCUMENT',
      payload: {
        documentId: content?.[0]?.documentId || documentId || '',
        chatbotId: content?.[0]?.chatbotId || '',
        content: content?.[0]?.pageContent || '',
      },
    });
  };

  // Handle success state
  useEffect(() => {
    if (state.value === 'success') {
      onClose();
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      <div className='relative bg-background rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border flex-shrink-0'>
          <div className='flex-1'>
            <h2 className='text-xl font-semibold text-foreground'>Scraped Content</h2>
          </div>

          <div className='flex items-center space-x-2'>
            <div>
              <button
                className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleSave}>
                Save
              </button>
            </div>
            <button
              onClick={handleCopy}
              className='p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors'
              title='Copy content'>
              {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
            </button>

            <button onClick={onClose} className='p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors'>
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-hidden min-h-0'>
          {!content || content.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-muted-foreground'>No content available</p>
            </div>
          ) : (
            <div className='p-6 h-full overflow-y-auto'>
              <div className='space-y-4'>
                {content.map((item: any, index: any) => (
                  <div key={index} className='bg-muted rounded-lg p-4 border border-border'>
                    <div className='text-sm text-muted-foreground mb-2'>
                      <span className='font-medium'>URL:</span> {item.metadata.url}
                    </div>
                    <div className='text-sm text-muted-foreground mb-2'>
                      <span className='font-medium'>Lines:</span> {item.metadata.loc.lines.from} - {item.metadata.loc.lines.to}
                    </div>
                    <div className='text-sm text-muted-foreground mb-3'>
                      <span className='font-medium'>Hash:</span> {item.metadata.hash}
                    </div>
                    <div className='prose max-w-none'>
                      <textarea
                        value={item.pageContent}
                        onChange={(e) => onContentChange(e.target.value)}
                        className='flex-1 w-full p-4 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent h-[55vh] bg-background text-foreground'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModal;

'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  id: string;
  onCopy?: (code: string, id: string) => void;
  copiedId?: string | null;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, id, onCopy, copiedId, className }) => {
  const isCopied = copiedId === id;

  return (
    <div className={cn('relative bg-slate-900 dark:bg-slate-800 rounded-lg overflow-hidden border border-border', className)}>
      <div className='flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-700 border-b border-slate-700 dark:border-slate-600'>
        <span className='text-sm text-slate-300 dark:text-slate-200 font-medium'>{language}</span>
        {onCopy && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onCopy(code, id)}
            className='flex items-center gap-2 px-3 py-1 text-sm text-slate-300 dark:text-slate-200 hover:text-white hover:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors'>
            {isCopied ? (
              <>
                <Check className='w-4 h-4 text-green-400' />
                Copied!
              </>
            ) : (
              <>
                <Copy className='w-4 h-4' />
                Copy
              </>
            )}
          </Button>
        )}
      </div>
      <pre className='p-4 overflow-x-auto'>
        <code className='text-sm text-slate-300 dark:text-slate-200 whitespace-pre-wrap'>{code}</code>
      </pre>
    </div>
  );
};

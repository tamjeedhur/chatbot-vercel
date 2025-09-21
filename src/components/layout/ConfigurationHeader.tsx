'use client';

import React from 'react';
import { Save, RotateCcw, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfigurationHeaderProps } from '@/types/chatbotConfiguration';

export const ConfigurationHeader: React.FC<ConfigurationHeaderProps> = ({
  title,
  description,
  hasUnsavedChanges,
  isLoading,
  showPreview,
  onSave,
  onReset,
  onTogglePreview,
  className = '',
}) => {
  return (
    <div className={`bg-card border-b border-border px-6 py-4 sticky top-0 z-10 ${className}`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div>
            <h1 className='text-2xl font-semibold text-foreground'>{title}</h1>
            <p className='text-sm text-muted-foreground mt-1'>{description}</p>
          </div>
          {hasUnsavedChanges && (
            <div className='flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg'>
              <AlertCircle size={16} className='text-amber-600 dark:text-amber-400' />
              <span className='text-sm text-amber-700 dark:text-amber-300'>Unsaved changes</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' onClick={onTogglePreview} className='flex items-center gap-2'>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>

          <Button variant='outline' size='sm' onClick={onReset} className='flex items-center gap-2'>
            <RotateCcw size={16} />
            Reset
          </Button>

          <Button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isLoading}
            className={`flex items-center gap-2 ${
              hasUnsavedChanges 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}>
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

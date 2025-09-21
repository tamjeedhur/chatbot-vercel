'use client';

import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EditableTextAreaProps } from '@/types/chatbotConfiguration';

export const EditableTextArea: React.FC<EditableTextAreaProps> = ({
  value,
  onSave,
  onCancel,
  placeholder = 'Enter text...',
  rows = 3,
  label,
  required = false,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleStartEditing = () => {
    if (disabled) return;
    setTempValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  if (!isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className='block text-sm font-medium text-foreground'>
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}
        <div className='relative'>
          <div className='flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm'>
            <p className='text-sm text-foreground min-h-[1.5rem] flex-1'>{value || 'No content set'}</p>
            {!disabled && (
              <div className='flex justify-end ml-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleStartEditing}
                  className='flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg'>
                  <Edit size={14} />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <div className='space-y-3'>
        <Textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          placeholder={placeholder}
          className='w-full resize-none'
          autoFocus
        />
        <div className='flex gap-2 justify-end'>
          <Button variant='outline' size='sm' onClick={handleCancel} className='px-3 py-2 text-sm'>
            <X size={14} className='mr-1' />
            Cancel
          </Button>
          <Button size='sm' onClick={handleSave} className='px-3 py-2 text-sm'>
            <Save size={14} className='mr-1' />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

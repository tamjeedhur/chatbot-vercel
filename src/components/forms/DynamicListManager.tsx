'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicListManagerProps } from '@/types/chatbotConfiguration';

export const DynamicListManager: React.FC<DynamicListManagerProps> = ({
  items,
  onAdd,
  onRemove,
  placeholder = 'Add item...',
  label,
  addButtonText = 'Add',
  itemClassName = '',
  containerClassName = '',
  disabled = false,
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`space-y-4 ${containerClassName}`}>
      {label && (
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-foreground'>{label}</label>
          <Button
            onClick={handleAdd}
            disabled={disabled || !newItem.trim() || items.includes(newItem.trim())}
            className='flex items-center gap-2 px-3 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg'>
            <Plus size={16} />
            {addButtonText}
          </Button>
        </div>
      )}

      <div className='flex space-x-2'>
        <Input
          type='text'
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className='flex-1'
        />
        {!label && (
          <Button onClick={handleAdd} disabled={disabled || !newItem.trim() || items.includes(newItem.trim())} className='px-4 py-2'>
            <Plus size={16} />
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {items.map((item, index) => (
          <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${itemClassName}`}>
            <span className='text-sm text-foreground capitalize flex-1'>{item}</span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onRemove(item)}
              disabled={disabled}
              className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2'>
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

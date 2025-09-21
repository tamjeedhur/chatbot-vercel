'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { toolIcons } from '@/utils/constants';
import { ToolSelectorProps } from '@/types/chatbotConfiguration';

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTools, onToolToggle, disabled = false, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-foreground'>Available Tools & Integrations</h3>
        <div className='text-sm text-muted-foreground'>
          {selectedTools.length} of {Object.keys(toolIcons).length} tools enabled
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {Object.entries(toolIcons).map(([tool, toolData]) => {
          const Icon = toolData.icon;
          const isEnabled = selectedTools.includes(tool);

          return (
            <div
              key={tool}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isEnabled ? 'border-primary/20 bg-primary/10 shadow-sm' : 'border-border bg-card hover:border-border/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onToolToggle(tool)}>
              <div className='flex items-start gap-3'>
                <div className={`p-2 rounded-lg ${isEnabled ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon size={20} className={isEnabled ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <h3 className={`text-sm font-medium ${isEnabled ? 'text-primary' : 'text-foreground'}`}>{toolData.name}</h3>
                    <input
                      type='checkbox'
                      checked={isEnabled}
                      onChange={(e) => e.stopPropagation()}
                      disabled={disabled}
                      className='h-4 w-4 text-primary rounded border-input'
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isEnabled ? 'text-primary/80' : 'text-muted-foreground'}`}>{toolData.description}</p>
                </div>
              </div>
              {isEnabled && (
                <div className='absolute top-2 right-2'>
                  <div className='w-2 h-2 bg-primary rounded-full'></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

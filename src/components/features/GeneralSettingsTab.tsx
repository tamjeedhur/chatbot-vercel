'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditableTextArea } from '@/components/forms/EditableTextArea';
import { GeneralSettingsTabProps, Chatbot } from '@/types/chatbotConfiguration';

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  selectedChatbot,
  onFieldChange,
  copiedField,
  onCopyToClipboard,
  disabled = false,
}) => {
  return (
    <div className='space-y-6'>
      {/* AI Model Configuration */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-semibold text-foreground'>AI Model Configuration</h2>
          <div className='text-sm text-muted-foreground'>Configure your AI model settings</div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='lg:col-span-2'>
            <EditableTextArea
              value={selectedChatbot?.config?.systemPrompt || ''}
              onSave={(value) => onFieldChange('config.systemPrompt', value)}
              label='System Prompt'
              required
              placeholder="Define your chatbot's personality and behavior..."
              rows={5}
              disabled={disabled}
            />
            <div className='flex justify-end mt-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onCopyToClipboard(selectedChatbot?.config?.systemPrompt || '', 'systemPrompt')}
                className='p-1 text-gray-400 hover:text-gray-600'>
                {copiedField === 'systemPrompt' ? <Check size={16} className='text-green-500' /> : <Copy size={16} />}
              </Button>
            </div>
            <div className='text-xs text-gray-500 mt-1'>{(selectedChatbot?.config?.systemPrompt || '').length} characters</div>
          </div>

          <div>
            <Label htmlFor='intentModel'>Intent Model</Label>
            <Select
              value={selectedChatbot?.config?.model?.intentModel || ''}
              onValueChange={(value) => onFieldChange('config.model.intentModel', value)}
              disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder='Select intent model' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gpt-4'>GPT-4 (Recommended)</SelectItem>
                <SelectItem value='gpt-4-turbo'>GPT-4 Turbo</SelectItem>
                <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
                <SelectItem value='claude-3'>Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='responseModel'>Response Model</Label>
            <Select
              value={selectedChatbot?.config?.model?.responseModel || ''}
              onValueChange={(value) => onFieldChange('config.model.responseModel', value)}
              disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder='Select response model' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gpt-4'>GPT-4 (Recommended)</SelectItem>
                <SelectItem value='gpt-4-turbo'>GPT-4 Turbo</SelectItem>
                <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
                <SelectItem value='claude-3'>Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='temperature'>
              Temperature
              <span className='text-gray-500 ml-1'>(0.0 - 1.0)</span>
            </Label>
            <div className='relative'>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={selectedChatbot?.config?.model?.temperature || 0.7}
                onChange={(e) => onFieldChange('config.model.temperature', parseFloat(e.target.value))}
                disabled={disabled}
                className='w-full'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>Conservative (0.0)</span>
                <span className='font-medium'>{selectedChatbot?.config?.model?.temperature || 0.7}</span>
                <span>Creative (1.0)</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor='maxTokens'>Max Tokens</Label>
            <Input
              type='number'
              min='1'
              max='4000'
              value={selectedChatbot?.config?.model?.maxTokens || ''}
              onChange={(e) => onFieldChange('config.model.maxTokens', parseInt(e.target.value))}
              disabled={disabled}
              placeholder='4000'
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <h2 className='text-lg font-semibold text-foreground mb-6'>General Settings</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='lg:col-span-2'>
            <EditableTextArea
              value={selectedChatbot?.settings?.welcomeMessage || ''}
              onSave={(value) => onFieldChange('settings.welcomeMessage', value)}
              label='Welcome Message'
              placeholder='Welcome message for users...'
              rows={3}
              disabled={disabled}
            />
          </div>

          <div>
            <Label htmlFor='maxMessages'>Max Messages Per Conversation</Label>
            <Input
              type='number'
              min='1'
              max='200'
              value={selectedChatbot?.settings?.maxMessagesPerConversation || ''}
              onChange={(e) => onFieldChange('settings.maxMessagesPerConversation', parseInt(e.target.value))}
              disabled={disabled}
              placeholder='50'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

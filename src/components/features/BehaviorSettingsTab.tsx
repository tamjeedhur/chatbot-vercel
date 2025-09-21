'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicListManager } from '@/components/forms/DynamicListManager';
import { BehaviorSettingsTabProps, Chatbot } from '@/types/chatbotConfiguration';

export const BehaviorSettingsTab: React.FC<BehaviorSettingsTabProps> = ({
  selectedChatbot,
  onFieldChange,
  newBrandVoice,
  onNewBrandVoiceChange,
  onAddBrandVoice,
  onRemoveBrandVoice,
  disabled = false,
}) => {
  return (
    <div className='space-y-6'>
      {/* Personality & Voice */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <h2 className='text-lg font-semibold text-foreground mb-6'>Personality & Voice</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='brandVoice'>Brand Voice</Label>
            <div className='space-y-3'>
              <div className='flex space-x-2'>
                <Input
                  type='text'
                  value={newBrandVoice}
                  onChange={(e) => onNewBrandVoiceChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddBrandVoice()}
                  placeholder='e.g., Friendly, helpful, and professional'
                  disabled={disabled}
                  className='flex-1'
                />
                <Button onClick={onAddBrandVoice} disabled={disabled || !newBrandVoice.trim()} className='px-4 py-2'>
                  <Plus size={16} />
                </Button>
              </div>
              {selectedChatbot?.config?.behaviorPolicies?.brandVoice && (
                <div className='flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg'>
                  <span className='text-sm text-primary flex-1'>{selectedChatbot.config.behaviorPolicies.brandVoice}</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemoveBrandVoice}
                    disabled={disabled}
                    className='text-muted-foreground hover:text-foreground ml-2'>
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='politenessLevel'>Politeness Level</Label>
            <Select
              value={selectedChatbot?.config?.behaviorPolicies?.politenessLevel || 'professional'}
              onValueChange={(value) => onFieldChange('config.behaviorPolicies.politenessLevel', value)}
              disabled={disabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='casual'>Casual</SelectItem>
                <SelectItem value='professional'>Professional</SelectItem>
                <SelectItem value='formal'>Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Restrictions */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <h2 className='text-lg font-semibold text-foreground mb-6'>Content Restrictions</h2>

        <div className='space-y-6'>
          <DynamicListManager
            items={selectedChatbot?.config?.behaviorPolicies?.bannedTopics || []}
            onAdd={(topic) => {
              const currentTopics = selectedChatbot?.config?.behaviorPolicies?.bannedTopics || [];
              onFieldChange('config.behaviorPolicies.bannedTopics', [...currentTopics, topic]);
            }}
            onRemove={(topic) => {
              const currentTopics = selectedChatbot?.config?.behaviorPolicies?.bannedTopics || [];
              onFieldChange(
                'config.behaviorPolicies.bannedTopics',
                currentTopics.filter((t: string) => t !== topic)
              );
            }}
            placeholder='Add banned topic...'
            label='Banned Topics'
            addButtonText='Add Topic'
            itemClassName='bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
            disabled={disabled}
          />

          <DynamicListManager
            items={selectedChatbot?.config?.behaviorPolicies?.requiredDisclaimers || []}
            onAdd={(disclaimer) => {
              const currentDisclaimers = selectedChatbot?.config?.behaviorPolicies?.requiredDisclaimers || [];
              onFieldChange('config.behaviorPolicies.requiredDisclaimers', [...currentDisclaimers, disclaimer]);
            }}
            onRemove={(disclaimer) => {
              const currentDisclaimers = selectedChatbot?.config?.behaviorPolicies?.requiredDisclaimers || [];
              onFieldChange(
                'config.behaviorPolicies.requiredDisclaimers',
                currentDisclaimers.filter((d: string) => d !== disclaimer)
              );
            }}
            placeholder='Add disclaimer...'
            label='Required Disclaimers'
            addButtonText='Add Disclaimer'
            itemClassName='bg-primary/10 border-primary/20'
            disabled={disabled}
          />
        </div>
      </div>

      {/* Escalation Settings */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <h2 className='text-lg font-semibold text-foreground mb-6'>Escalation Settings</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='escalationThreshold'>
              Escalation Threshold
              <span className='text-muted-foreground ml-1'>(0.0 - 1.0)</span>
            </Label>
            <div className='relative'>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={selectedChatbot?.config?.escalationThreshold || 0.7}
                onChange={(e) => onFieldChange('config.escalationThreshold', parseFloat(e.target.value))}
                disabled={disabled}
                className='w-full'
              />
              <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                <span>Low (0.0)</span>
                <span className='font-medium'>{selectedChatbot?.config?.escalationThreshold || 0.7}</span>
                <span>High (1.0)</span>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2'>
            <Label htmlFor='fallbackMessage'>Fallback Response Message</Label>
            <textarea
              value={selectedChatbot?.settings?.fallbackResponse?.message || ''}
              onChange={(e) => onFieldChange('settings.fallbackResponse.message', e.target.value)}
              rows={3}
              disabled={disabled}
              className='w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground'
              placeholder="I apologize, but I'm having trouble understanding your request. Let me connect you with a human agent who can better assist you."
            />
            <div className='flex items-center mt-3'>
              <input
                type='checkbox'
                checked={selectedChatbot?.settings?.fallbackResponse?.status || false}
                onChange={(e) => onFieldChange('settings.fallbackResponse.status', e.target.checked)}
                disabled={disabled}
                className='h-4 w-4 text-primary rounded border-input'
              />
              <Label htmlFor='fallbackEnabled' className='ml-2 text-sm text-foreground'>
                Enable fallback response
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkingHoursEditor } from '@/components/forms/WorkingHoursEditor';
import { WorkingHoursTabProps } from '@/types/chatbotConfiguration';

export const WorkingHoursTab: React.FC<WorkingHoursTabProps> = ({ selectedChatbot, onFieldChange, disabled = false }) => {
  return (
    <div className='space-y-6'>
      {/* Working Hours Configuration */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-semibold text-foreground'>Working Hours Configuration</h2>
          <div className='flex items-center gap-3'>
            <span className='text-sm text-muted-foreground'>Working Hours:</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                selectedChatbot?.settings?.workingHours?.enabled 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-muted text-muted-foreground'
              }`}>
              {selectedChatbot?.settings?.workingHours?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='flex items-center justify-between p-4 bg-muted rounded-lg'>
            <div>
              <h3 className='text-sm font-medium text-foreground'>Enable Working Hours</h3>
              <p className='text-sm text-muted-foreground'>Restrict chatbot availability to business hours</p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={selectedChatbot?.settings?.workingHours?.enabled || false}
                onChange={(e) => onFieldChange('settings.workingHours.enabled', e.target.checked)}
                disabled={disabled}
                className='sr-only'
              />
              <div className={`w-11 h-6 rounded-full ${selectedChatbot?.settings?.workingHours?.enabled ? 'bg-primary' : 'bg-muted-foreground/20'}`}>
                <div
                  className={`h-5 w-5 bg-background rounded-full shadow transform transition-transform ${
                    selectedChatbot?.settings?.workingHours?.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </label>
          </div>

          <div>
            <Label htmlFor='timezone'>Timezone</Label>
            <Select
              value={selectedChatbot?.settings?.workingHours?.timezone || 'America/New_York'}
              onValueChange={(value) => onFieldChange('settings.workingHours.timezone', value)}
              disabled={disabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='America/New_York'>Eastern Time (America/New_York)</SelectItem>
                <SelectItem value='America/Chicago'>Central Time (America/Chicago)</SelectItem>
                <SelectItem value='America/Denver'>Mountain Time (America/Denver)</SelectItem>
                <SelectItem value='America/Los_Angeles'>Pacific Time (America/Los_Angeles)</SelectItem>
                <SelectItem value='Europe/London'>GMT (Europe/London)</SelectItem>
                <SelectItem value='Europe/Paris'>CET (Europe/Paris)</SelectItem>
                <SelectItem value='Europe/Berlin'>CET (Europe/Berlin)</SelectItem>
                <SelectItem value='Asia/Tokyo'>JST (Asia/Tokyo)</SelectItem>
                <SelectItem value='Asia/Shanghai'>CST (Asia/Shanghai)</SelectItem>
                <SelectItem value='Australia/Sydney'>AEST (Australia/Sydney)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className='bg-card rounded-xl border border-border p-6'>
        <WorkingHoursEditor
          schedule={selectedChatbot?.settings?.workingHours?.schedule || [
            { day: 0, start: '09:00', end: '17:00' },
            { day: 1, start: '09:00', end: '17:00' },
            { day: 2, start: '09:00', end: '17:00' },
            { day: 3, start: '09:00', end: '17:00' },
            { day: 4, start: '09:00', end: '17:00' },
            { day: 5, start: '09:00', end: '17:00' },
            { day: 6, start: '09:00', end: '17:00' },
          ]}
          onScheduleChange={(schedule) => onFieldChange('settings.workingHours.schedule', schedule)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

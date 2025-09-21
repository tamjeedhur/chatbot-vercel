'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { PreferencesFormState } from '@/types/settings';

interface PreferencesSettingsFormProps {
  preferences: PreferencesFormState;
  isLoading: boolean;
  hasChanges: boolean;
  onPreferenceChange: (field: keyof PreferencesFormState, value: boolean) => void;
  onSave: () => void;
  onReset: () => void;
}

export function PreferencesSettingsForm({ preferences, isLoading, hasChanges, onPreferenceChange, onSave, onReset }: PreferencesSettingsFormProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Preferences</CardTitle>
          <CardDescription>Configure workspace preferences</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-64' />
            </div>
            <Skeleton className='h-6 w-11' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-56' />
            </div>
            <Skeleton className='h-6 w-11' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Preferences</CardTitle>
        <CardDescription>Configure workspace preferences</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <Label>Email Notifications</Label>
            <p className='text-sm text-muted-foreground'>Receive email updates about workspace activity</p>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => onPreferenceChange('emailNotifications', checked)}
            disabled={isLoading}
          />
        </div>
        <div className='flex items-center justify-between'>
          <div>
            <Label>Public Workspace</Label>
            <p className='text-sm text-muted-foreground'>Allow others to discover this workspace</p>
          </div>
          <Switch
            checked={preferences.publicWorkspace}
            onCheckedChange={(checked) => onPreferenceChange('publicWorkspace', checked)}
            disabled={isLoading}
          />
        </div>
        {hasChanges && (
          <div className='flex gap-2 pt-4 border-t'>
            <button
              onClick={onSave}
              disabled={isLoading}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'>
              Save Preferences
            </button>
            <button
              onClick={onReset}
              disabled={isLoading}
              className='px-4 py-2 border border-input bg-background rounded-md hover:bg-accent disabled:opacity-50'>
              Reset
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

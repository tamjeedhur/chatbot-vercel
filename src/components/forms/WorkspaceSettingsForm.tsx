'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceFormState } from '@/types/settings';

interface WorkspaceSettingsFormProps {
  workspaceForm: WorkspaceFormState;
  isLoading: boolean;
  hasChanges: boolean;
  onFieldChange: (field: keyof WorkspaceFormState, value: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function WorkspaceSettingsForm({ workspaceForm, isLoading, hasChanges, onFieldChange, onSave, onReset }: WorkspaceSettingsFormProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Workspace Information</CardTitle>
          <CardDescription>Update your workspace details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-20 w-full' />
          </div>
          <Skeleton className='h-10 w-32' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Workspace Information</CardTitle>
        <CardDescription>Update your workspace details</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='workspace-name'>Workspace Name</Label>
            <Input
              id='workspace-name'
              value={workspaceForm.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              disabled={isLoading}
              placeholder='Enter workspace name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='workspace-url'>Workspace URL</Label>
            <Input
              id='workspace-url'
              value={workspaceForm.url}
              onChange={(e) => onFieldChange('url', e.target.value)}
              disabled={isLoading}
              placeholder='Enter workspace URL'
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            placeholder='Describe your workspace...'
            value={workspaceForm.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>
        <div className='flex gap-2'>
          <Button onClick={onSave} disabled={!hasChanges || isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          {hasChanges && (
            <Button variant='outline' onClick={onReset} disabled={isLoading}>
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

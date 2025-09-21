'use client';

import React from 'react';
import { useGeneralSettings } from '@/providers/GeneralSettingsProvider';
import { WorkspaceSettingsForm } from '@/components/forms/WorkspaceSettingsForm';
import { PreferencesSettingsForm } from '@/components/forms/PreferencesSettingsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function GeneralSettingsClient() {
  const {
    workspaceForm,
    preferences,
    loading,
    error,
    hasChanges,
    updateWorkspaceField,
    updatePreference,
    saveWorkspace,
    savePreferences,
    resetForm,
    clearError,
  } = useGeneralSettings();

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold'>General</h1>
        <p className='text-muted-foreground mt-2'>Manage your workspace settings</p>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>{error}</span>
            <button onClick={clearError} className='text-sm underline hover:no-underline'>
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      <WorkspaceSettingsForm
        workspaceForm={workspaceForm}
        isLoading={loading}
        hasChanges={hasChanges}
        onFieldChange={updateWorkspaceField}
        onSave={saveWorkspace}
        onReset={resetForm}
      />

      <PreferencesSettingsForm
        preferences={preferences}
        isLoading={loading}
        hasChanges={hasChanges}
        onPreferenceChange={updatePreference}
        onSave={savePreferences}
        onReset={resetForm}
      />
    </div>
  );
}

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { generalSettingsMachine } from '@/machines/settingsMachines/generalSettingsMachine';
import { GeneralSettingsData } from '@/types/settings';

interface GeneralSettingsProviderProps {
  children: ReactNode;
  tenantId: string;
  initialData: GeneralSettingsData;
  accessToken: string;
}

interface GeneralSettingsContextType {
  // State
  tenant: any;
  settings: any;
  workspaceForm: {
    name: string;
    url: string;
    description: string;
  };
  preferences: {
    emailNotifications: boolean;
    publicWorkspace: boolean;
  };
  loading: boolean;
  error: string | null;
  hasChanges: boolean;

  // Actions
  updateWorkspaceField: (field: 'name' | 'url' | 'description', value: string) => void;
  updatePreference: (field: 'emailNotifications' | 'publicWorkspace', value: boolean) => void;
  saveWorkspace: () => void;
  savePreferences: () => void;
  resetForm: () => void;
  clearError: () => void;
}

const GeneralSettingsContext = createContext<GeneralSettingsContextType | null>(null);

export function GeneralSettingsProvider({ children, tenantId, initialData, accessToken }: GeneralSettingsProviderProps) {
  const [state, send] = useMachine(generalSettingsMachine, {
    input: {
      tenantId,
      initialData,
      accessToken,
    },
  });

  const context: GeneralSettingsContextType = {
    // State
    tenant: state.context.tenant,
    settings: state.context.settings,
    workspaceForm: state.context.workspaceForm,
    preferences: state.context.preferences,
    loading: state.context.isLoading,
    error: state.context.error?.message || null,
    hasChanges: state.context.hasChanges,

    // Actions
    updateWorkspaceField: (field, value) => send({ type: 'UPDATE_WORKSPACE_FIELD', field, value }),
    updatePreference: (field, value) => send({ type: 'UPDATE_PREFERENCE', field, value }),
    saveWorkspace: () => send({ type: 'SAVE_WORKSPACE' }),
    savePreferences: () => send({ type: 'SAVE_PREFERENCES' }),
    resetForm: () => send({ type: 'RESET_FORM' }),
    clearError: () => send({ type: 'CLEAR_ERROR' }),
  };

  return <GeneralSettingsContext.Provider value={context}>{children}</GeneralSettingsContext.Provider>;
}

export function useGeneralSettings() {
  const context = useContext(GeneralSettingsContext);
  if (!context) {
    throw new Error('useGeneralSettings must be used within a GeneralSettingsProvider');
  }
  return context;
}
